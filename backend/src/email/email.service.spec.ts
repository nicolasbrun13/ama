import { EmailService, escHtml } from './email.service';
import { CreateReservationDto } from '../reservations/dto/create-reservation.dto';

const EVIL = `<script>alert("x")</script> O'Brien & co`;

const evilDto = (): CreateReservationDto => ({
  firstName: EVIL,
  lastName: EVIL,
  email: 'client@example.fr',
  phone: '+33 6 00 00 00 00',
  date: '2027-02-05',
  time: '13:30',
  message: EVIL,
});

function makeService() {
  const service = new EmailService();
  const sendMail = vi.fn().mockResolvedValue({});
  (service as unknown as { transporter: { sendMail: typeof sendMail } }).transporter = { sendMail };
  return { service, sendMail };
}

function expectEscaped(html: string) {
  expect(html).not.toContain('<script>');
  expect(html).not.toContain(`O'Brien`);
  expect(html).not.toContain('"x"');
  expect(html).toContain('&lt;script&gt;');
  expect(html).toContain('&quot;x&quot;');
  expect(html).toContain('O&#x27;Brien');
  expect(html).toContain('&amp; co');
}

describe('escHtml', () => {
  it('échappe < > " \' &', () => {
    expect(escHtml(`<a href="x">'&'</a>`)).toBe('&lt;a href=&quot;x&quot;&gt;&#x27;&amp;&#x27;&lt;/a&gt;');
  });
  it('renvoie une chaîne vide pour null / undefined', () => {
    expect(escHtml(undefined)).toBe('');
    expect(escHtml(null)).toBe('');
  });
});

describe('EmailService : données utilisateur échappées dans le HTML', () => {
  it('mail à Ama', async () => {
    const { service, sendMail } = makeService();
    await service.sendConfirmationToAma(evilDto());
    expectEscaped(sendMail.mock.calls[0][0].html);
  });

  it('mail de confirmation client', async () => {
    const { service, sendMail } = makeService();
    await service.sendConfirmationToClient(evilDto());
    expectEscaped(sendMail.mock.calls[0][0].html);
  });

  it('mail de rappel J-1', async () => {
    const { service, sendMail } = makeService();
    await service.sendReminderToClient(evilDto());
    expectEscaped(sendMail.mock.calls[0][0].html);
  });

  it('mail de facture', async () => {
    const { service, sendMail } = makeService();
    await service.sendInvoiceToClient(evilDto());
    expectEscaped(sendMail.mock.calls[0][0].html);
  });

  it("mail d'alerte remboursement", async () => {
    const { service, sendMail } = makeService();
    await service.sendRefundFailureAlert({ orderID: 'O1', captureID: 'C1', reason: 'refus', dto: evilDto() });
    const mail = sendMail.mock.calls[0][0];
    expectEscaped(mail.html);
    expect(mail.html).toContain('O1');
    expect(mail.html).toContain('C1');
  });
});

describe('EmailService.generateIcs', () => {
  // Les lignes ICS longues sont repliées (CRLF + espace) : on les déplie avant de chercher.
  const unfold = (buf: Buffer) => buf.toString('utf-8').replace(/\r?\n[ \t]/g, '');
  const dto = (): CreateReservationDto => ({
    firstName: 'Claire',
    lastName: 'Dupont',
    email: 'claire.dupont@example.fr',
    phone: '+33 6 11 22 33 44',
    date: '2027-02-05',
    time: '13:30',
  });

  it('version Ama : nom, email et téléphone dans SUMMARY / DESCRIPTION', () => {
    const ics = unfold(new EmailService().generateIcs(dto(), true));
    expect(ics).toContain('SUMMARY:Séance HRE \u2014 Claire Dupont');
    const description = ics.match(/DESCRIPTION:(.*)/)?.[1] ?? '';
    expect(description).toContain('Claire Dupont');
    expect(description).toContain('claire.dupont@example.fr');
    expect(description).toContain('+33 6 11 22 33 44');
    expect(description).toContain('Mode : Zoom');
  });

  it('version Ama : "Non renseigné" sans téléphone', () => {
    const ics = unfold(new EmailService().generateIcs({ ...dto(), phone: undefined }, true));
    expect(ics).toContain('Non renseigné');
  });

  it('version patient : comportement inchangé', () => {
    const ics = unfold(new EmailService().generateIcs(dto()));
    expect(ics).toContain('SUMMARY:Séance HRE avec Ama');
    const description = ics.match(/DESCRIPTION:(.*)/)?.[1] ?? '';
    expect(description).toContain("Séance d'Hypnose Régressive Ésotérique avec Anne-Marie Blanc");
    expect(description).not.toContain('claire.dupont@example.fr');
    expect(description).not.toContain('+33 6 11 22 33 44');
    expect(ics).toContain('ORGANIZER');
    expect(ics).toContain('ATTENDEE');
  });

  it('message avec retours à la ligne et virgules : le fichier reste valide', () => {
    const message = "Bonjour,\r\nj'ai mal au dos; stress, sommeil\nmerci";
    const ics = unfold(new EmailService().generateIcs({ ...dto(), message }, true));
    expect(ics.startsWith('BEGIN:VCALENDAR')).toBe(true);
    expect(ics.trimEnd().endsWith('END:VCALENDAR')).toBe(true);
    expect(ics).toContain("Bonjour\\,\\nj'ai mal au dos\\; stress\\, sommeil\\nmerci");
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(1);
    expect(ics.match(/END:VEVENT/g)).toHaveLength(1);
  });

  it('message tronqué à 500 caractères', () => {
    const ics = unfold(new EmailService().generateIcs({ ...dto(), message: 'x'.repeat(800) }, true));
    expect(ics).toContain('x'.repeat(500));
    expect(ics).not.toContain('x'.repeat(501));
  });
});

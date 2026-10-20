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

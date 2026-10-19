/**
 * Script de test — envoie les 4 templates d'emails à l'adresse TEST_RECIPIENT
 *
 * Lancer :
 *   cd backend
 *   npx ts-node -r tsconfig-paths/register scripts/send-test-emails.ts
 */

import * as dotenv from 'dotenv';
dotenv.config();

import * as nodemailer from 'nodemailer';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PDFDocument = require('pdfkit');

const TEST_RECIPIENT = 'nitrodesign06@gmail.com';

const dto = {
  firstName: 'Sophie',
  lastName:  'Martin',
  email:     TEST_RECIPIENT,
  phone:     '06 12 34 56 78',
  date:      '2026-11-15',
  time:      '14:30',
  message:   'Je suis prête pour cette expérience transformatrice.',
};

// ─── Palette ─────────────────────────────────────────────────────────────────
const VIOLET      = '#8B6DC8';
const VIOLET_DARK = '#6B4DA8';
const VIOLET_BG   = '#F0EBFF';
const VIOLET_CARD = '#F8F4FF';
const ROSE        = '#E896A8';
const TEXT        = '#1E0A3C';
const SUBTEXT     = '#6B5B8A';
const SUCCESS     = '#27AE60';
const CONTACT     = 'contact@amablanc-hre.fr';

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST   || 'ssl0.ovh.net',
  port:   parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── Layout ──────────────────────────────────────────────────────────────────
function wrap(content: string): string {
  return `
    <div style="background:${VIOLET_BG};padding:2rem 1rem;font-family:'Nunito',Arial,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(139,109,200,.15);">
        <div style="background:linear-gradient(135deg,${VIOLET},${VIOLET_DARK});padding:2rem;text-align:center;">
          <p style="font-size:2.5rem;margin:0 0 .5rem;line-height:1;">🌸</p>
          <h1 style="color:#fff;font-family:Georgia,serif;font-style:italic;font-size:1.4rem;margin:0 0 .2rem;">Ama</h1>
          <p style="color:rgba(255,255,255,.75);font-size:.75rem;margin:0;letter-spacing:.06em;text-transform:uppercase;">Hypnose Régressive Ésotérique</p>
        </div>
        <div style="padding:2rem 2.5rem;">${content}</div>
        <div style="background:${VIOLET_CARD};padding:1.25rem 2.5rem;border-top:1px solid rgba(139,109,200,.12);text-align:center;">
          <p style="color:${SUBTEXT};font-size:.75rem;margin:0;">
            Anne-Marie Blanc — Praticienne HRE certifiée, méthode Calogéro Grifasi<br>
            <a href="mailto:${CONTACT}" style="color:${VIOLET};text-decoration:none;">${CONTACT}</a>
          </p>
        </div>
      </div>
    </div>`;
}

function li(emoji: string, label: string, text: string): string {
  return `<li style="padding:.6rem 0;border-bottom:1px solid rgba(139,109,200,.1);font-size:.88rem;line-height:1.7;color:${SUBTEXT};list-style:none;">${emoji}&nbsp;&nbsp;<strong style="color:${TEXT};">${label}</strong> — ${text}</li>`;
}

// ─── PDF ─────────────────────────────────────────────────────────────────────
function makePdf(): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 56 });
    const chunks: Buffer[] = [];
    doc.on('data', (c: Buffer) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const now     = new Date();
    const invNo   = `FACT-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2,'0')}-${Math.floor(Math.random()*9000)+1000}`;
    const invDate = now.toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' });
    const sesDate = new Date(dto.date).toLocaleDateString('fr-FR', { weekday:'long', day:'2-digit', month:'long', year:'numeric' });
    const W = doc.page.width - 112;

    doc.rect(56, 56, W, 56).fill('#8B6DC8');
    doc.fillColor('#FFF').font('Helvetica-Bold').fontSize(20).text('FACTURE', 72, 72);
    doc.font('Helvetica').fontSize(10).text(invNo, 72, 97);
    doc.font('Helvetica').fontSize(10).text(`Émise le ${invDate}`, 0, 80, { align:'right', width: W+56 });

    let y = 136;
    doc.fillColor('#1E0A3C').font('Helvetica-Bold').fontSize(8).text('ÉMETTEUR', 56, y).text('CLIENT', 330, y);
    y += 14;
    doc.font('Helvetica-Bold').fontSize(11).text('Anne-Marie Blanc', 56, y).text(`${dto.firstName} ${dto.lastName}`, 330, y);
    y += 16;
    doc.font('Helvetica').fontSize(9.5).fillColor('#6B5B8A').text('Praticienne HRE — méthode Calogéro Grifasi', 56, y).text(dto.email, 330, y);
    y += 14;
    const amaAddr   = process.env.AMA_ADDRESS   || '[adresse à compléter]';
    const amaLegal  = process.env.AMA_LEGAL_NUM;
    doc.text(amaAddr, 56, y);
    if (amaLegal) { y += 14; doc.text(amaLegal, 56, y); }
    y += 56;
    doc.moveTo(56, y).lineTo(56+W, y).strokeColor('#E0D5F5').lineWidth(1).stroke();
    y += 20;

    doc.rect(56, y, W, 28).fill('#F0EBFF');
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#6B5B8A').text('PRESTATION', 66, y+9).text('QTÉ', 430, y+9).text('MONTANT', 496, y+9);
    y += 28;
    doc.rect(56, y, W, 48).fill('#FAFAFA').stroke('#F0EBFF');
    doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#1E0A3C').text('Séance d\'Hypnose Régressive Ésotérique', 66, y+10);
    doc.font('Helvetica').fontSize(9).fillColor('#6B5B8A').text(`Réalisée le ${sesDate} à ${dto.time} — via Zoom`, 66, y+28);
    doc.font('Helvetica').fontSize(10.5).fillColor('#1E0A3C').text('1', 434, y+16).text('150,00 €', 480, y+16);
    y += 48;

    doc.moveTo(56, y).lineTo(56+W, y).strokeColor('#E0D5F5').stroke();
    y += 16;
    doc.font('Helvetica').fontSize(9).fillColor('#8B8B8B').text('TVA non applicable — art. 293 B du CGI', 56, y);
    doc.font('Helvetica-Bold').fontSize(14).fillColor('#8B6DC8').text('Total TTC : 150,00 €', 0, y, { align:'right', width: W+56 });
    y += 36;

    doc.rect(56, y, W, 32).fill('#F0FFF4').stroke('#27AE60');
    doc.font('Helvetica').fontSize(10).fillColor('#27AE60').text('✓  Paiement reçu via PayPal — merci pour votre confiance.', 68, y+10);
    y += 48;
    doc.moveTo(56, y).lineTo(56+W, y).strokeColor('#E0D5F5').stroke();
    y += 12;
    doc.font('Helvetica').fontSize(8.5).fillColor('#8B8B8B').text('Anne-Marie Blanc — Ama · Hypnose Régressive Ésotérique · contact@amablanc-hre.fr', 56, y, { align:'center', width: W });

    doc.end();
  });
}

// ─── Emails ───────────────────────────────────────────────────────────────────
async function sendNotifAma() {
  await transporter.sendMail({
    from: `"Site Ama HRE" <${process.env.SMTP_USER}>`,
    to: TEST_RECIPIENT,
    subject: `[TEST] Nouvelle réservation — ${dto.firstName} ${dto.lastName} — ${dto.date}`,
    html: wrap(`
      <h2 style="color:${VIOLET};font-family:Georgia,serif;font-style:italic;font-size:1.3rem;margin-bottom:1.5rem;">Nouvelle réservation</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:.5rem .75rem;font-size:.82rem;color:${SUBTEXT};width:120px;">Nom</td><td style="padding:.5rem .75rem;font-weight:700;color:${TEXT};">${dto.firstName} ${dto.lastName}</td></tr>
        <tr style="background:${VIOLET_CARD};"><td style="padding:.5rem .75rem;font-size:.82rem;color:${SUBTEXT};">Email</td><td style="padding:.5rem .75rem;"><a href="mailto:${dto.email}" style="color:${VIOLET};">${dto.email}</a></td></tr>
        <tr><td style="padding:.5rem .75rem;font-size:.82rem;color:${SUBTEXT};">Téléphone</td><td style="padding:.5rem .75rem;color:${TEXT};">${dto.phone}</td></tr>
        <tr style="background:${VIOLET_CARD};"><td style="padding:.5rem .75rem;font-size:.82rem;color:${SUBTEXT};">Date</td><td style="padding:.5rem .75rem;font-weight:700;color:${VIOLET_DARK};">${dto.date} à ${dto.time}</td></tr>
        <tr><td style="padding:.5rem .75rem;font-size:.82rem;color:${SUBTEXT};">Paiement</td><td style="padding:.5rem .75rem;font-weight:700;color:${SUCCESS};">150 € confirmé via PayPal</td></tr>
        <tr style="background:${VIOLET_CARD};"><td style="padding:.5rem .75rem;font-size:.82rem;color:${SUBTEXT};vertical-align:top;">Message</td><td style="padding:.5rem .75rem;font-style:italic;color:${SUBTEXT};">${dto.message}</td></tr>
      </table>
    `),
  });
  console.log('✅ 1/4 — Notification Ama');
}

async function sendConfirmClient() {
  await transporter.sendMail({
    from: `"Ama — Hypnose HRE" <${process.env.SMTP_USER}>`,
    to: TEST_RECIPIENT,
    subject: `[TEST] Séance confirmée — ${dto.date} à ${dto.time}`,
    html: wrap(`
      <h2 style="color:${TEXT};font-family:Georgia,serif;font-style:italic;font-size:1.35rem;margin-bottom:.25rem;">Votre séance est confirmée</h2>
      <p style="color:${SUBTEXT};font-size:.8rem;margin-bottom:1.75rem;">Hypnose Régressive Ésotérique · méthode Calogéro Grifasi</p>
      <p style="color:${TEXT};line-height:1.85;margin-bottom:1.5rem;">Bonjour <strong>${dto.firstName}</strong>,<br><br>Votre réservation a bien été enregistrée et votre paiement confirmé.</p>
      <div style="background:${VIOLET_CARD};border-left:3px solid ${ROSE};padding:1.2rem 1.5rem;border-radius:0 8px 8px 0;margin-bottom:2rem;">
        <p style="font-weight:700;color:${VIOLET_DARK};margin-bottom:.75rem;font-size:.85rem;letter-spacing:.06em;text-transform:uppercase;">Récapitulatif</p>
        <p style="color:${TEXT};font-size:.9rem;margin-bottom:.35rem;">📅 &nbsp;<strong>${dto.date}</strong> à <strong>${dto.time}</strong></p>
        <p style="color:${TEXT};font-size:.9rem;margin-bottom:.35rem;">💻 &nbsp;Via Zoom — le lien vous sera envoyé le jour même</p>
        <p style="color:${SUCCESS};font-size:.9rem;">✅ &nbsp;Paiement de 150 € confirmé</p>
      </div>
      <h3 style="font-family:Georgia,serif;font-style:italic;color:${VIOLET};font-size:1.05rem;margin-bottom:1rem;">Préparer votre séance</h3>
      <ul style="list-style:none;padding:0;margin-bottom:1.5rem;">
        ${li('🌐','Connexion internet stable','Privilégiez le Wi-Fi ou une connexion filaire.')}
        ${li('🎧','Casque ou écouteurs','Fortement recommandé pour une écoute immersive.')}
        ${li('🤫','Environnement calme','Installez-vous dans un espace où vous ne serez pas dérangé(e).')}
        ${li('🎙️','Enregistrement','Les séances sont enregistrées et peuvent vous être partagées si vous le souhaitez.')}
      </ul>
      <p style="color:${SUBTEXT};font-size:.87rem;font-style:italic;">Un rappel vous sera envoyé la veille de votre séance.</p>
    `),
  });
  console.log('✅ 2/4 — Confirmation client');
}

async function sendReminder() {
  await transporter.sendMail({
    from: `"Ama — Hypnose HRE" <${process.env.SMTP_USER}>`,
    to: TEST_RECIPIENT,
    subject: `[TEST] Rappel — Votre séance demain à ${dto.time}`,
    html: wrap(`
      <h2 style="color:${TEXT};font-family:Georgia,serif;font-style:italic;font-size:1.35rem;margin-bottom:.25rem;">Votre séance est demain</h2>
      <p style="color:${SUBTEXT};font-size:.8rem;margin-bottom:1.75rem;">Hypnose Régressive Ésotérique · méthode Calogéro Grifasi</p>
      <p style="color:${TEXT};line-height:1.85;margin-bottom:1.5rem;">Bonjour <strong>${dto.firstName}</strong>,<br><br>Votre séance est prévue <strong>demain ${dto.date} à ${dto.time}</strong> via Zoom.</p>
      <div style="background:${VIOLET_CARD};border:1px solid rgba(139,109,200,.25);border-radius:8px;padding:1.4rem 1.6rem;margin-bottom:1.75rem;">
        <p style="font-weight:700;color:${VIOLET_DARK};margin-bottom:1rem;font-size:.85rem;letter-spacing:.06em;text-transform:uppercase;">Checklist avant la séance</p>
        <ul style="list-style:none;padding:0;margin:0;">
          ${li('✅','Connexion internet stable','Vérifiez votre Wi-Fi ou branchez un câble réseau.')}
          ${li('🎧','Casque ou écouteurs','Indispensable pour une écoute de qualité et une réception optimale.')}
          ${li('🤫','Espace calme et isolé','Assurez-vous de ne pas être dérangé(e) pendant toute la durée.')}
          ${li('🎙️','Enregistrement','La séance sera enregistrée et pourra vous être transmise sur demande.')}
        </ul>
      </div>
      <p style="color:${SUBTEXT};font-size:.87rem;font-style:italic;">Installez-vous confortablement quelques minutes avant l'heure prévue. À demain.</p>
    `),
  });
  console.log('✅ 3/4 — Rappel J-1');
}

async function sendInvoice() {
  const pdf = await makePdf();
  const now = new Date();
  const invNo = `FACT-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2,'0')}-${Math.floor(Math.random()*9000)+1000}`;
  const invDate = now.toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' });
  const sesDate = new Date(dto.date).toLocaleDateString('fr-FR', { weekday:'long', day:'2-digit', month:'long', year:'numeric' });

  await transporter.sendMail({
    from: `"Ama — Hypnose HRE" <${process.env.SMTP_USER}>`,
    to: TEST_RECIPIENT,
    subject: `[TEST] Facture — Séance HRE du ${dto.date}`,
    html: wrap(`
      <h2 style="color:${TEXT};font-family:Georgia,serif;font-style:italic;font-size:1.35rem;margin-bottom:.25rem;">Votre facture</h2>
      <p style="color:${SUBTEXT};font-size:.8rem;margin-bottom:1.75rem;">${invNo} · Émise le ${invDate}</p>
      <p style="color:${TEXT};line-height:1.85;margin-bottom:1.5rem;">Bonjour <strong>${dto.firstName}</strong>,<br><br>Veuillez trouver ci-joint la facture pour votre séance.</p>
      <div style="background:${VIOLET_CARD};border-radius:8px;padding:1.2rem 1.5rem;margin-bottom:1.5rem;">
        <p style="font-size:.82rem;color:${SUBTEXT};margin-bottom:.35rem;">Séance d'Hypnose Régressive Ésotérique</p>
        <p style="font-size:.82rem;color:${SUBTEXT};margin-bottom:.75rem;">Réalisée le ${sesDate} à ${dto.time} — via Zoom</p>
        <p style="font-size:.78rem;color:${SUBTEXT};margin-bottom:.25rem;">TVA non applicable — art. 293 B du CGI</p>
        <p style="font-size:1.15rem;font-weight:700;color:${VIOLET_DARK};">Total : 150,00 €</p>
      </div>
      <div style="background:#F0FFF4;border-left:3px solid ${SUCCESS};padding:.9rem 1.2rem;border-radius:0 6px 6px 0;">
        <p style="font-size:.88rem;color:${SUCCESS};margin:0;">✅ &nbsp;Paiement reçu via PayPal — merci pour votre confiance.</p>
      </div>
    `),
    attachments: [{
      filename: `facture-${dto.date}-${invNo}.pdf`,
      content: pdf,
      contentType: 'application/pdf',
    }],
  });
  console.log('✅ 4/4 — Facture (PDF joint)');
}

// ─── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  console.log(`\nEnvoi des 4 templates vers : ${TEST_RECIPIENT}\n`);
  try {
    await transporter.verify();
    console.log('✅ SMTP OK\n');
  } catch (err) {
    console.error('❌ SMTP échoué :', err);
    process.exit(1);
  }

  await sendNotifAma();
  await sleep(5000);
  await sendConfirmClient();
  await sleep(5000);
  await sendReminder();
  await sleep(5000);
  await sendInvoice();

  console.log('\nTous les emails envoyés.');
})();

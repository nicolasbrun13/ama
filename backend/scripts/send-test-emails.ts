/**
 * Script de test — envoie les 4 templates d'emails à l'adresse TEST_RECIPIENT
 *
 * Prérequis : remplir backend/.env avec des vraies credentials SMTP
 *
 * Lancer :
 *   cd backend
 *   npx ts-node -r tsconfig-paths/register scripts/send-test-emails.ts
 */

import * as dotenv from 'dotenv';
dotenv.config();

import * as nodemailer from 'nodemailer';

// ─── Destinataire de test ────────────────────────────────────────────────────
const TEST_RECIPIENT = 'nitrodesign06@gmail.com';

// ─── Données de test réalistes ───────────────────────────────────────────────
const dto = {
  firstName: 'Sophie',
  lastName:  'Martin',
  email:     TEST_RECIPIENT,
  phone:     '06 12 34 56 78',
  date:      '2026-11-15',
  time:      '14:30',
  message:   'Je suis prête pour cette expérience transformatrice. Merci.',
};

// ─── Config ──────────────────────────────────────────────────────────────────
const ROSE    = '#FFC5D3';
const GOLD    = '#E8BF50';
const BG      = '#06030F';
const WHITE   = '#FDF0F7';
const DIM     = 'rgba(253,240,247,.65)';
const DIMLO   = 'rgba(253,240,247,.45)';
const BORDER  = 'rgba(255,197,211,.12)';
const CONTACT = 'contact@amablanc-hre.fr';

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST   || 'ssl0.ovh.net',
  port:   parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ─── Templates ───────────────────────────────────────────────────────────────

async function sendConfirmationClient() {
  await transporter.sendMail({
    from: `"Ama — Hypnose HRE" <${process.env.SMTP_USER}>`,
    to:   TEST_RECIPIENT,
    subject: `[TEST] Votre séance HRE est confirmée — ${dto.date} à ${dto.time}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:${BG};color:${WHITE};padding:2rem 2.5rem;border-radius:10px;">
        <h1 style="font-style:italic;color:${ROSE};font-size:1.75rem;margin-bottom:.25rem;">Votre séance est confirmée</h1>
        <p style="color:${DIMLO};font-size:.8rem;margin-bottom:2rem;">Hypnose Régressive Ésotérique · méthode Calogéro Grifasi</p>
        <p style="color:rgba(253,240,247,.8);line-height:1.85;margin-bottom:1.5rem;">
          Bonjour <strong>${dto.firstName}</strong>,<br><br>
          Votre réservation a bien été enregistrée et votre paiement confirmé.
        </p>
        <div style="background:rgba(255,197,211,.07);border-left:3px solid ${ROSE};padding:1.2rem 1.5rem;border-radius:0 8px 8px 0;margin-bottom:2rem;">
          <p style="font-weight:700;color:${GOLD};margin-bottom:.75rem;font-size:.9rem;letter-spacing:.06em;text-transform:uppercase;">Récapitulatif</p>
          <p style="color:rgba(253,240,247,.85);font-size:.9rem;margin-bottom:.35rem;">📅 <strong>${dto.date}</strong> à <strong>${dto.time}</strong></p>
          <p style="color:rgba(253,240,247,.85);font-size:.9rem;margin-bottom:.35rem;">💻 Via Zoom — le lien vous sera envoyé le jour même</p>
          <p style="color:rgba(253,240,247,.85);font-size:.9rem;">✅ Paiement de 150 € confirmé</p>
        </div>
        <h3 style="font-style:italic;color:${ROSE};font-size:1.1rem;margin-bottom:1rem;">Préparer votre séance</h3>
        <ul style="list-style:none;padding:0;margin-bottom:1.5rem;">
          <li style="padding:.55rem 0;border-bottom:1px solid rgba(255,197,211,.08);color:${DIM};font-size:.88rem;line-height:1.7;">🌐 <strong style="color:${WHITE};">Connexion internet stable</strong> — Privilégiez le Wi-Fi ou une connexion filaire.</li>
          <li style="padding:.55rem 0;border-bottom:1px solid rgba(255,197,211,.08);color:${DIM};font-size:.88rem;line-height:1.7;">🎧 <strong style="color:${WHITE};">Casque ou écouteurs</strong> — Fortement recommandé pour une écoute immersive.</li>
          <li style="padding:.55rem 0;border-bottom:1px solid rgba(255,197,211,.08);color:${DIM};font-size:.88rem;line-height:1.7;">🤫 <strong style="color:${WHITE};">Environnement calme</strong> — Installez-vous dans un espace où vous ne serez pas dérangé(e).</li>
          <li style="padding:.55rem 0;color:${DIM};font-size:.88rem;line-height:1.7;">🎙️ <strong style="color:${WHITE};">Enregistrement</strong> — Les séances sont enregistrées et peuvent vous être partagées si vous le souhaitez.</li>
        </ul>
        <p style="color:${DIM};font-size:.88rem;font-style:italic;margin-bottom:2rem;">Un rappel vous sera envoyé la veille de votre séance.</p>
        <p style="color:${DIMLO};font-size:.78rem;border-top:1px solid ${BORDER};padding-top:1rem;">
          Anne-Marie Blanc — Praticienne HRE certifiée, méthode Calogéro Grifasi<br>
          <a href="mailto:${CONTACT}" style="color:${ROSE};text-decoration:none;">${CONTACT}</a>
        </p>
      </div>
    `,
  });
  console.log('✅ Confirmation client envoyée');
}

async function sendReminderClient() {
  await transporter.sendMail({
    from: `"Ama — Hypnose HRE" <${process.env.SMTP_USER}>`,
    to:   TEST_RECIPIENT,
    subject: `[TEST] Rappel — Votre séance HRE demain à ${dto.time}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:${BG};color:${WHITE};padding:2rem 2.5rem;border-radius:10px;">
        <h2 style="font-style:italic;color:${ROSE};font-size:1.5rem;margin-bottom:.25rem;">Votre séance est demain</h2>
        <p style="color:${DIMLO};font-size:.8rem;margin-bottom:2rem;">Hypnose Régressive Ésotérique · méthode Calogéro Grifasi</p>
        <p style="color:rgba(253,240,247,.8);line-height:1.85;margin-bottom:1.5rem;">
          Bonjour <strong>${dto.firstName}</strong>,<br><br>
          Votre séance est prévue <strong>demain ${dto.date} à ${dto.time}</strong> via Zoom.
        </p>
        <div style="background:rgba(255,197,211,.06);border:1px solid rgba(255,197,211,.2);border-radius:8px;padding:1.4rem 1.6rem;margin-bottom:1.75rem;">
          <p style="font-weight:700;color:${GOLD};margin-bottom:1rem;font-size:.9rem;letter-spacing:.06em;text-transform:uppercase;">Checklist avant la séance</p>
          <ul style="list-style:none;padding:0;margin:0;">
            <li style="padding:.5rem 0;border-bottom:1px solid rgba(255,197,211,.08);color:rgba(253,240,247,.8);font-size:.88rem;line-height:1.7;">✅ <strong>Connexion internet stable</strong> — vérifiez votre Wi-Fi ou branchez un câble réseau.</li>
            <li style="padding:.5rem 0;border-bottom:1px solid rgba(255,197,211,.08);color:rgba(253,240,247,.8);font-size:.88rem;line-height:1.7;">🎧 <strong>Casque ou écouteurs</strong> — indispensable pour une écoute de qualité.</li>
            <li style="padding:.5rem 0;border-bottom:1px solid rgba(255,197,211,.08);color:rgba(253,240,247,.8);font-size:.88rem;line-height:1.7;">🤫 <strong>Espace calme et isolé</strong> — assurez-vous de ne pas être dérangé(e).</li>
            <li style="padding:.5rem 0;color:rgba(253,240,247,.8);font-size:.88rem;line-height:1.7;">🎙️ <strong>Enregistrement</strong> — la séance sera enregistrée et pourra vous être transmise sur demande.</li>
          </ul>
        </div>
        <p style="color:${DIMLO};font-size:.78rem;border-top:1px solid ${BORDER};padding-top:1rem;">
          Anne-Marie Blanc — Ama · Hypnose HRE<br>
          <a href="mailto:${CONTACT}" style="color:${ROSE};text-decoration:none;">${CONTACT}</a>
        </p>
      </div>
    `,
  });
  console.log('✅ Rappel J-1 envoyé');
}

async function sendInvoice() {
  const now = new Date();
  const invoiceDate = now.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  const sessionDate = new Date(dto.date).toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  const invoiceNumber = `FACT-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${Math.floor(Math.random() * 9000) + 1000}`;
  const amaAddress = process.env.AMA_ADDRESS || '[adresse à compléter]';
  const amaSiret   = process.env.AMA_SIRET;

  await transporter.sendMail({
    from: `"Ama — Hypnose HRE" <${process.env.SMTP_USER}>`,
    to:   TEST_RECIPIENT,
    subject: `[TEST] Facture — Séance HRE du ${dto.date} — ${invoiceNumber}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:${BG};color:${WHITE};padding:2rem 2.5rem;border-radius:10px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2rem;border-bottom:1px solid ${BORDER};padding-bottom:1.5rem;">
          <div>
            <h1 style="font-style:italic;color:${ROSE};font-size:1.6rem;margin:0 0 .2rem;">Facture</h1>
            <p style="color:${DIMLO};font-size:.75rem;margin:0;">${invoiceNumber}</p>
          </div>
          <p style="font-size:.82rem;color:${DIM};margin:0;">Émise le ${invoiceDate}</p>
        </div>
        <div style="margin-bottom:1.5rem;">
          <p style="font-size:.72rem;color:${DIMLO};text-transform:uppercase;letter-spacing:.08em;margin-bottom:.5rem;">Émetteur</p>
          <p style="font-weight:700;margin:0 0 .15rem;">Anne-Marie Blanc</p>
          <p style="font-size:.82rem;color:${DIM};margin:0;">Praticienne HRE — méthode Calogéro Grifasi</p>
          <p style="font-size:.82rem;color:${DIM};margin:.2rem 0 0;">${amaAddress}</p>
          ${amaSiret ? `<p style="font-size:.78rem;color:${DIMLO};margin:.2rem 0 0;">SIRET : ${amaSiret}</p>` : ''}
        </div>
        <div style="margin-bottom:2rem;">
          <p style="font-size:.72rem;color:${DIMLO};text-transform:uppercase;letter-spacing:.08em;margin-bottom:.5rem;">Client</p>
          <p style="font-weight:700;margin:0 0 .15rem;">${dto.firstName} ${dto.lastName}</p>
          <p style="font-size:.82rem;color:${DIM};margin:0;">${dto.email}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:1.25rem;">
          <thead>
            <tr style="border-bottom:1px solid rgba(255,197,211,.2);">
              <th style="text-align:left;padding:.55rem .4rem;font-size:.72rem;color:${DIMLO};text-transform:uppercase;letter-spacing:.06em;font-weight:600;">Prestation</th>
              <th style="text-align:center;padding:.55rem .4rem;font-size:.72rem;color:${DIMLO};text-transform:uppercase;font-weight:600;">Qté</th>
              <th style="text-align:right;padding:.55rem .4rem;font-size:.72rem;color:${DIMLO};text-transform:uppercase;font-weight:600;">Montant</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding:.9rem .4rem;">
                <p style="margin:0;font-size:.9rem;">Séance d'Hypnose Régressive Ésotérique</p>
                <p style="margin:.2rem 0 0;font-size:.78rem;color:${DIM};">Séance réalisée le ${sessionDate} à ${dto.time} — via Zoom</p>
              </td>
              <td style="padding:.9rem .4rem;text-align:center;font-size:.9rem;">1</td>
              <td style="padding:.9rem .4rem;text-align:right;font-size:.9rem;font-weight:700;color:${GOLD};">150,00 €</td>
            </tr>
          </tbody>
        </table>
        <div style="border-top:2px solid rgba(255,197,211,.2);padding-top:1rem;margin-bottom:1.5rem;text-align:right;">
          <p style="font-size:.75rem;color:${DIMLO};margin:0 0 .4rem;">TVA non applicable — art. 293 B du CGI</p>
          <p style="font-size:1.15rem;font-weight:700;color:${GOLD};margin:0;">Total TTC : 150,00 €</p>
        </div>
        <div style="background:rgba(111,207,151,.06);border-left:3px solid #6fcf97;padding:.9rem 1.2rem;border-radius:0 6px 6px 0;margin-bottom:2rem;">
          <p style="font-size:.85rem;color:rgba(253,240,247,.85);margin:0;">✅ Paiement reçu via PayPal — merci pour votre confiance.</p>
        </div>
        <p style="color:${DIMLO};font-size:.75rem;border-top:1px solid ${BORDER};padding-top:1rem;">
          Anne-Marie Blanc — Ama · Hypnose HRE<br>
          <a href="mailto:${CONTACT}" style="color:${ROSE};text-decoration:none;">${CONTACT}</a>
        </p>
      </div>
    `,
  });
  console.log('✅ Facture envoyée');
}

async function sendConfirmationAma() {
  await transporter.sendMail({
    from: `"Site Ama HRE" <${process.env.SMTP_USER}>`,
    to:   TEST_RECIPIENT,
    subject: `[TEST] Nouvelle réservation — ${dto.firstName} ${dto.lastName} — ${dto.date}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:${BG};color:${WHITE};padding:2rem;border-radius:8px;">
        <h2 style="color:${ROSE};font-style:italic;">Nouvelle réservation de séance HRE</h2>
        <table style="width:100%;border-collapse:collapse;margin-top:1.5rem;">
          <tr><td style="padding:.5rem;color:${DIM};font-size:.85rem;">Nom</td><td style="padding:.5rem;font-weight:700;">${dto.firstName} ${dto.lastName}</td></tr>
          <tr><td style="padding:.5rem;color:${DIM};font-size:.85rem;">Email</td><td style="padding:.5rem;"><a href="mailto:${dto.email}" style="color:${ROSE};">${dto.email}</a></td></tr>
          <tr><td style="padding:.5rem;color:${DIM};font-size:.85rem;">Téléphone</td><td style="padding:.5rem;">${dto.phone}</td></tr>
          <tr><td style="padding:.5rem;color:${DIM};font-size:.85rem;">Date</td><td style="padding:.5rem;font-weight:700;color:${GOLD};">${dto.date} à ${dto.time}</td></tr>
          <tr><td style="padding:.5rem;color:${DIM};font-size:.85rem;">Mode</td><td style="padding:.5rem;">Zoom</td></tr>
          <tr><td style="padding:.5rem;color:${DIM};font-size:.85rem;">Paiement</td><td style="padding:.5rem;color:#6fcf97;font-weight:700;">150 € confirmé via PayPal</td></tr>
          <tr><td style="padding:.5rem;color:${DIM};font-size:.85rem;vertical-align:top;">Message</td><td style="padding:.5rem;font-style:italic;">${dto.message}</td></tr>
        </table>
      </div>
    `,
  });
  console.log('✅ Notification Ama envoyée');
}

// ─── Exécution ───────────────────────────────────────────────────────────────
(async () => {
  console.log(`\nEnvoi des 4 templates de test vers : ${TEST_RECIPIENT}\n`);
  try {
    await transporter.verify();
    console.log('✅ Connexion SMTP OK\n');
  } catch (err) {
    console.error('❌ Connexion SMTP échouée :', err);
    process.exit(1);
  }

  await sendConfirmationAma();
  await sendConfirmationClient();
  await sendReminderClient();
  await sendInvoice();

  console.log('\nTous les emails ont été envoyés.');
})();

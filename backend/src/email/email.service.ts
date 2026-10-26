import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PDFDocument = require('pdfkit');
import { ICalCalendar } from 'ical-generator';
import { CreateReservationDto } from '../reservations/dto/create-reservation.dto';

// ─── Palette (light theme — pour lisibilité email) ────────────────────────────
const VIOLET      = '#8B6DC8';
const VIOLET_DARK = '#6B4DA8';
const VIOLET_BG   = '#F0EBFF';
const VIOLET_CARD = '#F8F4FF';
const ROSE        = '#E896A8';
const GOLD        = '#B8860B';
const TEXT        = '#1E0A3C';
const SUBTEXT     = '#6B5B8A';
const WHITE_PURE  = '#FFFFFF';
const SUCCESS     = '#27AE60';
const BORDER_SOFT = 'rgba(139,109,200,.15)';

void GOLD; // utilisé dans PDF si besoin

const CONTACT_EMAIL = 'contact@amablanc-hre.fr';

// ─── Sécurité HTML ────────────────────────────────────────────────────────────
/** Échappe les caractères HTML dangereux dans les données utilisateur */
export function escHtml(s: string | undefined | null): string {
  if (!s) return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// ─── Helpers HTML ─────────────────────────────────────────────────────────────
function emailWrapper(content: string): string {
  return `
    <div style="background:${VIOLET_BG};padding:2rem 1rem;font-family:'Nunito',Arial,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background:${WHITE_PURE};border-radius:12px;overflow:hidden;box-shadow:0 4px 24px ${BORDER_SOFT};">

        <!-- Header -->
        <div style="background:linear-gradient(135deg,${VIOLET},${VIOLET_DARK});padding:2rem;text-align:center;">
          <p style="font-size:2.5rem;margin:0 0 .5rem;line-height:1;">🌸</p>
          <h1 style="color:#FFFFFF;font-family:Georgia,serif;font-style:italic;font-size:1.4rem;margin:0 0 .2rem;line-height:1.2;">Ama</h1>
          <p style="color:rgba(255,255,255,.75);font-size:.75rem;margin:0;letter-spacing:.06em;text-transform:uppercase;">Hypnose Régressive Ésotérique</p>
        </div>

        <!-- Body -->
        <div style="padding:2rem 2.5rem;">
          ${content}
        </div>

        <!-- Footer -->
        <div style="background:${VIOLET_CARD};padding:1.25rem 2.5rem;border-top:1px solid rgba(139,109,200,.12);text-align:center;">
          <p style="color:${SUBTEXT};font-size:.75rem;margin:0;">
            Anne-Marie Blanc — Praticienne HRE certifiée, méthode Calogéro Grifasi<br>
            <a href="mailto:${CONTACT_EMAIL}" style="color:${VIOLET};text-decoration:none;">${CONTACT_EMAIL}</a>
          </p>
        </div>

      </div>
    </div>
  `;
}

function li(emoji: string, label: string, text: string): string {
  return `<li style="padding:.6rem 0;border-bottom:1px solid rgba(139,109,200,.1);font-size:.88rem;line-height:1.7;color:${SUBTEXT};list-style:none;">${emoji}&nbsp;&nbsp;<strong style="color:${TEXT};">${label}</strong> — ${text}</li>`;
}

// ─── PDF Facture ──────────────────────────────────────────────────────────────
function generateInvoicePdf(dto: CreateReservationDto): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 56 });
    const chunks: Buffer[] = [];
    doc.on('data', (c: Buffer) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const now   = new Date();
    const invNo = `FACT-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${Math.floor(Math.random() * 9000) + 1000}`;
    const invDate = now.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    const sessionDate = new Date(dto.date).toLocaleDateString('fr-FR', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
    });

    const W = doc.page.width - 112;

    doc.rect(56, 56, W, 56).fill('#8B6DC8');
    doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(20).text('FACTURE', 72, 72, { align: 'left' });
    doc.font('Helvetica').fontSize(10).fillColor('rgba(255,255,255,.8)').text(invNo, 72, 97);
    doc.font('Helvetica').fontSize(10).fillColor('#FFFFFF').text(`Émise le ${invDate}`, 0, 80, { align: 'right', width: W + 56 });

    let y = 136;

    doc.fillColor('#1E0A3C').font('Helvetica-Bold').fontSize(8)
       .text('ÉMETTEUR', 56, y).text('CLIENT', 330, y);
    y += 14;

    const amaName    = 'Anne-Marie Blanc';
    const amaAddress  = process.env.AMA_ADDRESS  || '[adresse à compléter]';
    const amaLegalNum = process.env.AMA_LEGAL_NUM;

    doc.font('Helvetica-Bold').fontSize(11).fillColor('#1E0A3C')
       .text(amaName, 56, y)
       .text(`${dto.firstName} ${dto.lastName}`, 330, y);
    y += 16;
    doc.font('Helvetica').fontSize(9.5).fillColor('#6B5B8A')
       .text('Praticienne HRE — méthode Calogéro Grifasi', 56, y)
       .text(dto.email, 330, y);
    y += 14;
    doc.text(amaAddress, 56, y);
    if (amaLegalNum) { y += 14; doc.text(amaLegalNum, 56, y); }
    doc.text(CONTACT_EMAIL, 56, y + (amaLegalNum ? 14 : 0));

    y += 60;
    doc.moveTo(56, y).lineTo(56 + W, y).strokeColor('#E0D5F5').lineWidth(1).stroke();
    y += 20;

    doc.rect(56, y, W, 28).fill('#F0EBFF');
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#6B5B8A')
       .text('PRESTATION', 66, y + 9)
       .text('QTÉ', 430, y + 9)
       .text('MONTANT', 496, y + 9);
    y += 28;

    doc.rect(56, y, W, 48).fill('#FAFAFA').stroke('#F0EBFF');
    doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#1E0A3C').text('Séance d\'Hypnose Régressive Ésotérique', 66, y + 10);
    doc.font('Helvetica').fontSize(9).fillColor('#6B5B8A').text(`Réalisée le ${sessionDate} à ${dto.time} — via Zoom`, 66, y + 28);
    doc.font('Helvetica').fontSize(10.5).fillColor('#1E0A3C').text('1', 434, y + 16).text('150,00 €', 480, y + 16);
    y += 48;

    doc.moveTo(56, y).lineTo(56 + W, y).strokeColor('#E0D5F5').stroke();
    y += 16;

    doc.font('Helvetica').fontSize(9).fillColor('#8B8B8B').text('TVA non applicable — art. 293 B du CGI', 56, y);
    doc.font('Helvetica-Bold').fontSize(14).fillColor('#8B6DC8').text('Total TTC : 150,00 €', 0, y, { align: 'right', width: W + 56 });
    y += 36;

    doc.rect(56, y, W, 32).fill('#F0FFF4').stroke('#27AE60');
    doc.font('Helvetica').fontSize(10).fillColor('#27AE60')
       .text('✓  Paiement reçu via PayPal — merci pour votre confiance.', 68, y + 10);
    y += 48;

    doc.moveTo(56, y).lineTo(56 + W, y).strokeColor('#E0D5F5').stroke();
    y += 12;
    doc.font('Helvetica').fontSize(8.5).fillColor('#8B8B8B')
       .text('Anne-Marie Blanc — Ama · Hypnose Régressive Ésotérique · contact@amablanc-hre.fr', 56, y, { align: 'center', width: W });

    doc.end();
  });
}

// ─── Service ─────────────────────────────────────────────────────────────────
@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST   || 'ssl0.ovh.net',
      port:   parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  generateIcs(dto: CreateReservationDto, forAma = false): Buffer {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ical = require('ical-generator');
    const calendar: ICalCalendar = ical.default({ name: 'Séance HRE — Ama' });
    const start = new Date(`${dto.date}T${dto.time}:00`);
    const end   = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    // Valeurs brutes (pas escHtml) : ce n'est pas du HTML, ical-generator échappe le format ICS.
    const amaDescription = [
      `${dto.firstName} ${dto.lastName}`,
      dto.email,
      dto.phone || 'Non renseigné',
      ...(dto.message ? [dto.message.replace(/\r/g, '').slice(0, 500)] : []),
      'Mode : Zoom',
    ].join('\n');
    calendar.createEvent({
      start, end,
      summary: forAma ? `Séance HRE \u2014 ${dto.firstName} ${dto.lastName}` : 'Séance HRE avec Ama',
      description: forAma
        ? amaDescription
        : `Séance d'Hypnose Régressive Ésotérique avec Anne-Marie Blanc.\nMode : Zoom.\nContact : ${CONTACT_EMAIL}`,
      organizer: { name: 'Ama — Hypnose HRE', email: process.env.AMA_EMAIL || CONTACT_EMAIL },
      attendees: [{ name: `${dto.firstName} ${dto.lastName}`, email: dto.email, rsvp: true }],
    });
    return Buffer.from(calendar.toString(), 'utf-8');
  }

  private get amaEmail(): string {
    return process.env.AMA_EMAIL || CONTACT_EMAIL;
  }

  // ── Notification à Ama ─────────────────────────────────────────────────────
  async sendConfirmationToAma(dto: CreateReservationDto, manualPayment = false): Promise<void> {
    const icsBuffer = this.generateIcs(dto, true);
    const fn  = escHtml(dto.firstName);
    const ln  = escHtml(dto.lastName);
    const em  = escHtml(dto.email);
    const ph  = escHtml(dto.phone) || 'Non renseigné';
    const dt  = escHtml(dto.date);
    const tm  = escHtml(dto.time);
    const msg = escHtml(dto.message);

    await this.transporter.sendMail({
      from:    `"Site Ama HRE" <${process.env.SMTP_USER}>`,
      to:      this.amaEmail,
      replyTo: dto.email,  // Ama peut répondre directement au client
      subject: `${manualPayment ? 'Nouvelle réservation (paiement à vérifier)' : 'Nouvelle réservation'} — ${dto.firstName} ${dto.lastName} — ${dto.date} à ${dto.time}`,
      html: emailWrapper(`
        <h2 style="color:${VIOLET};font-family:Georgia,serif;font-style:italic;font-size:1.3rem;margin-bottom:1.5rem;">Nouvelle réservation</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:.5rem .75rem;font-size:.82rem;color:${SUBTEXT};width:120px;">Nom</td>
              <td style="padding:.5rem .75rem;font-weight:700;color:${TEXT};">${fn} ${ln}</td></tr>
          <tr style="background:${VIOLET_CARD};"><td style="padding:.5rem .75rem;font-size:.82rem;color:${SUBTEXT};">Email</td>
              <td style="padding:.5rem .75rem;"><a href="mailto:${em}" style="color:${VIOLET};">${em}</a></td></tr>
          <tr><td style="padding:.5rem .75rem;font-size:.82rem;color:${SUBTEXT};">Téléphone</td>
              <td style="padding:.5rem .75rem;color:${TEXT};">${ph}</td></tr>
          <tr style="background:${VIOLET_CARD};"><td style="padding:.5rem .75rem;font-size:.82rem;color:${SUBTEXT};">Date</td>
              <td style="padding:.5rem .75rem;font-weight:700;color:${VIOLET_DARK};">${dt} à ${tm}</td></tr>
          <tr><td style="padding:.5rem .75rem;font-size:.82rem;color:${SUBTEXT};">Mode</td>
              <td style="padding:.5rem .75rem;color:${TEXT};">Zoom</td></tr>
          <tr style="background:${VIOLET_CARD};"><td style="padding:.5rem .75rem;font-size:.82rem;color:${SUBTEXT};">Paiement</td>
              <td style="padding:.5rem .75rem;font-weight:700;color:${manualPayment ? VIOLET_DARK : SUCCESS};">${manualPayment ? '150 € à vérifier sur ton compte PayPal (paypal.me), le client a utilisé le lien de paiement' : '150 € confirmé via PayPal'}</td></tr>
          ${msg ? `<tr><td style="padding:.5rem .75rem;font-size:.82rem;color:${SUBTEXT};vertical-align:top;">Message</td>
              <td style="padding:.5rem .75rem;font-style:italic;color:${SUBTEXT};">${msg}</td></tr>` : ''}
        </table>
        <p style="margin-top:1.5rem;font-size:.78rem;color:${SUBTEXT};">Le fichier .ics ci-joint te permet d'ajouter ce rendez-vous à ton agenda.</p>
      `),
      attachments: [{
        filename: `seance-hre-${dto.date}.ics`,
        content: icsBuffer,
        contentType: 'text/calendar; charset=utf-8; method=REQUEST',
      }],
    });
  }

  // ── Confirmation au client ─────────────────────────────────────────────────
  async sendConfirmationToClient(dto: CreateReservationDto, manualPayment = false): Promise<void> {
    const icsBuffer = this.generateIcs(dto);
    const fn  = escHtml(dto.firstName);
    const dt  = escHtml(dto.date);
    const tm  = escHtml(dto.time);

    await this.transporter.sendMail({
      from:    `"Ama — Hypnose HRE" <${process.env.SMTP_USER}>`,
      to:      dto.email,
      replyTo: this.amaEmail,  // Le client peut répondre directement à Ama
      subject: `Votre séance HRE est confirmée — ${dto.date} à ${dto.time}`,
      html: emailWrapper(`
        <h2 style="color:${TEXT};font-family:Georgia,serif;font-style:italic;font-size:1.35rem;margin-bottom:.25rem;">Votre séance est confirmée</h2>
        <p style="color:${SUBTEXT};font-size:.8rem;margin-bottom:1.75rem;">Hypnose Régressive Ésotérique · méthode Calogéro Grifasi</p>

        <p style="color:${TEXT};line-height:1.85;margin-bottom:1.5rem;">
          Bonjour <strong>${fn}</strong>,<br><br>
          Votre réservation a bien été enregistrée${manualPayment ? '.' : ' et votre paiement confirmé.'}
        </p>

        <div style="background:${VIOLET_CARD};border-left:3px solid ${ROSE};padding:1.2rem 1.5rem;border-radius:0 8px 8px 0;margin-bottom:2rem;">
          <p style="font-weight:700;color:${VIOLET_DARK};margin-bottom:.75rem;font-size:.85rem;letter-spacing:.06em;text-transform:uppercase;">Récapitulatif</p>
          <p style="color:${TEXT};font-size:.9rem;margin-bottom:.35rem;">📅 &nbsp;<strong>${dt}</strong> à <strong>${tm}</strong></p>
          <p style="color:${TEXT};font-size:.9rem;margin-bottom:.35rem;">💻 &nbsp;Via Zoom — le lien vous sera envoyé le jour même</p>
          ${manualPayment ? '' : `<p style="color:${SUCCESS};font-size:.9rem;">✅ &nbsp;Paiement de 150 € confirmé</p>`}
        </div>

        <h3 style="font-family:Georgia,serif;font-style:italic;color:${VIOLET};font-size:1.05rem;margin-bottom:1rem;">Préparer votre séance</h3>
        <ul style="list-style:none;padding:0;margin-bottom:1.5rem;">
          ${li('🌐', 'Connexion internet stable', 'Privilégiez le Wi-Fi ou une connexion filaire.')}
          ${li('🎧', 'Casque ou écouteurs', 'Fortement recommandé pour une écoute immersive.')}
          ${li('🤫', 'Environnement calme', 'Installez-vous dans un espace où vous ne serez pas dérangé(e).')}
          ${li('🎙️', 'Enregistrement', 'Les séances sont enregistrées et peuvent vous être partagées si vous le souhaitez.')}
        </ul>

        <p style="color:${SUBTEXT};font-size:.87rem;font-style:italic;">
          Un rappel vous sera envoyé la veille de votre séance. N'hésitez pas à me contacter pour toute question.
        </p>
      `),
      attachments: [{
        filename: `seance-hre-${dto.date}.ics`,
        content: icsBuffer,
        contentType: 'text/calendar; charset=utf-8; method=REQUEST',
      }],
    });
  }

  // ── Alerte : remboursement automatique échoué ─────────────────────────────
  async sendRefundFailureAlert(info: {
    orderID: string;
    captureID: string;
    reason: string;
    dto: CreateReservationDto;
  }): Promise<void> {
    const { orderID, captureID, reason, dto } = info;
    await this.transporter.sendMail({
      from:    `"Site Ama HRE" <${process.env.SMTP_USER}>`,
      to:      this.amaEmail,
      replyTo: dto.email,
      subject: `URGENT : remboursement PayPal à faire à la main (${orderID})`,
      html: emailWrapper(`
        <h2 style="color:#C0392B;font-family:Georgia,serif;font-style:italic;font-size:1.3rem;margin-bottom:1rem;">Remboursement automatique échoué</h2>
        <p style="color:${TEXT};line-height:1.7;margin-bottom:1rem;">
          Un client a payé mais sa réservation n'a pas pu être enregistrée, et le remboursement automatique a été refusé par PayPal.
          <strong>Merci de rembourser ce paiement depuis ton compte PayPal.</strong>
        </p>
        <table style="width:100%;border-collapse:collapse;font-size:.88rem;color:${TEXT};">
          <tr><td style="padding:.4rem .75rem;color:${SUBTEXT};width:140px;">Commande PayPal</td><td style="padding:.4rem .75rem;font-weight:700;">${escHtml(orderID)}</td></tr>
          <tr><td style="padding:.4rem .75rem;color:${SUBTEXT};">Capture</td><td style="padding:.4rem .75rem;font-weight:700;">${escHtml(captureID)}</td></tr>
          <tr><td style="padding:.4rem .75rem;color:${SUBTEXT};">Client</td><td style="padding:.4rem .75rem;">${escHtml(dto.firstName)} ${escHtml(dto.lastName)} (${escHtml(dto.email)})</td></tr>
          <tr><td style="padding:.4rem .75rem;color:${SUBTEXT};">Créneau demandé</td><td style="padding:.4rem .75rem;">${escHtml(dto.date)} à ${escHtml(dto.time)}</td></tr>
          <tr><td style="padding:.4rem .75rem;color:${SUBTEXT};">Raison</td><td style="padding:.4rem .75rem;">${escHtml(reason)}</td></tr>
        </table>
      `),
    });
  }

  // ── Rappel J-1 ────────────────────────────────────────────────────────────
  async sendReminderToClient(dto: CreateReservationDto): Promise<void> {
    const fn = escHtml(dto.firstName);
    const dt = escHtml(dto.date);
    const tm = escHtml(dto.time);

    await this.transporter.sendMail({
      from:    `"Ama — Hypnose HRE" <${process.env.SMTP_USER}>`,
      to:      dto.email,
      replyTo: this.amaEmail,
      subject: `Rappel — Votre séance HRE demain à ${dto.time}`,
      html: emailWrapper(`
        <h2 style="color:${TEXT};font-family:Georgia,serif;font-style:italic;font-size:1.35rem;margin-bottom:.25rem;">Votre séance est demain</h2>
        <p style="color:${SUBTEXT};font-size:.8rem;margin-bottom:1.75rem;">Hypnose Régressive Ésotérique · méthode Calogéro Grifasi</p>

        <p style="color:${TEXT};line-height:1.85;margin-bottom:1.5rem;">
          Bonjour <strong>${fn}</strong>,<br><br>
          Votre séance est prévue <strong>demain ${dt} à ${tm}</strong> via Zoom.
        </p>

        <div style="background:${VIOLET_CARD};border:1px solid rgba(139,109,200,.25);border-radius:8px;padding:1.4rem 1.6rem;margin-bottom:1.75rem;">
          <p style="font-weight:700;color:${VIOLET_DARK};margin-bottom:1rem;font-size:.85rem;letter-spacing:.06em;text-transform:uppercase;">Checklist avant la séance</p>
          <ul style="list-style:none;padding:0;margin:0;">
            ${li('✅', 'Connexion internet stable', 'Vérifiez votre Wi-Fi ou branchez un câble réseau.')}
            ${li('🎧', 'Casque ou écouteurs', 'Indispensable pour une écoute de qualité et une réception optimale.')}
            ${li('🤫', 'Espace calme et isolé', 'Assurez-vous de ne pas être dérangé(e) pendant toute la durée.')}
            ${li('🎙️', 'Enregistrement', 'La séance sera enregistrée et pourra vous être transmise sur demande.')}
          </ul>
        </div>

        <p style="color:${SUBTEXT};font-size:.87rem;font-style:italic;">
          Installez-vous confortablement quelques minutes avant l'heure prévue. À demain.
        </p>
      `),
    });
  }

  // ── Facture J+1 ───────────────────────────────────────────────────────────
  async sendInvoiceToClient(dto: CreateReservationDto): Promise<void> {
    const pdfBuffer = await generateInvoicePdf(dto);
    const now = new Date();
    const invNo = `FACT-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${Math.floor(Math.random() * 9000) + 1000}`;
    const invDate = now.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    const sessionDate = new Date(dto.date).toLocaleDateString('fr-FR', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
    });

    const fn = escHtml(dto.firstName);

    await this.transporter.sendMail({
      from:    `"Ama — Hypnose HRE" <${process.env.SMTP_USER}>`,
      to:      dto.email,
      replyTo: this.amaEmail,
      subject: `Facture — Séance HRE du ${dto.date} — ${invNo}`,
      html: emailWrapper(`
        <h2 style="color:${TEXT};font-family:Georgia,serif;font-style:italic;font-size:1.35rem;margin-bottom:.25rem;">Votre facture</h2>
        <p style="color:${SUBTEXT};font-size:.8rem;margin-bottom:1.75rem;">${escHtml(invNo)} · Émise le ${escHtml(invDate)}</p>

        <p style="color:${TEXT};line-height:1.85;margin-bottom:1.5rem;">
          Bonjour <strong>${fn}</strong>,<br><br>
          Veuillez trouver ci-joint la facture pour votre séance d'Hypnose Régressive Ésotérique.
        </p>

        <div style="background:${VIOLET_CARD};border-radius:8px;padding:1.2rem 1.5rem;margin-bottom:1.5rem;">
          <p style="font-size:.82rem;color:${SUBTEXT};margin-bottom:.35rem;">Séance d'Hypnose Régressive Ésotérique</p>
          <p style="font-size:.82rem;color:${SUBTEXT};margin-bottom:.75rem;">Réalisée le ${escHtml(sessionDate)} à ${escHtml(dto.time)} — via Zoom</p>
          <p style="font-size:.78rem;color:${SUBTEXT};margin-bottom:.25rem;">TVA non applicable — art. 293 B du CGI</p>
          <p style="font-size:1.15rem;font-weight:700;color:${VIOLET_DARK};">Total : 150,00 €</p>
        </div>

        <div style="background:#F0FFF4;border-left:3px solid ${SUCCESS};padding:.9rem 1.2rem;border-radius:0 6px 6px 0;">
          <p style="font-size:.88rem;color:${SUCCESS};margin:0;">✅ &nbsp;Paiement reçu via PayPal — merci pour votre confiance.</p>
        </div>
      `),
      attachments: [{
        filename: `facture-${dto.date}-${invNo}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      }],
    });
  }
}

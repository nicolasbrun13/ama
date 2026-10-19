import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ICalCalendar } from 'ical-generator';
import { CreateReservationDto } from '../reservations/dto/create-reservation.dto';

const ROSE  = '#FFC5D3';
const GOLD  = '#E8BF50';
const BG    = '#06030F';
const WHITE = '#FDF0F7';
const DIM   = 'rgba(253,240,247,.65)';
const DIMLO = 'rgba(253,240,247,.45)';
const BORDER = 'rgba(255,197,211,.12)';

const CONTACT_EMAIL = 'contact@amablanc-hre.fr';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  generateIcs(dto: CreateReservationDto): Buffer {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ical = require('ical-generator');
    const calendar: ICalCalendar = ical.default({ name: 'Séance HRE — Ama' });
    const start = new Date(`${dto.date}T${dto.time}:00`);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // 2h

    calendar.createEvent({
      start,
      end,
      summary: `Séance HRE avec Ama`,
      description: `Séance d'Hypnose Régressive Ésotérique avec Anne-Marie Blanc.\nMode : Zoom.\nContact : ${process.env.AMA_EMAIL || CONTACT_EMAIL}`,
      organizer: {
        name: 'Ama — Hypnose HRE',
        email: process.env.AMA_EMAIL || CONTACT_EMAIL,
      },
      attendees: [
        {
          name: `${dto.firstName} ${dto.lastName}`,
          email: dto.email,
          rsvp: true,
        },
      ],
    });

    return Buffer.from(calendar.toString(), 'utf-8');
  }

  async sendConfirmationToAma(dto: CreateReservationDto): Promise<void> {
    const icsBuffer = this.generateIcs(dto);

    await this.transporter.sendMail({
      from: `"Site Ama HRE" <${process.env.SMTP_USER}>`,
      to: process.env.AMA_EMAIL || CONTACT_EMAIL,
      subject: `Nouvelle réservation — ${dto.firstName} ${dto.lastName} — ${dto.date} à ${dto.time}`,
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:${BG};color:${WHITE};padding:2rem;border-radius:8px;">
          <h2 style="color:${ROSE};font-style:italic;">Nouvelle réservation de séance HRE</h2>
          <table style="width:100%;border-collapse:collapse;margin-top:1.5rem;">
            <tr><td style="padding:.5rem;color:${DIM};font-size:.85rem;">Nom</td><td style="padding:.5rem;font-weight:700;">${dto.firstName} ${dto.lastName}</td></tr>
            <tr><td style="padding:.5rem;color:${DIM};font-size:.85rem;">Email</td><td style="padding:.5rem;"><a href="mailto:${dto.email}" style="color:${ROSE};">${dto.email}</a></td></tr>
            <tr><td style="padding:.5rem;color:${DIM};font-size:.85rem;">Téléphone</td><td style="padding:.5rem;">${dto.phone || 'Non renseigné'}</td></tr>
            <tr><td style="padding:.5rem;color:${DIM};font-size:.85rem;">Date</td><td style="padding:.5rem;font-weight:700;color:${GOLD};">${dto.date} à ${dto.time}</td></tr>
            <tr><td style="padding:.5rem;color:${DIM};font-size:.85rem;">Mode</td><td style="padding:.5rem;">Zoom</td></tr>
            <tr><td style="padding:.5rem;color:${DIM};font-size:.85rem;">Paiement</td><td style="padding:.5rem;color:#6fcf97;font-weight:700;">150 € confirmé via PayPal</td></tr>
            ${dto.message ? `<tr><td style="padding:.5rem;color:${DIM};font-size:.85rem;vertical-align:top;">Message</td><td style="padding:.5rem;font-style:italic;">${dto.message}</td></tr>` : ''}
          </table>
          <p style="margin-top:1.5rem;font-size:.8rem;color:${DIMLO};">Le fichier .ics ci-joint te permet d'ajouter ce rendez-vous directement à ton agenda.</p>
        </div>
      `,
      attachments: [
        {
          filename: `seance-hre-${dto.date}.ics`,
          content: icsBuffer,
          contentType: 'text/calendar; charset=utf-8; method=REQUEST',
        },
      ],
    });
  }

  async sendConfirmationToClient(dto: CreateReservationDto): Promise<void> {
    const icsBuffer = this.generateIcs(dto);

    await this.transporter.sendMail({
      from: `"Ama — Hypnose HRE" <${process.env.SMTP_USER}>`,
      to: dto.email,
      subject: `Votre séance HRE est confirmée — ${dto.date} à ${dto.time}`,
      attachments: [
        {
          filename: `seance-hre-${dto.date}.ics`,
          content: icsBuffer,
          contentType: 'text/calendar; charset=utf-8; method=REQUEST',
        },
      ],
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:${BG};color:${WHITE};padding:2rem 2.5rem;border-radius:10px;">

          <h1 style="font-family:Georgia,serif;font-style:italic;color:${ROSE};font-size:1.75rem;margin-bottom:.25rem;line-height:1.2;">
            Votre séance est confirmée
          </h1>
          <p style="color:${DIMLO};font-size:.8rem;margin-bottom:2rem;letter-spacing:.04em;">Hypnose Régressive Ésotérique · méthode Calogéro Grifasi</p>

          <p style="color:rgba(253,240,247,.8);line-height:1.85;margin-bottom:1rem;">
            Bonjour <strong>${dto.firstName}</strong>,
          </p>
          <p style="color:rgba(253,240,247,.8);line-height:1.85;margin-bottom:1.5rem;">
            Votre réservation a bien été enregistrée et votre paiement confirmé. Vous trouverez ci-dessous le récapitulatif de votre séance ainsi que quelques recommandations pour en tirer le meilleur bénéfice.
          </p>

          <div style="background:rgba(255,197,211,.07);border-left:3px solid ${ROSE};padding:1.2rem 1.5rem;border-radius:0 8px 8px 0;margin-bottom:2rem;">
            <p style="font-weight:700;color:${GOLD};margin-bottom:.75rem;font-size:.9rem;letter-spacing:.06em;text-transform:uppercase;">Récapitulatif</p>
            <p style="color:rgba(253,240,247,.85);font-size:.9rem;margin-bottom:.35rem;">📅 <strong>${dto.date}</strong> à <strong>${dto.time}</strong></p>
            <p style="color:rgba(253,240,247,.85);font-size:.9rem;margin-bottom:.35rem;">💻 Via Zoom — le lien vous sera envoyé le jour même</p>
            <p style="color:rgba(253,240,247,.85);font-size:.9rem;">✅ Paiement de 150 € confirmé</p>
          </div>

          <h3 style="font-style:italic;color:${ROSE};font-size:1.1rem;margin-bottom:1rem;">Préparer votre séance</h3>
          <ul style="list-style:none;padding:0;margin-bottom:1.5rem;">
            <li style="padding:.55rem 0;border-bottom:1px solid rgba(255,197,211,.08);color:${DIM};font-size:.88rem;line-height:1.7;">
              🌐 <strong style="color:${WHITE};">Connexion internet stable</strong> — Privilégiez le Wi-Fi ou une connexion filaire pour éviter toute interruption.
            </li>
            <li style="padding:.55rem 0;border-bottom:1px solid rgba(255,197,211,.08);color:${DIM};font-size:.88rem;line-height:1.7;">
              🎧 <strong style="color:${WHITE};">Casque ou écouteurs</strong> — Fortement recommandé pour une écoute immersive et une meilleure réceptivité.
            </li>
            <li style="padding:.55rem 0;border-bottom:1px solid rgba(255,197,211,.08);color:${DIM};font-size:.88rem;line-height:1.7;">
              🤫 <strong style="color:${WHITE};">Environnement calme</strong> — Installez-vous dans un espace où vous ne serez pas dérangé(e) pendant toute la durée de la séance.
            </li>
            <li style="padding:.55rem 0;color:${DIM};font-size:.88rem;line-height:1.7;">
              🎙️ <strong style="color:${WHITE};">Enregistrement</strong> — Les séances sont enregistrées et peuvent vous être partagées si vous le souhaitez.
            </li>
          </ul>

          <p style="color:${DIM};line-height:1.85;margin-bottom:2rem;font-size:.88rem;font-style:italic;">
            Un rappel vous sera envoyé la veille de votre séance. N'hésitez pas à revenir vers moi pour toute question.
          </p>

          <p style="color:${DIMLO};font-size:.78rem;border-top:1px solid ${BORDER};padding-top:1rem;">
            Anne-Marie Blanc — Praticienne HRE certifiée, méthode Calogéro Grifasi<br>
            <a href="mailto:${CONTACT_EMAIL}" style="color:${ROSE};text-decoration:none;">${CONTACT_EMAIL}</a>
          </p>
        </div>
      `,
    });
  }

  async sendReminderToClient(dto: CreateReservationDto): Promise<void> {
    await this.transporter.sendMail({
      from: `"Ama — Hypnose HRE" <${process.env.SMTP_USER}>`,
      to: dto.email,
      subject: `Rappel — Votre séance HRE demain à ${dto.time}`,
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:${BG};color:${WHITE};padding:2rem 2.5rem;border-radius:10px;">

          <h2 style="font-style:italic;color:${ROSE};font-size:1.5rem;margin-bottom:.25rem;">Votre séance est demain</h2>
          <p style="color:${DIMLO};font-size:.8rem;margin-bottom:2rem;">Hypnose Régressive Ésotérique · méthode Calogéro Grifasi</p>

          <p style="color:rgba(253,240,247,.8);line-height:1.85;margin-bottom:.75rem;">
            Bonjour <strong>${dto.firstName}</strong>,
          </p>
          <p style="color:rgba(253,240,247,.8);line-height:1.85;margin-bottom:1.5rem;">
            Je vous rappelle que votre séance d'Hypnose Régressive Ésotérique est prévue <strong>demain ${dto.date} à ${dto.time}</strong> via Zoom.
          </p>

          <div style="background:rgba(255,197,211,.06);border:1px solid rgba(255,197,211,.2);border-radius:8px;padding:1.4rem 1.6rem;margin-bottom:1.75rem;">
            <p style="font-weight:700;color:${GOLD};margin-bottom:1rem;font-size:.9rem;letter-spacing:.06em;text-transform:uppercase;">Checklist avant la séance</p>
            <ul style="list-style:none;padding:0;margin:0;">
              <li style="padding:.5rem 0;border-bottom:1px solid rgba(255,197,211,.08);color:rgba(253,240,247,.8);font-size:.88rem;line-height:1.7;">
                ✅ <strong>Connexion internet stable</strong> — vérifiez votre Wi-Fi ou branchez un câble réseau.
              </li>
              <li style="padding:.5rem 0;border-bottom:1px solid rgba(255,197,211,.08);color:rgba(253,240,247,.8);font-size:.88rem;line-height:1.7;">
                🎧 <strong>Casque ou écouteurs</strong> — indispensable pour une écoute de qualité et une réception optimale.
              </li>
              <li style="padding:.5rem 0;border-bottom:1px solid rgba(255,197,211,.08);color:rgba(253,240,247,.8);font-size:.88rem;line-height:1.7;">
                🤫 <strong>Espace calme et isolé</strong> — assurez-vous de ne pas être dérangé(e) pendant toute la durée de la séance.
              </li>
              <li style="padding:.5rem 0;color:rgba(253,240,247,.8);font-size:.88rem;line-height:1.7;">
                🎙️ <strong>Enregistrement</strong> — la séance sera enregistrée et pourra vous être transmise sur simple demande.
              </li>
            </ul>
          </div>

          <p style="color:${DIM};line-height:1.85;font-size:.85rem;font-style:italic;margin-bottom:2rem;">
            Prenez le temps de vous installer confortablement quelques minutes avant l'heure prévue. À demain.
          </p>

          <p style="color:${DIMLO};font-size:.78rem;border-top:1px solid ${BORDER};padding-top:1rem;">
            Anne-Marie Blanc — Ama · Hypnose HRE<br>
            <a href="mailto:${CONTACT_EMAIL}" style="color:${ROSE};text-decoration:none;">${CONTACT_EMAIL}</a>
          </p>
        </div>
      `,
    });
  }

  async sendInvoiceToClient(dto: CreateReservationDto): Promise<void> {
    const now = new Date();
    const invoiceDate = now.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    const sessionDate = new Date(dto.date).toLocaleDateString('fr-FR', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
    });
    const invoiceNumber = `FACT-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${Math.floor(Math.random() * 9000) + 1000}`;

    const amaAddress = process.env.AMA_ADDRESS || '[adresse à compléter]';
    const amaSiret   = process.env.AMA_SIRET;

    await this.transporter.sendMail({
      from: `"Ama — Hypnose HRE" <${process.env.SMTP_USER}>`,
      to: dto.email,
      subject: `Facture — Séance HRE du ${dto.date} — ${invoiceNumber}`,
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:${BG};color:${WHITE};padding:2rem 2.5rem;border-radius:10px;">

          <!-- En-tête facture -->
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2rem;border-bottom:1px solid ${BORDER};padding-bottom:1.5rem;">
            <div>
              <h1 style="font-style:italic;color:${ROSE};font-size:1.6rem;margin:0 0 .2rem;">Facture</h1>
              <p style="color:${DIMLO};font-size:.75rem;margin:0;letter-spacing:.04em;">${invoiceNumber}</p>
            </div>
            <p style="font-size:.82rem;color:${DIM};margin:0;">Émise le ${invoiceDate}</p>
          </div>

          <!-- Émetteur -->
          <div style="margin-bottom:1.5rem;">
            <p style="font-size:.72rem;color:${DIMLO};text-transform:uppercase;letter-spacing:.08em;margin-bottom:.5rem;">Émetteur</p>
            <p style="font-weight:700;margin:0 0 .15rem;">Anne-Marie Blanc</p>
            <p style="font-size:.82rem;color:${DIM};margin:0;">Praticienne HRE — méthode Calogéro Grifasi</p>
            <p style="font-size:.82rem;color:${DIM};margin:.2rem 0 0;">${amaAddress}</p>
            ${amaSiret ? `<p style="font-size:.78rem;color:${DIMLO};margin:.2rem 0 0;">SIRET : ${amaSiret}</p>` : ''}
            <p style="font-size:.78rem;color:${DIMLO};margin:.2rem 0 0;"><a href="mailto:${CONTACT_EMAIL}" style="color:${ROSE};text-decoration:none;">${CONTACT_EMAIL}</a></p>
          </div>

          <!-- Client -->
          <div style="margin-bottom:2rem;">
            <p style="font-size:.72rem;color:${DIMLO};text-transform:uppercase;letter-spacing:.08em;margin-bottom:.5rem;">Client</p>
            <p style="font-weight:700;margin:0 0 .15rem;">${dto.firstName} ${dto.lastName}</p>
            <p style="font-size:.82rem;color:${DIM};margin:0;">${dto.email}</p>
          </div>

          <!-- Détail prestation -->
          <table style="width:100%;border-collapse:collapse;margin-bottom:1.25rem;">
            <thead>
              <tr style="border-bottom:1px solid rgba(255,197,211,.2);">
                <th style="text-align:left;padding:.55rem .4rem;font-size:.72rem;color:${DIMLO};text-transform:uppercase;letter-spacing:.06em;font-weight:600;">Prestation</th>
                <th style="text-align:center;padding:.55rem .4rem;font-size:.72rem;color:${DIMLO};text-transform:uppercase;letter-spacing:.06em;font-weight:600;">Qté</th>
                <th style="text-align:right;padding:.55rem .4rem;font-size:.72rem;color:${DIMLO};text-transform:uppercase;letter-spacing:.06em;font-weight:600;">Montant</th>
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

          <!-- Total -->
          <div style="border-top:2px solid rgba(255,197,211,.2);padding-top:1rem;margin-bottom:1.5rem;text-align:right;">
            <p style="font-size:.75rem;color:${DIMLO};margin:0 0 .4rem;">TVA non applicable — art. 293 B du CGI</p>
            <p style="font-size:1.15rem;font-weight:700;color:${GOLD};margin:0;">Total TTC : 150,00 €</p>
          </div>

          <!-- Paiement -->
          <div style="background:rgba(111,207,151,.06);border-left:3px solid #6fcf97;padding:.9rem 1.2rem;border-radius:0 6px 6px 0;margin-bottom:2rem;">
            <p style="font-size:.85rem;color:rgba(253,240,247,.85);margin:0;">✅ Paiement reçu via PayPal — merci pour votre confiance.</p>
          </div>

          <p style="color:${DIMLO};font-size:.75rem;border-top:1px solid ${BORDER};padding-top:1rem;">
            Anne-Marie Blanc — Ama · Hypnose HRE<br>
            <a href="mailto:${CONTACT_EMAIL}" style="color:${ROSE};text-decoration:none;">${CONTACT_EMAIL}</a>
          </p>
        </div>
      `,
    });
  }
}

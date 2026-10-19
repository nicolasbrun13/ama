import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ICalCalendar } from 'ical-generator';
import { CreateReservationDto } from '../reservations/dto/create-reservation.dto';

const ROSE  = '#FFC5D3';
const GOLD  = '#E8BF50';
const BG    = '#06030F';
const WHITE = '#FDF0F7';

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
      description: `Séance d'Hypnose Régressive Ésotérique avec Anne-Marie Blanc.\nMode : Zoom.\nContact : ${process.env.AMA_EMAIL || 'contact@annablanc.fr'}`,
      organizer: {
        name: 'Ama — Hypnose HRE',
        email: process.env.AMA_EMAIL || 'contact@annablanc.fr',
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
      to: process.env.AMA_EMAIL || 'contact@annablanc.fr',
      subject: `Nouvelle réservation — ${dto.firstName} ${dto.lastName} — ${dto.date} à ${dto.time}`,
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:${BG};color:${WHITE};padding:2rem;border-radius:8px;">
          <h2 style="color:${ROSE};font-style:italic;">Nouvelle réservation de séance HRE</h2>
          <table style="width:100%;border-collapse:collapse;margin-top:1.5rem;">
            <tr><td style="padding:.5rem;color:rgba(253,240,247,.6);font-size:.85rem;">Nom</td><td style="padding:.5rem;font-weight:700;">${dto.firstName} ${dto.lastName}</td></tr>
            <tr><td style="padding:.5rem;color:rgba(253,240,247,.6);font-size:.85rem;">Email</td><td style="padding:.5rem;"><a href="mailto:${dto.email}" style="color:${ROSE};">${dto.email}</a></td></tr>
            <tr><td style="padding:.5rem;color:rgba(253,240,247,.6);font-size:.85rem;">Téléphone</td><td style="padding:.5rem;">${dto.phone || '—'}</td></tr>
            <tr><td style="padding:.5rem;color:rgba(253,240,247,.6);font-size:.85rem;">Date</td><td style="padding:.5rem;font-weight:700;color:${GOLD};">${dto.date} à ${dto.time}</td></tr>
            <tr><td style="padding:.5rem;color:rgba(253,240,247,.6);font-size:.85rem;">Mode</td><td style="padding:.5rem;">Zoom</td></tr>
            <tr><td style="padding:.5rem;color:rgba(253,240,247,.6);font-size:.85rem;">Paiement</td><td style="padding:.5rem;color:#6fcf97;font-weight:700;">150 € confirmé via PayPal</td></tr>
            ${dto.message ? `<tr><td style="padding:.5rem;color:rgba(253,240,247,.6);font-size:.85rem;vertical-align:top;">Message</td><td style="padding:.5rem;font-style:italic;">${dto.message}</td></tr>` : ''}
          </table>
          <p style="margin-top:1.5rem;font-size:.8rem;color:rgba(253,240,247,.45);">Le fichier .ics ci-joint te permet d'ajouter ce rendez-vous directement à ton agenda.</p>
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
          <p style="color:rgba(253,240,247,.5);font-size:.8rem;margin-bottom:2rem;letter-spacing:.04em;">Hypnose Régressive Ésotérique · méthode Calogéro Grifasi</p>

          <p style="color:rgba(253,240,247,.8);line-height:1.85;margin-bottom:1rem;">
            Bonjour <strong>${dto.firstName}</strong>,
          </p>
          <p style="color:rgba(253,240,247,.8);line-height:1.85;margin-bottom:1.5rem;">
            Votre réservation a bien été enregistrée et votre paiement confirmé. Vous trouverez ci-dessous le récapitulatif de votre séance ainsi que quelques recommandations pour en tirer le meilleur bénéfice.
          </p>

          <!-- Récapitulatif -->
          <div style="background:rgba(255,197,211,.07);border-left:3px solid ${ROSE};padding:1.2rem 1.5rem;border-radius:0 8px 8px 0;margin-bottom:2rem;">
            <p style="font-weight:700;color:${GOLD};margin-bottom:.75rem;font-size:.9rem;letter-spacing:.06em;text-transform:uppercase;">Récapitulatif</p>
            <p style="color:rgba(253,240,247,.85);font-size:.9rem;margin-bottom:.35rem;">📅 <strong>${dto.date}</strong> à <strong>${dto.time}</strong></p>
            <p style="color:rgba(253,240,247,.85);font-size:.9rem;margin-bottom:.35rem;">💻 Via Zoom</p>
            <p style="color:rgba(253,240,247,.85);font-size:.9rem;">✅ Paiement de 150 € confirmé</p>
          </div>

          <!-- Préparer la séance -->
          <h3 style="font-style:italic;color:${ROSE};font-size:1.1rem;margin-bottom:1rem;">Préparer votre séance</h3>
          <p style="color:rgba(253,240,247,.75);line-height:1.85;margin-bottom:1rem;font-size:.9rem;">
            Pour que votre expérience soit la plus profonde et la plus bénéfique possible, voici quelques recommandations :
          </p>
          <ul style="list-style:none;padding:0;margin-bottom:1.5rem;">
            <li style="padding:.55rem 0;border-bottom:1px solid rgba(255,197,211,.08);color:rgba(253,240,247,.75);font-size:.88rem;line-height:1.7;">
              🌐 <strong style="color:${WHITE};">Connexion internet stable</strong> — Privilégiez le Wi-Fi ou une connexion filaire pour éviter toute interruption.
            </li>
            <li style="padding:.55rem 0;border-bottom:1px solid rgba(255,197,211,.08);color:rgba(253,240,247,.75);font-size:.88rem;line-height:1.7;">
              🎧 <strong style="color:${WHITE};">Casque ou écouteurs</strong> — Fortement recommandé pour une écoute immersive et une meilleure réceptivité aux transmissions.
            </li>
            <li style="padding:.55rem 0;border-bottom:1px solid rgba(255,197,211,.08);color:rgba(253,240,247,.75);font-size:.88rem;line-height:1.7;">
              🤫 <strong style="color:${WHITE};">Environnement calme</strong> — Installez-vous dans un espace où vous ne serez pas dérangé(e) pendant toute la durée de la séance.
            </li>
            <li style="padding:.55rem 0;color:rgba(253,240,247,.75);font-size:.88rem;line-height:1.7;">
              🎙️ <strong style="color:${WHITE};">Enregistrement</strong> — Les séances sont enregistrées et peuvent vous être partagées si vous le souhaitez.
            </li>
          </ul>

          <p style="color:rgba(253,240,247,.75);line-height:1.85;margin-bottom:2rem;font-size:.88rem;font-style:italic;">
            Un rappel vous sera envoyé la veille de votre séance. N'hésitez pas à revenir vers moi pour toute question.
          </p>

          <p style="color:rgba(253,240,247,.5);font-size:.78rem;margin-top:2rem;border-top:1px solid rgba(255,197,211,.12);padding-top:1rem;">
            Anne-Marie Blanc — Praticienne HRE certifiée, méthode Calogéro Grifasi<br>
            <a href="mailto:${process.env.AMA_EMAIL || 'contact@annablanc.fr'}" style="color:${ROSE};text-decoration:none;">${process.env.AMA_EMAIL || 'contact@annablanc.fr'}</a>
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
          <p style="color:rgba(253,240,247,.5);font-size:.8rem;margin-bottom:2rem;">Hypnose Régressive Ésotérique · méthode Calogéro Grifasi</p>

          <p style="color:rgba(253,240,247,.8);line-height:1.85;margin-bottom:.75rem;">
            Bonjour <strong>${dto.firstName}</strong>,
          </p>
          <p style="color:rgba(253,240,247,.8);line-height:1.85;margin-bottom:1.5rem;">
            Je vous rappelle que votre séance d'Hypnose Régressive Ésotérique est prévue <strong>demain ${dto.date} à ${dto.time}</strong> via Zoom.
          </p>

          <!-- Checklist avant séance -->
          <div style="background:rgba(255,197,211,.06);border:1px solid rgba(255,197,211,.2);border-radius:8px;padding:1.4rem 1.6rem;margin-bottom:1.75rem;">
            <p style="font-weight:700;color:${GOLD};margin-bottom:1rem;font-size:.9rem;letter-spacing:.06em;text-transform:uppercase;">Checklist avant la séance</p>
            <ul style="list-style:none;padding:0;margin:0;">
              <li style="padding:.5rem 0;border-bottom:1px solid rgba(255,197,211,.08);color:rgba(253,240,247,.8);font-size:.88rem;line-height:1.7;">
                ✅ <strong>Connexion internet stable</strong> — vérifiez votre Wi-Fi ou branchez un câble réseau.
              </li>
              <li style="padding:.5rem 0;border-bottom:1px solid rgba(255,197,211,.08);color:rgba(253,240,247,.8);font-size:.88rem;line-height:1.7;">
                🎧 <strong>Casque ou écouteurs</strong> — indispensable pour une écoute de qualité et une réception optimale des transmissions.
              </li>
              <li style="padding:.5rem 0;border-bottom:1px solid rgba(255,197,211,.08);color:rgba(253,240,247,.8);font-size:.88rem;line-height:1.7;">
                🤫 <strong>Espace calme et isolé</strong> — assurez-vous de ne pas être dérangé(e) pendant toute la durée de la séance.
              </li>
              <li style="padding:.5rem 0;color:rgba(253,240,247,.8);font-size:.88rem;line-height:1.7;">
                🎙️ <strong>Enregistrement</strong> — la séance sera enregistrée et pourra vous être transmise sur simple demande.
              </li>
            </ul>
          </div>

          <p style="color:rgba(253,240,247,.6);line-height:1.85;font-size:.85rem;font-style:italic;margin-bottom:2rem;">
            Prenez le temps de vous installer confortablement quelques minutes avant l'heure prévue. À demain.
          </p>

          <p style="color:rgba(253,240,247,.5);font-size:.78rem;border-top:1px solid rgba(255,197,211,.12);padding-top:1rem;">
            Anne-Marie Blanc — Ama · Hypnose HRE<br>
            <a href="mailto:${process.env.AMA_EMAIL || 'contact@annablanc.fr'}" style="color:${ROSE};text-decoration:none;">${process.env.AMA_EMAIL || 'contact@annablanc.fr'}</a>
          </p>
        </div>
      `,
    });
  }
}

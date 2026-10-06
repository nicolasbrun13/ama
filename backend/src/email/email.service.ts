import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ICalCalendar } from 'ical-generator';
import { CreateReservationDto } from '../reservations/dto/create-reservation.dto';

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
      description: `Séance d'Hypnose Régressive Ésotérique avec Anne-Marie Blanc.\nMode : ${dto.sessionType || 'En ligne'}.\nContact : ${process.env.AMA_EMAIL || 'contact@annablanc.fr'}`,
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
      subject: `Nouvelle réservation — ${dto.firstName} ${dto.lastName} — ${dto.date} ${dto.time}`,
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#06030F;color:#FDF0F7;padding:2rem;border-radius:8px;">
          <h2 style="color:#C8587A;font-style:italic;">Nouvelle demande de séance HRE</h2>
          <table style="width:100%;border-collapse:collapse;margin-top:1.5rem;">
            <tr><td style="padding:.5rem;color:rgba(253,240,247,.6);font-size:.85rem;">Nom</td><td style="padding:.5rem;font-weight:700;">${dto.firstName} ${dto.lastName}</td></tr>
            <tr><td style="padding:.5rem;color:rgba(253,240,247,.6);font-size:.85rem;">Email</td><td style="padding:.5rem;"><a href="mailto:${dto.email}" style="color:#C8587A;">${dto.email}</a></td></tr>
            <tr><td style="padding:.5rem;color:rgba(253,240,247,.6);font-size:.85rem;">Téléphone</td><td style="padding:.5rem;">${dto.phone || '—'}</td></tr>
            <tr><td style="padding:.5rem;color:rgba(253,240,247,.6);font-size:.85rem;">Date</td><td style="padding:.5rem;font-weight:700;color:#E8BF50;">${dto.date} à ${dto.time}</td></tr>
            <tr><td style="padding:.5rem;color:rgba(253,240,247,.6);font-size:.85rem;">Mode</td><td style="padding:.5rem;">${dto.sessionType || 'Non précisé'}</td></tr>
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
    await this.transporter.sendMail({
      from: `"Ama — Hypnose HRE" <${process.env.SMTP_USER}>`,
      to: dto.email,
      subject: `Confirmation de votre séance HRE — ${dto.date}`,
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#06030F;color:#FDF0F7;padding:2rem;border-radius:8px;">
          <h1 style="font-family:Georgia,serif;font-style:italic;color:#C8587A;font-size:1.8rem;margin-bottom:.5rem;">Votre séance est confirmée</h1>
          <p style="color:rgba(253,240,247,.7);margin-bottom:1.5rem;">Bonjour ${dto.firstName},</p>
          <p style="color:rgba(253,240,247,.7);line-height:1.8;margin-bottom:1rem;">Votre demande de séance d'Hypnose Régressive Ésotérique a bien été reçue. Ama vous contactera sous 24h pour confirmer les détails.</p>
          <div style="background:rgba(200,88,122,.08);border-left:3px solid #C8587A;padding:1.2rem 1.5rem;border-radius:0 8px 8px 0;margin:1.5rem 0;">
            <p style="font-weight:700;color:#E8BF50;margin-bottom:.5rem;">Récapitulatif</p>
            <p style="color:rgba(253,240,247,.8);font-size:.9rem;">📅 ${dto.date} à ${dto.time}</p>
            <p style="color:rgba(253,240,247,.8);font-size:.9rem;">💻 Mode : ${dto.sessionType || 'À confirmer'}</p>
          </div>
          <p style="color:rgba(253,240,247,.55);font-size:.8rem;margin-top:2rem;border-top:1px solid rgba(200,88,122,.15);padding-top:1rem;">Anne-Marie Blanc — Praticienne HRE certifiée, méthode Calogéro Grifasi</p>
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
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#06030F;color:#FDF0F7;padding:2rem;border-radius:8px;">
          <h2 style="font-style:italic;color:#C8587A;">Votre séance est demain</h2>
          <p style="color:rgba(253,240,247,.7);line-height:1.8;margin-top:1rem;">Bonjour ${dto.firstName}, je vous rappelle que votre séance d'Hypnose Régressive Ésotérique est prévue <strong>demain ${dto.date} à ${dto.time}</strong>.</p>
          <p style="color:rgba(253,240,247,.7);line-height:1.8;">Mode : <strong>${dto.sessionType || 'À confirmer'}</strong>.</p>
          <p style="color:rgba(253,240,247,.55);font-size:.8rem;margin-top:2rem;">Anne-Marie Blanc — Ama · Hypnose HRE</p>
        </div>
      `,
    });
  }
}

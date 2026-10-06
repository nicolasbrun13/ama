import { NextRequest, NextResponse } from 'next/server';
import * as nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { nom, email, sujet, message } = await request.json();

    if (!nom || !email || !message) {
      return NextResponse.json({ message: 'Champs requis manquants' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Site Ama HRE" <${process.env.SMTP_USER}>`,
      to: process.env.AMA_EMAIL || 'contact@annablanc.fr',
      subject: `Message de contact — ${sujet || 'Question'} — ${nom}`,
      html: `
        <div style="font-family:Georgia;max-width:600px;background:#06030F;color:#FDF0F7;padding:2rem;border-radius:8px;">
          <h2 style="color:#C8587A;">Nouveau message de contact</h2>
          <p><strong>Nom :</strong> ${nom}</p>
          <p><strong>Email :</strong> <a href="mailto:${email}" style="color:#C8587A;">${email}</a></p>
          <p><strong>Sujet :</strong> ${sujet || 'Non précisé'}</p>
          <p><strong>Message :</strong></p>
          <p style="background:rgba(200,88,122,.06);padding:1rem;border-radius:4px;">${message}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact error:', error);
    return NextResponse.json({ message: "Erreur lors de l'envoi" }, { status: 500 });
  }
}

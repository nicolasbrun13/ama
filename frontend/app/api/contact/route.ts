import { NextRequest, NextResponse } from 'next/server';
import * as nodemailer from 'nodemailer';

/** Échappe les caractères HTML dangereux dans les entrées utilisateur */
function escHtml(s: string | undefined | null): string {
  if (!s) return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nom, email, sujet, message, website } = body as {
      nom?: string; email?: string; sujet?: string; message?: string; website?: string;
    };

    // Honeypot : si le champ caché 'website' est rempli, c'est un bot
    if (website) {
      return NextResponse.json({ success: true }); // fausse réponse silencieuse
    }

    if (!nom || !email || !message) {
      return NextResponse.json({ message: 'Champs requis manquants' }, { status: 400 });
    }

    // Limites de taille
    if (nom.length > 200 || email.length > 254 || message.length > 5000 || (sujet && sujet.length > 300)) {
      return NextResponse.json({ message: 'Champs trop longs' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST || 'smtp.gmail.com',
      port:   parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const safeNom     = escHtml(nom);
    const safeEmail   = escHtml(email);
    const safeSujet   = escHtml(sujet);
    const safeMessage = escHtml(message);

    await transporter.sendMail({
      from:    `"Site Ama HRE" <${process.env.SMTP_USER}>`,
      to:      process.env.AMA_EMAIL || 'contact@amablanc-hre.fr',
      replyTo: email,
      subject: `Message de contact — ${sujet || 'Question'} — ${nom}`,
      html: `
        <div style="font-family:Georgia;max-width:600px;background:#06030F;color:#FDF0F7;padding:2rem;border-radius:8px;">
          <h2 style="color:#C8587A;">Nouveau message de contact</h2>
          <p><strong>Nom :</strong> ${safeNom}</p>
          <p><strong>Email :</strong> <a href="mailto:${safeEmail}" style="color:#C8587A;">${safeEmail}</a></p>
          <p><strong>Sujet :</strong> ${safeSujet || 'Non précisé'}</p>
          <p><strong>Message :</strong></p>
          <p style="background:rgba(255,197,211,.06);padding:1rem;border-radius:4px;">${safeMessage}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact error:', error);
    return NextResponse.json({ message: "Erreur lors de l'envoi" }, { status: 500 });
  }
}

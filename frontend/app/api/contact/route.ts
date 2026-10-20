import { NextRequest, NextResponse } from 'next/server';
import * as nodemailer from 'nodemailer';
import { getClientIp, invalidJsonResponse, readJsonBody } from '@/lib/server/request';
import { createRateLimiter } from '@/lib/server/rateLimit';
import { isSafeEmail } from '@/lib/validateEmail';

/** 3 messages / 10 min / IP */
const contactLimiter = createRateLimiter({ limit: 3, windowMs: 10 * 60_000 });

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

const isOptionalString = (v: unknown): v is string | undefined => v === undefined || typeof v === 'string';

export async function POST(request: NextRequest) {
  const body = await readJsonBody(request);
  if (body === null || typeof body !== 'object' || Array.isArray(body)) return invalidJsonResponse();

  const { nom, email, sujet, message, website } = body as Record<string, unknown>;

  // Honeypot : si le champ caché 'website' est rempli, c'est un bot
  if (website) {
    return NextResponse.json({ success: true }); // fausse réponse silencieuse
  }

  if (typeof nom !== 'string' || typeof email !== 'string' || typeof message !== 'string' || !isOptionalString(sujet)) {
    return NextResponse.json({ message: 'Champs requis manquants' }, { status: 400 });
  }
  const cleanNom = nom.trim();
  const cleanEmail = email.trim();
  const cleanMessage = message.trim();
  const cleanSujet = sujet?.trim() ?? '';
  if (!cleanNom || !cleanEmail || !cleanMessage) {
    return NextResponse.json({ message: 'Champs requis manquants' }, { status: 400 });
  }

  // Limites de taille
  if (cleanNom.length > 200 || cleanEmail.length > 254 || cleanMessage.length > 5000 || cleanSujet.length > 300) {
    return NextResponse.json({ message: 'Champs trop longs' }, { status: 400 });
  }

  // Une seule adresse, sans séparateur ni retour ligne : utilisée en replyTo
  if (!isSafeEmail(cleanEmail)) {
    return NextResponse.json({ message: 'Adresse email invalide' }, { status: 400 });
  }

  const ip = getClientIp(request) || 'unknown';
  const { allowed, retryAfterSec } = contactLimiter(ip);
  if (!allowed) {
    return NextResponse.json(
      { message: `Trop de messages envoyés. Réessayez dans ${Math.ceil(retryAfterSec / 60)} minute(s).` },
      { status: 429, headers: { 'Retry-After': String(retryAfterSec) } },
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST || 'smtp.gmail.com',
      port:   parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Sujet de mail : une seule ligne
    const subjectPart = (s: string) => s.replace(/[\r\n]+/g, ' ');

    await transporter.sendMail({
      from:    `"Site Ama HRE" <${process.env.SMTP_USER}>`,
      to:      process.env.AMA_EMAIL || 'contact@amablanc-hre.fr',
      replyTo: cleanEmail,
      subject: `Message de contact : ${subjectPart(cleanSujet || 'Question')}, ${subjectPart(cleanNom)}`,
      html: `
        <div style="font-family:Georgia;max-width:600px;background:#06030F;color:#FDF0F7;padding:2rem;border-radius:8px;">
          <h2 style="color:#C8587A;">Nouveau message de contact</h2>
          <p><strong>Nom :</strong> ${escHtml(cleanNom)}</p>
          <p><strong>Email :</strong> <a href="mailto:${escHtml(cleanEmail)}" style="color:#C8587A;">${escHtml(cleanEmail)}</a></p>
          <p><strong>Sujet :</strong> ${escHtml(cleanSujet) || 'Non précisé'}</p>
          <p><strong>Message :</strong></p>
          <p style="background:rgba(255,197,211,.06);padding:1rem;border-radius:4px;">${escHtml(cleanMessage)}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact error:', error);
    return NextResponse.json({ message: "Erreur lors de l'envoi" }, { status: 500 });
  }
}

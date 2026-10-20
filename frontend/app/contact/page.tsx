'use client';
import { useState } from 'react';
import Link from 'next/link';
import VideoBackground from '@/components/animations/VideoBackground';
import { isSafeEmail } from '@/lib/validateEmail';

type FormData = {
  nom: string;
  email: string;
  sujet: string;
  message: string;
  /** Piège à robots : champ invisible, doit rester vide */
  website: string;
};

type FormState = 'idle' | 'loading' | 'success' | 'error';

export default function ContactPage() {
  const [form, setForm] = useState<FormData>({ nom: '', email: '', sujet: '', message: '', website: '' });
  const [state, setState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nom.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMsg('Merci de remplir tous les champs obligatoires.');
      setState('error');
      return;
    }
    if (!isSafeEmail(form.email.trim())) {
      setErrorMsg('Adresse email invalide.');
      setState('error');
      return;
    }

    setState('loading');
    setErrorMsg('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Erreur lors de l\'envoi');
      }
      setState('success');
      setForm({ nom: '', email: '', sujet: '', message: '', website: '' });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erreur inconnue');
      setState('error');
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(6,3,15,.6)', border: '1px solid var(--border)',
    borderRadius: '6px', padding: '.85rem 1rem', color: 'var(--white)',
    fontSize: '.88rem', fontFamily: 'Nunito, sans-serif',
    outline: 'none', transition: 'border-color .2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '.72rem', fontWeight: 700, letterSpacing: '.14em',
    textTransform: 'uppercase' as const, color: 'var(--rose)', marginBottom: '.5rem',
  };

  return (
    <main>
      {/* Sub-hero */}
      <section style={{
        position: 'relative',
        padding: '4.5rem 2rem', overflow: 'hidden',
        minHeight: '270px', display: 'flex', alignItems: 'center',
      }}>
        <VideoBackground videoSrc="/videos/4034.mp4" overlay="rgba(6,3,15,.68)" />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1000px', margin: '0 auto', width: '100%', transform: 'translateY(1.8rem)',  }}>
          <div className="sub-hero-pill" style={{
            display: 'inline-flex', alignItems: 'center', gap: '.4rem',
            background: 'rgba(255,197,211,.08)', border: '1px solid rgba(255,197,211,.22)',
            borderRadius: '50px', padding: '.35rem 1rem', marginBottom: '1.5rem',
            fontSize: '.67rem', fontWeight: 700, letterSpacing: '.22em',
            textTransform: 'uppercase' as const, color: 'var(--rose)',
          }}>
            ✿ Contact
          </div>
          <h1 style={{
            fontFamily: 'Nunito, sans-serif', fontStyle: 'normal',
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700,
            color: 'var(--white)', lineHeight: 1.15, marginBottom: '0.5rem',
            letterSpacing: '-.01em',
          }}>
            Contactez-moi
          </h1>
          <p style={{
            fontSize: '.95rem', color: 'var(--dim)', lineHeight: 1.8, maxWidth: '580px',
          }}>
            Une question sur la méthode ou les tarifs ? Je vous réponds sous 24 à 48h.
          </p>
        </div>
      </section>

      {/* Separator */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(to right, transparent 0%, rgba(255,197,211,.7) 25%, rgba(255,197,211,.7) 75%, transparent 100%)',
      }} />

      {/* Contact section */}
      <section style={{ background: 'var(--bg-mid)', padding: '3rem 2rem 5rem' }}>
        <div style={{
          maxWidth: '1000px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 1.4fr',
          gap: '4rem', alignItems: 'start',
        }} className="contact-grid">

          {/* Left: info cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{
              fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
              fontSize: '1.5rem', color: 'var(--white)', marginBottom: '.5rem',
            }}>
              Informations de contact
            </h2>

            <div className="contact-info-cards" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              {
                icon: '📧',
                label: 'Email',
                value: <a href="mailto:anne.marie.blanc@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>anne.marie.blanc@gmail.com</a>,
              },
              {
                icon: '🕐',
                label: 'Réponse',
                value: 'Sous 24 à 48h en jours ouvrés',
              },
            ].map((item, i) => (
              <div key={i} style={{
                background: 'rgba(18,8,48,.5)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '1.25rem',
                display: 'flex', gap: '1rem', alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: '.7rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase' as const, color: 'var(--rose)', marginBottom: '.25rem' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '.85rem', color: 'var(--dim)', lineHeight: 1.6 }}>
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>

          {/* Right: form */}
          <div>
            <h2 style={{
              fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
              fontSize: '1.5rem', color: 'var(--white)', marginBottom: '1.5rem',
            }}>
              Envoyer un message
            </h2>

            {state === 'success' ? (
              <div style={{
                background: 'rgba(255,197,211,.08)', border: '1px solid rgba(255,197,211,.25)',
                borderRadius: '8px', padding: '2rem', textAlign: 'center',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '.75rem' }}>✿</div>
                <h3 style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: '1.2rem', color: 'var(--white)', marginBottom: '.5rem' }}>
                  Message envoyé !
                </h3>
                <p style={{ fontSize: '.85rem', color: 'var(--dim)', lineHeight: 1.7 }}>
                  Merci pour votre message. Je vous répondrai sous 24 à 48h.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Honeypot anti-robots : hors écran, ignoré par les humains et les lecteurs d'écran */}
                <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}>
                  <label htmlFor="website">Site web</label>
                  <input
                    id="website" name="website" type="text" value={form.website} onChange={handleChange}
                    tabIndex={-1} autoComplete="off"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Nom *</label>
                  <input
                    name="nom" type="text" value={form.nom} onChange={handleChange}
                    placeholder="Votre nom" style={inputStyle} required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input
                    name="email" type="email" value={form.email} onChange={handleChange}
                    placeholder="votre@email.fr" style={inputStyle} required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Sujet</label>
                  <select name="sujet" value={form.sujet} onChange={handleChange} style={inputStyle}>
                    <option value="">Sélectionner un sujet</option>
                    <option value="Question sur la méthode">Question sur la méthode</option>
                    <option value="Tarifs">Tarifs</option>
                    <option value="Autres">Autres</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Message *</label>
                  <textarea
                    name="message" value={form.message} onChange={handleChange}
                    placeholder="Votre message..."
                    rows={5}
                    style={{ ...inputStyle, resize: 'vertical' }}
                    required
                  />
                </div>

                {state === 'error' && (
                  <div style={{
                    background: 'rgba(255,197,211,.08)', border: '1px solid rgba(255,197,211,.3)',
                    borderRadius: '6px', padding: '.75rem 1rem',
                    fontSize: '.82rem', color: 'var(--rose)',
                  }}>
                    {errorMsg || 'Une erreur est survenue. Veuillez réessayer.'}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={state === 'loading'}
                  className={state !== 'loading' ? 'btn-cta-rose' : undefined}
                  style={{
                    background: state === 'loading' ? 'rgba(160,52,96,.5)' : 'linear-gradient(135deg, #A03460, #6A1030)',
                    color: 'white', border: 'none', cursor: state === 'loading' ? 'not-allowed' : 'pointer',
                    fontSize: '.82rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase' as const,
                    padding: '1rem 2rem', borderRadius: '50px',
                    boxShadow: '0 6px 24px rgba(160,52,96,.35)',
                    fontFamily: 'Nunito, sans-serif', transition: 'all .2s',
                  }}
                >
                  {state === 'loading' ? 'Envoi en cours…' : '✿ Envoyer le message'}
                </button>

                {/* Séparateur + CTA réservation */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '.85rem' }}>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255,197,211,.14)' }} />
                  <span style={{ fontSize: '.7rem', color: 'var(--dim)', letterSpacing: '.12em', textTransform: 'uppercase', flexShrink: 0 }}>ou simplement</span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255,197,211,.14)' }} />
                </div>

                <Link
                  href="/reserver"
                  className="btn-cta-outline"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem',
                    background: 'transparent',
                    border: '1px solid rgba(255,197,211,.35)',
                    color: 'var(--rose)', textDecoration: 'none',
                    fontSize: '.82rem', fontWeight: 700, letterSpacing: '.14em',
                    textTransform: 'uppercase' as const,
                    padding: '.95rem 2rem', borderRadius: '50px',
                    transition: 'all .2s',
                  }}
                >
                  ✿ Réserver directement en ligne
                </Link>
              </form>
            )}
          </div>
        </div>
      </section>

      <style>{`
        input::placeholder, textarea::placeholder { color: rgba(253,240,247,.25); }
        input:focus, textarea:focus, select:focus { border-color: rgba(255,197,211,.5) !important; }
        select option { background: #0C0620; color: #FDF0F7; }
        .btn-cta-outline:hover { background: rgba(255,197,211,.07) !important; border-color: rgba(255,197,211,.6) !important; }
        @media (max-width: 767px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .contact-info-cards { display: grid !important; grid-template-columns: 1fr 1fr !important; flex-direction: unset !important; }
        }
      `}</style>
    </main>
  );
}

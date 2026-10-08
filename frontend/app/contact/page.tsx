'use client';
import { useState } from 'react';
import VideoBackground from '@/components/animations/VideoBackground';

type FormData = {
  nom: string;
  email: string;
  sujet: string;
  message: string;
};

type FormState = 'idle' | 'loading' | 'success' | 'error';

export default function ContactPage() {
  const [form, setForm] = useState<FormData>({ nom: '', email: '', sujet: '', message: '' });
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

    setState('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Erreur lors de l\'envoi');
      }
      setState('success');
      setForm({ nom: '', email: '', sujet: '', message: '' });
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
        padding: '6rem 2rem', textAlign: 'center', overflow: 'hidden',
        minHeight: '360px', display: 'flex', alignItems: 'center',
      }}>
        <VideoBackground videoSrc="https://assets.mixkit.co/videos/4034/4034-1080.mp4" overlay="rgba(6,3,15,.68)" />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '700px', margin: '0 auto', width: '100%' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '.4rem',
            background: 'rgba(200,88,122,.08)', border: '1px solid rgba(200,88,122,.22)',
            borderRadius: '50px', padding: '.35rem 1rem', marginBottom: '1.5rem',
            fontSize: '.67rem', fontWeight: 700, letterSpacing: '.22em',
            textTransform: 'uppercase' as const, color: 'var(--rose)',
          }}>
            ✿ Contact
          </div>
          <h1 style={{
            fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
            fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', fontWeight: 400,
            color: 'var(--white)', lineHeight: 1.2, marginBottom: '1rem',
          }}>
            Contactez-moi
          </h1>
          <p style={{
            fontSize: '.95rem', color: 'var(--dim)', lineHeight: 1.8, maxWidth: '580px', margin: '0 auto',
          }}>
            Une question sur la méthode ou les tarifs ? Je vous réponds sous 24 à 48h.
          </p>
        </div>
      </section>

      {/* Contact section */}
      <section style={{ background: 'var(--bg-mid)', padding: '5rem 2rem' }}>
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

            {[
              {
                icon: '📧',
                label: 'Email',
                value: <a href="mailto:anne.marie.blanc@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>anne.marie.blanc@gmail.com</a>,
              },
              {
                icon: '📞',
                label: 'Téléphone',
                value: <a href="tel:+33667299096" style={{ color: 'inherit', textDecoration: 'none' }}>+33 6 67 29 90 96</a>,
              },
              {
                icon: '📍',
                label: 'Localisation',
                value: '134 Bis Rue de la Marne, 33500 Libourne · Séances en ligne (France entière)',
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
                background: 'rgba(200,88,122,.08)', border: '1px solid rgba(200,88,122,.25)',
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
                    background: 'rgba(200,88,122,.08)', border: '1px solid rgba(200,88,122,.3)',
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
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section style={{ background: 'var(--bg)', padding: '5rem 0 5rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{
            borderRadius: '10px', overflow: 'hidden',
            border: '1px solid rgba(200,88,122,.18)',
            boxShadow: '0 8px 40px rgba(0,0,0,.45)',
          }}>
            <div style={{
              padding: '.8rem 1.25rem',
              background: 'rgba(18,8,48,.7)',
              display: 'flex', alignItems: 'center', gap: '.6rem',
              borderBottom: '1px solid rgba(200,88,122,.15)',
            }}>
              <span style={{ color: 'var(--rose)', fontSize: '.85rem' }}>📍</span>
              <span style={{ fontSize: '.75rem', color: 'var(--dim)', letterSpacing: '.06em' }}>
                134 Bis Rue de la Marne, 33500 Libourne
              </span>
            </div>
            <iframe
              src="https://maps.google.com/maps?q=134+Bis+Rue+de+la+Marne,+33500+Libourne,+France&output=embed&hl=fr&z=15"
              width="100%"
              height="320"
              style={{ border: 0, display: 'block' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localisation du cabinet"
            />
          </div>
        </div>
      </section>

      <style>{`
        input::placeholder, textarea::placeholder { color: rgba(253,240,247,.25); }
        input:focus, textarea:focus, select:focus { border-color: rgba(200,88,122,.5) !important; }
        select option { background: #0C0620; color: #FDF0F7; }
        @media (max-width: 767px) { .contact-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </main>
  );
}

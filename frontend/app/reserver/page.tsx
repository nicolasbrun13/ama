'use client';
import { useState, useEffect } from 'react';
import VideoBackground from '@/components/animations/VideoBackground';

type FormData = {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  typeSeance: 'online' | 'presentiel' | '';
  dateVoulue: string;
  heureVoulue: string;
  message: string;
};

type FormState = 'idle' | 'loading' | 'success' | 'error';

const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

const today = new Date().toISOString().split('T')[0];

export default function ReserverPage() {
  const [form, setForm] = useState<FormData>({
    prenom: '', nom: '', email: '', telephone: '',
    typeSeance: '', dateVoulue: '', heureVoulue: '', message: '',
  });
  const [state, setState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Pré-remplit la date si ?date= est passé depuis le calendrier
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const d = params.get('date');
    if (d) setForm(prev => ({ ...prev, dateVoulue: d }));
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.prenom.trim() || !form.nom.trim() || !form.email.trim() ||
        !form.typeSeance || !form.dateVoulue || !form.heureVoulue) {
      setErrorMsg('Merci de remplir tous les champs obligatoires (*).');
      setState('error');
      return;
    }

    setState('loading');
    setErrorMsg('');

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
      const endpoint = apiBase ? `${apiBase}/api/reservations` : `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/api/reservations`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.prenom,
          lastName: form.nom,
          email: form.email,
          phone: form.telephone || undefined,
          sessionType: form.typeSeance,
          desiredDate: form.dateVoulue,
          desiredTime: form.heureVoulue,
          message: form.message || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Erreur lors de l\'envoi');
      }

      setState('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Impossible de contacter le serveur. Veuillez réessayer.');
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
        minHeight: '360px',
      }}>
        <VideoBackground overlay="rgba(6,3,15,.82)" />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '700px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '.4rem',
            background: 'rgba(200,88,122,.08)', border: '1px solid rgba(200,88,122,.22)',
            borderRadius: '50px', padding: '.35rem 1rem', marginBottom: '1.5rem',
            fontSize: '.67rem', fontWeight: 700, letterSpacing: '.22em',
            textTransform: 'uppercase' as const, color: 'var(--rose)',
          }}>
            ✿ Prendre rendez-vous
          </div>
          <h1 style={{
            fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
            fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', fontWeight: 400,
            color: 'var(--white)', lineHeight: 1.2, marginBottom: '1rem',
          }}>
            Réserver une séance
          </h1>
          <p style={{
            fontSize: '.95rem', color: 'var(--dim)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto',
          }}>
            Première consultation de 15 minutes offerte pour échanger avant votre première séance.
          </p>
        </div>
      </section>

      {/* Separator */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(to right, transparent 0%, rgba(200,88,122,.7) 25%, rgba(200,88,122,.7) 75%, transparent 100%)',
      }} />

      {/* How it works */}
      <section style={{ background: 'var(--bg-mid)', padding: '3.5rem 2rem' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem',
          }} className="steps-grid">
            {[
              { n: 1, title: 'Remplissez le formulaire', desc: '2 minutes — simple et sans engagement' },
              { n: 2, title: 'Confirmation par email', desc: 'Vous recevez un accusé de réception immédiat' },
              { n: 3, title: 'Ama vous contacte', desc: 'Confirmation des détails et du créneau définitif' },
            ].map((s) => (
              <div key={s.n} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                gap: '.75rem', padding: '1.5rem',
                background: 'rgba(18,8,48,.4)', border: '1px solid var(--border)', borderRadius: '8px',
              }}>
                <div style={{
                  width: '44px', height: '44px',
                  background: 'var(--rose-deep)', color: 'white', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '.9rem', fontWeight: 700,
                  boxShadow: '0 4px 16px rgba(160,52,96,.4)',
                }}>
                  {s.n}
                </div>
                <h4 style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--white)' }}>{s.title}</h4>
                <p style={{ fontSize: '.78rem', color: 'var(--dim)', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking form */}
      <section style={{ background: 'var(--bg-soft)', padding: '4rem 2rem 5rem' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          {state === 'success' ? (
            <div style={{
              background: 'rgba(200,88,122,.07)', border: '1px solid rgba(200,88,122,.25)',
              borderRadius: '12px', padding: '3rem 2rem', textAlign: 'center',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✿</div>
              <h2 style={{
                fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
                fontSize: '1.7rem', color: 'var(--white)', marginBottom: '1rem',
              }}>
                Demande envoyée !
              </h2>
              <p style={{ fontSize: '.9rem', color: 'var(--dim)', lineHeight: 1.8, maxWidth: '440px', margin: '0 auto' }}>
                Merci pour votre demande. Vous allez recevoir un email de confirmation.
                Ama vous contactera bientôt pour confirmer les détails de votre séance.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2 style={{
                fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
                fontSize: '1.6rem', color: 'var(--white)', marginBottom: '.25rem', textAlign: 'center',
              }}>
                Votre demande de réservation
              </h2>

              {/* First + Last name */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="name-grid">
                <div>
                  <label style={labelStyle}>Prénom *</label>
                  <input name="prenom" type="text" value={form.prenom} onChange={handleChange}
                    placeholder="Prénom" style={inputStyle} required />
                </div>
                <div>
                  <label style={labelStyle}>Nom *</label>
                  <input name="nom" type="text" value={form.nom} onChange={handleChange}
                    placeholder="Nom" style={inputStyle} required />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Email *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange}
                  placeholder="votre@email.fr" style={inputStyle} required />
              </div>

              {/* Phone */}
              <div>
                <label style={labelStyle}>Téléphone (optionnel)</label>
                <input name="telephone" type="tel" value={form.telephone} onChange={handleChange}
                  placeholder="+33 6 XX XX XX XX" style={inputStyle} />
              </div>

              {/* Session type */}
              <div>
                <label style={labelStyle}>Type de séance *</label>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {[
                    { value: 'online', label: 'En ligne (Zoom / Teams)' },
                    { value: 'presentiel', label: 'Présentiel' },
                  ].map(opt => (
                    <label key={opt.value} style={{
                      display: 'flex', alignItems: 'center', gap: '.6rem',
                      cursor: 'pointer', fontSize: '.88rem',
                      color: form.typeSeance === opt.value ? 'var(--white)' : 'var(--dim)',
                      background: form.typeSeance === opt.value ? 'rgba(200,88,122,.1)' : 'transparent',
                      border: `1px solid ${form.typeSeance === opt.value ? 'rgba(200,88,122,.4)' : 'var(--border)'}`,
                      borderRadius: '6px', padding: '.75rem 1.1rem', transition: 'all .2s',
                    }}>
                      <input
                        type="radio" name="typeSeance" value={opt.value}
                        checked={form.typeSeance === opt.value} onChange={handleChange}
                        style={{ accentColor: 'var(--rose)' }}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Date + Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="dt-grid">
                <div>
                  <label style={labelStyle}>Date souhaitée *</label>
                  <input name="dateVoulue" type="date" value={form.dateVoulue} onChange={handleChange}
                    min={today} style={{ ...inputStyle, colorScheme: 'dark' }} required />
                </div>
                <div>
                  <label style={labelStyle}>Heure souhaitée *</label>
                  <select name="heureVoulue" value={form.heureVoulue} onChange={handleChange}
                    style={inputStyle} required>
                    <option value="">Choisir un créneau</option>
                    {timeSlots.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle}>Message (optionnel)</label>
                <textarea
                  name="message" value={form.message} onChange={handleChange}
                  placeholder="Y a-t-il quelque chose de précis que vous souhaitez travailler ?"
                  rows={4} style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              {state === 'error' && (
                <div style={{
                  background: 'rgba(200,88,122,.07)', border: '1px solid rgba(200,88,122,.3)',
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
                  fontSize: '.88rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' as const,
                  padding: '1.1rem 2.5rem', borderRadius: '50px',
                  boxShadow: '0 8px 32px rgba(160,52,96,.4)',
                  fontFamily: 'Nunito, sans-serif', transition: 'all .2s',
                  alignSelf: 'center',
                }}
              >
                {state === 'loading' ? 'Envoi en cours…' : '✿ Envoyer ma demande'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Reassurance */}
      <section style={{ background: 'var(--bg-mid)', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }} className="reassurance-grid">
            {[
              { icon: '🔒', title: 'Confidentialité totale', desc: 'Vos informations ne sont jamais partagées ni vendues à des tiers.' },
              { icon: '✨', title: 'Sans engagement', desc: 'Aucun abonnement ni engagement à long terme. Chaque séance est indépendante.' },
              { icon: '🎁', title: 'Consultation offerte', desc: '15 minutes gratuites pour échanger et vous assurer que la méthode vous convient.' },
            ].map((r, i) => (
              <div key={i} style={{
                background: 'rgba(18,8,48,.4)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '1.5rem', textAlign: 'center',
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '.75rem' }}>{r.icon}</div>
                <h4 style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--white)', marginBottom: '.4rem' }}>{r.title}</h4>
                <p style={{ fontSize: '.78rem', color: 'var(--dim)', lineHeight: 1.65 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        input::placeholder, textarea::placeholder { color: rgba(253,240,247,.25); }
        input:focus, textarea:focus, select:focus { border-color: rgba(200,88,122,.5) !important; }
        select option { background: #0C0620; color: #FDF0F7; }
        @media (max-width: 600px) {
          .name-grid { grid-template-columns: 1fr !important; }
          .dt-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .reassurance-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}

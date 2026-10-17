'use client';
import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import VideoBackground from '@/components/animations/VideoBackground';
import type { ReservationPayload } from '@/components/payment/PaypalButton';

const PaypalButton = dynamic(() => import('@/components/payment/PaypalButton'), { ssr: false });

type FormData = {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  dateVoulue: string;
  message: string;
};

type PageState = 'form' | 'payment' | 'success';

const today = new Date().toISOString().split('T')[0];

export default function ReserverPage() {
  const [form, setForm] = useState<FormData>({
    prenom: '', nom: '', email: '', telephone: '', dateVoulue: '', message: '',
  });
  const [pageState, setPageState] = useState<PageState>('form');
  const [formError, setFormError] = useState('');
  const [payError, setPayError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const d = params.get('date');
    if (d) setForm(prev => ({ ...prev, dateVoulue: d }));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleProceedToPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!form.prenom.trim() || !form.nom.trim() || !form.email.trim() || !form.dateVoulue) {
      setFormError('Merci de remplir tous les champs obligatoires (*).');
      return;
    }
    setFormError('');
    setPayError('');
    setPageState('payment');
  }

  const reservationData: ReservationPayload = {
    firstName: form.prenom,
    lastName: form.nom,
    email: form.email,
    phone: form.telephone || undefined,
    date: form.dateVoulue,
    time: '13:30',
    message: form.message || undefined,
  };

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
        position: 'relative', padding: '6rem 2rem', textAlign: 'center', overflow: 'hidden', minHeight: '360px',
      }}>
        <VideoBackground overlay="rgba(6,3,15,.82)" />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '700px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '.4rem',
            background: 'rgba(255,197,211,.08)', border: '1px solid rgba(255,197,211,.22)',
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
          <p style={{ fontSize: '.95rem', color: 'var(--dim)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto' }}>
            Séances en ligne via Zoom, chaque vendredi à 13h30. Tarif : 150 €.
          </p>
        </div>
      </section>

      {/* Separator */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(to right, transparent 0%, rgba(255,197,211,.7) 25%, rgba(255,197,211,.7) 75%, transparent 100%)',
      }} />

      {/* Steps */}
      <section style={{ background: 'var(--bg-mid)', padding: '3.5rem 2rem' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }} className="steps-grid">
            {[
              { n: 1, title: 'Remplissez le formulaire', desc: 'Vos coordonnées et la date souhaitée (vendredi à 13h30)' },
              { n: 2, title: 'Paiement sécurisé PayPal', desc: '150 € par carte bancaire ou en 4 fois sans frais' },
              { n: 3, title: 'Confirmation instantanée', desc: 'Un email avec le fichier .ics est envoyé immédiatement' },
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

      {/* Main section */}
      <section style={{ background: 'var(--bg-soft)', padding: '4rem 2rem 5rem' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>

          {/* SUCCESS */}
          {pageState === 'success' && (
            <div style={{
              background: 'rgba(255,197,211,.07)', border: '1px solid rgba(255,197,211,.25)',
              borderRadius: '12px', padding: '3rem 2rem', textAlign: 'center',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✿</div>
              <h2 style={{
                fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
                fontSize: '1.7rem', color: 'var(--white)', marginBottom: '1rem',
              }}>
                Séance confirmée !
              </h2>
              <p style={{ fontSize: '.9rem', color: 'var(--dim)', lineHeight: 1.8, maxWidth: '440px', margin: '0 auto' }}>
                Votre paiement a bien été reçu. Vous allez recevoir un email de confirmation avec le fichier .ics pour ajouter la séance à votre agenda.
              </p>
              <p style={{ fontSize: '.8rem', color: 'rgba(253,240,247,.35)', marginTop: '1.5rem' }}>
                {form.dateVoulue} à 13h30 · Via Zoom
              </p>
            </div>
          )}

          {/* PAYMENT */}
          {pageState === 'payment' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2 style={{
                fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
                fontSize: '1.6rem', color: 'var(--white)', textAlign: 'center',
              }}>
                Paiement de la séance
              </h2>

              {/* Récapitulatif */}
              <div style={{
                background: 'rgba(255,197,211,.06)', border: '1px solid rgba(255,197,211,.18)',
                borderRadius: '8px', padding: '1.25rem 1.5rem',
              }}>
                <p style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--rose)', marginBottom: '.75rem' }}>
                  Récapitulatif
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.88rem' }}>
                    <span style={{ color: 'var(--dim)' }}>Client</span>
                    <span style={{ color: 'var(--white)', fontWeight: 600 }}>{form.prenom} {form.nom}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.88rem' }}>
                    <span style={{ color: 'var(--dim)' }}>Date</span>
                    <span style={{ color: 'var(--white)', fontWeight: 600 }}>{form.dateVoulue} à 13h30</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.88rem' }}>
                    <span style={{ color: 'var(--dim)' }}>Mode</span>
                    <span style={{ color: 'var(--white)' }}>Zoom</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.95rem', marginTop: '.4rem', paddingTop: '.75rem', borderTop: '1px solid rgba(255,197,211,.12)' }}>
                    <span style={{ color: 'var(--white)', fontWeight: 700 }}>Total</span>
                    <span style={{ color: 'var(--rose)', fontWeight: 700 }}>150,00 €</span>
                  </div>
                </div>
              </div>

              {payError && (
                <div style={{
                  background: 'rgba(255,197,211,.07)', border: '1px solid rgba(255,197,211,.3)',
                  borderRadius: '6px', padding: '.75rem 1rem',
                  fontSize: '.82rem', color: 'var(--rose)',
                }}>
                  {payError}
                </div>
              )}

              <Suspense fallback={<div style={{ textAlign: 'center', color: 'var(--dim)', fontSize: '.85rem' }}>Chargement du paiement…</div>}>
                <PaypalButton
                  reservationData={reservationData}
                  onSuccess={() => setPageState('success')}
                  onError={(msg) => setPayError(msg)}
                />
              </Suspense>

              <button
                onClick={() => { setPageState('form'); setPayError(''); }}
                style={{
                  background: 'none', border: 'none', color: 'rgba(253,240,247,.35)',
                  fontSize: '.78rem', cursor: 'pointer', textDecoration: 'underline',
                  textAlign: 'center', fontFamily: 'Nunito, sans-serif',
                }}
              >
                ← Modifier mes informations
              </button>
            </div>
          )}

          {/* FORM */}
          {pageState === 'form' && (
            <form onSubmit={handleProceedToPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2 style={{
                fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
                fontSize: '1.6rem', color: 'var(--white)', marginBottom: '.25rem', textAlign: 'center',
              }}>
                Votre réservation
              </h2>

              {/* Prénom + Nom */}
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

              {/* Téléphone */}
              <div>
                <label style={labelStyle}>Téléphone (optionnel)</label>
                <input name="telephone" type="tel" value={form.telephone} onChange={handleChange}
                  placeholder="+33 6 XX XX XX XX" style={inputStyle} />
              </div>

              {/* Date + heure fixe */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="dt-grid">
                <div>
                  <label style={labelStyle}>
                    Date souhaitée *{' '}
                    <span style={{ fontSize: '.65rem', opacity: .6, textTransform: 'none', letterSpacing: 0 }}>(vendredi)</span>
                  </label>
                  <input name="dateVoulue" type="date" value={form.dateVoulue} onChange={handleChange}
                    min={today} style={{ ...inputStyle, colorScheme: 'dark' }} required />
                </div>
                <div>
                  <label style={labelStyle}>Heure</label>
                  <div style={{
                    ...inputStyle, display: 'flex', alignItems: 'center',
                    background: 'rgba(6,3,15,.3)', color: 'rgba(253,240,247,.45)',
                  }}>
                    13h30 · créneau unique
                  </div>
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

              {formError && (
                <div style={{
                  background: 'rgba(255,197,211,.07)', border: '1px solid rgba(255,197,211,.3)',
                  borderRadius: '6px', padding: '.75rem 1rem',
                  fontSize: '.82rem', color: 'var(--rose)',
                }}>
                  {formError}
                </div>
              )}

              <button
                type="submit"
                className="btn-cta-rose"
                style={{
                  background: 'linear-gradient(135deg, #A03460, #6A1030)',
                  color: 'white', border: 'none', cursor: 'pointer',
                  fontSize: '.88rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' as const,
                  padding: '1.1rem 2.5rem', borderRadius: '50px',
                  boxShadow: '0 8px 32px rgba(160,52,96,.4)',
                  fontFamily: 'Nunito, sans-serif', transition: 'all .2s',
                  alignSelf: 'center',
                }}
              >
                ✿ Procéder au paiement
              </button>
            </form>
          )}

        </div>
      </section>

      <style>{`
        input::placeholder, textarea::placeholder { color: rgba(253,240,247,.25); }
        input:focus, textarea:focus { border-color: rgba(255,197,211,.5) !important; }
        @media (max-width: 600px) {
          .name-grid { grid-template-columns: 1fr !important; }
          .dt-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}

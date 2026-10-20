'use client';
import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import VideoBackground from '@/components/animations/VideoBackground';
import type { ReservationPayload } from '@/components/payment/PaypalButton';
import { OPEN_ISO, OPEN_LABEL, isAvailableDate } from '@/lib/availableDates';

/* ── Calendrier custom (seuls les vendredis disponibles sont cliquables) ── */
const MOIS_CAL = ['Janvier','Février','Mars','Avril','Mai','Juin',
                  'Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const OPEN_YEAR_CAL  = Number(OPEN_ISO.split('-')[0]);
const OPEN_MONTH_CAL = Number(OPEN_ISO.split('-')[1]) - 1;

function isoFromYMD(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function ReservationCalendar({ value, onChange }: { value: string; onChange: (iso: string) => void }) {
  const [year,  setYear]  = useState(OPEN_YEAR_CAL);
  const [month, setMonth] = useState(OPEN_MONTH_CAL);
  const [takenSet, setTakenSet] = useState<Set<string>>(new Set());

  // Charge les créneaux déjà réservés pour le mois affiché
  useEffect(() => {
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    fetch(`/api/availability?month=${monthStr}`)
      .then(r => r.ok ? r.json() : { taken: [] })
      .then((data: { taken: { date: string; time: string }[] }) => {
        setTakenSet(new Set((data.taken ?? []).map(t => t.date)));
      })
      .catch(() => { /* ignore — créneaux non chargés, pas bloquant */ });
  }, [year, month]);

  const now    = new Date();
  const todayY = now.getFullYear();
  const todayM = now.getMonth();
  const todayD = now.getDate();

  const firstDay    = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7;

  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const isCellAvail = (d: number): boolean => {
    const today = new Date(todayY, todayM, todayD);
    const dt = new Date(year, month, d);
    if (dt <= today) return false;
    const iso = isoFromYMD(year, month, d);
    if (takenSet.has(iso)) return false;
    return isAvailableDate(iso);
  };

  /** Vendredi possible mais déjà réservé */
  const isCellTaken = (d: number): boolean => {
    const today = new Date(todayY, todayM, todayD);
    const dt = new Date(year, month, d);
    if (dt <= today) return false;
    const iso = isoFromYMD(year, month, d);
    return takenSet.has(iso) && isAvailableDate(iso);
  };

  const isSelected = (d: number) => value === isoFromYMD(year, month, d);
  const canPrev = year > OPEN_YEAR_CAL || (year === OPEN_YEAR_CAL && month > OPEN_MONTH_CAL);

  const prevMonth = () => {
    if (!canPrev) return;
    if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1);
  };

  const selectedDisplay = value
    ? new Date(value + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <div>
      <div style={{ background: 'rgba(6,3,15,.6)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.1rem 1.1rem .8rem' }}>
        {/* Navigation mois */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.7rem' }}>
          <button type="button" onClick={prevMonth} disabled={!canPrev} style={{ background: 'rgba(255,197,211,.08)', border: '1px solid var(--border)', color: canPrev ? 'var(--rose)' : 'rgba(255,197,211,.2)', width: '28px', height: '28px', cursor: canPrev ? 'pointer' : 'default', fontSize: '.9rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
          <span style={{ fontFamily: '"Playfair Display",serif', fontStyle: 'italic', fontSize: '.95rem', color: 'var(--white)' }}>{MOIS_CAL[month]} {year}</span>
          <button type="button" onClick={nextMonth} style={{ background: 'rgba(255,197,211,.08)', border: '1px solid var(--border)', color: 'var(--rose)', width: '28px', height: '28px', cursor: 'pointer', fontSize: '.9rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
        </div>
        {/* En-têtes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px', marginBottom: '3px' }}>
          {['L','M','M','J','V','S','D'].map((d, i) => (
            <span key={i} style={{ textAlign: 'center', fontSize: '.55rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: i === 4 ? 'rgba(255,197,211,.65)' : 'rgba(253,240,247,.25)', padding: '3px 0' }}>{d}</span>
          ))}
        </div>
        {/* Grille jours */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px' }}>
          {cells.map((d, i) => {
            if (d === null) return <div key={`e-${i}`} style={{ padding: '5px 0' }} />;
            const avail = isCellAvail(d);
            const taken = isCellTaken(d);
            const sel   = isSelected(d);
            return (
              <button key={d} type="button"
                onClick={() => avail && onChange(isoFromYMD(year, month, d))}
                disabled={!avail}
                title={taken ? 'Créneau déjà réservé' : undefined}
                style={{ textAlign: 'center', padding: '5px 2px', fontSize: '.76rem', borderRadius: '6px', fontFamily: 'Nunito, sans-serif',
                  border:      sel   ? '1px solid rgba(255,197,211,.7)'  : avail ? '1px solid rgba(255,197,211,.15)' : taken ? '1px solid rgba(200,88,122,.18)' : '1px solid transparent',
                  background:  sel   ? 'rgba(255,197,211,.25)'           : avail ? 'rgba(255,197,211,.06)'          : taken ? 'rgba(200,88,122,.07)'           : 'transparent',
                  color:       avail ? 'var(--white)'                    : taken ? 'rgba(200,88,122,.45)'           : 'rgba(253,240,247,.15)',
                  fontWeight:  sel   ? 700                                : 400,
                  cursor:      avail ? 'pointer'                          : 'default',
                  textDecoration: taken ? 'line-through' : 'none',
                }}>
                {d}
              </button>
            );
          })}
        </div>
        <p style={{ fontSize: '.58rem', color: 'rgba(253,240,247,.25)', marginTop: '.6rem', textAlign: 'center', lineHeight: 1.5 }}>
          Ouverture {OPEN_LABEL} · vendredis uniquement · hors vacances zone A
        </p>
      </div>
      {selectedDisplay && (
        <div style={{ marginTop: '.5rem', padding: '.55rem 1rem', background: 'rgba(255,197,211,.07)', border: '1px solid rgba(255,197,211,.22)', borderRadius: '6px', fontSize: '.82rem', color: 'var(--white)' }}>
          ✿ {selectedDisplay} à 13h30
        </div>
      )}
    </div>
  );
}

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
    if (!isAvailableDate(form.dateVoulue)) {
      setFormError('Veuillez sélectionner un vendredi disponible dans le calendrier.');
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
        position: 'relative', padding: '3rem 2rem', overflow: 'hidden', minHeight: '270px', display: 'flex', alignItems: 'center',
      }}>
        <VideoBackground overlay="rgba(6,3,15,.82)" />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '700px', margin: '0 auto', textAlign: 'center', width: '100%', transform: 'translateY(1.8rem)',  }}>
          <div className="sub-hero-pill" style={{
            display: 'inline-flex', alignItems: 'center', gap: '.4rem',
            background: 'rgba(255,197,211,.08)', border: '1px solid rgba(255,197,211,.22)',
            borderRadius: '50px', padding: '.35rem 1rem', marginBottom: '1.5rem',
            fontSize: '.67rem', fontWeight: 700, letterSpacing: '.22em',
            textTransform: 'uppercase' as const, color: 'var(--rose)',
          }}>
            ✿ Prendre rendez-vous
          </div>
          <h1 style={{
            fontFamily: 'Nunito, sans-serif', fontStyle: 'normal',
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700,
            color: 'var(--white)', lineHeight: 1.15, marginBottom: '0.5rem',
            letterSpacing: '-.01em',
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
      <section style={{ background: 'var(--bg-mid)', padding: '1.75rem 2rem' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }} className="steps-grid">
            {[
              { n: 1, title: 'Remplissez le formulaire', desc: 'Vos coordonnées et la date souhaitée (vendredi à 13h30)' },
              { n: 2, title: 'Paiement sécurisé PayPal', desc: '150 € par carte bancaire ou en 4 fois sans frais' },
              { n: 3, title: 'Confirmation instantanée', desc: 'Un email avec le fichier .ics est envoyé immédiatement' },
            ].map((s) => (
              <div key={s.n} style={{
                display: 'flex', flexDirection: 'row', alignItems: 'flex-start',
                gap: '.75rem', padding: '.9rem 1rem',
                background: 'rgba(18,8,48,.4)', border: '1px solid var(--border)', borderRadius: '8px',
              }}>
                <div style={{
                  width: '28px', height: '28px', flexShrink: 0,
                  background: 'var(--rose-deep)', color: 'white', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '.72rem', fontWeight: 700,
                  boxShadow: '0 3px 10px rgba(160,52,96,.4)',
                  marginTop: '.1rem',
                }}>
                  {s.n}
                </div>
                <div>
                  <h4 style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--white)', marginBottom: '.2rem' }}>{s.title}</h4>
                  <p style={{ fontSize: '.7rem', color: 'var(--dim)', lineHeight: 1.55 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main section */}
      <section style={{ background: 'var(--bg-soft)', padding: '3rem 2rem 5rem' }}>
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

              {/* Date — calendrier custom (seuls les vendredis cliquables) */}
              <div>
                <label style={labelStyle}>Date souhaitée *</label>
                <ReservationCalendar
                  value={form.dateVoulue}
                  onChange={(iso) => setForm(prev => ({ ...prev, dateVoulue: iso }))}
                />
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

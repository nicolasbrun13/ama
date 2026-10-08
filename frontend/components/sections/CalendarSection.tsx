'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ScrollReveal from '@/components/animations/ScrollReveal';

const JOURS  = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MOIS   = ['Janvier','Février','Mars','Avril','Mai','Juin',
                'Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

function toISO(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export default function CalendarSection() {
  const router = useRouter();
  const [now]  = useState(() => new Date());
  const todayY = now.getFullYear();
  const todayM = now.getMonth();
  const todayD = now.getDate();

  const [year,  setYear]  = useState(todayY);
  const [month, setMonth] = useState(todayM);

  const firstDay    = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Monday-first offset  (JS getDay: 0=Sun → Mon-first index 6)
  const startOffset = (firstDay.getDay() + 6) % 7;

  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const isAvailable = (day: number) => {
    const d = new Date(year, month, day);
    const ref = new Date(todayY, todayM, todayD);
    if (d <= ref) return false;        // past + today
    if (d.getDay() === 0) return false; // dimanche
    return true;
  };

  const isToday = (day: number) =>
    year === todayY && month === todayM && day === todayD;

  const canPrev = year > todayY || (year === todayY && month > todayM);

  const prevMonth = () => {
    if (!canPrev) return;
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const handleDay = (day: number) => {
    if (!isAvailable(day)) return;
    router.push(`/reserver?date=${toISO(year, month, day)}`);
  };

  /* ── Styles ── */
  const navBtnStyle = (active: boolean): React.CSSProperties => ({
    width: '36px', height: '36px', borderRadius: '50%',
    background: active ? 'rgba(200,88,122,.08)' : 'transparent',
    border: `1px solid ${active ? 'rgba(200,88,122,.28)' : 'rgba(200,88,122,.08)'}`,
    color: active ? 'var(--rose)' : 'rgba(200,88,122,.2)',
    cursor: active ? 'pointer' : 'default',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '.82rem', fontFamily: 'monospace', flexShrink: 0,
  });

  const dayStyle = (day: number): React.CSSProperties => {
    const avail = isAvailable(day);
    const tod   = isToday(day);
    return {
      height: '40px',
      borderRadius: '8px',
      border: tod
        ? '1px solid rgba(200,88,122,.6)'
        : avail
          ? '1px solid rgba(200,88,122,.18)'
          : '1px solid transparent',
      background: tod
        ? 'rgba(200,88,122,.14)'
        : avail
          ? 'rgba(200,88,122,.07)'
          : 'transparent',
      color: avail || tod ? 'var(--white)' : 'rgba(253,240,247,.18)',
      fontSize: '.84rem',
      cursor: avail ? 'pointer' : 'default',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Nunito, sans-serif',
      transition: 'background .15s, border-color .15s',
    };
  };

  return (
    <section id="calendrier" style={{ background: 'var(--bg-soft)', padding: '6rem 2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <ScrollReveal direction="up">
          <div style={{ textAlign: 'center', marginBottom: '.75rem', display: 'flex', justifyContent: 'center' }}>
            <div className="eyebrow-pill">✿ Disponibilités</div>
          </div>
          <div className="sep-line" style={{ maxWidth: '160px', margin: '0 auto 1.5rem' }}>
            <span style={{ color: 'var(--rose)', fontSize: '.65rem' }}>★</span>
          </div>
          <h2 className="section-h2">Choisissez votre <em>date</em></h2>
          <p className="section-lead">
            Toutes les dates en surbrillance sont disponibles. Cliquez pour pré-remplir votre réservation.
          </p>
        </ScrollReveal>

        {/* Calendar card */}
        <div style={{
          maxWidth: '480px', margin: '2.5rem auto 0',
          background: 'linear-gradient(145deg, rgba(22,10,58,.97) 0%, rgba(14,6,38,.93) 100%)',
          border: '1px solid rgba(200,88,122,.25)',
          borderRadius: '16px',
          padding: '2rem 2rem 1.5rem',
          boxShadow: '0 20px 70px rgba(0,0,0,.6), 0 0 50px rgba(200,88,122,.07), inset 0 1px 0 rgba(255,255,255,.04)',
        }}>

          {/* Month navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
            <button onClick={prevMonth} disabled={!canPrev} style={navBtnStyle(canPrev)} aria-label="Mois précédent">◀</button>
            <div style={{
              fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
              fontSize: '1.2rem', color: 'var(--white)', letterSpacing: '.02em',
            }}>
              {MOIS[month]}&nbsp;{year}
            </div>
            <button onClick={nextMonth} style={navBtnStyle(true)} aria-label="Mois suivant">▶</button>
          </div>

          {/* Day-of-week headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '.3rem', marginBottom: '.4rem' }}>
            {JOURS.map(j => (
              <div key={j} style={{
                textAlign: 'center', fontSize: '.6rem', fontWeight: 700,
                letterSpacing: '.12em', textTransform: 'uppercase',
                color: 'rgba(253,240,247,.28)', padding: '.25rem 0',
              }}>{j}</div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '.3rem' }}>
            {cells.map((day, i) =>
              day === null
                ? <div key={`e-${i}`} style={{ height: '40px' }} />
                : (
                  <button
                    key={day}
                    onClick={() => handleDay(day)}
                    disabled={!isAvailable(day) && !isToday(day)}
                    style={dayStyle(day)}
                    className={isAvailable(day) ? 'cal-avail' : ''}
                    aria-label={isAvailable(day) ? `Réserver le ${day} ${MOIS[month]} ${year}` : undefined}
                  >
                    {day}
                  </button>
                )
            )}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '1.75rem', justifyContent: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(200,88,122,.08)' }}>
            {[
              { color: 'rgba(200,88,122,.14)', border: 'rgba(200,88,122,.35)', label: "Aujourd'hui" },
              { color: 'rgba(200,88,122,.07)', border: 'rgba(200,88,122,.18)', label: 'Disponible' },
              { color: 'transparent',          border: 'transparent',          label: 'Indisponible' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '.45rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: l.color, border: `1px solid ${l.border}`, flexShrink: 0 }} />
                <span style={{ fontSize: '.62rem', color: 'rgba(253,240,247,.35)', letterSpacing: '.08em' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fallback link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link href="/reserver" style={{ fontSize: '.75rem', color: 'rgba(253,240,247,.28)', textDecoration: 'underline', letterSpacing: '.06em' }}>
            Accéder directement au formulaire →
          </Link>
        </div>
      </div>

      <style>{`
        .cal-avail:hover {
          background: rgba(200,88,122,.22) !important;
          border-color: rgba(200,88,122,.5) !important;
          color: var(--white) !important;
        }
      `}</style>
    </section>
  );
}

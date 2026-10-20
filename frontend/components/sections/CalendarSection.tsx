'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { OPEN_ISO, OPEN_LABEL, isAvailableDate } from '@/lib/availableDates';
import { useTakenDates } from '@/lib/useTakenDates';
import AvailabilityNotice from '@/components/booking/AvailabilityNotice';

const JOURS  = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MOIS   = ['Janvier','Février','Mars','Avril','Mai','Juin',
                'Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

const OPEN_YEAR  = Number(OPEN_ISO.split('-')[0]);
const OPEN_MONTH = Number(OPEN_ISO.split('-')[1]) - 1; // 0-indexed

function toISO(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export default function CalendarSection() {
  const router = useRouter();
  const now    = new Date();
  const todayY = now.getFullYear();
  const todayM = now.getMonth();
  const todayD = now.getDate();

  /* Démarrer directement sur février 2027 si on est avant */
  const openDate = new Date(OPEN_YEAR, OPEN_MONTH, 1);
  const initYear  = now < openDate ? OPEN_YEAR  : todayY;
  const initMonth = now < openDate ? OPEN_MONTH : todayM;

  const [year,  setYear]  = useState(initYear);
  const [month, setMonth] = useState(initMonth);
  const { taken, status, retry } = useTakenDates(year, month);

  const firstDay    = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7; // lundi en premier

  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const isFutureOpenDay = (day: number): boolean => {
    const today = new Date(todayY, todayM, todayD);
    const d = new Date(year, month, day);
    if (d <= today) return false;
    return isAvailableDate(toISO(year, month, day));
  };

  /* Cliquable seulement si les créneaux pris sont chargés ET que la date est libre */
  const isCellAvailable = (day: number): boolean =>
    status === 'ready' && isFutureOpenDay(day) && !taken.has(toISO(year, month, day));

  const isCellTaken = (day: number): boolean =>
    status === 'ready' && isFutureOpenDay(day) && taken.has(toISO(year, month, day));

  const isToday = (day: number) =>
    year === todayY && month === todayM && day === todayD;

  /* Empêcher de revenir avant le mois d'ouverture */
  const canPrev = year > OPEN_YEAR || (year === OPEN_YEAR && month > OPEN_MONTH);

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
    if (!isCellAvailable(day)) return;
    router.push(`/reserver?date=${toISO(year, month, day)}&time=13:30`);
  };

  /* ── Styles ── */
  const navBtnStyle = (active: boolean): React.CSSProperties => ({
    width: '36px', height: '36px', borderRadius: '50%',
    background: active ? 'rgba(255,197,211,.08)' : 'transparent',
    border: `1px solid ${active ? 'rgba(255,197,211,.28)' : 'rgba(255,197,211,.08)'}`,
    color: active ? 'var(--rose)' : 'rgba(255,197,211,.2)',
    cursor: active ? 'pointer' : 'default',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '.82rem', fontFamily: 'monospace', flexShrink: 0,
  });

  const dayStyle = (day: number): React.CSSProperties => {
    const avail = isCellAvailable(day);
    const tkn   = isCellTaken(day);
    const tod   = isToday(day);
    return {
      height: '40px',
      borderRadius: '8px',
      border: tod
        ? '1px solid rgba(255,197,211,.6)'
        : avail
          ? '1px solid rgba(255,197,211,.18)'
          : '1px solid transparent',
      background: tod
        ? 'rgba(255,197,211,.14)'
        : avail
          ? 'rgba(255,197,211,.07)'
          : 'transparent',
      color: avail || tod ? 'var(--white)' : tkn ? 'rgba(200,88,122,.5)' : 'rgba(253,240,247,.18)',
      textDecoration: tkn ? 'line-through' : 'none',
      fontSize: '.84rem',
      cursor: avail ? 'pointer' : 'default',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Nunito, sans-serif',
      transition: 'background .15s, border-color .15s',
    };
  };

  return (
    <section id="calendrier" style={{ background: 'var(--bg-soft)', padding: '3rem 2rem 5rem' }}>
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
            Séances disponibles chaque vendredi à 13h30, à partir du {OPEN_LABEL}.
          </p>
        </ScrollReveal>

        {/* Bulle d'information */}
        <div style={{
          maxWidth: '480px', margin: '0 auto 1.5rem',
          background: 'rgba(255,197,211,.05)',
          border: '1px solid rgba(255,197,211,.2)',
          borderRadius: '10px',
          padding: '.85rem 1.2rem',
          display: 'flex', alignItems: 'flex-start', gap: '.75rem',
        }}>
          <span style={{ color: 'var(--rose)', fontSize: '.95rem', flexShrink: 0, marginTop: '.05rem' }}>✦</span>
          <p style={{ fontSize: '.74rem', color: 'rgba(253,240,247,.5)', lineHeight: 1.7 }}>
            Les réservations ouvrent le{' '}
            <strong style={{ color: 'var(--rose)', fontWeight: 600 }}>{OPEN_LABEL}</strong>.
            Un seul créneau par vendredi : <strong style={{ color: 'rgba(253,240,247,.75)' }}>13h30</strong>.
            Les vendredis en vacances scolaires zone A ne sont pas disponibles.
          </p>
        </div>

        {/* Calendar card */}
        <div style={{
          maxWidth: '480px', margin: '0 auto',
          background: 'linear-gradient(145deg, rgba(22,10,58,.97) 0%, rgba(14,6,38,.93) 100%)',
          border: '1px solid rgba(255,197,211,.25)',
          borderRadius: '16px',
          padding: '2rem 2rem 1.5rem',
          boxShadow: '0 20px 70px rgba(0,0,0,.6), 0 0 50px rgba(255,197,211,.07), inset 0 1px 0 rgba(255,255,255,.04)',
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
                color: j === 'Ven' ? 'rgba(255,197,211,.6)' : 'rgba(253,240,247,.28)',
                padding: '.25rem 0',
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
                    disabled={!isCellAvailable(day)}
                    style={dayStyle(day)}
                    className={isCellAvailable(day) ? 'cal-avail' : ''}
                    title={isCellTaken(day) ? 'Créneau déjà réservé' : undefined}
                    aria-label={isCellAvailable(day) ? `Réserver le ${day} ${MOIS[month]} ${year} à 13h30` : isCellTaken(day) ? `${day} ${MOIS[month]} : déjà réservé` : undefined}
                  >
                    {day}
                  </button>
                )
            )}
          </div>

          <AvailabilityNotice status={status} onRetry={retry} />

          {/* Legend */}
          <div style={{ display: 'flex', gap: '1.75rem', justifyContent: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,197,211,.08)' }}>
            {[
              { color: 'rgba(255,197,211,.07)', border: 'rgba(255,197,211,.18)', label: 'Vendredi 13h30' },
              { color: 'rgba(200,88,122,.07)', border: 'rgba(200,88,122,.25)', label: 'Réservé' },
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
          background: rgba(255,197,211,.22) !important;
          border-color: rgba(255,197,211,.5) !important;
          color: var(--white) !important;
        }
      `}</style>
    </section>
  );
}

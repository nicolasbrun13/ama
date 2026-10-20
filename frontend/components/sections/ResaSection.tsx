'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import VideoBackground from '@/components/animations/VideoBackground';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { OPEN_ISO, OPEN_LABEL, isAvailableDate } from '@/lib/availableDates';
import { useTakenDates } from '@/lib/useTakenDates';
import AvailabilityNotice from '@/components/booking/AvailabilityNotice';

const MOIS = ['Janvier','Février','Mars','Avril','Mai','Juin',
              'Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

const OPEN_YEAR  = Number(OPEN_ISO.split('-')[0]);
const OPEN_MONTH = Number(OPEN_ISO.split('-')[1]) - 1; // 0-indexed

function toISO(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function CalMini() {
  const router = useRouter();
  const now    = new Date();
  const todayY = now.getFullYear();
  const todayM = now.getMonth();
  const todayD = now.getDate();

  /* Démarre sur le mois d'ouverture, jamais sur le mois courant s'il est avant */
  const [year,  setYear]  = useState(OPEN_YEAR);
  const [month, setMonth] = useState(OPEN_MONTH);
  const { taken, status, retry } = useTakenDates(year, month);

  const firstDay    = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7; // lundi = 0

  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const isFutureOpenDay = (d: number) => {
    const today = new Date(todayY, todayM, todayD);
    const dt = new Date(year, month, d);
    if (dt <= today) return false;
    return isAvailableDate(toISO(year, month, d));
  };

  /* Cliquable seulement si les créneaux pris sont chargés ET que la date est libre */
  const isAvail = (d: number) => status === 'ready' && isFutureOpenDay(d) && !taken.has(toISO(year, month, d));
  const isTaken = (d: number) => status === 'ready' && isFutureOpenDay(d) && taken.has(toISO(year, month, d));

  const isToday = (d: number) =>
    year === todayY && month === todayM && d === todayD;

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

  return (
    <div style={{ background:'rgba(6,3,15,.7)', border:'1px solid var(--border)', padding:'1.4rem', borderRadius:'8px' }}>

      {/* Navigation mois */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
        <button
          onClick={prevMonth}
          disabled={!canPrev}
          style={{ background:'rgba(255,197,211,.1)', border:'1px solid var(--border)', color: canPrev ? 'var(--rose)' : 'rgba(255,197,211,.2)', width:'28px', height:'28px', cursor: canPrev ? 'pointer' : 'default', fontSize:'.8rem', borderRadius:'50%' }}
        >‹</button>
        <span style={{ fontFamily:'"Playfair Display",serif', fontStyle:'italic', fontSize:'1rem', color:'var(--white)' }}>
          {MOIS[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          style={{ background:'rgba(255,197,211,.1)', border:'1px solid var(--border)', color:'var(--rose)', width:'28px', height:'28px', cursor:'pointer', fontSize:'.8rem', borderRadius:'50%' }}
        >›</button>
      </div>

      {/* En-têtes jours */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'2px', marginBottom:'3px' }}>
        {['L','M','M','J','V','S','D'].map((d, i) => (
          <span key={i} style={{ textAlign:'center', fontSize:'.6rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--dim)', padding:'3px 0' }}>{d}</span>
        ))}
      </div>

      {/* Grille des jours */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'2px' }}>
        {cells.map((d, i) => {
          if (d === null) return <div key={`e-${i}`} style={{ padding:'6px 3px' }} />;
          const avail = isAvail(d);
          const tkn   = isTaken(d);
          const tod   = isToday(d);
          return (
            <div
              key={d}
              onClick={() => avail && router.push(`/reserver?date=${toISO(year, month, d)}`)}
              className={avail ? 'cal-day-avail' : ''}
              title={tkn ? 'Créneau déjà réservé' : undefined}
              style={{
                textAlign:'center', padding:'6px 3px', fontSize:'.76rem', borderRadius:'50%',
                color: tod ? 'var(--rose)' : avail ? 'var(--white)' : tkn ? 'rgba(200,88,122,.5)' : 'rgba(253,240,247,.25)',
                textDecoration: tkn ? 'line-through' : 'none',
                background: tod ? 'rgba(255,197,211,.15)' : 'transparent',
                fontWeight: tod ? 700 : 400,
                cursor: avail ? 'pointer' : 'default',
                border: tod ? '1px solid rgba(255,197,211,.4)' : '1px solid transparent',
              }}
            >
              {d}
            </div>
          );
        })}
      </div>
      <AvailabilityNotice status={status} onRetry={retry} />
      <p style={{ fontSize:'.6rem', color:'var(--dim)', marginTop:'.75rem', textAlign:'center', lineHeight: 1.6 }}>
        Vendredis 13h30 · ouverture {OPEN_LABEL}
      </p>

      <style>{`.cal-day-avail:hover { background: rgba(255,197,211,.22) !important; color: var(--white) !important; }`}</style>
    </div>
  );
}

export default function ResaSection() {
  return (
    <section id="resa" style={{ position:'relative', overflow:'hidden', padding:'3rem 2rem 5rem' }}>
      <VideoBackground overlay="rgba(6,3,15,.82)" playbackRate={1} />

      <div style={{ position:'relative', zIndex:2, maxWidth:'1200px', margin:'0 auto' }}>
        <ScrollReveal direction="up">
          <div style={{ textAlign:'center', marginBottom:'.75rem', display:'flex', justifyContent:'center' }}>
            <div className="eyebrow-pill">✿ Prendre rendez-vous</div>
          </div>
          <div className="sep-line" style={{ maxWidth:'160px', margin:'0 auto 1.5rem' }}><span style={{ color:'var(--rose)', fontSize:'.65rem' }}>★</span></div>
          <h2 className="section-h2">Réservez votre <em>séance</em></h2>
        </ScrollReveal>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'3.5rem', maxWidth:'860px', margin:'0 auto', alignItems:'start' }}>
          <ScrollReveal direction="left">
            <div>
              <h3 style={{ fontFamily:'"Playfair Display",serif', fontSize:'1.7rem', fontStyle:'italic', color:'var(--white)', marginBottom:'1rem' }}>Une séance, un tournant</h3>
              <div style={{ display:'inline-block', background:'rgba(232,191,80,.08)', border:'1px solid rgba(232,191,80,.25)', color:'var(--gold-light)', borderRadius:'50px', fontSize:'.73rem', letterSpacing:'.12em', textTransform:'uppercase', padding:'.45rem 1.1rem', marginBottom:'1.5rem' }}>
                Séances individuelles · Tarifs fixes
              </div>
              <p style={{ fontSize:'.86rem', color:'var(--dim)', lineHeight:1.85, marginBottom:'1rem' }}>
                Chaque séance HRE est unique et adaptée à votre questionnement. Via Zoom depuis votre domicile, chaque vendredi à 13h30.
              </p>
              <ul style={{ listStyle:'none', padding:0, marginBottom:'1.75rem' }}>
                {['Durée : 1h30 à 2h par séance', 'En ligne (Zoom)', '150 € · Paiement sécurisé PayPal', 'Suivi post-séance inclus'].map(item => (
                  <li key={item} style={{ fontSize:'.82rem', color:'var(--dim)', padding:'.4rem 0', borderBottom:'1px solid rgba(255,255,255,.04)', display:'flex', gap:'.6rem', alignItems:'center' }}>
                    <span style={{ color:'var(--rose)', fontSize:'.7rem' }}>✿</span> {item}
                  </li>
                ))}
              </ul>
              <Link href="/reserver" className="btn-cta-rose" style={{ display:'inline-flex', alignItems:'center', gap:'.6rem', background:'linear-gradient(135deg,#A03460,#6A1030)', color:'white', textDecoration:'none', fontSize:'.8rem', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', padding:'1rem 2.2rem', borderRadius:'50px', boxShadow:'0 8px 36px rgba(255,197,211,.38)' }}>
                ✿ &nbsp;Prendre rendez-vous
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={80}>
            <div style={{ marginTop: '3.5rem' }}>
              <CalMini />
            </div>
          </ScrollReveal>
        </div>
      </div>
      <style>{`@media(max-width:767px){ div[style*="1fr 320px"]{ grid-template-columns:1fr !important; } }`}</style>
    </section>
  );
}

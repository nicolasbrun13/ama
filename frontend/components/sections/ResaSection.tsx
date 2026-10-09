'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import VideoBackground from '@/components/animations/VideoBackground';
import ScrollReveal from '@/components/animations/ScrollReveal';

const MOIS = ['Janvier','Février','Mars','Avril','Mai','Juin',
              'Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

function toISO(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function CalMini() {
  const router = useRouter();
  const now    = new Date();
  const todayY = now.getFullYear();
  const todayM = now.getMonth();
  const todayD = now.getDate();

  const [year,  setYear]  = useState(todayY);
  const [month, setMonth] = useState(todayM);

  const firstDay    = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7; // lundi = 0

  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const isAvail = (d: number) => {
    const dt  = new Date(year, month, d);
    const ref = new Date(todayY, todayM, todayD);
    return dt > ref && dt.getDay() !== 0; // futur + pas dimanche
  };
  const isToday = (d: number) =>
    year === todayY && month === todayM && d === todayD;

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

  return (
    <div style={{ background:'rgba(6,3,15,.7)', border:'1px solid var(--border)', padding:'1.4rem', borderRadius:'8px' }}>

      {/* Navigation mois */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
        <button
          onClick={prevMonth}
          disabled={!canPrev}
          style={{ background:'rgba(200,88,122,.1)', border:'1px solid var(--border)', color: canPrev ? 'var(--rose)' : 'rgba(200,88,122,.2)', width:'28px', height:'28px', cursor: canPrev ? 'pointer' : 'default', fontSize:'.8rem', borderRadius:'50%' }}
        >‹</button>
        <span style={{ fontFamily:'"Playfair Display",serif', fontStyle:'italic', fontSize:'1rem', color:'var(--white)' }}>
          {MOIS[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          style={{ background:'rgba(200,88,122,.1)', border:'1px solid var(--border)', color:'var(--rose)', width:'28px', height:'28px', cursor:'pointer', fontSize:'.8rem', borderRadius:'50%' }}
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
          const tod   = isToday(d);
          return (
            <div
              key={d}
              onClick={() => avail && router.push(`/reserver?date=${toISO(year, month, d)}`)}
              className={avail ? 'cal-day-avail' : ''}
              style={{
                textAlign:'center', padding:'6px 3px', fontSize:'.76rem', borderRadius:'50%',
                color: tod ? 'var(--rose)' : avail ? 'var(--white)' : 'rgba(253,240,247,.25)',
                background: tod ? 'rgba(200,88,122,.15)' : 'transparent',
                fontWeight: tod ? 700 : 400,
                cursor: avail ? 'pointer' : 'default',
                border: tod ? '1px solid rgba(200,88,122,.4)' : '1px solid transparent',
              }}
            >
              {d}
            </div>
          );
        })}
      </div>
      <p style={{ fontSize:'.6rem', color:'var(--dim)', marginTop:'.75rem', textAlign:'center' }}>
        Cliquez sur une date pour réserver
      </p>

      <style>{`.cal-day-avail:hover { background: rgba(200,88,122,.22) !important; color: var(--white) !important; }`}</style>
    </div>
  );
}

export default function ResaSection() {
  return (
    <section id="resa" style={{ position:'relative', overflow:'hidden', padding:'6rem 2rem' }}>
      <VideoBackground overlay="rgba(6,3,15,.82)" />

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
                Séances individuelles · Tarif sur demande
              </div>
              <p style={{ fontSize:'.86rem', color:'var(--dim)', lineHeight:1.85, marginBottom:'1rem' }}>
                Chaque séance HRE est unique et adaptée à votre questionnement. En présentiel ou en visioconférence depuis votre domicile.
              </p>
              <ul style={{ listStyle:'none', padding:0, marginBottom:'1.75rem' }}>
                {['Durée : 1h30 à 2h par séance', 'En ligne (Teams / Zoom) ou en présentiel', 'Première consultation offerte (15 min)', 'Suivi post-séance inclus'].map(item => (
                  <li key={item} style={{ fontSize:'.82rem', color:'var(--dim)', padding:'.4rem 0', borderBottom:'1px solid rgba(255,255,255,.04)', display:'flex', gap:'.6rem', alignItems:'center' }}>
                    <span style={{ color:'var(--rose)', fontSize:'.7rem' }}>✿</span> {item}
                  </li>
                ))}
              </ul>
              <Link href="/reserver" className="btn-cta-rose" style={{ display:'inline-flex', alignItems:'center', gap:'.6rem', background:'linear-gradient(135deg,#A03460,#6A1030)', color:'white', textDecoration:'none', fontSize:'.8rem', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', padding:'1rem 2.2rem', borderRadius:'50px', boxShadow:'0 8px 36px rgba(200,88,122,.38)' }}>
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

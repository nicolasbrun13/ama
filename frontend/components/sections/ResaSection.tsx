import Link from 'next/link';
import VideoBackground from '@/components/animations/VideoBackground';
import ScrollReveal from '@/components/animations/ScrollReveal';

const days = [
  [null, null, null, 1, null, null, null],
  [5, 6, null, 8, null, null, null],
  [12, 13, null, 15, null, null, null],
  [null, null, null, null, 19, 20, null],
  [null, 23, 24, null, 26, null, null],
  [29, 30, 31, null, null, null, null],
];
const available = new Set([1, 5, 6, 8, 12, 13, 15, 19, 20, 23, 24, 26, 29, 30, 31]);
const selected = 19;

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
            <div style={{ background:'rgba(6,3,15,.7)', border:'1px solid var(--border)', padding:'1.4rem', borderRadius:'8px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
                <button style={{ background:'rgba(200,88,122,.1)', border:'1px solid var(--border)', color:'var(--rose)', width:'28px', height:'28px', cursor:'pointer', fontSize:'.8rem', borderRadius:'50%' }}>‹</button>
                <span style={{ fontFamily:'"Playfair Display",serif', fontStyle:'italic', fontSize:'1rem', color:'var(--white)' }}>Octobre 2026</span>
                <button style={{ background:'rgba(200,88,122,.1)', border:'1px solid var(--border)', color:'var(--rose)', width:'28px', height:'28px', cursor:'pointer', fontSize:'.8rem', borderRadius:'50%' }}>›</button>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'2px', marginBottom:'3px' }}>
                {['L','M','M','J','V','S','D'].map((d,i) => (
                  <span key={i} style={{ textAlign:'center', fontSize:'.6rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--dim)', padding:'3px 0' }}>{d}</span>
                ))}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'2px' }}>
                {days.flat().map((d, i) => (
                  <div key={i} style={{
                    textAlign:'center', padding:'6px 3px', fontSize:'.76rem', borderRadius:'50%',
                    color: d === null ? 'transparent' : d === selected ? 'white' : available.has(d!) ? 'var(--white)' : 'rgba(253,240,247,.25)',
                    background: d === selected ? 'var(--rose-deep)' : 'transparent',
                    fontWeight: d === selected ? 700 : 400,
                    cursor: d !== null && available.has(d!) ? 'pointer' : 'default',
                  }}>
                    {d ?? ''}
                  </div>
                ))}
              </div>
              <p style={{ fontSize:'.6rem', color:'var(--dim)', marginTop:'.75rem', textAlign:'center' }}>Calendrier · Prototype</p>
            </div>
          </ScrollReveal>
        </div>
      </div>
      <style>{`@media(max-width:767px){ div[style*="1fr 320px"]{ grid-template-columns:1fr !important; } }`}</style>
    </section>
  );
}

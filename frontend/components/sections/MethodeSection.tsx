import Link from 'next/link';
import ScrollReveal from '@/components/animations/ScrollReveal';

const steps = [
  { n: 1, title: 'Échange préliminaire', desc: 'Nous définissons votre intention de séance. Première consultation de 15 min offerte.' },
  { n: 2, title: "L'exploration hypnotique", desc: 'Via le support télépathique, votre inconscient révèle les origines profondes de vos blocages. Vous restez conscient et lucide.' },
  { n: 3, title: 'Intégration & libération', desc: 'Des processus de libération sont effectués pour une transformation durable dans votre vie.' },
];

export default function MethodeSection() {
  return (
    <section id="methode" style={{ position:'relative', background:'var(--bg-mid)', padding:'6rem 2rem' }} className="sec-ambient">
      <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
        <ScrollReveal direction="up">
          <div style={{ textAlign:'center', marginBottom:'.75rem', display:'flex', justifyContent:'center' }}>
            <div className="eyebrow-pill">✿ La Méthode HRE</div>
          </div>
          <div className="sep-line" style={{ maxWidth:'160px', margin:'0 auto 1.5rem' }}><span style={{ color:'var(--rose)', fontSize:'.65rem' }}>★</span></div>
          <h2 className="section-h2">Qu&apos;est-ce que l&apos;<em>Hypnose Régressive Ésotérique</em>&nbsp;?</h2>
          <p className="section-lead">Une approche unique qui explore l&apos;être dans toutes ses dimensions, sans limite de temps ni d&apos;espace.</p>
        </ScrollReveal>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'3.5rem', maxWidth:'940px', margin:'0 auto 3rem', alignItems:'start' }}>
          <ScrollReveal direction="left">
            <div>
              <p style={{ fontSize:'.9rem', color:'var(--dim)', lineHeight:1.88, marginBottom:'1rem' }}>
                L&apos;HRE est une approche thérapeutique fondée par <strong style={{ color:'var(--rose)', fontWeight:600 }}>Calogéro Grifasi</strong> qui permet d&apos;accéder aux zones cachées de l&apos;inconscient profond, au-delà des frontières du temps et de l&apos;espace.
              </p>
              <p style={{ fontSize:'.9rem', color:'var(--dim)', lineHeight:1.88, marginBottom:'1rem' }}>
                Sa particularité : grâce à un <strong style={{ color:'var(--rose)', fontWeight:600 }}>support télépathique</strong>, vous n&apos;entrez pas vous-même en hypnose. Une tierce personne entre en transe à votre place et accède aux informations de votre inconscient.
              </p>
              <p style={{ fontSize:'.9rem', color:'var(--dim)', lineHeight:1.88, marginBottom:'1rem' }}>
                La méthode repose sur la <strong style={{ color:'var(--rose)', fontWeight:600 }}>souveraineté de la conscience</strong> : c&apos;est toujours votre propre subconscient qui effectue les transformations. Aucune entité extérieure n&apos;intervient.
              </p>
              <div className="callout-glow" style={{ background:'rgba(200,88,122,.06)', borderLeft:'3px solid var(--rose)', padding:'1.15rem 1.4rem', fontSize:'.86rem', fontStyle:'italic', color:'var(--dim)', lineHeight:1.75, marginTop:'1.25rem' }}>
                « Vous restez pleinement conscient, lucide et acteur de votre transformation tout en bénéficiant des révélations de l&apos;hypnose profonde. »
              </div>
            </div>
          </ScrollReveal>

          <div style={{ display:'flex', flexDirection:'column', gap:'.9rem' }}>
            {steps.map((s, i) => (
              <ScrollReveal key={s.n} direction="right" delay={i * 110}>
                <div className="step-row">
                  <div className="step-num">{s.n}</div>
                  <div>
                    <h4 style={{ fontSize:'.88rem', fontWeight:700, color:'var(--white)', marginBottom:'.3rem' }}>{s.title}</h4>
                    <p style={{ fontSize:'.8rem', color:'var(--dim)', lineHeight:1.65 }}>{s.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <div style={{ textAlign:'center' }}>
          <Link href="/la-methode" style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', border:'1px solid rgba(200,88,122,.35)', color:'var(--rose)', textDecoration:'none', fontSize:'.8rem', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', padding:'.85rem 2rem', borderRadius:'50px', transition:'all .25s' }}>
            En savoir plus sur la méthode →
          </Link>
        </div>
      </div>

      <style>{`
        .eyebrow-pill { display:inline-flex; align-items:center; gap:.4rem; background:rgba(200,88,122,.08); border:1px solid rgba(200,88,122,.12); border-radius:50px; padding:.35rem 1rem; font-size:.67rem; font-weight:700; letter-spacing:.22em; text-transform:uppercase; color:var(--rose); }
        .section-h2 { font-family:"Playfair Display",serif; font-weight:500; font-size:clamp(1.8rem,3vw,2.8rem); color:var(--white); text-align:center; line-height:1.22; margin-bottom:.9rem; }
        .section-h2 em { font-style:italic; color:var(--rose); }
        .section-lead { text-align:center; color:var(--dim); font-size:.92rem; line-height:1.85; max-width:600px; margin:0 auto 3.5rem; }
        .step-row { display:flex; gap:1.1rem; align-items:flex-start; padding:1.25rem; background:rgba(18,8,48,.5); border:1px solid var(--border); border-radius:4px; transition:all .25s; }
        .step-row:hover { border-color:rgba(200,88,122,.3); box-shadow:0 4px 24px rgba(200,88,122,.1); }
        .step-num { width:38px;height:38px;flex-shrink:0; background:var(--rose-deep); color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:.8rem; font-weight:700; box-shadow:0 4px 16px rgba(160,52,96,.4); transition:all .25s; }
        .step-row:hover .step-num { box-shadow:0 0 22px rgba(200,88,122,.5); transform:scale(1.1); }
        @media(max-width:767px){ div[style*="grid-template-columns:1fr 1fr"] { grid-template-columns:1fr !important; } }
      `}</style>
    </section>
  );
}

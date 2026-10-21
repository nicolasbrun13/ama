import ScrollReveal from '@/components/animations/ScrollReveal';

const cards = [
  { icon:'🌙', title:'Blocages émotionnels', desc:'Peurs inexpliquées, angoisses profondes, tristesse persistante sans cause apparente dans cette vie.' },
  { icon:'🔄', title:'Schémas répétitifs', desc:'Sensations de blocage répété, relations difficiles, échecs récurrents, situations qui se répètent malgré vos efforts conscients.' },
  { icon:'🌊', title:'Phobies & traumatismes', desc:'Peurs irrationnelles, phobies inexpliquées, traumas enfouis qui impactent votre quotidien.' },
  { icon:'⭐', title:'Quête de sens', desc:'Comprendre votre existence et remettre du sens sur ces expériences.' },
  { icon:'🔗', title:'Liens transgéné­rationnels', desc:'Libérer les liens toxiques qui influencent votre vie actuelle.' },
  { icon:'🌸', title:'Confiance & alignement', desc:'Retrouver confiance en vous et vous aligner avec votre être profond pour vivre pleinement.' },
];

export default function BienfaitsSection() {
  return (
    <section style={{ position:'relative', background:'var(--bg-soft)', padding:'3rem 2rem 5rem' }} className="sec-ambient">
      <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
        <ScrollReveal direction="up">
          <div style={{ textAlign:'center', marginBottom:'.75rem', display:'flex', justifyContent:'center' }}>
            <div className="eyebrow-pill">✿ Pour qui ?</div>
          </div>
          <div className="sep-line" style={{ maxWidth:'160px', margin:'0 auto 1.5rem' }}><span style={{ color:'var(--rose)', fontSize:'.65rem' }}>★</span></div>
          <h2 className="section-h2">Ce que l&apos;HRE peut <em>transformer</em></h2>
          <p className="section-lead">La méthode s&apos;adresse à toute personne souhaitant comprendre et libérer ce qui l&apos;empêche de s&apos;épanouir.</p>
        </ScrollReveal>

        <div className="bienfaits-home-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.25rem', maxWidth:'1000px', margin:'0 auto' }}>
          {cards.map((c, i) => (
            <ScrollReveal key={c.title} direction="up" delay={i * 90} className="card-stretch">
              <div className="card-breath" style={{ background:'rgba(6,3,15,.6)', border:'1px solid var(--border)', borderRadius:'8px', padding:'1.75rem 1.4rem', textAlign:'center', height:'100%', boxSizing:'border-box' }}>
                <div style={{ width:'54px', height:'54px', background:'var(--rose-dim)', border:'1px solid var(--border)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem', fontSize:'1.4rem', transition:'all .32s ease' }} className="benef-orb">
                  {c.icon}
                </div>
                <h4 style={{ fontSize:'.88rem', fontWeight:700, color:'var(--white)', marginBottom:'.5rem' }}>{c.title}</h4>
                <p style={{ fontSize:'.8rem', color:'var(--dim)', lineHeight:1.65 }}>{c.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
      <style>{`
        .card-stretch { height: 100%; }
        .card-breath:hover .benef-orb { background:rgba(255,197,211,.2); border-color:rgba(255,197,211,.5); box-shadow:0 0 18px rgba(255,197,211,.3); transform:scale(1.1) rotate(12deg); }
        @media(max-width:767px){
          .bienfaits-home-grid { grid-template-columns:repeat(2,minmax(0,1fr)) !important; }
          .bienfaits-home-grid h4, .bienfaits-home-grid p { hyphens:auto; overflow-wrap:break-word; }
        }
        @media(max-width:480px){
          .bienfaits-home-grid { gap:.85rem !important; }
          .bienfaits-home-grid .card-breath { padding:1.5rem 1rem !important; }
          .bienfaits-home-grid h4 { font-size:.8rem !important; }
        }
      `}</style>
    </section>
  );
}

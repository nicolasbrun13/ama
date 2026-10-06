import Link from 'next/link';

const DemoTag = ({ label = 'demo' }: { label?: string }) => (
  <span style={{ background:'rgba(255,200,0,.1)', border:'1px solid rgba(255,200,0,.35)', color:'#D4A020', fontSize:'.55rem', letterSpacing:'.12em', textTransform:'uppercase', padding:'1px 5px', borderRadius:'3px', marginLeft:'4px', verticalAlign:'middle' }}>
    🧪 {label}
  </span>
);

export default function Footer() {
  return (
    <footer style={{ background:'#030208', borderTop:'1px solid var(--border)', padding:'3.5rem 2rem 2rem' }}>
      <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:'3rem', marginBottom:'2rem' }}>
          {/* Brand */}
          <div>
            <div style={{ fontFamily:'"Playfair Display",serif', fontStyle:'italic', fontSize:'1.5rem', color:'var(--white)', marginBottom:'.65rem' }}>Ama</div>
            <p style={{ fontSize:'.8rem', color:'var(--dim)', lineHeight:1.75, maxWidth:'290px', marginBottom:'1.25rem' }}>
              Thérapeute certifiée en Hypnose Régressive Ésotérique, méthode Calogéro Grifasi. Accompagnement individuel en présentiel et en ligne.
            </p>
            <div style={{ display:'flex', gap:'.6rem' }}>
              {['▶','◉','f'].map((icon, i) => (
                <a key={i} href="#" style={{ width:'34px', height:'34px', border:'1px solid var(--border)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--dim)', textDecoration:'none', fontSize:'.85rem', transition:'all .2s' }}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ fontSize:'.67rem', fontWeight:700, letterSpacing:'.22em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'.9rem' }}>Navigation</h4>
            <ul style={{ listStyle:'none', padding:0 }}>
              {[['/', 'Accueil'], ['/qui-suis-je', 'Qui suis-je'], ['/la-methode', 'La Méthode HRE'], ['/reserver', 'Réserver'], ['/contact', 'Contact']].map(([href, label]) => (
                <li key={href} style={{ marginBottom:'.45rem' }}>
                  <Link href={href} style={{ color:'var(--dim)', textDecoration:'none', fontSize:'.8rem', transition:'color .2s' }}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize:'.67rem', fontWeight:700, letterSpacing:'.22em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'.9rem' }}>Contact</h4>
            <ul style={{ listStyle:'none', padding:0 }}>
              <li style={{ marginBottom:'.45rem' }}>
                <a href="#" style={{ color:'var(--dim)', textDecoration:'none', fontSize:'.8rem' }}>contact@annablanc.fr<DemoTag /></a>
              </li>
              <li style={{ marginBottom:'.45rem' }}>
                <a href="#" style={{ color:'var(--dim)', textDecoration:'none', fontSize:'.8rem' }}>+33 6 XX XX XX XX<DemoTag /></a>
              </li>
              <li>
                <a href="#" style={{ color:'var(--rose)', textDecoration:'none', fontSize:'.8rem' }}>📍 Voir sur Google Maps ↗</a>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop:'1px solid rgba(255,255,255,.04)', paddingTop:'1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'.7rem', color:'var(--dim)' }}>
          <span>© 2026 Anne-Marie Blanc — Hypnose HRE · Tous droits réservés</span>
          <span>
            <a href="#" style={{ color:'var(--dim)', textDecoration:'none', marginRight:'1rem' }}>Mentions légales</a>
            <a href="#" style={{ color:'var(--dim)', textDecoration:'none' }}>Politique de confidentialité</a>
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          footer > div > div:first-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

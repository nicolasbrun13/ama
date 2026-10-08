import Link from 'next/link';

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
              <a href="https://www.youtube.com/channel/UCZEYtzvqQwfPhC-oXASQyWA" target="_blank" rel="noopener noreferrer" style={{ width:'34px', height:'34px', border:'1px solid var(--border)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--dim)', textDecoration:'none', fontSize:'.85rem', transition:'all .2s' }}>▶</a>
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
                <a href="mailto:anne.marie.blanc@gmail.com" style={{ color:'var(--dim)', textDecoration:'none', fontSize:'.8rem' }}>anne.marie.blanc@gmail.com</a>
              </li>
              <li style={{ marginBottom:'.45rem' }}>
                <a href="tel:+33667299096" style={{ color:'var(--dim)', textDecoration:'none', fontSize:'.8rem' }}>+33 6 67 29 90 96</a>
              </li>
              <li>
                <a href="https://maps.google.com/maps?q=134+Bis+Rue+de+la+Marne+33500+Libourne" target="_blank" rel="noopener noreferrer" style={{ color:'var(--rose)', textDecoration:'none', fontSize:'.8rem' }}>📍 Libourne (33) ↗</a>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop:'1px solid rgba(255,255,255,.04)', paddingTop:'1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'.7rem', color:'var(--dim)' }}>
          <span>© 2026 Anne-Marie Blanc · Hypnose HRE · Tous droits réservés</span>
          <span>
            <Link href="/mentions-legales" style={{ color:'var(--dim)', textDecoration:'none', marginRight:'1rem' }}>Mentions légales &amp; CGV</Link>
            <Link href="/contact" style={{ color:'var(--dim)', textDecoration:'none' }}>Contact</Link>
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

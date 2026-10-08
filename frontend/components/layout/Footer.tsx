import Link from 'next/link';

const MAPS_URL = 'https://www.google.com/maps/search/Anne-Marie+Blanc+hypnose+Libourne';
const YT_URL   = 'https://www.youtube.com/channel/UCZEYtzvqQwfPhC-oXASQyWA';

function YouTubeLogo() {
  return (
    <svg viewBox="0 0 71 50" width="18" height="13" xmlns="http://www.w3.org/2000/svg">
      <path d="M69.4 7.8C68.6 4.9 66.4 2.6 63.6 1.8 58 .3 35.6.3 35.6.3S13.2.3 7.6 1.8C4.8 2.6 2.6 4.9 1.8 7.8.3 13.5.3 25.5.3 25.5S.3 37.5 1.8 43.2c.8 2.9 3 5.2 5.8 6 5.6 1.5 28 1.5 28 1.5s22.4 0 28-1.5c2.8-.8 5-3.1 5.8-6C70.9 37.5 70.9 25.5 70.9 25.5S70.9 13.5 69.4 7.8z" fill="#FF0000"/>
      <path d="M28.6 36.1 46.8 25.5 28.6 14.9z" fill="white"/>
    </svg>
  );
}

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
              <a
                href={YT_URL}
                target="_blank"
                rel="noopener noreferrer"
                title="Chaîne YouTube NagAma"
                style={{
                  width:'34px', height:'34px',
                  border:'1px solid var(--border)',
                  borderRadius:'50%',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  textDecoration:'none', transition:'border-color .2s, background .2s',
                }}
                className="footer-yt-btn"
              >
                <YouTubeLogo />
              </a>
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
            <ul style={{ listStyle:'none', padding:0, marginBottom:'.85rem' }}>
              <li style={{ marginBottom:'.45rem' }}>
                <a href="mailto:anne.marie.blanc@gmail.com" style={{ color:'var(--dim)', textDecoration:'none', fontSize:'.8rem' }}>anne.marie.blanc@gmail.com</a>
              </li>
              <li>
                <a href="tel:+33667299096" style={{ color:'var(--dim)', textDecoration:'none', fontSize:'.8rem' }}>+33 6 67 29 90 96</a>
              </li>
            </ul>

            {/* Google Maps thumbnail */}
            <div style={{ borderRadius:'6px', overflow:'hidden', border:'1px solid var(--border)', opacity:0.85 }}>
              <iframe
                src="https://maps.google.com/maps?q=Anne-Marie+Blanc+hypnose+Libourne&output=embed&hl=fr"
                width="100%"
                height="118"
                style={{ border:'none', display:'block' }}
                loading="lazy"
                title="Localisation Ama — Libourne"
              />
            </div>
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
        .footer-yt-btn:hover { border-color: rgba(255,0,0,.5) !important; background: rgba(255,0,0,.07) !important; }
      `}</style>
    </footer>
  );
}

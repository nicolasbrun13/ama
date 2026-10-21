'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { resolveVideo } from '@/lib/videos';
import { useNearViewport } from '@/components/animations/useNearViewport';

const YT_URL = 'https://www.youtube.com/channel/UCZEYtzvqQwfPhC-oXASQyWA';

const PAGE_RATES: Record<string, number> = {
  '/':            1,
  '/reserver':    1,
  '/qui-suis-je': 0.7,
};
const PAGE_VIDEOS: Record<string, string> = {
  '/':                 '/videos/1610.mp4',
  '/qui-suis-je':      '/videos/30073.mp4',
  '/la-methode':       '/videos/30063.mp4',
  '/youtube':          '/videos/10418.mp4',
  '/contact':          '/videos/4034.mp4',
  '/reserver':         '/videos/1610.mp4',
  '/mentions-legales': '/videos/30063.mp4',
};

function YouTubeLogo() {
  return (
    <svg viewBox="0 0 71 50" width="18" height="13" xmlns="http://www.w3.org/2000/svg">
      <path d="M69.4 7.8C68.6 4.9 66.4 2.6 63.6 1.8 58 .3 35.6.3 35.6.3S13.2.3 7.6 1.8C4.8 2.6 2.6 4.9 1.8 7.8.3 13.5.3 25.5.3 25.5S.3 37.5 1.8 43.2c.8 2.9 3 5.2 5.8 6 5.6 1.5 28 1.5 28 1.5s22.4 0 28-1.5c2.8-.8 5-3.1 5.8-6C70.9 37.5 70.9 25.5 70.9 25.5S70.9 13.5 69.4 7.8z" fill="#FF0000"/>
      <path d="M28.6 36.1 46.8 25.5 28.6 14.9z" fill="white"/>
    </svg>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const footerRef = useRef<HTMLElement>(null);
  // La video du footer n'est chargee que lorsque le footer approche de l'ecran
  const nearFooter = useNearViewport(footerRef, '400px 0px');
  // Sur les pages courtes le footer est visible des le chargement : on attend que la video du hero soit prete
  // (ou 5 s) pour ne pas telecharger deux fois le meme fichier en parallele.
  const [heroSettled, setHeroSettled] = useState(false);
  useEffect(() => {
    const hero = document.querySelector<HTMLVideoElement>('main section .vid-bg video');
    const done = () => setHeroSettled(true);
    const timer = setTimeout(done, hero && hero.readyState < 4 ? 5000 : 0);
    hero?.addEventListener('canplaythrough', () => { clearTimeout(timer); done(); }, { once: true });
    return () => clearTimeout(timer);
  }, []);
  const loadVideo = nearFooter && heroSettled;

  // Strip the /ama basePath prefix if present
  const cleanPath = pathname.replace(/^\/ama/, '') || '/';

  const scrollTop = (href: string) => (e: { preventDefault(): void }) => {
    if (href === cleanPath) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const { src: videoSrc, poster: videoPoster } = resolveVideo(PAGE_VIDEOS[cleanPath] ?? PAGE_VIDEOS['/']);
  const videoRate = PAGE_RATES[cleanPath] ?? 0.5;

  const noVideo = ['/', '/la-methode', '/qui-suis-je', '/youtube', '/mentions-legales'].includes(cleanPath);

  return (
    <footer ref={footerRef} className={noVideo ? 'footer-transparent' : ''} style={{ background: noVideo ? 'transparent' : '#030208', borderTop: noVideo ? 'none' : '1px solid var(--border)', padding:'3.5rem 2rem 2rem', position:'relative', overflow:'hidden' }}>

      {/* Video background — only on pages where last section doesn't extend into footer */}
      {mounted && !noVideo && (
        <>
          <video
            key={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            poster={videoPoster}
            onLoadedMetadata={(e) => { (e.target as HTMLVideoElement).playbackRate = videoRate; }}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              opacity: 0.40,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            {loadVideo && <source src={videoSrc} type="video/mp4" />}
          </video>

          {/* Overlay to darken further */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(3,2,8,.58)',
            zIndex: 1, pointerEvents: 'none',
          }} />
        </>
      )}

      <div style={{ maxWidth:'1200px', margin:'0 auto', position:'relative', zIndex:2 }}>
        <div className="footer-grid" style={{ display:'grid', gridTemplateColumns:'2fr auto', gap:'3rem', marginBottom:'2rem' }}>

          {/* Brand */}
          <div>
            <div style={{ fontFamily:'"Playfair Display",serif', fontStyle:'italic', fontSize:'1.5rem', color:'var(--white)', marginBottom:'.65rem' }}>Ama</div>
            <p style={{ fontSize:'.8rem', color:'var(--dim)', lineHeight:1.75, maxWidth:'290px', marginBottom:'1.25rem' }}>
              Thérapeute certifiée en Hypnose Régressive Ésotérique, méthode Calogéro Grifasi. Accompagnement individuel en ligne.
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

          {/* Navigation + Contact groupés */}
          <div className="footer-nav-group" style={{ display:'flex', gap:'2.5rem' }}>

          {/* Navigation */}
          <div>
            <h4 style={{ fontSize:'.67rem', fontWeight:700, letterSpacing:'.22em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'.9rem' }}>Navigation</h4>
            <ul style={{ listStyle:'none', padding:0 }}>
              {[['/', 'Accueil'], ['/qui-suis-je', 'Qui suis-je'], ['/la-methode', 'La Méthode HRE'], ['/reserver', 'Réserver'], ['/contact', 'Contact']].map(([href, label]) => (
                <li key={href} style={{ marginBottom:'.45rem' }}>
                  <Link href={href} onClick={scrollTop(href)} style={{ color:'var(--dim)', textDecoration:'none', fontSize:'.8rem', transition:'color .2s' }}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize:'.67rem', fontWeight:700, letterSpacing:'.22em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'.9rem' }}>Contact</h4>
            <ul style={{ listStyle:'none', padding:0 }}>
              <li>
                <a href="mailto:anne.marie.blanc@gmail.com" style={{ color:'var(--dim)', textDecoration:'none', fontSize:'.8rem' }}>anne.marie.blanc@gmail.com</a>
              </li>
            </ul>
          </div>
          </div>{/* fin Navigation + Contact groupés */}
        </div>

        <div className="footer-bottom" style={{ borderTop:'1px solid rgba(255,255,255,.04)', paddingTop:'1.5rem', display:'grid', gridTemplateColumns:'1fr auto 1fr', alignItems:'center', fontSize:'.7rem', color:'var(--dim)' }}>
          <span>© 2026 Anne-Marie Blanc · Hypnose HRE · Tous droits réservés</span>
          <span className="footer-credit">
            Site réalisé par <a href="https://agence-stylia.fr" target="_blank" rel="noopener noreferrer" style={{ color:'var(--rose)', textDecoration:'none' }}>agence-stylia.fr</a>
          </span>
          <span style={{ justifySelf:'end' }}>
            <Link href="/mentions-legales" onClick={scrollTop('/mentions-legales')} style={{ color:'var(--dim)', textDecoration:'none', marginRight:'1rem' }}>Mentions légales &amp; CGV</Link>
            <Link href="/contact" onClick={scrollTop('/contact')} style={{ color:'var(--dim)', textDecoration:'none' }}>Contact</Link>
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
          .footer-nav-group { flex-direction: column !important; gap: 1.5rem !important; }
          .footer-bottom {
            display: flex !important;
            flex-direction: column !important;
            gap: .55rem !important;
            text-align: center !important;
          }
          .footer-bottom > span:last-child {
            justify-self: auto !important;
            display: flex !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
            gap: .5rem 1rem !important;
          }
          /* Pages où le footer est transparent : fond de secours sur mobile
             (la vidéo de la section du dessus ne descend pas assez bas) */
          .footer-transparent { background: var(--bg) !important; }
        }
        .footer-yt-btn:hover { border-color: rgba(255,0,0,.5) !important; background: rgba(255,0,0,.07) !important; }
      `}</style>
    </footer>
  );
}

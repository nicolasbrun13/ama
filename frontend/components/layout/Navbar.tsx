'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { resolveVideo } from '@/lib/videos';
import FlowerIcon from './FlowerIcon';

const NAVBAR_H = 66;
const MOBILE_TRIGGER_PX = 4; // mobile : scroll a partir duquel la video apparait dans le header
const NAV_PRELOAD_PX = 600; // distance avant la fin du hero a partir de laquelle on charge la video du header

const PAGE_VIDEOS: Record<string, string> = {
  '/':            '/videos/1610.mp4',
  '/qui-suis-je': '/videos/30073.mp4',
  '/la-methode':  '/videos/30063.mp4',
  '/youtube':     '/videos/10418.mp4',
  '/contact':     '/videos/4034.mp4',
  '/reserver':    '/videos/1610.mp4',
};
const PAGE_RATES: Record<string, number> = {
  '/':            1,
  '/qui-suis-je': 0.7,
};
const PAGE_OVERLAYS: Record<string, string> = {
  '/':            'rgba(6,3,15,.65)',
  '/qui-suis-je': 'rgba(6,3,15,.72)',
  '/la-methode':  'rgba(6,3,15,.75)',
  '/youtube':     'rgba(6,3,15,.70)',
  '/contact':     'rgba(6,3,15,.68)',
  '/reserver':    'rgba(6,3,15,.82)',
};
const PAGE_LINE_COLORS: Record<string, string> = {
  '/la-methode': 'rgba(196,176,245,.7)',
};

// Telephone : la video du header prend le relais au tout premier scroll. PC : a la fin du hero.
const isMobileView = () => window.matchMedia('(max-width: 767px)').matches;

const getThreshold = () => {
  if (isMobileView()) return MOBILE_TRIGGER_PX;
  const hero = document.querySelector('main > section:first-child') as HTMLElement | null;
  if (!hero) return 999;
  return hero.offsetTop + hero.offsetHeight - NAVBAR_H;
};

// Scroll a partir duquel on charge la video du header (mobile : des le premier scroll)
const armAt = (threshold: number) => (isMobileView() ? 1 : threshold - NAV_PRELOAD_PX);

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  // La video du header n'est chargee que lorsque le scroll approche de la fin du hero
  const [navArmed, setNavArmed] = useState(false);
  const pathname = usePathname();
  const navVideoRef = useRef<HTMLVideoElement>(null);
  const thresholdRef = useRef<number>(999);

  const cleanPath = (pathname ?? '').replace(/^\/ama/, '') || '/';
  const isGlass = ['/', '/qui-suis-je', '/la-methode', '/youtube', '/contact', '/reserver'].includes(cleanPath);
  const heroVideo = PAGE_VIDEOS[cleanPath] ? resolveVideo(PAGE_VIDEOS[cleanPath]) : undefined;
  const heroVideoSrc = heroVideo?.src;
  const heroVideoRate = PAGE_RATES[cleanPath] ?? 0.5;
  const heroOverlay = PAGE_OVERLAYS[cleanPath] ?? 'rgba(6,3,15,.72)';
  const heroLineColor = PAGE_LINE_COLORS[cleanPath] ?? 'rgba(255,197,211,.7)';

  // Scroll + resize listener (monté une seule fois)
  useEffect(() => {
    setMounted(true);

    thresholdRef.current = getThreshold();

    const onScroll = () => {
      const past = window.scrollY >= thresholdRef.current;
      if (window.scrollY >= armAt(thresholdRef.current)) setNavArmed(true);
      setScrolled(prev => {
        if (past && !prev) {
          // Sync currentTime au moment exact de la transition
          const heroVid = document.querySelector('main section .vid-bg video') as HTMLVideoElement | null;
          if (heroVid && navVideoRef.current) {
            navVideoRef.current.currentTime = heroVid.currentTime;
          }
        }
        return past;
      });
    };

    // Recalcule si la page redimensionne (images chargées, etc.)
    const onResize = () => { thresholdRef.current = getThreshold(); };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Réinitialise scrolled + recalcule le seuil à chaque changement de page
  useEffect(() => {
    setScrolled(false);
    setNavArmed(false);
    // Délai court pour laisser le DOM de la nouvelle page se rendre
    const timer = setTimeout(() => {
      thresholdRef.current = getThreshold();
      if (window.scrollY >= thresholdRef.current) setScrolled(true);
      if (window.scrollY >= armAt(thresholdRef.current)) setNavArmed(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [cleanPath]);

  const scrollTop = (href: string) => (e: { preventDefault(): void }) => {
    if (href === cleanPath) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const links = [
    { href: '/', label: 'Accueil' },
    { href: '/qui-suis-je', label: 'Qui suis-je' },
    { href: '/la-methode', label: 'La Méthode' },
    { href: '/youtube', label: 'YouTube' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav style={{
        position: isGlass ? 'fixed' : 'sticky',
        top: 0, zIndex: 200,
        left: isGlass ? 0 : undefined,
        right: isGlass ? 0 : undefined,
        background: isGlass ? 'transparent' : 'rgba(6,3,15,0.90)',
        backdropFilter: !isGlass ? 'blur(16px)' : 'none',
        borderBottom: isGlass ? 'none' : '1px solid var(--border)',
        padding: '0 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: `${NAVBAR_H}px`,
        overflow: 'hidden',
      }}>

        {/* Video collée au header — rendue côté client uniquement, transition instantanée */}
        {mounted && isGlass && heroVideoSrc && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0,
            opacity: scrolled ? 1 : 0,
            transition: 'opacity 0ms',   // instantané — le seuil est calculé au pixel près
            pointerEvents: 'none',
          }}>
            <video
              key={heroVideoSrc}
              ref={navVideoRef}
              autoPlay muted loop playsInline suppressHydrationWarning
              poster={heroVideo?.poster}
              onLoadedMetadata={(e) => { (e.target as HTMLVideoElement).playbackRate = heroVideoRate; }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
            >
              {navArmed && <source src={heroVideoSrc} type="video/mp4" suppressHydrationWarning />}
            </video>
            <div style={{ position: 'absolute', inset: 0, background: heroOverlay }} />
          </div>
        )}

        {/* Barre dégradée en bas du navbar — rose ou violette selon la page */}
        {isGlass && scrolled && cleanPath !== '/' && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: '1px',
            background: `linear-gradient(to right, transparent 0%, ${heroLineColor} 25%, ${heroLineColor} 75%, transparent 100%)`,
            pointerEvents: 'none',
            zIndex: 3,
          }} />
        )}

        {/* Logo */}
        <Link href="/" onClick={scrollTop('/')} style={{
          fontFamily: '"Playfair Display",serif', fontStyle: 'italic',
          fontSize: '1.5rem', color: 'var(--white)', letterSpacing: '.05em',
          textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '.5rem',
          position: 'relative', zIndex: 1,
        }}>
          <span className="nav-star"><FlowerIcon /></span>
          Ama
        </Link>

        {/* Desktop */}
        <ul className="nav-desktop" style={{ display: 'flex', listStyle: 'none', gap: 0, alignItems: 'center', margin: 0, position: 'relative', zIndex: 1 }}>
          {links.map(l => (
            <li key={l.href}>
              <Link href={l.href} onClick={scrollTop(l.href)} className={`nav-link${cleanPath === l.href ? ' nav-active' : ''}${isGlass ? ' nav-glass' : ''}`}>
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/reserver" onClick={scrollTop('/reserver')} className="nav-cta">Réserver</Link>
          </li>
        </ul>

        {/* Mobile */}
        <button className="nav-burger" onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', color: 'var(--white)', fontSize: '1.4rem', cursor: 'pointer', position: 'relative', zIndex: 1 }}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {menuOpen && (
        <div className="nav-mobile-menu">
          {[...links, { href: '/reserver', label: 'Réserver une séance' }].map(l => (
            <Link key={l.href} href={l.href} className={`nav-mobile-link${cleanPath === l.href ? ' nav-mobile-active' : ''}`} onClick={(e) => { scrollTop(l.href)(e); setMenuOpen(false); }}>
              {/* Petite fleur a gauche de la page en cours (et toujours devant "Réserver") */}
              {(cleanPath === l.href || l.href === '/reserver') && <FlowerIcon className="nav-mobile-flower" />}
              {l.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .nav-star { color:var(--rose); font-style:normal; font-size:.9rem; animation:navStarPulse 2.2s ease-in-out infinite; }
        @keyframes navStarPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.2)} }
        .nav-link { color:rgba(253,240,247,.6); text-decoration:none; font-size:.76rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; padding:.5rem .9rem; transition:color .2s; display:block; position:relative; }
        /* Petit trait rose sous le lien de la page en cours (desktop) */
        .nav-link.nav-active::after { content:''; position:absolute; left:.9rem; right:.9rem; bottom:.05rem; height:2px; border-radius:2px; background:linear-gradient(90deg,transparent,var(--rose) 20%,var(--rose) 80%,transparent); box-shadow:0 0 8px rgba(255,197,211,.55); transform-origin:center; animation:navUnderline .35s ease-out; }
        @keyframes navUnderline { from { transform:scaleX(0); opacity:0 } to { transform:scaleX(1); opacity:1 } }
        .nav-link:hover, .nav-active { color:var(--white) !important; }
        .nav-glass { color:var(--white) !important; }
        .nav-glass:hover, .nav-glass.nav-active { color:var(--white) !important; }
        .nav-cta { background:linear-gradient(135deg,#A03460,#6A1030); color:white !important; text-decoration:none; font-size:.76rem; font-weight:700; letter-spacing:.14em; text-transform:uppercase; padding:.5rem 1.4rem; border-radius:50px; display:block; box-shadow:0 4px 20px rgba(160,52,96,.45); animation:navGlow 2.8s ease-in-out infinite; transition:transform .22s ease,box-shadow .22s ease,filter .22s ease; }
        .nav-cta:hover { transform:translateY(-2px) !important; box-shadow:0 8px 36px rgba(255,197,211,.56) !important; filter:brightness(1.08); }
        @keyframes navGlow { 0%,100%{box-shadow:0 4px 20px rgba(160,52,96,.45)} 50%{box-shadow:0 8px 36px rgba(255,197,211,.55),0 0 40px rgba(255,197,211,.15)} }
        .nav-burger { display:none; }
        .nav-mobile-menu { position:fixed; top:${NAVBAR_H}px; left:0; right:0; background:rgba(6,3,15,.97); border-bottom:1px solid var(--border); padding:1rem 2rem; z-index:199; }
        .nav-mobile-link { display:flex; align-items:center; gap:.55rem; color:var(--white); text-decoration:none; padding:.75rem 0; border-bottom:1px solid rgba(255,197,211,.08); font-size:.9rem; }
        /* Menu mobile : page en cours en rose et en gras */
        .nav-mobile-link.nav-mobile-active { color:var(--rose); font-weight:700; }
        .nav-mobile-flower { color:var(--rose); font-size:1rem; flex-shrink:0; }
        @media (max-width: 767px) {
          .nav-desktop { display:none !important; }
          .nav-burger { display:block !important; }
        }
        @media (max-width: 480px) {
          nav { padding-left: 1.15rem !important; padding-right: 1.15rem !important; }
        }
      `}</style>
    </>
  );
}

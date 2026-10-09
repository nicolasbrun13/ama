'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Accueil' },
    { href: '/qui-suis-je', label: 'Qui suis-je' },
    { href: '/la-methode', label: 'La Méthode' },
    { href: '/youtube', label: 'YouTube' },
    { href: '/contact', label: 'Contact' },
  ];

  const isGlass = ['/qui-suis-je', '/la-methode', '/youtube', '/contact'].includes(pathname ?? '');

  return (
    <>
      <nav style={{
        position: isGlass ? 'fixed' : 'sticky', top: 0, zIndex: 200,
        left: isGlass ? 0 : undefined, right: isGlass ? 0 : undefined,
        background: isGlass ? 'transparent' : 'rgba(6,3,15,0.90)',
        backdropFilter: isGlass ? 'none' : 'blur(16px)',
        borderBottom: isGlass ? 'none' : '1px solid var(--border)',
        padding: '0 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '66px',
      }}>
        <Link href="/" style={{
          fontFamily: '"Playfair Display",serif', fontStyle: 'italic',
          fontSize: '1.5rem',
          color: 'var(--white)',
          letterSpacing: '.05em',
          textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '.5rem',
        }}>
          <span className="nav-star">✿</span>
          Ama
        </Link>

        {/* Desktop */}
        <ul className="nav-desktop" style={{ display: 'flex', listStyle: 'none', gap: 0, alignItems: 'center', margin: 0 }}>
          {links.map(l => (
            <li key={l.href}>
              <Link href={l.href} className={`nav-link${pathname === l.href ? ' nav-active' : ''}${isGlass ? ' nav-glass' : ''}`}>
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/reserver" className="nav-cta">Réserver</Link>
          </li>
        </ul>

        {/* Mobile */}
        <button className="nav-burger" onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', color: 'var(--white)', fontSize: '1.4rem', cursor: 'pointer' }}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {menuOpen && (
        <div className="nav-mobile-menu">
          {[...links, { href: '/reserver', label: '✿ Réserver une séance' }].map(l => (
            <Link key={l.href} href={l.href} className="nav-mobile-link" onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .nav-star { color:var(--rose); font-style:normal; font-size:.9rem; animation:navStarPulse 2.2s ease-in-out infinite; }
        @keyframes navStarPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.2)} }
        .nav-link { color:rgba(253,240,247,.6); text-decoration:none; font-size:.76rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; padding:.5rem .9rem; transition:color .2s; display:block; }
        .nav-link:hover, .nav-active { color:var(--white) !important; }
        .nav-glass { color:var(--white) !important; }
        .nav-glass:hover, .nav-glass.nav-active { color:var(--white) !important; }
        .nav-cta { background:var(--rose-deep); color:white !important; text-decoration:none; font-size:.76rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; padding:.5rem 1.4rem; border-radius:50px; display:block; box-shadow:0 4px 20px rgba(160,52,96,.4); animation:navGlow 2.8s ease-in-out infinite; }
        @keyframes navGlow { 0%,100%{box-shadow:0 4px 20px rgba(160,52,96,.4)} 50%{box-shadow:0 4px 40px rgba(200,88,122,.6),0 0 40px rgba(200,88,122,.15)} }
        .nav-burger { display:none; }
        .nav-mobile-menu { position:fixed; top:66px; left:0; right:0; background:rgba(6,3,15,.97); border-bottom:1px solid var(--border); padding:1rem 2rem; z-index:199; }
        .nav-mobile-link { display:block; color:var(--white); text-decoration:none; padding:.75rem 0; border-bottom:1px solid rgba(200,88,122,.08); font-size:.9rem; }
        @media (max-width: 767px) {
          .nav-desktop { display:none !important; }
          .nav-burger { display:block !important; }
        }
      `}</style>
    </>
  );
}

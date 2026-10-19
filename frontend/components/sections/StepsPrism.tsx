'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';

type Step = { n: number; title: string; desc: string; cta?: { label: string; href: string } };

const N = 5;

// Maps relative position → visual style (peekY passé en paramètre pour être réactif)
function getStyle(rel: number, peekY: number): React.CSSProperties {
  if (rel === 0) return {
    transform: 'translateY(0px) scale(1)',
    opacity: 1,
    zIndex: 3,
    filter: 'none',
    pointerEvents: 'auto',
  };
  if (Math.abs(rel) === 1) return {
    transform: `translateY(${rel * peekY}px) scale(0.82)`,
    opacity: 0.28,
    zIndex: 2,
    filter: 'blur(1px)',
    pointerEvents: 'none',
  };
  return {
    transform: `translateY(${rel * peekY * 1.5}px) scale(0.7)`,
    opacity: 0,
    zIndex: 1,
    filter: 'blur(2px)',
    pointerEvents: 'none',
  };
}

export default function StepsPrism({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(0);
  const [dims, setDims] = useState({ h: 300, clip: 340, peek: 260, pad: '2.2rem 2.8rem' });
  const blocked = useRef(false);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 600) {
        setDims({ h: 220, clip: 256, peek: 190, pad: '1.4rem 1.6rem' });
      } else {
        setDims({ h: 300, clip: 340, peek: 260, pad: '2.2rem 2.8rem' });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const go = useCallback((d: 1 | -1) => {
    if (blocked.current) return;
    blocked.current = true;
    setActive(a => (a + d + N) % N);
    setTimeout(() => { blocked.current = false; }, 520);
  }, []);

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', userSelect: 'none' }}>

      {/* ── Drum scene ── */}
      <div
        onClick={() => go(1)}
        style={{
          position: 'relative',
          height: `${dims.clip}px`,
          overflow: 'hidden',
          cursor: 'pointer',
        }}
      >
        {/* Gradient masks — same colour as section bg */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '80px',
          background: 'linear-gradient(to bottom, rgba(12,6,32,1), rgba(12,6,32,0))',
          zIndex: 10, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
          background: 'linear-gradient(to top, rgba(12,6,32,1), rgba(12,6,32,0))',
          zIndex: 10, pointerEvents: 'none',
        }} />

        {/* Cards stacked at the same absolute position */}
        <div style={{ position: 'relative', height: `${dims.clip}px` }}>
          {steps.map((s, i) => {
            // shortest-path relative position (-2 to +2)
            let rel = i - active;
            if (rel > Math.floor(N / 2)) rel -= N;
            if (rel < -Math.floor(N / 2)) rel += N;

            const topOffset = (dims.clip - dims.h) / 2; // center active card

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: `${topOffset}px`,
                  left: 0, right: 0,
                  height: `${dims.h}px`,
                  transition: 'transform .48s cubic-bezier(0.33, 1, 0.68, 1), opacity .42s ease, filter .42s ease',
                  ...getStyle(rel, dims.peek),
                  /* Card design */
                  background: 'linear-gradient(145deg, rgba(22,10,58,.97) 0%, rgba(14,6,38,.93) 100%)',
                  border: rel === 0 ? '1px solid rgba(255,197,211,.35)' : '1px solid rgba(255,197,211,.12)',
                  borderRadius: '14px',
                  padding: dims.pad,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: '.85rem',
                  boxShadow: rel === 0
                    ? '0 16px 60px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.04), 0 0 40px rgba(255,197,211,.08)'
                    : '0 8px 30px rgba(0,0,0,.35)',
                }}
              >
                {/* Step number */}
                <div style={{
                  fontFamily: '"Playfair Display", serif',
                  fontStyle: 'italic',
                  fontSize: 'clamp(2.2rem, 4.5vw, 3rem)',
                  fontWeight: 400,
                  color: 'var(--gold)',
                  opacity: 0.65,
                  lineHeight: 1,
                }}>
                  {String(s.n).padStart(2, '0')}
                </div>

                {/* Rose line */}
                <div style={{
                  width: '36px', height: '1px',
                  background: 'linear-gradient(90deg, var(--rose), rgba(255,197,211,0))',
                }} />

                {/* Title */}
                <h4 style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: 'clamp(.95rem, 1.8vw, 1.15rem)',
                  fontWeight: 500,
                  color: 'var(--white)',
                  lineHeight: 1.3,
                  margin: 0,
                }}>
                  {s.title}
                </h4>

                {/* Description */}
                <p style={{
                  fontSize: '.86rem',
                  color: 'var(--dim)',
                  lineHeight: 1.78,
                  margin: 0,
                }}>
                  {s.desc}
                </p>

                {/* CTA optionnel — visible uniquement sur la carte active */}
                {s.cta && rel === 0 && (
                  <Link
                    href={s.cta.href}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '.4rem',
                      color: 'var(--rose)', textDecoration: 'none',
                      fontSize: '.76rem', fontWeight: 700, letterSpacing: '.1em',
                      border: '1px solid rgba(255,197,211,.28)',
                      borderRadius: '50px', padding: '.4rem 1rem',
                      background: 'rgba(255,197,211,.06)',
                      transition: 'background .2s, border-color .2s',
                      alignSelf: 'flex-start',
                    }}
                    className="steps-cta"
                  >
                    {s.cta.label}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Navigation ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '1.75rem', marginTop: '1.25rem',
      }}>
        <button
          onClick={() => go(-1)}
          aria-label="Étape précédente"
          style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'rgba(255,197,211,.07)', border: '1px solid rgba(255,197,211,.28)',
            color: 'var(--rose)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '.82rem', transition: 'background .2s',
            fontFamily: 'monospace',
          }}
        >▲</button>

        {/* Dots */}
        <div style={{ display: 'flex', gap: '.45rem', alignItems: 'center' }}>
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (!blocked.current) {
                  blocked.current = true;
                  setActive(i);
                  setTimeout(() => { blocked.current = false; }, 520);
                }
              }}
              aria-label={`Étape ${i + 1}`}
              style={{
                width: i === active ? '20px' : '7px',
                height: '7px', borderRadius: '4px',
                background: i === active ? 'var(--rose)' : 'rgba(255,197,211,.22)',
                border: 'none', cursor: 'pointer',
                transition: 'width .3s, background .3s',
                padding: 0,
              }}
            />
          ))}
        </div>

        <button
          onClick={() => go(1)}
          aria-label="Étape suivante"
          style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'rgba(255,197,211,.07)', border: '1px solid rgba(255,197,211,.28)',
            color: 'var(--rose)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '.82rem', transition: 'background .2s',
            fontFamily: 'monospace',
          }}
        >▼</button>
      </div>

      <p style={{
        textAlign: 'center', marginTop: '.5rem',
        fontSize: '.64rem', letterSpacing: '.22em',
        textTransform: 'uppercase' as const,
        color: 'rgba(253,240,247,.28)',
      }}>
        Étape {active + 1}&nbsp;/&nbsp;{N}
      </p>

      <style>{`.steps-cta:hover { background: rgba(255,197,211,.14) !important; border-color: rgba(255,197,211,.5) !important; }`}</style>
    </div>
  );
}

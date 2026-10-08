'use client';
import { useState, useRef, useCallback } from 'react';

type Step = { n: number; title: string; desc: string };

const N = 5;
const ITEM_H = 300;   // height of one card
const CLIP_H = 340;   // visible window (active card + peek)
const PEEK_Y = 260;   // how far adjacent cards are offset

// Maps relative position → visual style
function getStyle(rel: number): React.CSSProperties {
  if (rel === 0) return {
    transform: 'translateY(0px) scale(1)',
    opacity: 1,
    zIndex: 3,
    filter: 'none',
    pointerEvents: 'auto',
  };
  if (Math.abs(rel) === 1) return {
    transform: `translateY(${rel * PEEK_Y}px) scale(0.82)`,
    opacity: 0.28,
    zIndex: 2,
    filter: 'blur(1px)',
    pointerEvents: 'none',
  };
  return {
    transform: `translateY(${rel * PEEK_Y * 1.5}px) scale(0.7)`,
    opacity: 0,
    zIndex: 1,
    filter: 'blur(2px)',
    pointerEvents: 'none',
  };
}

export default function StepsPrism({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(0);
  const blocked = useRef(false);
  const lastWheel = useRef(0);
  const touchY = useRef(0);

  const go = useCallback((d: 1 | -1) => {
    if (blocked.current) return;
    blocked.current = true;
    setActive(a => (a + d + N) % N);
    setTimeout(() => { blocked.current = false; }, 520);
  }, []);

  const onWheel = useCallback((e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheel.current < 750) return;
    lastWheel.current = now;
    go(e.deltaY > 0 ? 1 : -1);
  }, [go]);

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', userSelect: 'none' }}>

      {/* ── Drum scene ── */}
      <div
        onWheel={onWheel}
        onTouchStart={e => { touchY.current = e.touches[0].clientY; }}
        onTouchEnd={e => {
          const delta = touchY.current - e.changedTouches[0].clientY;
          if (Math.abs(delta) > 40) go(delta > 0 ? 1 : -1);
        }}
        style={{
          position: 'relative',
          height: `${CLIP_H}px`,
          overflow: 'hidden',
          cursor: 'ns-resize',
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
        <div style={{ position: 'relative', height: `${CLIP_H}px` }}>
          {steps.map((s, i) => {
            // shortest-path relative position (-2 to +2)
            let rel = i - active;
            if (rel > Math.floor(N / 2)) rel -= N;
            if (rel < -Math.floor(N / 2)) rel += N;

            const topOffset = (CLIP_H - ITEM_H) / 2; // center active card

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: `${topOffset}px`,
                  left: 0, right: 0,
                  height: `${ITEM_H}px`,
                  transition: 'transform .48s cubic-bezier(0.33, 1, 0.68, 1), opacity .42s ease, filter .42s ease',
                  ...getStyle(rel),
                  /* Card design */
                  background: 'linear-gradient(145deg, rgba(22,10,58,.97) 0%, rgba(14,6,38,.93) 100%)',
                  border: rel === 0 ? '1px solid rgba(200,88,122,.35)' : '1px solid rgba(200,88,122,.12)',
                  borderRadius: '14px',
                  padding: '2.2rem 2.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: '.85rem',
                  boxShadow: rel === 0
                    ? '0 16px 60px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.04), 0 0 40px rgba(200,88,122,.08)'
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
                  background: 'linear-gradient(90deg, var(--rose), rgba(200,88,122,0))',
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
            background: 'rgba(200,88,122,.07)', border: '1px solid rgba(200,88,122,.28)',
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
                background: i === active ? 'var(--rose)' : 'rgba(200,88,122,.22)',
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
            background: 'rgba(200,88,122,.07)', border: '1px solid rgba(200,88,122,.28)',
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
    </div>
  );
}

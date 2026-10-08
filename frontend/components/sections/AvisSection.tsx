'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import VideoBackground from '@/components/animations/VideoBackground';

const avis = [
  {
    stars: 5,
    text: 'Ravi d\'avoir choisi cette professionnelle ! Je suis sorti de mon burn-out grâce aux méthodes douces qu\'elle utilise, notamment la relaxation et les TCC. C\'est une personne très à l\'écoute et très agréable. Je garde en tête ces outils qui me permettront d\'avancer. Je la recommande sans hésitation.',
    author: 'Loic P.',
    tag: 'Burn-out',
  },
  {
    stars: 5,
    text: 'Très bonne professionnelle de santé, à l\'écoute active, je la recommande vivement.',
    author: 'Julie L.',
    tag: 'Écoute active',
  },
  {
    stars: 5,
    text: 'Excellente psychologue. Elle m\'a beaucoup aidé à m\'affirmer et avoir plus confiance en moi. Elle est très douce et agréable. Je la recommande à 100%',
    author: 'Adélaïde A.',
    tag: 'Confiance en soi',
  },
  {
    stars: 5,
    text: 'Suite à un burn-out, j\'ai consulté Anne-Marie Blanc et j\'en suis très satisfaite. Elle utilise la méthode TCC qui s\'est avérée très efficace. J\'ai également fait une séance d\'hypnose régressive qui m\'a beaucoup aidée à progresser.',
    author: 'Karine P.',
    tag: 'TCC & Hypnose',
  },
  {
    stars: 5,
    text: 'Très bonne psychologue, à l\'écoute et accueillante. J\'ai également fait des séances d\'hypnose régressive ésotérique avec de bons résultats.',
    author: 'Farida Z.',
    tag: 'Hypnose Régressive',
  },
];

const N = avis.length; // 5

export default function AvisSection() {
  const [visible, setVisible] = useState(3);
  const [active, setActive]   = useState(0);
  const paused  = useRef(false);
  const touchX  = useRef(0);

  // Responsive: 1 card on mobile, 3 on desktop
  useEffect(() => {
    const update = () => {
      const v = window.innerWidth < 640 ? 1 : 3;
      setVisible(prev => {
        if (prev !== v) { setActive(0); return v; }
        return prev;
      });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const MAX = Math.max(0, N - visible);

  const go = useCallback((d: 1 | -1) => {
    setActive(a => {
      const next = a + d;
      if (next < 0) return MAX;
      if (next > MAX) return 0;
      return next;
    });
  }, [MAX]);

  // Autoplay
  useEffect(() => {
    const id = setInterval(() => {
      if (!paused.current) go(1);
    }, 5000);
    return () => clearInterval(id);
  }, [go]);

  const btnStyle: React.CSSProperties = {
    width: '40px', height: '40px', borderRadius: '50%',
    background: 'rgba(200,88,122,.07)', border: '1px solid rgba(200,88,122,.28)',
    color: 'var(--rose)', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '.82rem', transition: 'background .2s', fontFamily: 'monospace',
    flexShrink: 0,
  };

  // Track: N cards total, `visible` shown at a time
  // track width  = N / visible × 100%  (% of container)
  // each card    = 100% / N            (% of track = 1/visible of container)
  // translateX   = -active × (100/N)%  (% of track = -active/visible of container)
  const trackW    = `${(N / visible) * 100}%`;
  const cardW     = `${100 / N}%`;
  const translateX = `translateX(-${active * (100 / N)}%)`;

  return (
    <section id="avis" style={{ position: 'relative', overflow: 'hidden', padding: '6rem 2rem' }}>
      <VideoBackground overlay="rgba(6,3,15,.78)" />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="eyebrow-pill" style={{ display: 'inline-flex', marginBottom: '.75rem' }}>✿ Témoignages</div>
          <div className="sep-line" style={{ maxWidth: '160px', margin: '0 auto .75rem' }}>
            <span style={{ color: 'var(--rose)', fontSize: '.65rem' }}>★</span>
          </div>
          <h2 className="section-h2">Ce qu&apos;ils ont <em>vécu</em></h2>
          <p className="section-lead">Des transformations réelles, racontées par ceux qui ont osé plonger.</p>
        </div>

        {/* Carousel */}
        <div
          onMouseEnter={() => { paused.current = true; }}
          onMouseLeave={() => { paused.current = false; }}
          onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={e => {
            const d = touchX.current - e.changedTouches[0].clientX;
            if (Math.abs(d) > 40) go(d > 0 ? 1 : -1);
          }}
        >
          {/* Sliding track */}
          <div style={{ overflow: 'hidden' }}>
            <div style={{
              display: 'flex',
              width: trackW,
              transform: translateX,
              transition: 'transform .52s cubic-bezier(.33,1,.68,1)',
              alignItems: 'stretch',
            }}>
              {avis.map((a, i) => (
                <div
                  key={i}
                  style={{
                    width: cardW,
                    padding: '0 .75rem',
                    boxSizing: 'border-box' as const,
                  }}
                >
                  <div style={{
                    height: '100%',
                    background: 'linear-gradient(145deg, rgba(22,10,58,.97) 0%, rgba(14,6,38,.93) 100%)',
                    border: '1px solid rgba(200,88,122,.22)',
                    borderRadius: '12px',
                    padding: '1.65rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '.75rem',
                    boxShadow: '0 8px 40px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.03)',
                  }}>
                    {/* Stars */}
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {Array.from({ length: a.stars }).map((_, si) => (
                        <span key={si} style={{ color: 'var(--gold)', fontSize: '.85rem' }}>★</span>
                      ))}
                    </div>

                    {/* Rose line */}
                    <div style={{ width: '28px', height: '1px', background: 'linear-gradient(90deg, var(--rose), rgba(200,88,122,0))' }} />

                    {/* Text */}
                    <p style={{ fontSize: '.82rem', fontStyle: 'italic', color: 'var(--dim)', lineHeight: 1.82, margin: 0, flex: 1 }}>
                      &ldquo;{a.text}&rdquo;
                    </p>

                    {/* Author + tag */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '.5rem', borderTop: '1px solid rgba(200,88,122,.08)' }}>
                      <div>
                        <div style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--white)' }}>{a.author}</div>
                        <div style={{ fontSize: '.6rem', color: 'rgba(253,240,247,.28)', letterSpacing: '.08em', marginTop: '.12rem' }}>Avis Google ★</div>
                      </div>
                      <span style={{
                        background: 'rgba(200,88,122,.08)', border: '1px solid rgba(200,88,122,.15)',
                        color: 'var(--rose)', fontSize: '.58rem', letterSpacing: '.1em',
                        textTransform: 'uppercase' as const, padding: '.18rem .55rem', borderRadius: '50px',
                        whiteSpace: 'nowrap' as const,
                      }}>{a.tag}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginTop: '1.5rem' }}>
            <button onClick={() => go(-1)} aria-label="Précédent" style={btnStyle}>◀</button>

            <div style={{ display: 'flex', gap: '.45rem', alignItems: 'center' }}>
              {Array.from({ length: MAX + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Page ${i + 1}`}
                  style={{
                    width: i === active ? '20px' : '7px',
                    height: '7px', borderRadius: '4px',
                    background: i === active ? 'var(--rose)' : 'rgba(200,88,122,.22)',
                    border: 'none', cursor: 'pointer',
                    transition: 'width .3s, background .3s', padding: 0,
                  }}
                />
              ))}
            </div>

            <button onClick={() => go(1)} aria-label="Suivant" style={btnStyle}>▶</button>
          </div>

          <p style={{
            textAlign: 'center', marginTop: '.5rem',
            fontSize: '.64rem', letterSpacing: '.22em', textTransform: 'uppercase' as const,
            color: 'rgba(253,240,247,.28)',
          }}>
            Avis {active + 1}–{Math.min(active + visible, N)}&nbsp;sur&nbsp;{N}
          </p>
        </div>

      </div>
    </section>
  );
}

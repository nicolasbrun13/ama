import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'YouTube — Ama · Hypnose HRE',
  description: "Retrouvez les vidéos d'Ama sur YouTube : témoignages, explications de la méthode HRE et explorations de l'inconscient.",
};

const placeholders = [
  { label: 'Témoignage — libération d\'un blocage émotionnel profond' },
  { label: 'Qu\'est-ce que la méthode HRE ? Explication complète' },
  { label: 'Comment fonctionne le support télépathique ?' },
];

export default function YouTubePage() {
  return (
    <main>
      {/* Sub-hero */}
      <section style={{
        position: 'relative', background: 'var(--bg)',
        padding: '8rem 2rem 5rem', textAlign: 'center', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', width: '600px', height: '600px', borderRadius: '50%',
          filter: 'blur(120px)',
          background: 'radial-gradient(circle, rgba(200,88,122,.12) 0%, transparent 60%)',
          top: '-200px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '.4rem',
            background: 'rgba(200,88,122,.08)', border: '1px solid rgba(200,88,122,.22)',
            borderRadius: '50px', padding: '.35rem 1rem', marginBottom: '1.5rem',
            fontSize: '.67rem', fontWeight: 700, letterSpacing: '.22em',
            textTransform: 'uppercase' as const, color: 'var(--rose)',
          }}>
            ▶ YouTube
          </div>
          <h1 style={{
            fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
            fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', fontWeight: 400,
            color: 'var(--white)', lineHeight: 1.2, marginBottom: '1rem',
          }}>
            La chaîne YouTube
          </h1>
          <p style={{
            fontSize: '.95rem', color: 'var(--dim)', lineHeight: 1.8, maxWidth: '580px', margin: '0 auto',
          }}>
            Témoignages authentiques, explorations de l&apos;inconscient et explications approfondies
            de la méthode HRE — directement sur YouTube.
          </p>
        </div>
      </section>

      {/* Main channel card */}
      <section style={{ background: 'var(--bg-mid)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{
            background: 'rgba(12,6,32,.8)', border: '1px solid rgba(200,88,122,.2)',
            borderRadius: '12px', overflow: 'hidden', marginBottom: '4rem',
          }}>
            {/* Video thumbnail area */}
            <div style={{
              position: 'relative', paddingBottom: '56.25%',
              background: 'linear-gradient(135deg, rgba(6,3,15,.95) 0%, rgba(18,8,48,.95) 100%)',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.25rem',
              }}>
                <div style={{
                  width: '80px', height: '80px',
                  background: 'rgba(200,88,122,.12)', border: '1px solid rgba(200,88,122,.3)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem', cursor: 'pointer',
                  transition: 'all .2s',
                }}>
                  ▶
                </div>
                <p style={{ color: 'var(--dim)', fontSize: '.82rem', letterSpacing: '.1em', textTransform: 'uppercase' as const }}>
                  Chaîne YouTube — Ama Hypnose HRE
                </p>
                <span style={{
                  background: 'rgba(200,88,122,.08)', border: '1px solid rgba(200,88,122,.2)',
                  color: 'var(--rose)', fontSize: '.62rem', letterSpacing: '.12em',
                  textTransform: 'uppercase' as const, padding: '.25rem .75rem', borderRadius: '50px',
                }}>
                  À venir
                </span>
              </div>
            </div>

            <div style={{ padding: '1.75rem 2rem' }}>
              <h2 style={{
                fontFamily: '"Playfair Display", serif', fontSize: '1.4rem',
                fontStyle: 'italic', color: 'var(--white)', marginBottom: '.75rem',
              }}>
                Ama — Hypnose Régressive Ésotérique
              </h2>
              <p style={{ fontSize: '.85rem', color: 'var(--dim)', lineHeight: 1.75, marginBottom: '1.5rem' }}>
                Retrouvez des témoignages de clients ayant vécu des transformations profondes grâce à la méthode HRE,
                des explications détaillées sur l&apos;approche de Calogéro Grifasi, et des vidéos d&apos;exploration
                de l&apos;inconscient pour mieux comprendre ce travail unique.
              </p>
              <a
                href="#"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '.6rem',
                  background: 'linear-gradient(135deg, #A03460, #6A1030)',
                  color: 'white', textDecoration: 'none',
                  fontSize: '.78rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' as const,
                  padding: '.85rem 1.75rem', borderRadius: '50px',
                  boxShadow: '0 6px 24px rgba(160,52,96,.4)',
                }}
              >
                ▶ S&apos;abonner à la chaîne
              </a>
            </div>
          </div>

          {/* Coming soon videos */}
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h3 style={{
              fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
              fontSize: '1.3rem', color: 'var(--white)', marginBottom: '.5rem',
            }}>
              Prochaines vidéos
            </h3>
            <p style={{ fontSize: '.8rem', color: 'var(--dim)' }}>
              De nouvelles vidéos arrivent bientôt.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem' }} className="yt-grid">
            {placeholders.map((p, i) => (
              <div key={i} style={{
                background: 'rgba(12,6,32,.7)', border: '1px solid var(--border)',
                borderRadius: '8px', overflow: 'hidden',
              }}>
                {/* 16:9 placeholder */}
                <div style={{
                  position: 'relative', paddingBottom: '56.25%',
                  background: 'rgba(6,3,15,.9)',
                }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '.5rem',
                  }}>
                    <span style={{ fontSize: '1.6rem', opacity: .4 }}>▶</span>
                    <span style={{
                      background: 'rgba(200,88,122,.08)', border: '1px solid rgba(200,88,122,.18)',
                      color: 'var(--rose)', fontSize: '.55rem', letterSpacing: '.12em',
                      textTransform: 'uppercase' as const, padding: '.2rem .6rem', borderRadius: '50px',
                    }}>
                      À venir
                    </span>
                  </div>
                </div>
                <div style={{ padding: '1rem' }}>
                  <p style={{ fontSize: '.78rem', color: 'var(--dim)', lineHeight: 1.6 }}>{p.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section style={{ background: 'var(--bg)', padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
            fontSize: '1.8rem', color: 'var(--white)', marginBottom: '1rem',
          }}>
            Ne manquez aucune vidéo
          </h2>
          <p style={{ color: 'var(--dim)', fontSize: '.88rem', lineHeight: 1.75, marginBottom: '1.75rem' }}>
            Abonnez-vous à la chaîne pour être notifié dès la publication des prochaines vidéos.
          </p>
          <a
            href="#"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '.6rem',
              border: '1px solid rgba(200,88,122,.35)', color: 'var(--rose)',
              textDecoration: 'none', fontSize: '.8rem', fontWeight: 700,
              letterSpacing: '.12em', textTransform: 'uppercase' as const,
              padding: '.9rem 2rem', borderRadius: '50px', transition: 'all .25s',
            }}
          >
            ▶ S&apos;abonner →
          </a>
        </div>
      </section>

      <style>{`
        @media (max-width: 767px) { .yt-grid { grid-template-columns: 1fr !important; } }
        @media (min-width: 640px) and (max-width: 900px) { .yt-grid { grid-template-columns: repeat(2,1fr) !important; } }
      `}</style>
    </main>
  );
}

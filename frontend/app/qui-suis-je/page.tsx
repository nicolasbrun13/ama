import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Qui suis-je — Ama · Hypnose HRE',
  description: "Découvrez le parcours d'Anne-Marie Blanc, praticienne certifiée en Hypnose Régressive Ésotérique, méthode Calogéro Grifasi.",
};

const values = [
  {
    icon: '💛',
    title: 'Bienveillance',
    desc: 'Un espace sécurisant et sans jugement pour explorer les dimensions profondes de votre être.',
  },
  {
    icon: '🔑',
    title: 'Autonomie',
    desc: "La méthode HRE respecte la souveraineté de votre conscience. C'est vous qui transformez, pas une entité extérieure.",
  },
  {
    icon: '🌟',
    title: 'Précision',
    desc: "Chaque séance cible les véritables origines de vos blocages, pas seulement leurs manifestations en surface.",
  },
];

export default function QuiSuisJe() {
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
            ✿ Qui suis-je
          </div>
          <h1 style={{
            fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
            fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', fontWeight: 400,
            color: 'var(--white)', lineHeight: 1.2, marginBottom: '1rem',
          }}>
            Anne-Marie Blanc
          </h1>
          <p style={{
            fontSize: '.95rem', color: 'var(--dim)', lineHeight: 1.8, maxWidth: '560px', margin: '0 auto',
          }}>
            Praticienne en Hypnose Régressive Ésotérique, méthode Calogéro Grifasi
          </p>
        </div>
      </section>

      {/* Main content */}
      <section style={{ background: 'var(--bg-mid)', padding: '5rem 2rem' }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: '280px 1fr',
          gap: '4rem', alignItems: 'start',
        }} className="qsj-grid">
          {/* Photo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              position: 'relative', width: '280px', height: '380px',
              borderRadius: '140px 140px 100px 100px',
              border: '1px solid rgba(200,88,122,.3)',
              boxShadow: '0 24px 80px rgba(0,0,0,.7), 0 0 60px rgba(200,88,122,.08)',
              overflow: 'hidden',
            }}>
              <Image
                src="/anna-blanc.png"
                alt="Anne-Marie Blanc — Praticienne HRE"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
              />
            </div>
            <p style={{
              fontSize: '.68rem', color: 'var(--dim)', letterSpacing: '.2em',
              textTransform: 'uppercase' as const, textAlign: 'center',
            }}>
              Praticienne HRE certifiée
            </p>
          </div>

          {/* Text */}
          <div>
            <h2 style={{
              fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
              fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', color: 'var(--white)',
              marginBottom: '1.75rem', lineHeight: 1.25,
            }}>
              Mon chemin vers l&apos;HRE
            </h2>

            <p style={{ fontSize: '.9rem', color: 'var(--dim)', lineHeight: 1.88, marginBottom: '1.1rem' }}>
              Depuis toujours attirée par les dimensions invisibles de l&apos;existence, j&apos;ai découvert
              la méthode HRE de Calogéro Grifasi après des années de recherche personnelle.
              Cette rencontre a transformé ma vie.
            </p>
            <p style={{ fontSize: '.9rem', color: 'var(--dim)', lineHeight: 1.88, marginBottom: '1.1rem' }}>
              Certifiée praticienne HRE, j&apos;accompagne aujourd&apos;hui mes clients dans une exploration
              profonde de leur inconscient, au-delà du temps et de l&apos;espace, pour libérer ce qui
              les retient véritablement.
            </p>
            <p style={{ fontSize: '.9rem', color: 'var(--dim)', lineHeight: 1.88, marginBottom: '2rem' }}>
              Chaque séance est une aventure unique. Ma mission : vous offrir un espace de confiance
              et de bienveillance pour que vous puissiez vous reconnecter à votre essence profonde.{' '}
              <span style={{ color: 'rgba(253,240,247,.3)', fontSize: '.8rem', fontStyle: 'italic' }}>
                [À compléter]
              </span>
            </p>

            {/* Callout quote */}
            <div className="callout-glow" style={{
              background: 'rgba(200,88,122,.06)',
              borderLeft: '3px solid var(--rose)',
              padding: '1.25rem 1.5rem',
              fontSize: '.9rem', fontStyle: 'italic',
              color: 'var(--dim)', lineHeight: 1.75,
            }}>
              « Tu n&apos;es pas le problème — c&apos;est ce que tu ne vois pas encore. »
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ background: 'var(--bg-soft)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '.4rem',
              background: 'rgba(200,88,122,.08)', border: '1px solid rgba(200,88,122,.12)',
              borderRadius: '50px', padding: '.35rem 1rem', marginBottom: '1.25rem',
              fontSize: '.67rem', fontWeight: 700, letterSpacing: '.22em',
              textTransform: 'uppercase' as const, color: 'var(--rose)',
            }}>
              ✿ Mes valeurs
            </div>
            <h2 style={{
              fontFamily: '"Playfair Display", serif', fontWeight: 500,
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: 'var(--white)',
              lineHeight: 1.22,
            }}>
              Ce qui guide <em style={{ fontStyle: 'italic', color: 'var(--rose)' }}>chaque séance</em>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }} className="values-grid">
            {values.map((v, i) => (
              <div key={i} className="card-breath" style={{
                background: 'rgba(6,3,15,.6)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '2rem 1.75rem', textAlign: 'center',
              }}>
                <div style={{
                  width: '60px', height: '60px', margin: '0 auto 1.25rem',
                  background: 'rgba(200,88,122,.08)', border: '1px solid var(--border)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.6rem',
                }}>
                  {v.icon}
                </div>
                <h3 style={{ fontSize: '.95rem', fontWeight: 700, color: 'var(--white)', marginBottom: '.6rem' }}>
                  {v.title}
                </h3>
                <p style={{ fontSize: '.82rem', color: 'var(--dim)', lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--bg-mid)', padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
            fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: 'var(--white)',
            marginBottom: '1rem',
          }}>
            Prêt(e) à explorer ?
          </h2>
          <p style={{ color: 'var(--dim)', fontSize: '.9rem', lineHeight: 1.8, marginBottom: '2rem' }}>
            Réservez votre première séance ou une consultation offerte de 15 minutes pour découvrir la méthode.
          </p>
          <Link href="/reserver" style={{
            display: 'inline-flex', alignItems: 'center', gap: '.6rem',
            background: 'linear-gradient(135deg, #A03460, #6A1030)',
            color: 'white', textDecoration: 'none',
            fontSize: '.82rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase' as const,
            padding: '1rem 2.4rem', borderRadius: '50px',
            boxShadow: '0 8px 36px rgba(200,88,122,.38)',
          }}>
            ✿ Réserver une séance
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 767px) {
          .qsj-grid { grid-template-columns: 1fr !important; }
          .values-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 640px) and (max-width: 900px) {
          .values-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </main>
  );
}

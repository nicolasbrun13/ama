import Link from 'next/link';
import ScrollReveal from '@/components/animations/ScrollReveal';

export default function YoutubeSection() {
  return (
    <section id="youtube" style={{ position: 'relative', background: 'var(--bg-mid)', padding: '6rem 2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <ScrollReveal direction="up">
          <div style={{ textAlign: 'center', marginBottom: '.75rem', display: 'flex', justifyContent: 'center' }}>
            <div className="eyebrow-pill">▶ La Chaîne YouTube</div>
          </div>
          <div className="sep-line" style={{ maxWidth: '160px', margin: '0 auto 1.5rem' }}>
            <span style={{ color: 'var(--rose)', fontSize: '.65rem' }}>★</span>
          </div>
          <h2 className="section-h2">Découvrez l&apos;<em>HRE en vidéo</em></h2>
          <p className="section-lead">
            Témoignages, explications de la méthode et explorations de l&apos;inconscient — directement sur YouTube.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100}>
          <div style={{
            background: 'rgba(12,6,32,.7)', border: '1px solid rgba(200,88,122,.18)',
            borderRadius: '12px', overflow: 'hidden', maxWidth: '720px', margin: '0 auto 2.5rem',
          }}>
            <div style={{
              position: 'relative', paddingBottom: '56.25%', background: '#000',
            }}>
              <div style={{
                position: 'absolute', inset: 0, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: '1rem',
                background: 'linear-gradient(135deg, rgba(6,3,15,.9) 0%, rgba(18,8,48,.9) 100%)',
              }}>
                <div style={{
                  width: '72px', height: '72px', background: 'rgba(200,88,122,.15)',
                  border: '1px solid rgba(200,88,122,.3)', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.8rem', cursor: 'pointer',
                }}>▶</div>
                <p style={{ color: 'var(--dim)', fontSize: '.8rem', letterSpacing: '.1em' }}>
                  Chaîne YouTube d&apos;Ama — Hypnose HRE
                </p>
              </div>
            </div>
            <div style={{ padding: '1.25rem 1.5rem' }}>
              <p style={{ fontSize: '.82rem', color: 'var(--dim)', lineHeight: 1.7 }}>
                Retrouvez des témoignages de clients, des explications approfondies sur la méthode HRE et des vidéos d&apos;exploration de l&apos;inconscient.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <div style={{ textAlign: 'center' }}>
          <Link href="/youtube" style={{
            display: 'inline-flex', alignItems: 'center', gap: '.5rem',
            border: '1px solid rgba(200,88,122,.35)', color: 'var(--rose)', textDecoration: 'none',
            fontSize: '.8rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase',
            padding: '.85rem 2rem', borderRadius: '50px', transition: 'all .25s',
          }}>
            Voir toutes les vidéos →
          </Link>
        </div>
      </div>
    </section>
  );
}

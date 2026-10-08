import Link from 'next/link';
import Image from 'next/image';
import ScrollReveal from '@/components/animations/ScrollReveal';

const CHANNEL = 'https://www.youtube.com/channel/UCZEYtzvqQwfPhC-oXASQyWA';

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
          <a
            href={CHANNEL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              background: 'rgba(12,6,32,.7)',
              border: '1px solid rgba(200,88,122,.18)',
              borderRadius: '12px',
              overflow: 'hidden',
              maxWidth: '720px',
              margin: '0 auto 2.5rem',
              textDecoration: 'none',
            }}
            className="yt-home-card"
          >
            <div style={{ position: 'relative', paddingBottom: '52%' }}>
              <Image
                src="/youtube-channel.png"
                alt="Chaîne YouTube NagAma — Hypnose HRE"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
                sizes="(max-width: 900px) 100vw, 720px"
              />
              {/* hover overlay */}
              <div className="yt-home-overlay" style={{
                position: 'absolute', inset: 0,
                background: 'rgba(6,3,15,.48)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: '1rem',
                transition: 'background .25s',
              }}>
                <div style={{
                  width: '68px', height: '68px',
                  background: 'rgba(200,88,122,.85)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem',
                  boxShadow: '0 4px 24px rgba(200,88,122,.45)',
                }}>▶</div>
                <p style={{ color: 'rgba(253,240,247,.85)', fontSize: '.78rem', letterSpacing: '.1em', margin: 0 }}>
                  Visiter la chaîne NagAma
                </p>
              </div>
            </div>
          </a>
        </ScrollReveal>

        <div style={{ textAlign: 'center' }}>
          <Link href="/youtube" className="btn-cta-ghost" style={{
            display: 'inline-flex', alignItems: 'center', gap: '.5rem',
            border: '1px solid rgba(200,88,122,.35)', color: 'var(--rose)', textDecoration: 'none',
            fontSize: '.8rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase',
            padding: '.85rem 2rem', borderRadius: '50px', transition: 'all .25s',
          }}>
            Voir toutes les vidéos →
          </Link>
        </div>
      </div>

      <style>{`
        .yt-home-card:hover .yt-home-overlay { background: rgba(6,3,15,.28) !important; }
      `}</style>
    </section>
  );
}

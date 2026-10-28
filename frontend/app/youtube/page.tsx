import type { Metadata } from 'next';
import Image from 'next/image';
import VideoBackground from '@/components/animations/VideoBackground';
import SacredGeometryBg from '@/components/decorations/SacredGeometryBg';

export const metadata: Metadata = {
  title: 'YouTube — Ama · Hypnose HRE',
  description: "Retrouvez les vidéos d'Ama sur YouTube : séances filmées, explications de la méthode HRE et explorations de l'inconscient.",
};

const CHANNEL = 'https://www.youtube.com/channel/UCZEYtzvqQwfPhC-oXASQyWA';
const YT_WATCH = (id: string) => `https://www.youtube.com/watch?v=${id}`;
const YT_THUMB = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

type Video = { id: string; title: string; date?: string; tag?: string; customThumb?: string };

const featured: Video = {
  id: 'UzQzHmQs6EA',
  title: 'Meryam — Séance HRE',
  date: '18 sept. 2026',
  tag: 'Séance',
  customThumb: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/youtube-featured.png`,
};

// Vidéo de présentation : cible des liens "Comprendre la méthode" du site (/youtube#comprendre)
const highlight: Video = {
  id: 'rzDwEVCcAEQ',
  title: 'Présentation Ama et Nag',
  tag: 'Présentation',
};

const contentVideos: Video[] = [
  { id: 'ebRiVBAD_7Q', title: 'Rêve et réalité ésotérique #9', date: '22 août 2025', tag: 'Ésoterisme' },
  { id: 'UYSqA8gq5Mw', title: 'Le pouvoir ésotérique de la mémoire', date: '14 juil. 2025', tag: 'Mémoire' },
  { id: 'ZU2aeYAi9Y0', title: 'Capsule du vendredi n°5', date: '1er mai 2025', tag: 'Capsule' },
];

const testimonials: Video[] = [
  { id: 'BRI4kSc5zfY', title: 'Karine', date: '15 juin 2026', tag: 'Séance' },
  { id: '1hqh4Hnsq34', title: 'Patrice', date: '25 avr. 2026', tag: 'Séance' },
  { id: 'GktQtr89Ljg', title: 'Caroline', date: '24 avr. 2026', tag: 'Séance' },
  { id: 'gUgLv6wgwEg', title: 'Emilie', date: '21 mars 2026', tag: 'Séance' },
  { id: 'foANxz4jQsY', title: 'Delphine', date: '19 janv. 2026', tag: 'Séance' },
  { id: 'qeg20SzbFZI', title: 'Candice', date: '9 janv. 2026', tag: 'Séance' },
  { id: '1utH_xKUnT0', title: 'Anais', date: '14 nov. 2025', tag: 'Séance' },
  { id: 'NXF49jQjXFg', title: 'Elodie', date: '9 nov. 2025', tag: 'Séance' },
  { id: '0FTljynEfaI', title: 'Angélique', date: '19 oct. 2025', tag: 'Séance' },
  { id: 'rp8P_DVkK5o', title: 'Gianni', date: '6 oct. 2025', tag: 'Séance' },
  { id: 'QjuVsCJFrkg', title: 'Lydie', date: '26 avr. 2025', tag: 'Séance' },
];

function VideoCard({ video, featured: isFeatured = false }: { video: Video; featured?: boolean }) {
  return (
    <a
      href={YT_WATCH(video.id)}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block',
        background: 'rgba(12,6,32,.8)',
        border: '1px solid var(--border)',
        borderRadius: isFeatured ? '12px' : '8px',
        overflow: 'hidden',
        textDecoration: 'none',
        transition: 'border-color .25s, transform .25s',
      }}
      className="yt-card"
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', paddingBottom: '56.25%', background: 'rgba(6,3,15,.9)' }}>
        <Image
          src={video.customThumb ?? YT_THUMB(video.id)}
          alt={video.title}
          fill
          style={{ objectFit: 'cover' }}
          sizes={isFeatured ? '(max-width:900px) 100vw, 860px' : '(max-width:640px) 100vw, 280px'}
        />
        {/* Play overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(6,3,15,.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: 0, transition: 'opacity .22s',
        }} className="yt-play-overlay">
          <div style={{
            width: isFeatured ? '64px' : '44px',
            height: isFeatured ? '64px' : '44px',
            borderRadius: '50%',
            background: 'rgba(255,197,211,.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: isFeatured ? '1.4rem' : '1rem', color: '#000',
            boxShadow: '0 4px 20px rgba(255,197,211,.4)',
          }}>▶</div>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: isFeatured ? '1.5rem 1.75rem' : '.85rem 1rem' }}>
        {video.tag && (
          <span style={{
            display: 'inline-block', marginBottom: '.5rem',
            background: 'rgba(255,197,211,.08)', border: '1px solid rgba(255,197,211,.2)',
            color: 'var(--rose)', fontSize: '.58rem', letterSpacing: '.12em',
            textTransform: 'uppercase', padding: '.18rem .6rem', borderRadius: '50px',
          }}>
            {video.tag}
          </span>
        )}
        <h3 style={{
          fontFamily: '"Playfair Display", serif',
          fontStyle: 'italic',
          fontSize: isFeatured ? '1.3rem' : '.88rem',
          fontWeight: 400,
          color: 'var(--white)',
          lineHeight: 1.3,
          marginBottom: '.35rem',
        }}>
          {video.title}
        </h3>
        {video.date && (
          <p style={{ fontSize: '.72rem', color: 'rgba(253,240,247,.35)', letterSpacing: '.04em' }}>
            {video.date}
          </p>
        )}
      </div>
    </a>
  );
}

function FeaturedCard({ video, badge }: { video: Video; badge: string }) {
  return (
  <a
    href={YT_WATCH(video.id)}
    target="_blank"
    rel="noopener noreferrer"
    className="featured-card"
    style={{
      display: 'flex', textDecoration: 'none',
      background: 'rgba(12,6,32,.85)',
      border: '1px solid rgba(255,197,211,.42)',
      borderRadius: '14px', overflow: 'hidden',
      transition: 'border-color .3s, box-shadow .3s',
      boxShadow: '0 16px 64px rgba(160,52,96,.28), 0 0 80px rgba(255,197,211,.06), inset 0 1px 0 rgba(255,255,255,.05)',
    }}
  >
    {/* Thumbnail */}
    <div style={{ position: 'relative', width: '495px', flexShrink: 0, aspectRatio: '16/9', background: 'rgba(6,3,15,.9)' }}>
      <Image
        src={video.customThumb ?? YT_THUMB(video.id)}
        alt={video.title}
        fill
        style={{ objectFit: 'cover' }}
        sizes="495px"
      />
      {/* Badge "Dernière vidéo" */}
      <div style={{
        position: 'absolute', top: '14px', left: '14px', zIndex: 1,
        background: 'linear-gradient(135deg,#A03460,#6A1030)',
        color: 'white', borderRadius: '50px',
        padding: '.28rem .8rem',
        fontSize: '.56rem', fontWeight: 700, letterSpacing: '.16em',
        textTransform: 'uppercase' as const,
        boxShadow: '0 4px 16px rgba(160,52,96,.55)',
      }}>{badge}</div>
      {/* Play overlay */}
      <div className="featured-play" style={{
        position: 'absolute', inset: 0,
        background: 'rgba(6,3,15,.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: 0, transition: 'opacity .25s',
      }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'rgba(255,197,211,.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.4rem', color: '#000',
          boxShadow: '0 4px 24px rgba(255,197,211,.5)',
        }}>▶</div>
      </div>
    </div>

    {/* Info panel */}
    <div style={{
      flex: 1,
      padding: '2rem 2.25rem',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      borderLeft: '1px solid rgba(255,197,211,.18)',
      background: 'linear-gradient(135deg, rgba(30,8,68,.92) 0%, rgba(8,3,24,.96) 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '-50px', right: '-50px',
        width: '260px', height: '260px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,197,211,.16) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div>
        {video.tag && (
          <span style={{
            display: 'inline-block', marginBottom: '1rem',
            background: 'rgba(255,197,211,.1)', border: '1px solid rgba(255,197,211,.25)',
            color: 'var(--rose)', fontSize: '.6rem', letterSpacing: '.16em',
            textTransform: 'uppercase', padding: '.22rem .75rem', borderRadius: '50px',
          }}>
            {video.tag}
          </span>
        )}
        <h2 style={{
          fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
          fontSize: 'clamp(1.3rem, 2vw, 1.65rem)', fontWeight: 400,
          color: 'var(--white)', lineHeight: 1.3, marginBottom: '.75rem',
        }}>
          {video.title}
        </h2>
        <div style={{
          width: '36px', height: '1px',
          background: 'linear-gradient(to right, var(--rose), transparent)',
          marginBottom: '.75rem',
        }} />
      </div>

      <div>
        {video.date && (
          <p style={{
            fontSize: '.72rem', color: 'rgba(253,240,247,.35)',
            letterSpacing: '.08em', marginBottom: '1.5rem',
          }}>
            {video.date}
          </p>
        )}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '.5rem',
          background: 'linear-gradient(135deg,#A03460,#6A1030)',
          color: 'white', borderRadius: '50px',
          padding: '.6rem 1.4rem',
          fontSize: '.72rem', fontWeight: 700, letterSpacing: '.12em',
          textTransform: 'uppercase' as const,
          boxShadow: '0 4px 20px rgba(160,52,96,.35)',
        }}>
          ▶ Regarder
        </div>
      </div>
    </div>
  </a>
  );
}

export default function YouTubePage() {
  return (
    <main>
      {/* Sub-hero */}
      <section className="sub-hero" style={{
        position: 'relative',
        padding: '4.5rem 2rem', overflow: 'hidden',
        minHeight: '270px', display: 'flex', alignItems: 'center',
      }}>
        <VideoBackground videoSrc="/videos/10418.mp4" overlay="rgba(6,3,15,.70)" />
        <div className="sub-hero-inner" style={{ position: 'relative', zIndex: 2, maxWidth: '1100px', margin: '0 auto', width: '100%', transform: 'translateY(1.8rem)',  }}>
          <div className="sub-hero-pill" style={{
            display: 'inline-flex', alignItems: 'center', gap: '.4rem',
            background: 'rgba(255,197,211,.08)', border: '1px solid rgba(255,197,211,.22)',
            borderRadius: '50px', padding: '.35rem 1rem', marginBottom: '1.5rem',
            fontSize: '.67rem', fontWeight: 700, letterSpacing: '.22em',
            textTransform: 'uppercase' as const, color: 'var(--rose)',
          }}>
            ▶ YouTube
          </div>
          <h1 style={{
            fontFamily: 'Nunito, sans-serif', fontStyle: 'normal',
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700,
            color: 'var(--white)', lineHeight: 1.15, marginBottom: '0.5rem',
            letterSpacing: '-.01em',
          }}>
            La chaîne YouTube
          </h1>
          <p style={{
            fontSize: '.95rem', color: 'var(--dim)', lineHeight: 1.8, maxWidth: '580px',
          }}>
            Séances de clients, explications de la méthode HRE et explorations de l&apos;inconscient.
          </p>
        </div>
      </section>

      {/* Separator */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(to right, transparent 0%, rgba(255,197,211,.7) 25%, rgba(255,197,211,.7) 75%, transparent 100%)',
      }} />

      {/* Featured video */}
      <section style={{ background: 'var(--bg-mid)', padding: '3rem 2rem 5rem' }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>

          <FeaturedCard video={featured} badge="✦ Dernière vidéo" />

        </div>
      </section>

      {/* Content videos */}
      <section id="comprendre" style={{ background: 'var(--bg-soft)', padding: '4rem 2rem', position: 'relative' }}>
        <SacredGeometryBg />
        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '.4rem',
              background: 'rgba(255,197,211,.08)', border: '1px solid rgba(255,197,211,.12)',
              borderRadius: '50px', padding: '.35rem 1rem', marginBottom: '.75rem',
              fontSize: '.67rem', fontWeight: 700, letterSpacing: '.22em',
              textTransform: 'uppercase' as const, color: 'var(--rose)',
            }}>
              ✿ Explorations
            </div>
            <h2 style={{
              fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
              fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', color: 'var(--white)',
            }}>
              Comprendre la méthode
            </h2>
          </div>
          <div style={{ maxWidth: '920px', margin: '0 auto 3rem' }}>
            <FeaturedCard video={highlight} badge="✦ Pour commencer" />
          </div>
          <p style={{
            textAlign: 'center', marginBottom: '1.25rem',
            fontSize: '.67rem', fontWeight: 700, letterSpacing: '.22em',
            textTransform: 'uppercase' as const, color: 'var(--dim)',
          }}>
            Pour aller plus loin
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem' }} className="yt-grid">
            {contentVideos.map(v => <VideoCard key={v.id} video={v} />)}
          </div>
        </div>
      </section>

      {/* Testimonials grid */}
      <section style={{ background: 'var(--bg-mid)', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '.4rem',
              background: 'rgba(255,197,211,.08)', border: '1px solid rgba(255,197,211,.12)',
              borderRadius: '50px', padding: '.35rem 1rem', marginBottom: '.75rem',
              fontSize: '.67rem', fontWeight: 700, letterSpacing: '.22em',
              textTransform: 'uppercase' as const, color: 'var(--rose)',
            }}>
              ✿ Séances
            </div>
            <h2 style={{
              fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
              fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', color: 'var(--white)',
            }}>
              Des séances en vidéo
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.1rem' }} className="yt-testi-grid">
            {testimonials.map(v => <VideoCard key={v.id} video={v} />)}
          </div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section style={{ position: 'relative', background: 'transparent', padding: '4.5rem 2rem 0', textAlign: 'center' }}>
        <VideoBackground videoSrc="/videos/10418.mp4" overlay="rgba(6,3,15,.82)" bottomExtend={350} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '500px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
            fontSize: '1.8rem', color: 'var(--white)', marginBottom: '1rem',
          }}>
            Ne manquez aucune vidéo
          </h2>
          <p style={{ color: 'var(--dim)', fontSize: '.88rem', lineHeight: 1.75, marginBottom: '1.75rem' }}>
            Abonnez-vous pour être notifié dès la publication des prochaines vidéos.
          </p>
          <a
            href={CHANNEL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta-rose"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '.6rem',
              background: 'linear-gradient(135deg, #A03460, #6A1030)',
              color: 'white', textDecoration: 'none',
              fontSize: '.8rem', fontWeight: 700, letterSpacing: '.12em',
              textTransform: 'uppercase' as const,
              padding: '.9rem 2.2rem', borderRadius: '50px',
              boxShadow: '0 8px 32px rgba(255,197,211,.38)',
            }}
          >
            ▶ S&apos;abonner →
          </a>
        </div>
      </section>

      <style>{`
        .yt-card:hover { border-color: rgba(255,197,211,.32) !important; transform: translateY(-3px); }
        .yt-card:hover .yt-play-overlay { opacity: 1 !important; }
        .featured-card:hover { border-color: rgba(255,197,211,.6) !important; box-shadow: 0 24px 80px rgba(160,52,96,.45), 0 0 100px rgba(255,197,211,.1) !important; }
        .featured-card:hover .featured-play { opacity: 1 !important; }
        @media (max-width: 767px) {
          .featured-card { flex-direction: column !important; }
          .featured-card > div:first-child { width: 100% !important; aspect-ratio: 16/9; }
          .yt-grid { grid-template-columns: 1fr !important; }
          .yt-testi-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (min-width: 640px) and (max-width: 900px) {
          .yt-grid { grid-template-columns: repeat(2,1fr) !important; }
          .yt-testi-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (min-width: 900px) and (max-width: 1100px) {
          .yt-testi-grid { grid-template-columns: repeat(3,1fr) !important; }
        }
      `}</style>
    </main>
  );
}

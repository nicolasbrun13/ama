import type { Metadata } from 'next';
import Image from 'next/image';
import VideoBackground from '@/components/animations/VideoBackground';

export const metadata: Metadata = {
  title: 'YouTube — Ama · Hypnose HRE',
  description: "Retrouvez les vidéos d'Ama sur YouTube : témoignages clients, explications de la méthode HRE et explorations de l'inconscient.",
};

const CHANNEL = 'https://www.youtube.com/channel/UCZEYtzvqQwfPhC-oXASQyWA';
const YT_WATCH = (id: string) => `https://www.youtube.com/watch?v=${id}`;
const YT_THUMB = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

type Video = { id: string; title: string; date: string; tag?: string; customThumb?: string };

const featured: Video = {
  id: 'UzQzHmQs6EA',
  title: 'Meryam — Séance HRE',
  date: '18 sept. 2026',
  tag: 'Témoignage',
  customThumb: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/youtube-featured.png`,
};

const contentVideos: Video[] = [
  { id: 'ebRiVBAD_7Q', title: 'Rêve et réalité ésotérique #9', date: '22 août 2025', tag: 'Ésoterisme' },
  { id: 'UYSqA8gq5Mw', title: 'Le pouvoir ésotérique de la mémoire', date: '14 juil. 2025', tag: 'Mémoire' },
  { id: 'ZU2aeYAi9Y0', title: 'Capsule du vendredi n°5', date: '1er mai 2025', tag: 'Capsule' },
];

const testimonials: Video[] = [
  { id: 'BRI4kSc5zfY', title: 'Karine', date: '15 juin 2026', tag: 'Témoignage' },
  { id: '1hqh4Hnsq34', title: 'Patrice', date: '25 avr. 2026', tag: 'Témoignage' },
  { id: 'GktQtr89Ljg', title: 'Caroline', date: '24 avr. 2026', tag: 'Témoignage' },
  { id: 'gUgLv6wgwEg', title: 'Emilie', date: '21 mars 2026', tag: 'Témoignage' },
  { id: 'foANxz4jQsY', title: 'Delphine', date: '19 janv. 2026', tag: 'Témoignage' },
  { id: 'qeg20SzbFZI', title: 'Candice', date: '9 janv. 2026', tag: 'Témoignage' },
  { id: '1utH_xKUnT0', title: 'Anais', date: '14 nov. 2025', tag: 'Témoignage' },
  { id: 'NXF49jQjXFg', title: 'Elodie', date: '9 nov. 2025', tag: 'Témoignage' },
  { id: '0FTljynEfaI', title: 'Angélique', date: '19 oct. 2025', tag: 'Témoignage' },
  { id: 'rp8P_DVkK5o', title: 'Gianni', date: '6 oct. 2025', tag: 'Témoignage' },
  { id: 'QjuVsCJFrkg', title: 'Lydie', date: '26 avr. 2025', tag: 'Témoignage' },
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
            background: 'rgba(200,88,122,.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: isFeatured ? '1.4rem' : '1rem',
            boxShadow: '0 4px 20px rgba(200,88,122,.4)',
          }}>▶</div>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: isFeatured ? '1.5rem 1.75rem' : '.85rem 1rem' }}>
        {video.tag && (
          <span style={{
            display: 'inline-block', marginBottom: '.5rem',
            background: 'rgba(200,88,122,.08)', border: '1px solid rgba(200,88,122,.2)',
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
        <p style={{ fontSize: '.72rem', color: 'rgba(253,240,247,.35)', letterSpacing: '.04em' }}>
          {video.date}
        </p>
      </div>
    </a>
  );
}

export default function YouTubePage() {
  return (
    <main>
      {/* Sub-hero */}
      <section style={{
        position: 'relative',
        padding: '6rem 2rem', textAlign: 'center', overflow: 'hidden',
        minHeight: '360px', display: 'flex', alignItems: 'center',
      }}>
        <VideoBackground videoSrc="https://assets.mixkit.co/videos/10418/10418-1080.mp4" overlay="rgba(6,3,15,.70)" />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto', width: '100%' }}>
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
            Séances de clients, explications de la méthode HRE et explorations de l&apos;inconscient.
          </p>
        </div>
      </section>

      {/* Featured video */}
      <section style={{ background: 'var(--bg-mid)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '.4rem',
              background: 'rgba(200,88,122,.08)', border: '1px solid rgba(200,88,122,.12)',
              borderRadius: '50px', padding: '.35rem 1rem', marginBottom: '1rem',
              fontSize: '.67rem', fontWeight: 700, letterSpacing: '.22em',
              textTransform: 'uppercase' as const, color: 'var(--rose)',
            }}>
              ✿ Dernière vidéo
            </div>
          </div>
          <VideoCard video={featured} featured />
        </div>
      </section>

      {/* Content videos */}
      <section style={{ background: 'var(--bg-soft)', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '.4rem',
              background: 'rgba(200,88,122,.08)', border: '1px solid rgba(200,88,122,.12)',
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
              background: 'rgba(200,88,122,.08)', border: '1px solid rgba(200,88,122,.12)',
              borderRadius: '50px', padding: '.35rem 1rem', marginBottom: '.75rem',
              fontSize: '.67rem', fontWeight: 700, letterSpacing: '.22em',
              textTransform: 'uppercase' as const, color: 'var(--rose)',
            }}>
              ✿ Témoignages
            </div>
            <h2 style={{
              fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
              fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', color: 'var(--white)',
            }}>
              Ils ont vécu la séance
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.1rem' }} className="yt-testi-grid">
            {testimonials.map(v => <VideoCard key={v.id} video={v} />)}
          </div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section style={{ background: 'var(--bg)', padding: '4.5rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
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
              boxShadow: '0 8px 32px rgba(200,88,122,.38)',
            }}
          >
            ▶ S&apos;abonner →
          </a>
        </div>
      </section>

      <style>{`
        .yt-card:hover { border-color: rgba(200,88,122,.32) !important; transform: translateY(-3px); }
        .yt-card:hover .yt-play-overlay { opacity: 1 !important; }
        @media (max-width: 767px) {
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

import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import VideoBackground from '@/components/animations/VideoBackground';

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
        position: 'relative',
        padding: '6rem 2rem', textAlign: 'center', overflow: 'hidden',
        minHeight: '360px', display: 'flex', alignItems: 'center',
      }}>
        <VideoBackground videoSrc="https://assets.mixkit.co/videos/30073/30073-1080.mp4" overlay="rgba(6,3,15,.72)" />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto', width: '100%' }}>
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
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* Rangée : photo à gauche + 3 premiers paragraphes à droite */}
          <div className="qsj-flex" style={{ display: 'flex', gap: '4rem', alignItems: 'flex-start', marginBottom: '1.1rem' }}>

            {/* Photo */}
            <div className="qsj-photo" style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                position: 'relative', width: '280px', height: '380px',
                borderRadius: '140px 140px 100px 100px',
                border: '1px solid rgba(200,88,122,.3)',
                boxShadow: '0 24px 80px rgba(0,0,0,.7), 0 0 60px rgba(200,88,122,.08)',
                overflow: 'hidden',
              }}>
                <Image
                  src="/anna-blanc.png"
                  alt="Anne-Marie Blanc, Praticienne HRE"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                />
              </div>
              <p style={{
                fontSize: '.68rem', color: 'var(--dim)', letterSpacing: '.2em',
                textTransform: 'uppercase' as const, textAlign: 'center',
                marginTop: '2rem',
              }}>
                Praticienne HRE certifiée
              </p>
            </div>

            {/* Paragraphes 1 à 3 — restent à droite de la photo */}
            <div style={{ flex: 1 }}>
              <h2 style={{
                fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
                fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', color: 'var(--white)',
                marginBottom: '1.75rem', lineHeight: 1.25,
              }}>
                Mon chemin vers l&apos;HRE
              </h2>

              <p style={{ fontSize: '.9rem', color: 'var(--dim)', lineHeight: 1.88, marginBottom: '1.1rem' }}>
                Psychologue de formation, j&apos;ai toujours été attirée par l&apos;hypnose sans réellement passer à une formation concrète. Jusqu&apos;au jour où je suis tombée sur une session d&apos;<span style={{ color: 'var(--rose)', fontStyle: 'italic' }}>hypnose régressive ésotérique</span>. Mon attention a immédiatement été retenue, l&apos;envie de découvrir son fonctionnement, sa mécanique, toute particulière, inhérente au <span style={{ color: 'var(--rose)' }}>monde subtil</span>, certes bien loin des techniques habituellement utilisées, mais permettant une compréhension de thèmes toujours restés en attente dans mon esprit.
              </p>
              <p style={{ fontSize: '.9rem', color: 'var(--dim)', lineHeight: 1.88, marginBottom: '1.1rem' }}>
                Expérimentant d&apos;innombrables chemins de curiosités dans le but de mieux comprendre ce monde et le sens de l&apos;existence, mes pas m&apos;ont guidée vers l&apos;étude des religions, des traditions anciennes, le tantra, le yoga, le reiki, le chamanisme, la médiumnité, les constellations familiales, la cartomancie, la numérologie, l&apos;utilisation du pendule… Finalement, ma curiosité <strong style={{ color: 'var(--white)', fontWeight: 600 }}>n&apos;était jamais vraiment assouvie</strong> : les réponses me semblaient insuffisantes et me poussaient à continuer vers une meilleure compréhension du soi et du fonctionnement de ce monde.
              </p>
              <p style={{ fontSize: '.9rem', color: 'var(--dim)', lineHeight: 1.88, marginBottom: 0 }}>
                Au fil des mois d&apos;écoute de sessions réalisées par des équipes d&apos;<span style={{ color: 'var(--rose)' }}>opérateurs</span> et de <span style={{ color: 'var(--rose)' }}>supports télépathes</span>, le puzzle de compréhension s&apos;est formé. Ce processus d&apos;intégration était nécessaire face à ce tsunami d&apos;informations que mon cartésianisme avait des difficultés à dépasser. Pourtant, au fond de moi, une part d&apos;intuition avait toujours eu la sensation que nous étions <strong style={{ color: 'var(--white)', fontWeight: 600 }}>plus qu&apos;un corps physique</strong> et qu&apos;une <strong style={{ color: 'var(--white)', fontWeight: 600 }}>partie énergétique</strong> devait exister.
              </p>
            </div>
          </div>

          {/* Paragraphes 4 et 5 + callout — pleine largeur sous la photo */}
          <p style={{ fontSize: '.9rem', color: 'var(--dim)', lineHeight: 1.88, marginBottom: '1.1rem' }}>
            Une fois ma compréhension plus solide, j&apos;ai décidé de réserver ma session. Quelques semaines d&apos;attente, pendant lesquelles l&apos;excitation et <strong style={{ color: 'var(--white)', fontWeight: 600 }}>la peur</strong> se mêlaient. La peur est restée présente jusqu&apos;au jour de ma session et m&apos;a finalement définitivement quittée une fois ce travail réalisé. Si bien que la décision de me former à cette technique a été très rapide. Le mois suivant, j&apos;étais déjà dans une dynamique d&apos;apprentissage. Dans un premier temps comme support télépathe, puis très rapidement, j&apos;ai compris que je me sentais plus à l&apos;aise en tant qu&apos;<span style={{ color: 'var(--rose)' }}>opérateur</span>.
          </p>
          <p style={{ fontSize: '.9rem', color: 'var(--dim)', lineHeight: 1.88, marginBottom: '2rem' }}>
            À ce processus de formation s&apos;est combinée la rencontre avec mon support télépathe, <span style={{ color: 'var(--rose)' }}>Nag</span>, avec qui nous nous sommes entraînées durant une année à explorer des thèmes variés en <em style={{ color: 'var(--rose)' }}>état de conscience modifiée</em>. Cette période restera dans ma mémoire comme un <strong style={{ color: 'var(--white)', fontWeight: 600 }}>temps suspendu</strong> où mes questionnements existentiels pouvaient enfin trouver réponses.
          </p>

          {/* Callout quote */}
          <div className="callout-glow" style={{
            background: 'rgba(200,88,122,.06)',
            borderLeft: '3px solid var(--rose)',
            padding: '1.25rem 1.5rem',
            fontSize: '.9rem', fontStyle: 'italic',
            color: 'var(--dim)', lineHeight: 1.75,
          }}>
            « Ma curiosité n&apos;était jamais vraiment assouvie. Jusqu&apos;au jour où l&apos;HRE a mis des mots sur ce que j&apos;avais toujours pressenti. »
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
          <Link href="/reserver" className="btn-cta-rose" style={{
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
          .qsj-flex { flex-direction: column !important; }
          .qsj-photo { align-self: center !important; }
          .values-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 640px) and (max-width: 900px) {
          .values-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </main>
  );
}

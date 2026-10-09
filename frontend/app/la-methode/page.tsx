import Link from 'next/link';
import type { Metadata } from 'next';
import VideoBackground from '@/components/animations/VideoBackground';
import FaqAccordion from '@/components/sections/FaqAccordion';
import StepsPrism from '@/components/sections/StepsPrism';
import ConstellationBg from '@/components/decorations/ConstellationBg';

export const metadata: Metadata = {
  title: 'La Méthode HRE — Hypnose Régressive Ésotérique · Ama',
  description: "Découvrez l'Hypnose Régressive Ésotérique, une approche révolutionnaire fondée par Calogéro Grifasi pour accéder aux zones cachées de l'inconscient.",
};

const differentiators = [
  {
    icon: '🎯',
    title: 'Non-intervention',
    desc: "Aucune entité extérieure n'intervient. C'est votre propre subconscient qui effectue les transformations.",
  },
  {
    icon: '👁',
    title: 'Conscience intacte',
    desc: "Contrairement à d'autres formes d'hypnose, vous restez pleinement conscient et lucide durant toute la séance.",
  },
  {
    icon: '🌍',
    title: 'Sans frontières',
    desc: "La méthode fonctionne en présentiel comme à distance, au-delà des barrières géographiques.",
  },
];

const bienfaits = [
  { icon: '🌙', title: 'Blocages émotionnels', desc: 'Peurs inexpliquées, angoisses profondes, tristesse persistante sans cause apparente.' },
  { icon: '🔄', title: 'Schémas répétitifs', desc: 'Relations difficiles, échecs récurrents, situations qui se répètent malgré vos efforts conscients.' },
  { icon: '🌊', title: 'Phobies & traumatismes', desc: "Peurs irrationnelles, phobies inexpliquées, traumas enfouis qui impactent votre quotidien." },
  { icon: '⭐', title: 'Quête de sens', desc: "Comprendre votre chemin de vie, votre mission d'âme et le sens profond de vos expériences." },
  { icon: '🔗', title: 'Liens karmiques', desc: 'Libérer les liens karmiques ou intergénérationnels qui influencent votre vie actuelle.' },
  { icon: '🌸', title: 'Confiance & alignement', desc: 'Retrouver confiance en vous et vous aligner avec votre être profond pour vivre pleinement.' },
];

const steps = [
  {
    n: 1,
    title: 'Prise de contact (15 min offerte)',
    desc: "Un premier échange gratuit pour comprendre votre questionnement, définir si la méthode est adaptée à votre situation et répondre à toutes vos questions sans engagement.",
  },
  {
    n: 2,
    title: "Définition de l'intention",
    desc: "Ensemble, nous formulons une intention précise pour la séance. Cette étape est essentielle : plus l'intention est claire, plus l'exploration sera ciblée et efficace.",
  },
  {
    n: 3,
    title: 'La séance hypnotélépathique',
    desc: "L'opérateur (une tierce personne formée à la méthode) entre en état hypnotique à votre place, via un support télépathique. Vous restez totalement conscient et lucide tout au long du processus.",
  },
  {
    n: 4,
    title: 'Exploration et libération',
    desc: "Votre inconscient révèle les origines profondes de vos blocages, parfois dans d'autres vies, d'autres dimensions temporelles. Des processus de libération sont ensuite effectués.",
  },
  {
    n: 5,
    title: 'Intégration post-séance',
    desc: "Les 48 à 72 heures suivant la séance sont une période d'intégration importante. Des transformations continuent de se produire. Un suivi post-séance est inclus pour accompagner ce processus.",
  },
];

const faq = [
  {
    q: "Est-ce que je dois croire en la méthode pour qu'elle fonctionne ?",
    a: "Non. La méthode fonctionne indépendamment de vos croyances. L'inconscient n'a pas besoin de votre foi consciente pour opérer. Beaucoup de clients sceptiques ont vécu des transformations profondes.",
  },
  {
    q: "Est-ce dangereux ?",
    a: "Non. Vous restez conscient et lucide tout au long de la séance. La méthode est basée sur la souveraineté de votre conscience — rien ne peut vous être imposé contre votre gré.",
  },
  {
    q: "Combien de séances sont nécessaires ?",
    a: "C'est très variable selon les personnes et les problématiques. Certains obtiennent des résultats dès la première séance. D'autres choisissent de faire plusieurs séances pour approfondir le travail.",
  },
  {
    q: "Peut-on faire la séance en ligne ?",
    a: "Oui, absolument. La méthode HRE fonctionne aussi bien à distance qu'en présentiel. De nombreux clients font leur séance depuis leur domicile, partout dans le monde.",
  },
  {
    q: "C'est quoi le support télépathique ?",
    a: "Un opérateur formé entre en état hypnotique à votre place via une connexion télépathique. Cette personne perçoit les informations de votre inconscient et les communique. C'est la particularité fondamentale de la méthode HRE.",
  },
  {
    q: "Les résultats sont-ils permanents ?",
    a: "Certains résultats sont immédiats et permanents. D'autres se manifestent progressivement sur plusieurs jours ou semaines après la séance, le temps que l'inconscient intègre les transformations.",
  },
];

export default function LaMethode() {
  return (
    <main>
      {/* Sub-hero */}
      <section style={{
        position: 'relative',
        padding: '6rem 2rem', textAlign: 'center', overflow: 'hidden',
        minHeight: '360px', display: 'flex', alignItems: 'center',
      }}>
        <VideoBackground videoSrc="https://assets.mixkit.co/videos/30063/30063-1080.mp4" overlay="rgba(6,3,15,.75)" />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '.4rem',
            background: 'rgba(200,88,122,.08)', border: '1px solid rgba(200,88,122,.22)',
            borderRadius: '50px', padding: '.35rem 1rem', marginBottom: '1.5rem',
            fontSize: '.67rem', fontWeight: 700, letterSpacing: '.22em',
            textTransform: 'uppercase' as const, color: 'var(--rose)',
          }}>
            ✿ La Méthode
          </div>
          <h1 style={{
            fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
            fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', fontWeight: 400,
            color: 'var(--white)', lineHeight: 1.2, marginBottom: '1rem',
          }}>
            L&apos;Hypnose Régressive Ésotérique
          </h1>
          <p style={{
            fontSize: '.95rem', color: 'var(--dim)', lineHeight: 1.8, maxWidth: '560px', margin: '0 auto',
          }}>
            Une approche révolutionnaire fondée par Calogéro Grifasi
          </p>
        </div>
      </section>

      <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #C8587A 25%, #C8587A 75%, transparent)' }} />

      {/* Section 1 — Qu'est-ce que l'HRE */}
      <section style={{ background: 'var(--bg-mid)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontFamily: '"Playfair Display", serif', fontWeight: 500,
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: 'var(--white)', lineHeight: 1.22,
            }}>
              Qu&apos;est-ce que <em style={{ fontStyle: 'italic', color: 'var(--rose)' }}>l&apos;HRE ?</em>
            </h2>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start',
          }} className="methode-grid">
            {/* Left: description */}
            <div>
              <p style={{ fontSize: '.9rem', color: 'var(--dim)', lineHeight: 1.88, marginBottom: '1rem' }}>
                L&apos;HRE est une méthode thérapeutique qui permet d&apos;accéder aux zones cachées de l&apos;inconscient profond, au-delà des frontières ordinaires du temps et de l&apos;espace.
              </p>
              <p style={{ fontSize: '.9rem', color: 'var(--dim)', lineHeight: 1.88, marginBottom: '1rem' }}>
                Fondée en 2012 par <strong style={{ color: 'var(--rose)', fontWeight: 600 }}>Calogéro Grifasi</strong>, chercheur autodidacte passionné par les mécanismes de l&apos;inconscient, la méthode est le fruit d&apos;années d&apos;expérimentation et de recherche.
              </p>
              <p style={{ fontSize: '.9rem', color: 'var(--dim)', lineHeight: 1.88, marginBottom: '1rem' }}>
                Sa particularité absolue : grâce à un <strong style={{ color: 'var(--rose)', fontWeight: 600 }}>support télépathique</strong>, vous n&apos;entrez pas vous-même en hypnose. Un opérateur formé entre en transe à votre place et accède aux informations de votre inconscient.
              </p>
              <p style={{ fontSize: '.9rem', color: 'var(--dim)', lineHeight: 1.88, marginBottom: '1rem' }}>
                La méthode repose sur la <strong style={{ color: 'var(--rose)', fontWeight: 600 }}>souveraineté totale de la conscience</strong> : c&apos;est toujours votre propre subconscient qui effectue les transformations. Aucune entité extérieure n&apos;intervient dans votre espace intérieur.
              </p>
              <p style={{ fontSize: '.9rem', color: 'var(--dim)', lineHeight: 1.88, marginBottom: '1rem' }}>
                Les résultats varient selon les personnes : certains sont immédiats et visibles dès les heures suivant la séance, d&apos;autres se manifestent progressivement sur plusieurs jours ou semaines.
              </p>
              <p style={{ fontSize: '.9rem', color: 'var(--dim)', lineHeight: 1.88 }}>
                La méthode ne présente pas de contre-indication. Elle convient à tout le monde, quel que soit votre état de santé, vos croyances ou votre niveau de sensibilité.
              </p>
            </div>

            {/* Right: differentiators */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {differentiators.map((d, i) => (
                <div key={i} className="card-breath" style={{
                  background: 'rgba(18,8,48,.6)', border: '1px solid var(--border)',
                  borderRadius: '8px', padding: '1.5rem',
                  display: 'flex', gap: '1.1rem', alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: '44px', height: '44px', flexShrink: 0,
                    background: 'rgba(200,88,122,.08)', border: '1px solid var(--border)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '1.2rem',
                  }}>
                    {d.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--white)', marginBottom: '.35rem' }}>{d.title}</h4>
                    <p style={{ fontSize: '.8rem', color: 'var(--dim)', lineHeight: 1.65 }}>{d.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — Ce que l'HRE peut traiter */}
      <section style={{ background: 'var(--bg-soft)', padding: '5rem 2rem', position: 'relative' }}>
        <ConstellationBg />
        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '.4rem',
              background: 'rgba(200,88,122,.08)', border: '1px solid rgba(200,88,122,.12)',
              borderRadius: '50px', padding: '.35rem 1rem', marginBottom: '1.25rem',
              fontSize: '.67rem', fontWeight: 700, letterSpacing: '.22em',
              textTransform: 'uppercase' as const, color: 'var(--rose)',
            }}>
              ✿ Pour qui ?
            </div>
            <h2 style={{
              fontFamily: '"Playfair Display", serif', fontWeight: 500,
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: 'var(--white)', lineHeight: 1.22,
            }}>
              Ce que l&apos;HRE peut <em style={{ fontStyle: 'italic', color: 'var(--rose)' }}>transformer</em>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem' }} className="bienfaits-grid">
            {bienfaits.map((b, i) => (
              <div key={i} className="card-breath" style={{
                background: 'rgba(6,3,15,.6)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '1.75rem 1.4rem', textAlign: 'center',
              }}>
                <div style={{
                  width: '54px', height: '54px', margin: '0 auto 1rem',
                  background: 'rgba(200,88,122,.08)', border: '1px solid var(--border)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.4rem',
                }}>
                  {b.icon}
                </div>
                <h4 style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--white)', marginBottom: '.5rem' }}>{b.title}</h4>
                <p style={{ fontSize: '.8rem', color: 'var(--dim)', lineHeight: 1.65 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — Déroulement d'une séance */}
      <section style={{ background: 'var(--bg-mid)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '.4rem',
              background: 'rgba(200,88,122,.08)', border: '1px solid rgba(200,88,122,.12)',
              borderRadius: '50px', padding: '.35rem 1rem', marginBottom: '1.25rem',
              fontSize: '.67rem', fontWeight: 700, letterSpacing: '.22em',
              textTransform: 'uppercase' as const, color: 'var(--rose)',
            }}>
              ✿ Déroulement
            </div>
            <h2 style={{
              fontFamily: '"Playfair Display", serif', fontWeight: 500,
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: 'var(--white)', lineHeight: 1.22,
            }}>
              Comment se déroule <em style={{ fontStyle: 'italic', color: 'var(--rose)' }}>une séance ?</em>
            </h2>
          </div>

          <StepsPrism steps={steps} />
        </div>
      </section>

      {/* Section 4 — FAQ */}
      <section style={{ background: 'var(--bg-soft)', padding: '5rem 2rem', position: 'relative' }}>
        <ConstellationBg />
        <div style={{ maxWidth: '860px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '.4rem',
              background: 'rgba(200,88,122,.08)', border: '1px solid rgba(200,88,122,.12)',
              borderRadius: '50px', padding: '.35rem 1rem', marginBottom: '1.25rem',
              fontSize: '.67rem', fontWeight: 700, letterSpacing: '.22em',
              textTransform: 'uppercase' as const, color: 'var(--rose)',
            }}>
              ✿ FAQ
            </div>
            <h2 style={{
              fontFamily: '"Playfair Display", serif', fontWeight: 500,
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: 'var(--white)', lineHeight: 1.22,
            }}>
              Questions <em style={{ fontStyle: 'italic', color: 'var(--rose)' }}>fréquentes</em>
            </h2>
          </div>

          <FaqAccordion items={faq} />
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--bg)', padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
            fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: 'var(--white)',
            marginBottom: '1rem',
          }}>
            Prêt(e) à découvrir la méthode ?
          </h2>
          <p style={{ color: 'var(--dim)', fontSize: '.9rem', lineHeight: 1.8, marginBottom: '2rem' }}>
            Première consultation de 15 minutes offerte pour échanger et répondre à toutes vos questions.
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
          .methode-grid { grid-template-columns: 1fr !important; }
          .bienfaits-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 640px) and (max-width: 900px) {
          .bienfaits-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </main>
  );
}

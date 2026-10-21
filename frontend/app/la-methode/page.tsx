import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import VideoBackground from '@/components/animations/VideoBackground';
import FaqAccordion from '@/components/sections/FaqAccordion';
import StepsPrism from '@/components/sections/StepsPrism';
import ConstellationBg from '@/components/decorations/ConstellationBg';

function EyeIcon() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 0C5.73 0 1.25 3.28 0 8c1.25 4.72 5.73 8 11 8s9.75-3.28 11-8C20.75 3.28 16.27 0 11 0zm0 13.33A5.33 5.33 0 1111 2.67a5.33 5.33 0 010 10.66zm0-8.53a3.2 3.2 0 100 6.4 3.2 3.2 0 000-6.4z" fill="#1a0d2e"/>
    </svg>
  );
}

export const metadata: Metadata = {
  title: 'La Méthode HRE — Hypnose Régressive Ésotérique · Ama',
  description: "Découvrez l'Hypnose Régressive Ésotérique, une approche révolutionnaire fondée par Calogéro Grifasi pour accéder aux zones cachées de l'inconscient.",
};

const differentiators: { icon: ReactNode; title: string; desc: string }[] = [
  {
    icon: '🎯',
    title: 'Non-intervention',
    desc: "Aucune entité extérieure n'intervient. C'est votre propre partie subliminal qui effectue les transformations.",
  },
  {
    icon: <EyeIcon />,
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
  { icon: '🔗', title: 'Liens transgéné­rationnels', desc: 'Libérer les liens transgénérationnels qui influencent votre vie actuelle.' },
  { icon: '🌸', title: 'Confiance & alignement', desc: 'Retrouver confiance en vous et vous aligner avec votre être profond pour vivre pleinement.' },
];

const steps = [
  {
    n: 1,
    title: "S'approprier la méthode",
    desc: "Au travers de l'écoute des sessions pour une meilleure compréhension de la méthode.",
    cta: { label: '▶ Comprendre la méthode →', href: '/youtube#comprendre' },
  },
  {
    n: 2,
    title: "Définition de l'intention",
    desc: "Après une introspection de son vécu, la personne pourra énoncer les points de vérification qu'elle souhaite découvrir dans sa session et aussi énoncer son intention à réaliser cet accompagnement.",
  },
  {
    n: 3,
    title: 'La séance hypnotélépathique',
    desc: "Le support télépathe (Nag) entre en état de conscience modifié à votre place, puis il est guidé par l'opérateur, Ama. Vous restez totalement conscient et lucide tout au long du processus.",
  },
  {
    n: 4,
    title: 'Exploration et libération',
    desc: "Votre partie subliminale dévoile les origines profondes de vos blocages, parfois dans d'autres vies, d'autres dimensions temporelles. Des processus de libération sont ensuite effectués.",
  },
  {
    n: 5,
    title: 'Intégration post-séance',
    desc: "Les semaines qui suivent la séance sont une période d'intégration importante. Les transformations continuent de se produire en fonction du travail et des objectifs de création de chacun. C'est au travers de votre observation au quotidien que vous créerez des changements concrets dans votre existence.",
  },
];

const faq = [
  {
    q: "Est-ce que je dois croire en la méthode pour qu'elle fonctionne ?",
    a: "Oui. Tout dépend de l'intégration du pourquoi et du comment nous devons agir pour et par nous-même.",
  },
  {
    q: "Est-ce dangereux ?",
    a: "Non. Vous restez conscient et lucide tout au long de la séance. La méthode est basée sur la souveraineté de votre conscience — rien ne peut vous être imposé contre votre gré.",
  },
  {
    q: "Combien de séances sont nécessaires ?",
    a: "C'est très variable selon les personnes et les problématiques. D'autres obtiennent des résultats dès la première séance. D'autres choisissent de faire plusieurs séances pour approfondir le travail en fonction de leur vécu.",
  },
  {
    q: "Peut-on faire la séance en ligne ?",
    a: "Oui, absolument. La méthode HRE fonctionne aussi bien à distance qu'en présentiel. De nombreux clients font leur séance depuis leur domicile, partout dans le monde.",
  },
  {
    q: "C'est quoi le support télépathique ?",
    a: "Un support télépathe, formé à la méthode, entre en hypnose et communique avec votre partie subliminale via une connexion télépathique, guidé par l'opérateur. Il perçoit les informations de votre conscience et les transmet. C'est la particularité fondamentale de la méthode HRE.",
  },
  {
    q: "Les résultats sont-ils permanents ?",
    a: "Certains résultats sont immédiats et permanents. D'autres se manifestent progressivement sur plusieurs jours ou semaines après la séance, le temps que la conscience stabilise et intègre les informations.",
  },
];

export default function LaMethode() {
  return (
    <main>
      {/* Sub-hero */}
      <section className="sub-hero" style={{
        position: 'relative',
        padding: '4.5rem 2rem', overflow: 'hidden',
        minHeight: '270px', display: 'flex', alignItems: 'center',
      }}>
        <VideoBackground videoSrc="/videos/30063.mp4" overlay="rgba(6,3,15,.75)" rotate={180} />
        <div className="sub-hero-inner" style={{ position: 'relative', zIndex: 2, maxWidth: '1100px', margin: '0 auto', width: '100%', transform: 'translateY(1.8rem)',  }}>
          <div className="sub-hero-pill" style={{
            display: 'inline-flex', alignItems: 'center', gap: '.4rem',
            background: 'rgba(196,176,245,.08)', border: '1px solid rgba(196,176,245,.28)',
            borderRadius: '50px', padding: '.35rem 1rem', marginBottom: '1.5rem',
            fontSize: '.67rem', fontWeight: 700, letterSpacing: '.22em',
            textTransform: 'uppercase' as const, color: 'var(--violet)',
          }}>
            ✿ La Méthode
          </div>
          <h1 style={{
            fontFamily: 'Nunito, sans-serif', fontStyle: 'normal',
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700,
            color: 'var(--white)', lineHeight: 1.15, marginBottom: '0.5rem',
            letterSpacing: '-.01em',
          }}>
            L&apos;Hypnose Régressive Ésotérique
          </h1>
          <p style={{
            fontSize: '.95rem', color: 'var(--dim)', lineHeight: 1.8, maxWidth: '560px',
          }}>
            Une approche révolutionnaire fondée par Calogéro Grifasi
          </p>
        </div>
      </section>

      {/* Separator */}
      <div style={{
        height: '2px',
        background: 'linear-gradient(to right, transparent 0%, rgba(196,176,245,.7) 25%, rgba(196,176,245,.7) 75%, transparent 100%)',
      }} />

      {/* Section 1 — Qu'est-ce que l'HRE — fond clair inversé */}
      <section style={{ background: '#FBF0F4', padding: '3rem 2rem 5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontFamily: '"Playfair Display", serif', fontWeight: 500,
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: '#1a0d2e', lineHeight: 1.22,
            }}>
              Qu&apos;est-ce que <em style={{ fontStyle: 'italic', color: 'var(--violet-deep)' }}>l&apos;HRE ?</em>
            </h2>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'stretch',
          }} className="methode-grid">
            {/* Left: description */}
            <div>
              <p style={{ fontSize: '.9rem', color: 'rgba(30,15,50,.72)', lineHeight: 1.88, marginBottom: '1rem' }}>
                L&apos;HRE est une méthode thérapeutique qui permet d&apos;accéder aux zones cachées de l&apos;inconscient profond, au-delà des frontières ordinaires du temps et de l&apos;espace.
              </p>
              <p style={{ fontSize: '.9rem', color: 'rgba(30,15,50,.72)', lineHeight: 1.88, marginBottom: '1rem' }}>
                Fondée en 2012 par <strong style={{ color: 'var(--violet-deep)', fontWeight: 600 }}>Calogéro Grifasi</strong>, chercheur autodidacte passionné par les mécanismes de l&apos;inconscient, la méthode est le fruit d&apos;années d&apos;expérimentation et de recherche.
              </p>
              <p style={{ fontSize: '.9rem', color: 'rgba(30,15,50,.72)', lineHeight: 1.88, marginBottom: '1rem' }}>
                Sa particularité absolue : grâce à un <strong style={{ color: 'var(--violet-deep)', fontWeight: 600 }}>support télépathique</strong>, vous n&apos;entrez pas vous-même en hypnose. Le support télépathe, formé à la méthode, entre en état de conscience modifié à votre place, guidé par l&apos;opérateur, et accède aux informations de votre espace énergétique.
              </p>
              <p style={{ fontSize: '.9rem', color: 'rgba(30,15,50,.72)', lineHeight: 1.88, marginBottom: '1rem' }}>
                La méthode repose sur la <strong style={{ color: 'var(--violet-deep)', fontWeight: 600 }}>souveraineté totale de la conscience</strong> : c&apos;est toujours votre propre subconscient qui effectue les transformations. Aucune entité extérieure n&apos;intervient dans votre espace intérieur.
              </p>
              <p style={{ fontSize: '.9rem', color: 'rgba(30,15,50,.72)', lineHeight: 1.88, marginBottom: '1rem' }}>
                Les résultats varient selon les personnes : certains sont immédiats et visibles dès les heures suivant la séance, d&apos;autres se manifestent progressivement sur plusieurs jours ou semaines.
              </p>
              <p style={{ fontSize: '.9rem', color: 'rgba(30,15,50,.72)', lineHeight: 1.88 }}>
                La méthode ne présente pas de contre-indication. Elle convient à tout le monde, quel que soit votre état de santé, vos croyances ou votre niveau de sensibilité.
              </p>
            </div>

            {/* Right: differentiators + photo */}
            <div style={{ display: 'grid', gridTemplateRows: 'auto auto auto 1fr', gap: '1.1rem', alignSelf: 'stretch' }}>
              {differentiators.map((d, i) => (
                <div key={i} className="card-breath" style={{
                  background: 'linear-gradient(135deg,#fff 0%,#f3eaf8 100%)',
                  border: '1px solid rgba(139,109,200,.28)',
                  borderLeft: '3px solid rgba(100,60,180,.45)',
                  borderRadius: '8px', padding: '1.5rem',
                  display: 'flex', gap: '1.1rem', alignItems: 'flex-start',
                  boxShadow: '0 4px 24px rgba(100,70,160,.1), 0 1px 4px rgba(0,0,0,.05)',
                }}>
                  <div style={{
                    width: '44px', height: '44px', flexShrink: 0,
                    background: 'rgba(139,109,200,.22)', border: '1px solid rgba(139,109,200,.52)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '1.2rem',
                  }}>
                    {d.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '.88rem', fontWeight: 700, color: '#1a0d2e', marginBottom: '.35rem' }}>{d.title}</h4>
                    <p style={{ fontSize: '.8rem', color: 'rgba(30,15,50,.65)', lineHeight: 1.65 }}>{d.desc}</p>
                  </div>
                </div>
              ))}

              {/* Photo-card — 1fr = espace restant jusqu'au bas du dernier paragraphe */}
              <div className="methode-photo-card" style={{
                position: 'relative', minHeight: '80px',
                borderRadius: '8px', overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(100,70,160,.1), 0 1px 4px rgba(0,0,0,.05)',
              }}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/bird-freedom.jpg`}
                  alt="Un oiseau en liberté, symbole de libération des blocages"
                  fill
                  sizes="(max-width: 600px) 100vw, 520px"
                  style={{ objectFit: 'cover', objectPosition: 'center 78%', filter: 'grayscale(85%) sepia(25%) hue-rotate(230deg) contrast(1.12) brightness(1.08)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — Ce que l'HRE peut traiter */}
      <section style={{ background: 'var(--bg-soft)', padding: '3rem 2rem 5rem', position: 'relative' }}>
        <ConstellationBg />
        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '.4rem',
              background: 'rgba(196,176,245,.08)', border: '1px solid rgba(196,176,245,.18)',
              borderRadius: '50px', padding: '.35rem 1rem', marginBottom: '1.25rem',
              fontSize: '.67rem', fontWeight: 700, letterSpacing: '.22em',
              textTransform: 'uppercase' as const, color: 'var(--violet)',
            }}>
              ✿ Pour qui ?
            </div>
            <h2 style={{
              fontFamily: '"Playfair Display", serif', fontWeight: 500,
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: 'var(--white)', lineHeight: 1.22,
            }}>
              Ce que l&apos;HRE peut <em style={{ fontStyle: 'italic', color: 'var(--violet)' }}>transformer</em>
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
                  background: 'rgba(255,197,211,.08)', border: '1px solid var(--border)',
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
      <section style={{ background: 'var(--bg-mid)', padding: '3rem 2rem 5rem' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '.4rem',
              background: 'rgba(196,176,245,.08)', border: '1px solid rgba(196,176,245,.18)',
              borderRadius: '50px', padding: '.35rem 1rem', marginBottom: '1.25rem',
              fontSize: '.67rem', fontWeight: 700, letterSpacing: '.22em',
              textTransform: 'uppercase' as const, color: 'var(--violet)',
            }}>
              ✿ Déroulement
            </div>
            <h2 style={{
              fontFamily: '"Playfair Display", serif', fontWeight: 500,
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: 'var(--white)', lineHeight: 1.22,
            }}>
              Comment se déroule <em style={{ fontStyle: 'italic', color: 'var(--violet)' }}>une séance ?</em>
            </h2>
          </div>

          <StepsPrism steps={steps} />
        </div>
      </section>

      {/* Section 4 — FAQ */}
      <section style={{ background: 'var(--bg-soft)', padding: '3rem 2rem 5rem', position: 'relative' }}>
        <ConstellationBg />
        <div style={{ maxWidth: '860px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '.4rem',
              background: 'rgba(196,176,245,.08)', border: '1px solid rgba(196,176,245,.18)',
              borderRadius: '50px', padding: '.35rem 1rem', marginBottom: '1.25rem',
              fontSize: '.67rem', fontWeight: 700, letterSpacing: '.22em',
              textTransform: 'uppercase' as const, color: 'var(--violet)',
            }}>
              ✿ FAQ
            </div>
            <h2 style={{
              fontFamily: '"Playfair Display", serif', fontWeight: 500,
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: 'var(--white)', lineHeight: 1.22,
            }}>
              Questions <em style={{ fontStyle: 'italic', color: 'var(--violet)' }}>fréquentes</em>
            </h2>
          </div>
          <FaqAccordion items={faq} />
        </div>
      </section>

      {/* CTA — fond vidéo fusionné avec footer */}
      <section style={{ position: 'relative', background: 'transparent', padding: '3rem 2rem 0', textAlign: 'center' }}>
        <VideoBackground videoSrc="/videos/30063.mp4" overlay="rgba(6,3,15,.82)" bottomExtend={350} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
            fontSize: '1.8rem', color: 'var(--white)',
            marginBottom: '1rem',
          }}>
            Prêt(e) à découvrir la méthode ?
          </h2>
          <p style={{ color: 'var(--dim)', fontSize: '.88rem', lineHeight: 1.75, maxWidth: '480px', margin: '0 auto 1.75rem' }}>
            Réservez votre séance et commencez votre exploration dès maintenant.
          </p>
          <Link href="/reserver" className="btn-cta-rose" style={{
            display: 'inline-flex', alignItems: 'center', gap: '.6rem',
            background: 'linear-gradient(135deg, #A03460, #6A1030)',
            color: 'white', textDecoration: 'none',
            fontSize: '.82rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase' as const,
            padding: '1rem 2.4rem', borderRadius: '50px',
            boxShadow: '0 8px 36px rgba(255,197,211,.38)',
          }}>
            ✿ Réserver une séance
          </Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 767px) {
          .methode-grid { grid-template-columns: 1fr !important; }
          .bienfaits-grid { grid-template-columns: repeat(2,minmax(0,1fr)) !important; }
          .bienfaits-grid h4, .bienfaits-grid p { hyphens: auto; overflow-wrap: break-word; }
          .methode-photo-card { height: 200px !important; min-height: 200px !important; }
        }
        @media (max-width: 480px) {
          .bienfaits-grid { gap: .85rem !important; }
          .bienfaits-grid .card-breath { padding: 1.5rem 1rem !important; }
          .bienfaits-grid h4 { font-size: .8rem !important; }
        }
        @media (min-width: 640px) and (max-width: 900px) {
          .bienfaits-grid { grid-template-columns: repeat(2,minmax(0,1fr)) !important; }
        }
      `}</style>
    </main>
  );
}

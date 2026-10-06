import ScrollReveal from '@/components/animations/ScrollReveal';

const avis = [
  {
    stars: 5,
    text: 'Une expérience profonde et transformatrice. Après des années de thérapies classiques, l\'HRE avec Ama a libéré quelque chose que je n\'arrivais pas à atteindre. Je me sens légère.',
    author: 'Sophie M.',
    tag: 'Schémas répétitifs',
  },
  {
    stars: 5,
    text: 'Je suis venu avec beaucoup de scepticisme. Mais la séance a été bouleversante de précision. Ama est d\'une présence et d\'une bienveillance remarquables.',
    author: 'Thomas D.',
    tag: 'Confiance en soi',
  },
  {
    stars: 5,
    text: 'En quelques heures, j\'ai compris l\'origine de ma phobie qui me hantait depuis l\'enfance. C\'est comme si un chapitre douloureux se fermait enfin.',
    author: 'Marie-Claire L.',
    tag: 'Phobie profonde',
  },
];

export default function AvisSection() {
  return (
    <section id="avis" style={{ position: 'relative', background: 'var(--bg)', padding: '6rem 2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <ScrollReveal direction="up">
          <div style={{ textAlign: 'center', marginBottom: '.75rem', display: 'flex', justifyContent: 'center' }}>
            <div className="eyebrow-pill">✿ Témoignages</div>
          </div>
          <div className="sep-line" style={{ maxWidth: '160px', margin: '0 auto 1.5rem' }}>
            <span style={{ color: 'var(--rose)', fontSize: '.65rem' }}>★</span>
          </div>
          <h2 className="section-h2">Ce qu&apos;ils ont <em>vécu</em></h2>
          <p className="section-lead">
            Des transformations réelles, racontées par ceux qui ont osé plonger.
          </p>
        </ScrollReveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }} className="avis-grid">
          {avis.map((a, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 100}>
              <div className="card-float" style={{
                background: 'rgba(12,6,32,.8)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '1.75rem',
              }}>
                <div style={{ display: 'flex', gap: '2px', marginBottom: '1rem' }}>
                  {Array.from({ length: a.stars }).map((_, si) => (
                    <span key={si} style={{ color: 'var(--gold)', fontSize: '.85rem' }}>★</span>
                  ))}
                </div>
                <p style={{
                  fontSize: '.85rem', fontStyle: 'italic', color: 'var(--dim)',
                  lineHeight: 1.8, marginBottom: '1.25rem',
                }}>
                  &ldquo;{a.text}&rdquo;
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--white)' }}>{a.author}</span>
                  <span style={{
                    background: 'rgba(200,88,122,.08)', border: '1px solid rgba(200,88,122,.15)',
                    color: 'var(--rose)', fontSize: '.6rem', letterSpacing: '.1em',
                    textTransform: 'uppercase', padding: '.2rem .6rem', borderRadius: '50px',
                  }}>{a.tag}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .avis-grid { grid-template-columns: 1fr !important; } }
        @media (min-width: 640px) and (max-width: 900px) { .avis-grid { grid-template-columns: repeat(2,1fr) !important; } }
      `}</style>
    </section>
  );
}

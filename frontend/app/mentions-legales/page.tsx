import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import VideoBackground from '@/components/animations/VideoBackground';

export const metadata: Metadata = {
  title: 'Mentions légales & CGV — Ama · Hypnose HRE',
  description: 'Mentions légales, politique de confidentialité et conditions générales de vente du cabinet Ama — Hypnose Régressive Ésotérique.',
};

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <div style={{ marginBottom: '2.5rem' }}>
    <h2 style={{
      fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
      fontSize: '1.25rem', color: 'var(--white)',
      borderBottom: '1px solid rgba(200,88,122,.2)',
      paddingBottom: '.65rem', marginBottom: '1.25rem',
    }}>
      {title}
    </h2>
    {children}
  </div>
);

const P = ({ children }: { children: ReactNode }) => (
  <p style={{ fontSize: '.86rem', color: 'var(--dim)', lineHeight: 1.85, marginBottom: '.75rem' }}>
    {children}
  </p>
);

const Li = ({ children }: { children: ReactNode }) => (
  <li style={{ fontSize: '.86rem', color: 'var(--dim)', lineHeight: 1.85, marginBottom: '.35rem' }}>
    {children}
  </li>
);

export default function MentionsLegales() {
  return (
    <main>
      {/* Sub-hero */}
      <section style={{
        position: 'relative',
        padding: '6rem 2rem', textAlign: 'center', overflow: 'hidden',
        minHeight: '360px', display: 'flex', alignItems: 'center',
      }}>
        <VideoBackground videoSrc="https://assets.mixkit.co/videos/30063/30063-1080.mp4" overlay="rgba(6,3,15,.80)" />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '700px', margin: '0 auto', width: '100%' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '.4rem',
            background: 'rgba(200,88,122,.08)', border: '1px solid rgba(200,88,122,.22)',
            borderRadius: '50px', padding: '.35rem 1rem', marginBottom: '1.5rem',
            fontSize: '.67rem', fontWeight: 700, letterSpacing: '.22em',
            textTransform: 'uppercase' as const, color: 'var(--rose)',
          }}>
            ✿ Informations légales
          </div>
          <h1 style={{
            fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 400,
            color: 'var(--white)', lineHeight: 1.2,
          }}>
            Mentions légales &amp; CGV
          </h1>
        </div>
      </section>

      {/* Content */}
      <section style={{ background: 'var(--bg-mid)', padding: '5rem 2rem' }}>
        <div style={{
          maxWidth: '820px', margin: '0 auto',
          background: 'rgba(18,8,48,.5)', border: '1px solid var(--border)',
          borderRadius: '10px', padding: 'clamp(2rem,5vw,3.5rem)',
        }}>

          <p style={{ fontSize: '.78rem', color: 'rgba(253,240,247,.3)', letterSpacing: '.1em', marginBottom: '2.5rem' }}>
            Dernière mise à jour : octobre 2026
          </p>

          {/* ── I. Éditeur ── */}
          <Section title="I. Éditeur du site">
            <P>
              Le présent site est édité par :
            </P>
            <ul style={{ listStyle: 'none', padding: '0 0 0 .5rem', marginBottom: '.75rem' }}>
              <Li><strong style={{ color: 'var(--white)' }}>Nom :</strong> Anne-Marie Blanc</Li>
              <Li><strong style={{ color: 'var(--white)' }}>Nom professionnel :</strong> Ama</Li>
              <Li><strong style={{ color: 'var(--white)' }}>Titre :</strong> Psychologue et praticienne certifiée en Hypnose Régressive Ésotérique (HRE)</Li>
              <Li><strong style={{ color: 'var(--white)' }}>Numéro RPPS :</strong> 10009613695</Li>
              <Li><strong style={{ color: 'var(--white)' }}>Adresse :</strong> 134 Bis Rue de la Marne, 33500 Libourne, France</Li>
              <Li><strong style={{ color: 'var(--white)' }}>Téléphone :</strong> +33 6 67 29 90 96</Li>
              <Li><strong style={{ color: 'var(--white)' }}>Email :</strong> anne.marie.blanc@gmail.com</Li>
            </ul>
            <P>
              Anne-Marie Blanc exerce en tant que praticienne libérale. Les séances sont proposées en présentiel à Libourne ainsi qu&apos;à distance pour la France entière et l&apos;international.
            </P>
          </Section>

          {/* ── II. Hébergement ── */}
          <Section title="II. Hébergement">
            <P>
              Ce site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.
              Pour toute question relative à l&apos;hébergement : <a href="https://vercel.com" style={{ color: 'var(--rose)', textDecoration: 'none' }}>vercel.com</a>
            </P>
          </Section>

          {/* ── III. Propriété intellectuelle ── */}
          <Section title="III. Propriété intellectuelle">
            <P>
              L&apos;ensemble des contenus présents sur ce site (textes, photographies, vidéos, graphismes, logos) sont la propriété exclusive d&apos;Anne-Marie Blanc, sauf mention contraire.
            </P>
            <P>
              Toute reproduction, représentation, modification, publication ou transmission, totale ou partielle, du site ou de l&apos;un de ses éléments, sans autorisation écrite préalable, est interdite et constitue une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
            </P>
          </Section>

          {/* ── IV. Données personnelles (RGPD) ── */}
          <Section title="IV. Protection des données personnelles (RGPD)">
            <P>
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez des droits suivants sur vos données :
            </P>
            <ul style={{ listStyle: 'none', padding: '0 0 0 .5rem', marginBottom: '.75rem' }}>
              <Li>Droit d&apos;accès, de rectification et d&apos;effacement</Li>
              <Li>Droit à la limitation et à la portabilité</Li>
              <Li>Droit d&apos;opposition au traitement</Li>
            </ul>
            <P>
              Les données collectées via le formulaire de contact (nom, adresse e-mail, message) sont utilisées exclusivement aux fins de vous répondre. Elles ne sont ni vendues, ni cédées à des tiers.
            </P>
            <P>
              Les données relatives aux séances (nature des problématiques abordées) sont strictement confidentielles et couvertes par le secret professionnel. Elles sont conservées de manière sécurisée et ne sont jamais communiquées sans votre consentement explicite.
            </P>
            <P>
              Pour exercer vos droits ou pour toute question relative à vos données : <a href="mailto:anne.marie.blanc@gmail.com" style={{ color: 'var(--rose)', textDecoration: 'none' }}>anne.marie.blanc@gmail.com</a>
            </P>
            <P>
              Vous pouvez également introduire une réclamation auprès de la CNIL (Commission Nationale de l&apos;Informatique et des Libertés) : <a href="https://www.cnil.fr" style={{ color: 'var(--rose)', textDecoration: 'none' }}>www.cnil.fr</a>
            </P>
          </Section>

          {/* ── V. Cookies ── */}
          <Section title="V. Cookies">
            <P>
              Ce site n&apos;utilise pas de cookies de traçage ou de publicité. Des cookies techniques strictement nécessaires au bon fonctionnement du site peuvent être utilisés. Aucune donnée de navigation n&apos;est partagée avec des tiers à des fins publicitaires.
            </P>
          </Section>

          {/* ── VI. Conditions Générales de Vente ── */}
          <Section title="VI. Conditions générales de vente">

            <h3 style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--white)', marginBottom: '.65rem', marginTop: '1.25rem' }}>
              Objet et champ d&apos;application
            </h3>
            <P>
              Les présentes Conditions Générales de Vente (CGV) régissent les relations entre Anne-Marie Blanc, praticienne en Hypnose Régressive Ésotérique (méthode Calogéro Grifasi), et toute personne physique souhaitant bénéficier de ses prestations (ci-après le « Client »).
            </P>

            <h3 style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--white)', marginBottom: '.65rem', marginTop: '1.25rem' }}>
              Description des prestations
            </h3>
            <P>
              Les prestations proposées comprennent :
            </P>
            <ul style={{ listStyle: 'none', padding: '0 0 0 .5rem', marginBottom: '.75rem' }}>
              <Li>Consultation préalable gratuite de 15 minutes (par téléphone ou visioconférence)</Li>
              <Li>Séance d&apos;Hypnose Régressive Ésotérique individuelle (en présentiel ou à distance)</Li>
              <Li>Suivi post-séance inclus (48 à 72 heures après la séance)</Li>
            </ul>
            <P>
              La méthode HRE n&apos;est ni une consultation médicale ni une psychothérapie au sens réglementaire. Elle constitue un accompagnement complémentaire et ne remplace en aucun cas un traitement médical ou psychiatrique en cours.
            </P>

            <h3 style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--white)', marginBottom: '.65rem', marginTop: '1.25rem' }}>
              Tarifs
            </h3>
            <P>
              Les tarifs en vigueur sont communiqués lors de la consultation préalable gratuite. Ils peuvent être consultés sur demande à l&apos;adresse : <a href="mailto:anne.marie.blanc@gmail.com" style={{ color: 'var(--rose)', textDecoration: 'none' }}>anne.marie.blanc@gmail.com</a>
            </P>
            <P>
              Conformément à l&apos;article 293 B du Code général des impôts, TVA non applicable.
            </P>

            <h3 style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--white)', marginBottom: '.65rem', marginTop: '1.25rem' }}>
              Modalités de paiement
            </h3>
            <P>
              Le règlement s&apos;effectue par virement bancaire ou via les modes de paiement précisés lors de la réservation. Le paiement intégral est dû avant la séance, sauf accord contraire.
            </P>

            <h3 style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--white)', marginBottom: '.65rem', marginTop: '1.25rem' }}>
              Annulation et report
            </h3>
            <P>
              Toute annulation doit être notifiée par e-mail ou par téléphone :
            </P>
            <ul style={{ listStyle: 'none', padding: '0 0 0 .5rem', marginBottom: '.75rem' }}>
              <Li>Plus de 48h avant la séance : remboursement intégral ou report sans frais</Li>
              <Li>Entre 24h et 48h avant : report possible une fois sans frais supplémentaires</Li>
              <Li>Moins de 24h avant ou absence sans préavis : la séance est due en totalité</Li>
            </ul>
            <P>
              En cas d&apos;annulation par la praticienne, le Client sera remboursé intégralement ou pourra reporter la séance à une date de son choix.
            </P>

            <h3 style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--white)', marginBottom: '.65rem', marginTop: '1.25rem' }}>
              Droit de rétractation
            </h3>
            <P>
              Conformément à l&apos;article L.221-18 du Code de la consommation, le Client dispose d&apos;un délai de 14 jours à compter de la conclusion du contrat pour exercer son droit de rétractation, sauf si la prestation a été réalisée avec son accord exprès avant l&apos;expiration de ce délai.
            </P>

            <h3 style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--white)', marginBottom: '.65rem', marginTop: '1.25rem' }}>
              Responsabilité
            </h3>
            <P>
              Les séances d&apos;HRE s&apos;inscrivent dans un cadre de bien-être et de développement personnel. Anne-Marie Blanc ne peut garantir des résultats spécifiques, les effets des séances variant d&apos;une personne à l&apos;autre. En aucun cas la praticienne ne peut être tenue responsable des décisions personnelles prises par le Client à la suite d&apos;une séance.
            </P>
            <P>
              Le Client reconnaît avoir pris connaissance de la méthode et ne pas présenter de contre-indications psychiatriques sévères (psychose, schizophrénie, bipolarité non stabilisée). En cas de doute, l&apos;avis préalable d&apos;un médecin est recommandé.
            </P>

            <h3 style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--white)', marginBottom: '.65rem', marginTop: '1.25rem' }}>
              Confidentialité des séances
            </h3>
            <P>
              L&apos;ensemble des informations partagées lors des séances est traité avec la plus stricte confidentialité. Anne-Marie Blanc est tenue au secret professionnel.
            </P>

            <h3 style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--white)', marginBottom: '.65rem', marginTop: '1.25rem' }}>
              Droit applicable et juridiction compétente
            </h3>
            <P>
              Les présentes CGV sont soumises au droit français. En cas de litige, les parties rechercheront une solution amiable avant tout recours judiciaire. À défaut, le tribunal compétent sera celui du ressort du domicile professionnel d&apos;Anne-Marie Blanc.
            </P>
          </Section>

          {/* ── VII. Contact ── */}
          <Section title="VII. Contact">
            <P>
              Pour toute question relative aux présentes mentions légales ou conditions générales de vente :
            </P>
            <ul style={{ listStyle: 'none', padding: '0 0 0 .5rem' }}>
              <Li>Par e-mail : <a href="mailto:anne.marie.blanc@gmail.com" style={{ color: 'var(--rose)', textDecoration: 'none' }}>anne.marie.blanc@gmail.com</a></Li>
              <Li>Par téléphone : +33 6 67 29 90 96</Li>
              <Li>Par courrier : Anne-Marie Blanc, 134 Bis Rue de la Marne, 33500 Libourne</Li>
            </ul>
          </Section>

        </div>
      </section>
    </main>
  );
}

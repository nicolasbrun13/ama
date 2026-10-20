'use client';
import type { AvailabilityStatus } from '@/lib/useTakenDates';

/** Message affiché sous un calendrier tant que les créneaux pris ne sont pas chargés */
export default function AvailabilityNotice({ status, onRetry }: { status: AvailabilityStatus; onRetry: () => void }) {
  if (status === 'ready') return null;

  if (status === 'loading') {
    return (
      <p role="status" style={{ fontSize: '.7rem', color: 'rgba(253,240,247,.45)', textAlign: 'center', marginTop: '.6rem' }}>
        Chargement des disponibilités…
      </p>
    );
  }

  return (
    <div role="alert" style={{
      marginTop: '.75rem', padding: '.65rem .9rem', borderRadius: '6px',
      background: 'rgba(200,88,122,.08)', border: '1px solid rgba(200,88,122,.35)',
      fontSize: '.75rem', color: 'var(--white)', textAlign: 'center', lineHeight: 1.6,
    }}>
      Impossible de charger les disponibilités, réessayez.
      <button type="button" onClick={onRetry} style={{
        marginLeft: '.6rem', background: 'rgba(255,197,211,.12)', border: '1px solid rgba(255,197,211,.35)',
        color: 'var(--rose)', borderRadius: '50px', padding: '.2rem .8rem', cursor: 'pointer',
        fontSize: '.7rem', fontWeight: 700, fontFamily: 'Nunito, sans-serif',
      }}>
        Réessayer
      </button>
    </div>
  );
}

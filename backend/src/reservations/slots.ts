/**
 * Source de vérité serveur pour les créneaux disponibles.
 * Doit rester en sync avec frontend/lib/availableDates.ts.
 *
 * Règles : uniquement les vendredis à 13:30,
 * à partir du 2027-02-01, hors vacances scolaires zone A.
 */

export const SLOT_TIME = '13:30';
export const OPEN_ISO  = '2027-02-01';

/** Plages de vacances scolaires zone A [début_inclus, fin_inclus] */
export const HOLIDAYS_ZONE_A: [string, string][] = [
  ['2026-10-17', '2026-11-02'],
  ['2026-12-19', '2027-01-04'],
  ['2027-02-13', '2027-03-01'],
  ['2027-04-10', '2027-04-26'],
  ['2027-05-05', '2027-05-10'],
  ['2027-07-03', '2027-08-31'],
  ['2027-10-23', '2027-11-08'],
  ['2027-12-18', '2028-01-03'],
  ['2028-02-19', '2028-03-06'],
  ['2028-04-22', '2028-05-09'],
  ['2028-05-24', '2028-05-29'],
  ['2028-07-04', '2028-08-31'],
];

function isHolidayZoneA(iso: string): boolean {
  return HOLIDAYS_ZONE_A.some(([s, e]) => iso >= s && iso <= e);
}

/** Retourne true si la date est un vendredi disponible (hors passé, hors vacances) */
export function isValidSlotDate(iso: string): boolean {
  if (iso < OPEN_ISO) return false;
  const d = new Date(iso + 'T12:00:00Z');
  if (d.getUTCDay() !== 5) return false; // 5 = vendredi
  if (isHolidayZoneA(iso)) return false;
  return true;
}

/**
 * Retourne true si date+time correspondent à un créneau réel proposé
 * ET que la date n'est pas dans le passé (heure Paris).
 */
export function isValidSlot(date: string, time: string): boolean {
  if (time !== SLOT_TIME) return false;
  if (!isValidSlotDate(date)) return false;
  // Créneau à 13:30 heure Paris — refuser si déjà passé
  const slotUtc = new Date(`${date}T${time}:00+02:00`); // heure d'été; conservatif
  if (slotUtc < new Date()) return false;
  return true;
}

/** Retourne "YYYY-MM-DD" pour aujourd'hui + offsetDays, en heure de Paris,
 *  quel que soit le fuseau du process (TZ du conteneur). */
export function parisDateStr(offsetDays = 0, now: Date = new Date()): string {
  const todayParis = now.toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' });
  const d = new Date(`${todayParis}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

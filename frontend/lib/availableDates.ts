/**
 * Règles de disponibilité des séances Ama · Hypnose HRE
 * - Uniquement les vendredis à 13h30
 * - À partir du 1er février 2027
 * - Hors vacances scolaires zone A (France)
 *
 * Sources : vacances-scolaires-gouv.com / education.gouv.fr
 * Mis à jour : octobre 2026
 */

/** Date d'ouverture des réservations */
export const OPEN_ISO = '2027-02-01';
export const OPEN_LABEL = '1er février 2027';

/**
 * Plages de vacances scolaires zone A
 * Format : [début_inclus, fin_inclus]
 * Les deux bornes sont des jours de vacances.
 * La rentrée a lieu le lendemain de la date de fin.
 */
export const HOLIDAYS_ZONE_A: [string, string][] = [
  // ── 2026-2027 ──────────────────────────────────────────────
  ['2026-10-17', '2026-11-02'], // Toussaint
  ['2026-12-19', '2027-01-04'], // Noël
  ['2027-02-13', '2027-03-01'], // Hiver Zone A
  ['2027-04-10', '2027-04-26'], // Printemps Zone A
  ['2027-05-05', '2027-05-10'], // Pont de l'Ascension
  ['2027-07-03', '2027-08-31'], // Été
  // ── 2027-2028 ──────────────────────────────────────────────
  ['2027-10-23', '2027-11-08'], // Toussaint
  ['2027-12-18', '2028-01-03'], // Noël
  ['2028-02-19', '2028-03-06'], // Hiver Zone A
  ['2028-04-22', '2028-05-09'], // Printemps Zone A
  ['2028-05-24', '2028-05-29'], // Pont de l'Ascension
  ['2028-07-04', '2028-08-31'], // Été
];

/** Vérifie si un jour (YYYY-MM-DD) tombe dans les vacances Zone A */
export function isHolidayZoneA(iso: string): boolean {
  return HOLIDAYS_ZONE_A.some(([start, end]) => iso >= start && iso <= end);
}

/**
 * Renvoie true si la date ISO donnée est réservable :
 * - Vendredi
 * - Après ou égal à OPEN_ISO
 * - Hors vacances Zone A
 */
export function isAvailableDate(iso: string): boolean {
  if (iso < OPEN_ISO) return false;
  const d = new Date(iso + 'T12:00:00');
  if (d.getDay() !== 5) return false;
  if (isHolidayZoneA(iso)) return false;
  return true;
}

/**
 * Retourne l'ISO du prochain vendredi disponible à partir de fromISO
 * (ou à partir de OPEN_ISO si fromISO est antérieur).
 */
export function nextValidFriday(fromISO: string): string {
  let d = new Date((fromISO || OPEN_ISO) + 'T12:00:00');
  const openD = new Date(OPEN_ISO + 'T12:00:00');
  if (d < openD) d = new Date(OPEN_ISO + 'T12:00:00');
  // Avancer jusqu'au vendredi suivant (ou rester si déjà vendredi)
  const day = d.getDay();
  if (day !== 5) {
    d.setDate(d.getDate() + ((5 - day + 7) % 7 || 7));
  }
  // Sauter les vendredis en vacances (max 2 ans en avant)
  for (let i = 0; i < 104; i++) {
    const iso = d.toISOString().split('T')[0];
    if (isAvailableDate(iso)) return iso;
    d.setDate(d.getDate() + 7);
  }
  return OPEN_ISO;
}

/**
 * Renvoie un message d'erreur lisible si la date n'est pas disponible,
 * ou null si elle est valide.
 */
export function getDateError(iso: string): string | null {
  if (!iso) return null;
  if (iso < OPEN_ISO) {
    return `Les réservations ouvrent le ${OPEN_LABEL}.`;
  }
  const d = new Date(iso + 'T12:00:00');
  if (d.getDay() !== 5) {
    return 'Seuls les vendredis à 13h30 sont disponibles.';
  }
  if (isHolidayZoneA(iso)) {
    return 'Ce vendredi tombe pendant les vacances scolaires (zone A).';
  }
  return null;
}

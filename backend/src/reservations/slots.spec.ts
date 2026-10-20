import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { HOLIDAYS_ZONE_A, OPEN_ISO, SLOT_TIME, isValidSlot, parisDateStr } from './slots';

describe('isValidSlot', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2027-01-15T10:00:00Z'));
  });
  afterEach(() => vi.useRealTimers());

  it('accepte un vendredi 13:30 ouvert', () => {
    expect(isValidSlot('2027-02-05', '13:30')).toBe(true);
  });

  it('refuse un jeudi', () => {
    expect(isValidSlot('2027-02-04', '13:30')).toBe(false);
  });

  it('refuse un autre horaire que 13:30', () => {
    expect(isValidSlot('2027-02-05', '14:00')).toBe(false);
  });

  it('refuse un vendredi pendant les vacances zone A', () => {
    expect(isValidSlot('2027-02-19', '13:30')).toBe(false);
  });

  it("refuse un vendredi avant la date d'ouverture", () => {
    expect(isValidSlot('2027-01-29', '13:30')).toBe(false);
  });

  it('refuse un créneau passé', () => {
    vi.setSystemTime(new Date('2027-03-06T10:00:00Z'));
    expect(isValidSlot('2027-03-05', '13:30')).toBe(false);
    expect(isValidSlot('2027-03-12', '13:30')).toBe(true);
  });

  it('refuse une date de 2020', () => {
    expect(isValidSlot('2020-01-03', '13:30')).toBe(false);
  });
});

describe('parisDateStr', () => {
  afterEach(() => vi.useRealTimers());

  it('à 00:30 heure de Paris (hiver), "aujourd\'hui" est déjà le nouveau jour', () => {
    // 2027-03-11T23:30Z = 2027-03-12 00:30 à Paris (UTC+1)
    const now = new Date('2027-03-11T23:30:00Z');
    expect(parisDateStr(0, now)).toBe('2027-03-12');
    expect(parisDateStr(1, now)).toBe('2027-03-13');
    expect(parisDateStr(-1, now)).toBe('2027-03-11');
  });

  it('à 00:30 heure de Paris (été), bon jour aussi', () => {
    // 2027-06-10T22:30Z = 2027-06-11 00:30 à Paris (UTC+2)
    const now = new Date('2027-06-10T22:30:00Z');
    expect(parisDateStr(1, now)).toBe('2027-06-12');
  });

  it('passe correctement le changement de mois', () => {
    expect(parisDateStr(1, new Date('2027-01-31T10:00:00Z'))).toBe('2027-02-01');
  });
});

// Les règles de créneaux sont dupliquées côté front (frontend/lib/availableDates.ts).
// Ce test échoue si les deux copies divergent.
const FRONT_LIB = resolve(__dirname, '../../../frontend/lib/availableDates.ts');

describe.skipIf(!existsSync(FRONT_LIB))('sync backend / frontend des règles de créneaux', () => {
  it('même liste de vacances, même OPEN_ISO, même horaire', async () => {
    const front = await import(FRONT_LIB);
    expect(front.HOLIDAYS_ZONE_A).toEqual(HOLIDAYS_ZONE_A);
    expect(front.OPEN_ISO).toBe(OPEN_ISO);
    expect(front.SLOT_TIME).toBe(SLOT_TIME);
    expect(SLOT_TIME).toBe('13:30');
  });
});

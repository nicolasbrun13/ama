import { ThrottlerOptions } from '@nestjs/throttler';

/** Limites globales par IP (POST paiement, etc.) */
export const THROTTLERS: ThrottlerOptions[] = [
  { name: 'short', ttl: 10_000, limit: 5 },  // 5 req max par IP sur 10 s
  { name: 'long',  ttl: 60_000, limit: 20 }, // 20 req max par IP par minute
];

/** Lecture des créneaux pris : appelée à chaque changement de mois du calendrier */
export const AVAILABILITY_THROTTLE = {
  short: { ttl: 10_000, limit: 20 },
  long:  { ttl: 60_000, limit: 60 },
};

/**
 * Email simple et sûr pour un en-tête (replyTo) : une seule adresse,
 * pas d'espace, virgule, point-virgule, chevron, guillemet, parenthèse, antislash ni retour ligne.
 */
const SAFE_EMAIL = /^[^\s@,;<>"'()\\]+@[^\s@,;<>"'()\\]+\.[^\s@,;<>"'()\\]{2,}$/;

export function isSafeEmail(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 254 && SAFE_EMAIL.test(value);
}

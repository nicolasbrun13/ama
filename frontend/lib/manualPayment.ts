/** Mode paiement manuel : lien paypal.me tant que les clés API PayPal ne sont pas là.
 *  Variables NEXT_PUBLIC_* figées au build. */
export const PAYPAL_ME_URL = (process.env.NEXT_PUBLIC_PAYPAL_ME_URL ?? '').replace(/\/+$/, '');
const CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '';

export const MANUAL_PAYMENT =
  (!CLIENT_ID || CLIENT_ID.startsWith('[')) && PAYPAL_ME_URL.startsWith('https://');

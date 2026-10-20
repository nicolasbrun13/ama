'use client';
import { useRef } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

export type ReservationPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  message?: string;
};

interface Props {
  reservationData: ReservationPayload;
  onSuccess: (captureID: string) => void;
  /** slotTaken : le serveur a répondu 409 (créneau pris) → le parent recharge les disponibilités */
  onError: (msg: string, opts?: { slotTaken?: boolean }) => void;
}

/** Erreur serveur avec son statut HTTP et son vrai message */
class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function postJson<T>(url: string, body: unknown, fallbackMsg: string): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({})) as T & { message?: string | string[] };
  if (!res.ok) {
    const msg = Array.isArray(data.message) ? data.message.join(' ') : data.message;
    throw new ApiError(msg || fallbackMsg, res.status);
  }
  return data;
}

export default function PaypalButton({ reservationData, onSuccess, onError }: Props) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '';
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  // Dernière erreur serveur : le SDK PayPal ne transmet pas toujours notre message à onError
  const lastError = useRef<ApiError | null>(null);

  if (!clientId || clientId.startsWith('[')) {
    return (
      <div style={{
        background: 'rgba(255,197,211,.07)', border: '1px solid rgba(255,197,211,.2)',
        borderRadius: '8px', padding: '1.5rem', textAlign: 'center',
        fontSize: '.82rem', color: 'rgba(253,240,247,.5)', lineHeight: 1.7,
      }}>
        Le paiement PayPal n&apos;est pas encore activé.<br />
        Contactez-nous directement pour finaliser votre réservation.
      </div>
    );
  }

  // Toujours via les routes Next (même origine) : elles transmettent l'IP réelle au backend
  const createEndpoint  = `${basePath}/api/payment/create-order`;
  const captureEndpoint = `${basePath}/api/payment/capture-order`;

  const report = (err: unknown, fallback: string) => {
    const apiErr = err instanceof ApiError ? err : lastError.current;
    lastError.current = null;
    if (apiErr) onError(apiErr.message, { slotTaken: apiErr.status === 409 });
    else onError(fallback);
  };

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: 'EUR',
        locale: 'fr_FR',
        intent: 'capture',
      }}
    >
      <PayPalButtons
        style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay', height: 48 }}
        createOrder={async () => {
          lastError.current = null;
          try {
            const data = await postJson<{ orderID: string }>(
              createEndpoint, { reservationData }, 'Erreur lors de la création du paiement',
            );
            return data.orderID;
          } catch (err) {
            if (err instanceof ApiError) lastError.current = err;
            throw err; // obligatoire pour que PayPal annule le paiement → onError
          }
        }}
        onApprove={async (data) => {
          // Erreurs gérées ici (et pas relancées) pour afficher le vrai message serveur,
          // ex. 409 « … Votre paiement a été remboursé. »
          try {
            const result = await postJson<{ captureID?: string }>(
              captureEndpoint,
              { orderID: data.orderID, reservationData },
              'Erreur lors de la validation du paiement',
            );
            onSuccess(result.captureID ?? '');
          } catch (err) {
            report(err, 'Erreur lors de la validation du paiement. Contactez-nous si vous avez été débité.');
          }
        }}
        onError={(err) => report(err, 'Le paiement a échoué. Veuillez réessayer.')}
        onCancel={() => onError('Le paiement a été annulé.')}
      />
    </PayPalScriptProvider>
  );
}

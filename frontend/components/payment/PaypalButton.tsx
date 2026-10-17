'use client';
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
  onError: (msg: string) => void;
}

export default function PaypalButton({ reservationData, onSuccess, onError }: Props) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '';
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? '';
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

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

  const createEndpoint = apiBase
    ? `${apiBase}/api/payment/create-order`
    : `${basePath}/api/payment/create-order`;

  const captureEndpoint = apiBase
    ? `${apiBase}/api/payment/capture-order`
    : `${basePath}/api/payment/capture-order`;

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
          const res = await fetch(createEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reservationData }),
          });
          const data = await res.json() as { orderID?: string; message?: string };
          if (!res.ok) throw new Error(data.message ?? 'Erreur lors de la création du paiement');
          return data.orderID!;
        }}
        onApprove={async (data) => {
          const res = await fetch(captureEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderID: data.orderID, reservationData }),
          });
          const result = await res.json() as { captureID?: string; success?: boolean; message?: string };
          if (!res.ok) throw new Error(result.message ?? 'Erreur lors de la capture du paiement');
          onSuccess(result.captureID ?? '');
        }}
        onError={() => onError('Le paiement a échoué. Veuillez réessayer.')}
        onCancel={() => onError('Le paiement a été annulé.')}
      />
    </PayPalScriptProvider>
  );
}

import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreateReservationDto } from '../reservations/dto/create-reservation.dto';
import { EmailService } from '../email/email.service';
import { ReservationsService } from '../reservations/reservations.service';

const PAYPAL_API = {
  sandbox: 'https://api-m.sandbox.paypal.com',
  live:    'https://api-m.paypal.com',
};

const PRICE_EUR  = '150.00';
const CURRENCY   = 'EUR';
const ITEM_NAME  = 'Séance HRE — Hypnose Régressive Ésotérique';

@Injectable()
export class PaymentService {
  private get baseUrl(): string {
    return process.env.PAYPAL_MODE === 'live'
      ? PAYPAL_API.live
      : PAYPAL_API.sandbox;
  }

  /** Récupère un access token PayPal via OAuth2 client_credentials */
  private async getAccessToken(): Promise<string> {
    const clientId     = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new InternalServerErrorException('PayPal credentials not configured.');
    }

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const res = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method:  'POST',
      headers: {
        Authorization:  `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!res.ok) {
      throw new InternalServerErrorException('PayPal OAuth failed.');
    }

    const data = await res.json() as { access_token: string };
    return data.access_token;
  }

  /** Crée une commande PayPal de 150 € (Orders API v2) */
  async createOrder(reservationData: Partial<CreateReservationDto>): Promise<{ orderID: string }> {
    const token = await this.getAccessToken();

    const body = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: CURRENCY,
            value:         PRICE_EUR,
            breakdown: {
              item_total: { currency_code: CURRENCY, value: PRICE_EUR },
            },
          },
          items: [
            {
              name:       ITEM_NAME,
              quantity:   '1',
              unit_amount: { currency_code: CURRENCY, value: PRICE_EUR },
              category:   'DIGITAL_GOODS',
            },
          ],
          description: `Séance HRE — ${reservationData.firstName ?? ''} ${reservationData.lastName ?? ''} — ${reservationData.date ?? ''}`,
        },
      ],
      /* Active Pay Later / payer en 4x si disponible pour le pays du client */
      payment_source: {
        paypal: {
          experience_context: {
            payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
            brand_name:                'Ama — Hypnose HRE',
            locale:                    'fr-FR',
            landing_page:              'LOGIN',
            user_action:               'PAY_NOW',
          },
        },
      },
    };

    const res = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
      method:  'POST',
      headers: {
        Authorization:  `Bearer ${token}`,
        'Content-Type': 'application/json',
        Prefer:         'return=representation',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new BadRequestException(`PayPal order creation failed: ${err}`);
    }

    const order = await res.json() as { id: string };
    return { orderID: order.id };
  }

  /** Capture le paiement et crée la réservation */
  async captureOrder(
    orderID: string,
    reservationDto: CreateReservationDto,
    emailService: EmailService,
    reservationsService: ReservationsService,
  ): Promise<{ success: boolean; captureID: string }> {
    const token = await this.getAccessToken();

    const res = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderID}/capture`, {
      method:  'POST',
      headers: {
        Authorization:  `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const err = await res.text();
      throw new BadRequestException(`PayPal capture failed: ${err}`);
    }

    const capture = await res.json() as {
      status: string;
      purchase_units: { payments: { captures: { id: string }[] } }[];
    };

    if (capture.status !== 'COMPLETED') {
      throw new BadRequestException(`Payment not completed: ${capture.status}`);
    }

    const captureID = capture.purchase_units[0].payments.captures[0].id;

    // Enregistrer la réservation sans envoyer les emails immédiatement
    await reservationsService.create(reservationDto, true);

    // Envoyer les emails de confirmation avec un délai de 2 minutes
    setTimeout(() => {
      Promise.all([
        emailService.sendConfirmationToAma(reservationDto),
        emailService.sendConfirmationToClient(reservationDto),
      ]).catch((err: unknown) => console.error('Email error after PayPal capture:', err));
    }, 2 * 60 * 1000);

    return { success: true, captureID };
  }
}

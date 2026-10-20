import {
  Injectable,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateReservationDto } from '../reservations/dto/create-reservation.dto';
import { ReservationsService } from '../reservations/reservations.service';
import { isValidSlot } from '../reservations/slots';

const PAYPAL_API = {
  sandbox: 'https://api-m.sandbox.paypal.com',
  live:    'https://api-m.paypal.com',
};

const PRICE_EUR = '150.00';
const CURRENCY  = 'EUR';
const ITEM_NAME = 'Séance HRE — Hypnose Régressive Ésotérique';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(private readonly reservationsService: ReservationsService) {}

  private get baseUrl(): string {
    return process.env.PAYPAL_MODE === 'live' ? PAYPAL_API.live : PAYPAL_API.sandbox;
  }

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

    if (!res.ok) throw new InternalServerErrorException('PayPal OAuth failed.');

    const data = await res.json() as { access_token: string };
    return data.access_token;
  }

  /** Rembourse une capture PayPal déjà réalisée (best-effort, ne lance pas d'exception) */
  private async refundCapture(captureID: string): Promise<void> {
    try {
      const token = await this.getAccessToken();
      await fetch(`${this.baseUrl}/v2/payments/captures/${captureID}/refund`, {
        method:  'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body:    JSON.stringify({}),
      });
      this.logger.log(`Capture ${captureID} remboursée`);
    } catch (err) {
      this.logger.error(`Échec remboursement capture ${captureID}`, err);
    }
  }

  /** Crée une commande PayPal de 150 € — vérifie que le créneau est encore libre */
  async createOrder(reservationData: Partial<CreateReservationDto>): Promise<{ orderID: string }> {
    const date = reservationData.date;
    const time = reservationData.time ?? '13:30';

    if (date && await this.reservationsService.isSlotTaken(date, time)) {
      throw new ConflictException('Ce créneau est déjà réservé.');
    }

    const token = await this.getAccessToken();

    const body = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: CURRENCY,
          value:         PRICE_EUR,
          breakdown: { item_total: { currency_code: CURRENCY, value: PRICE_EUR } },
        },
        items: [{
          name:        ITEM_NAME,
          quantity:    '1',
          unit_amount: { currency_code: CURRENCY, value: PRICE_EUR },
          category:    'DIGITAL_GOODS',
        }],
        description: `Séance HRE — ${reservationData.firstName ?? ''} ${reservationData.lastName ?? ''} — ${reservationData.date ?? ''}`,
      }],
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

  /** Capture le paiement, vérifie le montant, crée la réservation.
   *  En cas de race condition (créneau pris entre create-order et capture), rembourse. */
  async captureOrder(
    orderID: string,
    reservationDto: CreateReservationDto,
  ): Promise<{ success: boolean; captureID: string }> {
    // Valider le créneau côté serveur (date valide, heure Paris, hors passé)
    if (!isValidSlot(reservationDto.date, reservationDto.time)) {
      throw new BadRequestException('Créneau invalide ou expiré.');
    }

    const token = await this.getAccessToken();

    const res = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderID}/capture`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const err = await res.text();
      throw new BadRequestException(`PayPal capture failed: ${err}`);
    }

    const capture = await res.json() as {
      status: string;
      purchase_units: {
        payments: {
          captures: { id: string; amount?: { value: string; currency_code: string } }[];
        };
      }[];
    };

    if (capture.status !== 'COMPLETED') {
      throw new BadRequestException(`Payment not completed: ${capture.status}`);
    }

    const captureInfo = capture.purchase_units[0].payments.captures[0];
    const captureID   = captureInfo.id;

    // Vérifier que le montant capturé est bien 150,00 EUR
    if (captureInfo.amount?.value !== PRICE_EUR || captureInfo.amount?.currency_code !== CURRENCY) {
      await this.refundCapture(captureID);
      throw new BadRequestException('Montant capturé incorrect — remboursement initié.');
    }

    // Créer la réservation avec paypalOrderId pour idempotence
    try {
      await this.reservationsService.create(reservationDto, false, orderID);
    } catch (err: unknown) {
      const prismaError = err as { code?: string };
      if (prismaError.code === 'P2002') {
        // Créneau pris en simultané : rembourser et rejeter
        await this.refundCapture(captureID);
        throw new ConflictException(
          'Ce créneau vient d\'être réservé par quelqu\'un d\'autre. Votre paiement a été remboursé.',
        );
      }
      throw err;
    }

    return { success: true, captureID };
  }
}

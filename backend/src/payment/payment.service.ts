import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateReservationDto } from '../reservations/dto/create-reservation.dto';
import { ReservationsService } from '../reservations/reservations.service';
import { EmailService } from '../email/email.service';
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

  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly emailService: EmailService,
  ) {}

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

  /** Rembourse une capture PayPal déjà réalisée. Ne lance jamais d'exception.
   *  Retourne true seulement si PayPal a accepté le remboursement.
   *  En cas d'échec : log en erreur + mail d'alerte à Ama pour un remboursement manuel. */
  private async refundCapture(
    orderID: string,
    captureID: string,
    dto: CreateReservationDto,
  ): Promise<boolean> {
    let reason: string;
    try {
      const token = await this.getAccessToken();
      const res = await fetch(`${this.baseUrl}/v2/payments/captures/${encodeURIComponent(captureID)}/refund`, {
        method:  'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body:    JSON.stringify({}),
      });
      const data = await res.json().catch(() => ({})) as { status?: string };
      if (res.ok && (data.status === 'COMPLETED' || data.status === 'PENDING')) {
        this.logger.log(`Capture ${captureID} remboursée (statut ${data.status})`);
        return true;
      }
      reason = `PayPal a répondu HTTP ${res.status}, statut ${data.status ?? 'inconnu'}`;
    } catch (err) {
      reason = err instanceof Error ? err.message : String(err);
    }

    this.logger.error(`ÉCHEC remboursement capture ${captureID} (commande ${orderID}) : ${reason}`);
    try {
      await this.emailService.sendRefundFailureAlert({ orderID, captureID, reason, dto });
    } catch (err) {
      this.logger.error(`Échec envoi alerte remboursement pour ${captureID}`, err);
    }
    return false;
  }

  private refundMessage(refunded: boolean): string {
    return refunded
      ? 'Votre paiement a été remboursé.'
      : 'Votre paiement va vous être remboursé manuellement très rapidement.';
  }

  /** Crée une commande PayPal de 150 € — vérifie que le créneau est encore libre */
  async createOrder(reservationData: CreateReservationDto): Promise<{ orderID: string }> {
    const { date, time } = reservationData;

    // Vérifié AVANT PayPal : créneau réel, futur et encore libre
    if (!isValidSlot(date, time)) {
      throw new BadRequestException('Créneau invalide ou expiré.');
    }
    if (await this.reservationsService.isSlotTaken(date, time)) {
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
        description: `Séance HRE, ${reservationData.firstName} ${reservationData.lastName}, ${reservationData.date}`.slice(0, 127),
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
    // Créneau déjà pris : on refuse AVANT de débiter le client
    if (await this.reservationsService.isSlotTaken(reservationDto.date, reservationDto.time)) {
      throw new ConflictException(
        'Ce créneau vient d\'être réservé par quelqu\'un d\'autre. Aucun paiement n\'a été prélevé.',
      );
    }

    const token = await this.getAccessToken();

    const res = await fetch(`${this.baseUrl}/v2/checkout/orders/${encodeURIComponent(orderID)}/capture`, {
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

    const captureInfo = capture.purchase_units?.[0]?.payments?.captures?.[0];
    if (!captureInfo?.id) {
      throw new BadRequestException('Réponse PayPal inattendue (capture introuvable).');
    }
    const captureID = captureInfo.id;

    // Vérifier que le montant capturé est bien 150,00 EUR
    if (captureInfo.amount?.value !== PRICE_EUR || captureInfo.amount?.currency_code !== CURRENCY) {
      const refunded = await this.refundCapture(orderID, captureID, reservationDto);
      throw new BadRequestException(`Montant capturé incorrect. ${this.refundMessage(refunded)}`);
    }

    // Créer la réservation (contraintes uniques : (date,time) et paypalOrderId)
    try {
      await this.reservationsService.create(reservationDto, false, orderID);
    } catch (err: unknown) {
      const prismaError = err as { code?: string; meta?: { target?: unknown } };
      if (prismaError.code === 'P2002') {
        const target = JSON.stringify(prismaError.meta?.target ?? '');
        if (target.includes('paypalOrderId')) {
          // Même paiement rejoué : la résa existe déjà avec ce paiement, on ne rembourse PAS
          this.logger.warn(`Capture rejouée pour la commande ${orderID} (déjà enregistrée)`);
          throw new ConflictException('Ce paiement a déjà été utilisé pour une réservation.');
        }
        // Créneau pris en simultané (date,time) : rembourser et rejeter
        const refunded = await this.refundCapture(orderID, captureID, reservationDto);
        throw new ConflictException(
          `Ce créneau vient d'être réservé par quelqu'un d'autre. ${this.refundMessage(refunded)}`,
        );
      }
      throw err;
    }

    return { success: true, captureID };
  }

  /** Mode paiement manuel (lien paypal.me, en attendant les clés API) : aucune vérification
   *  de paiement côté serveur, Ama contrôle ses encaissements à la main.
   *  Désactivé par défaut : il faut MANUAL_PAYMENT=true, sinon n'importe qui réserverait gratuitement. */
  async createManualReservation(dto: CreateReservationDto): Promise<{ success: boolean }> {
    if (process.env.MANUAL_PAYMENT !== 'true') {
      throw new ForbiddenException('Réservation sans paiement en ligne non activée.');
    }
    if (!isValidSlot(dto.date, dto.time)) {
      throw new BadRequestException('Créneau invalide ou expiré.');
    }
    if (await this.reservationsService.isSlotTaken(dto.date, dto.time)) {
      throw new ConflictException("Ce créneau vient d'être réservé par quelqu'un d'autre.");
    }

    try {
      await this.reservationsService.create(dto, true);
    } catch (err: unknown) {
      if ((err as { code?: string }).code === 'P2002') {
        throw new ConflictException("Ce créneau vient d'être réservé par quelqu'un d'autre.");
      }
      throw err;
    }

    // Réservation en base : un échec SMTP ne fait jamais échouer la requête
    const results = await Promise.allSettled([
      this.emailService.sendConfirmationToAma(dto, true),
      this.emailService.sendConfirmationToClient(dto, true),
    ]);
    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        this.logger.error(
          `Échec envoi mail (${i === 0 ? 'Ama' : dto.email}) pour la résa manuelle du ${dto.date} ${dto.time}`,
          r.reason instanceof Error ? r.reason.stack : String(r.reason),
        );
      }
    });
    return { success: true };
  }
}

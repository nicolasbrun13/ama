import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { EmailService } from '../email/email.service';
import { ReservationsService } from '../reservations/reservations.service';
import { CreateReservationDto } from '../reservations/dto/create-reservation.dto';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly emailService: EmailService,
    private readonly reservationsService: ReservationsService,
  ) {}

  /** POST /api/payment/create-order
   *  Body : { reservationData: Partial<CreateReservationDto> }
   *  Retourne { orderID } pour le SDK PayPal côté frontend */
  @Post('create-order')
  createOrder(@Body() body: { reservationData: Partial<CreateReservationDto> }) {
    return this.paymentService.createOrder(body.reservationData);
  }

  /** POST /api/payment/capture-order
   *  Body : { orderID: string, reservationData: CreateReservationDto }
   *  Capture le paiement, crée la réservation, envoie les emails */
  @Post('capture-order')
  captureOrder(
    @Body() body: { orderID: string; reservationData: CreateReservationDto },
  ) {
    return this.paymentService.captureOrder(
      body.orderID,
      body.reservationData,
      this.emailService,
      this.reservationsService,
    );
  }
}

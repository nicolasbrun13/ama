import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateReservationDto } from '../reservations/dto/create-reservation.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /** POST /api/payment/create-order
   *  Body : { reservationData: Partial<CreateReservationDto> }
   *  Vérifie que le créneau est libre puis retourne { orderID } pour le SDK PayPal. */
  @Post('create-order')
  createOrder(@Body() body: { reservationData: Partial<CreateReservationDto> }) {
    return this.paymentService.createOrder(body.reservationData ?? {});
  }

  /** POST /api/payment/capture-order
   *  Body : { orderID: string, reservationData: CreateReservationDto }
   *  Capture le paiement, vérifie le montant, crée la réservation, envoie les emails. */
  @Post('capture-order')
  captureOrder(@Body() body: { orderID: string; reservationData: CreateReservationDto }) {
    return this.paymentService.captureOrder(body.orderID, body.reservationData);
  }
}

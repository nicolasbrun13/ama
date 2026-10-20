import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CaptureOrderDto, CreateOrderDto } from './dto/payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /** POST /api/payment/create-order
   *  Body : { reservationData: CreateReservationDto } (validé)
   *  Vérifie que le créneau est valide et libre puis retourne { orderID } pour le SDK PayPal. */
  @Post('create-order')
  createOrder(@Body() body: CreateOrderDto) {
    return this.paymentService.createOrder(body.reservationData);
  }

  /** POST /api/payment/capture-order
   *  Body : { orderID: string, reservationData: CreateReservationDto } (validé)
   *  Capture le paiement, vérifie le montant, crée la réservation, envoie les emails. */
  @Post('capture-order')
  captureOrder(@Body() body: CaptureOrderDto) {
    return this.paymentService.captureOrder(body.orderID, body.reservationData);
  }
}

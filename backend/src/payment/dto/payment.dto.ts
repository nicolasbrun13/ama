import { IsDefined, IsNotEmpty, IsString, Matches, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateReservationDto } from '../../reservations/dto/create-reservation.dto';

/** POST /api/payment/create-order */
export class CreateOrderDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => CreateReservationDto)
  reservationData: CreateReservationDto;
}

/** POST /api/payment/capture-order */
export class CaptureOrderDto {
  /** ID de commande PayPal (alphanumérique) */
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @Matches(/^[A-Za-z0-9-]+$/, { message: 'orderID invalide' })
  orderID: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => CreateReservationDto)
  reservationData: CreateReservationDto;
}

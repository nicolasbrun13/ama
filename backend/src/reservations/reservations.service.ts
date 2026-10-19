import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { EmailService } from '../email/email.service';

export interface StoredReservation extends CreateReservationDto {
  id: string;
  createdAt: Date;
  reminderSent: boolean;
  invoiceSent: boolean;
}

@Injectable()
export class ReservationsService {
  private reservations: StoredReservation[] = [];

  constructor(private readonly emailService: EmailService) {}

  async create(dto: CreateReservationDto, skipEmails = false): Promise<StoredReservation> {
    const reservation: StoredReservation = {
      ...dto,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      reminderSent: false,
      invoiceSent: false,
    };

    this.reservations.push(reservation);

    if (!skipEmails) {
      await Promise.all([
        this.emailService.sendConfirmationToAma(dto),
        this.emailService.sendConfirmationToClient(dto),
      ]);
    }

    return reservation;
  }

  findAll(): StoredReservation[] {
    return this.reservations;
  }

  findUpcomingTomorrow(): StoredReservation[] {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    return this.reservations.filter((r) => r.date === tomorrowStr && !r.reminderSent);
  }

  findYesterdayForInvoice(): StoredReservation[] {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    return this.reservations.filter((r) => r.date === yesterdayStr && !r.invoiceSent);
  }

  markReminderSent(id: string): void {
    const r = this.reservations.find((res) => res.id === id);
    if (r) r.reminderSent = true;
  }

  markInvoiceSent(id: string): void {
    const r = this.reservations.find((res) => res.id === id);
    if (r) r.invoiceSent = true;
  }
}

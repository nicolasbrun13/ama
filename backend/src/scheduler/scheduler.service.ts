import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Reservation } from '@prisma/client';
import { ReservationsService } from '../reservations/reservations.service';
import { EmailService } from '../email/email.service';
import { CreateReservationDto } from '../reservations/dto/create-reservation.dto';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly emailService: EmailService,
  ) {}

  /** Convertit un enregistrement Prisma (null) en DTO (undefined) pour les emails */
  private toDto(r: Reservation): CreateReservationDto {
    return {
      firstName:   r.firstName,
      lastName:    r.lastName,
      email:       r.email,
      phone:       r.phone       ?? undefined,
      date:        r.date,
      time:        r.time,
      message:     r.message     ?? undefined,
      sessionType: r.sessionType ?? undefined,
    };
  }

  // Rappels J-1 — toutes les 15 min, entre 18h et 22h Paris (TZ=Europe/Paris dans compose)
  // Idempotent : reminderSentAt en base garantit qu'on n'envoie qu'une fois
  @Cron('*/15 * * * *')
  async sendReminders() {
    const hour = new Date().getHours();
    if (hour < 18 || hour >= 22) return;

    const upcoming = await this.reservationsService.findUpcomingTomorrow();
    if (upcoming.length === 0) return;

    this.logger.log(`Rappels J-1 : ${upcoming.length} à envoyer`);
    for (const reservation of upcoming) {
      try {
        await this.emailService.sendReminderToClient(this.toDto(reservation));
        await this.reservationsService.markReminderSent(reservation.id);
        this.logger.log(`Rappel envoyé à ${reservation.email}`);
      } catch (err) {
        this.logger.error(`Échec rappel pour ${reservation.email}`, err);
      }
    }
  }

  // Factures J+1 — toutes les 15 min, entre 8h et 12h Paris
  // Idempotent : invoiceSentAt en base garantit qu'on n'envoie qu'une fois
  @Cron('*/15 * * * *')
  async sendInvoices() {
    const hour = new Date().getHours();
    if (hour < 8 || hour >= 12) return;

    const yesterday = await this.reservationsService.findYesterdayForInvoice();
    if (yesterday.length === 0) return;

    this.logger.log(`Factures J+1 : ${yesterday.length} à envoyer`);
    for (const reservation of yesterday) {
      try {
        await this.emailService.sendInvoiceToClient(this.toDto(reservation));
        await this.reservationsService.markInvoiceSent(reservation.id);
        this.logger.log(`Facture envoyée à ${reservation.email}`);
      } catch (err) {
        this.logger.error(`Échec facture pour ${reservation.email}`, err);
      }
    }
  }
}

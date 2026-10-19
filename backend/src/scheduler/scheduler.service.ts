import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ReservationsService } from '../reservations/reservations.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly emailService: EmailService,
  ) {}

  // Rappels J-1 — tous les jours à 20h00
  @Cron('0 20 * * *')
  async sendReminders() {
    const upcoming = this.reservationsService.findUpcomingTomorrow();
    this.logger.log(`Rappels J-1 : ${upcoming.length} à envoyer`);

    for (const reservation of upcoming) {
      try {
        await this.emailService.sendReminderToClient(reservation);
        this.reservationsService.markReminderSent(reservation.id);
        this.logger.log(`Rappel envoyé à ${reservation.email}`);
      } catch (err) {
        this.logger.error(`Échec rappel pour ${reservation.email}`, err);
      }
    }
  }

  // Factures J+1 — tous les jours à 10h00
  @Cron('0 10 * * *')
  async sendInvoices() {
    const yesterday = this.reservationsService.findYesterdayForInvoice();
    this.logger.log(`Factures J+1 : ${yesterday.length} à envoyer`);

    for (const reservation of yesterday) {
      try {
        await this.emailService.sendInvoiceToClient(reservation);
        this.reservationsService.markInvoiceSent(reservation.id);
        this.logger.log(`Facture envoyée à ${reservation.email}`);
      } catch (err) {
        this.logger.error(`Échec facture pour ${reservation.email}`, err);
      }
    }
  }
}

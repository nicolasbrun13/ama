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

  // Every day at 20:00
  @Cron('0 20 * * *')
  async sendReminders() {
    const upcoming = this.reservationsService.findUpcomingTomorrow();
    this.logger.log(`Sending ${upcoming.length} reminder(s) for tomorrow`);

    for (const reservation of upcoming) {
      try {
        await this.emailService.sendReminderToClient(reservation);
        this.reservationsService.markReminderSent(reservation.id);
        this.logger.log(`Reminder sent to ${reservation.email}`);
      } catch (err) {
        this.logger.error(`Failed to send reminder to ${reservation.email}`, err);
      }
    }
  }
}

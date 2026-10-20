import { Injectable, Logger } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { Reservation } from '@prisma/client';
import { parisDateStr } from './slots';

@Injectable()
export class ReservationsService {
  private readonly logger = new Logger(ReservationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async create(
    dto: CreateReservationDto,
    skipEmails = false,
    paypalOrderId?: string,
  ): Promise<Reservation> {
    const reservation = await this.prisma.reservation.create({
      data: {
        firstName:     dto.firstName,
        lastName:      dto.lastName,
        email:         dto.email,
        phone:         dto.phone,
        date:          dto.date,
        time:          dto.time,
        message:       dto.message,
        sessionType:   dto.sessionType,
        paypalOrderId: paypalOrderId,
      },
    });

    // La réservation est en base (et payée) : un échec SMTP ne doit JAMAIS
    // faire échouer la requête. On logge, Ama retrouve la résa en base.
    if (!skipEmails) {
      const results = await Promise.allSettled([
        this.emailService.sendConfirmationToAma(dto),
        this.emailService.sendConfirmationToClient(dto),
      ]);
      results.forEach((r, i) => {
        if (r.status === 'rejected') {
          const target = i === 0 ? 'Ama' : dto.email;
          this.logger.error(
            `Échec envoi mail de confirmation (${target}) pour la résa ${reservation.id} du ${dto.date} ${dto.time}`,
            r.reason instanceof Error ? r.reason.stack : String(r.reason),
          );
        }
      });
    }

    return reservation;
  }

  /** Créneaux pris pour un mois (YYYY-MM) — aucune donnée perso exposée */
  async findTakenByMonth(month: string): Promise<{ date: string; time: string }[]> {
    return this.prisma.reservation.findMany({
      where:  { date: { startsWith: month } },
      select: { date: true, time: true },
    });
  }

  /** Vérifie si un créneau est déjà pris */
  async isSlotTaken(date: string, time: string): Promise<boolean> {
    const count = await this.prisma.reservation.count({ where: { date, time } });
    return count > 0;
  }

  /** Réservations du lendemain sans rappel envoyé (heure Paris) */
  async findUpcomingTomorrow(): Promise<Reservation[]> {
    return this.prisma.reservation.findMany({
      where: { date: parisDateStr(+1), reminderSentAt: null },
    });
  }

  /** Réservations d'hier sans facture envoyée (heure Paris) */
  async findYesterdayForInvoice(): Promise<Reservation[]> {
    return this.prisma.reservation.findMany({
      where: { date: parisDateStr(-1), invoiceSentAt: null },
    });
  }

  async markReminderSent(id: string): Promise<void> {
    await this.prisma.reservation.update({ where: { id }, data: { reminderSentAt: new Date() } });
  }

  async markInvoiceSent(id: string): Promise<void> {
    await this.prisma.reservation.update({ where: { id }, data: { invoiceSentAt: new Date() } });
  }
}

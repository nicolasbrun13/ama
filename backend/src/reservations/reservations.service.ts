import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { Reservation } from '@prisma/client';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  /** Retourne "YYYY-MM-DD" pour today+offset en heure Paris (sv-SE = ISO date) */
  private parisDateStr(offsetDays: number): string {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' });
  }

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

    if (!skipEmails) {
      await Promise.all([
        this.emailService.sendConfirmationToAma(dto),
        this.emailService.sendConfirmationToClient(dto),
      ]);
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
      where: { date: this.parisDateStr(+1), reminderSentAt: null },
    });
  }

  /** Réservations d'hier sans facture envoyée (heure Paris) */
  async findYesterdayForInvoice(): Promise<Reservation[]> {
    return this.prisma.reservation.findMany({
      where: { date: this.parisDateStr(-1), invoiceSentAt: null },
    });
  }

  async markReminderSent(id: string): Promise<void> {
    await this.prisma.reservation.update({ where: { id }, data: { reminderSentAt: new Date() } });
  }

  async markInvoiceSent(id: string): Promise<void> {
    await this.prisma.reservation.update({ where: { id }, data: { invoiceSentAt: new Date() } });
  }
}

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

  async create(dto: CreateReservationDto, skipEmails = false): Promise<Reservation> {
    const reservation = await this.prisma.reservation.create({
      data: {
        firstName:   dto.firstName,
        lastName:    dto.lastName,
        email:       dto.email,
        phone:       dto.phone,
        date:        dto.date,
        time:        dto.time,
        message:     dto.message,
        sessionType: dto.sessionType,
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

  async findAll(): Promise<Reservation[]> {
    return this.prisma.reservation.findMany({ orderBy: { createdAt: 'desc' } });
  }

  /** Réservations du lendemain sans rappel envoyé */
  async findUpcomingTomorrow(): Promise<Reservation[]> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    return this.prisma.reservation.findMany({
      where: { date: tomorrowStr, reminderSentAt: null },
    });
  }

  /** Réservations d'hier sans facture envoyée */
  async findYesterdayForInvoice(): Promise<Reservation[]> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    return this.prisma.reservation.findMany({
      where: { date: yesterdayStr, invoiceSentAt: null },
    });
  }

  async markReminderSent(id: string): Promise<void> {
    await this.prisma.reservation.update({
      where: { id },
      data: { reminderSentAt: new Date() },
    });
  }

  async markInvoiceSent(id: string): Promise<void> {
    await this.prisma.reservation.update({
      where: { id },
      data: { invoiceSentAt: new Date() },
    });
  }
}

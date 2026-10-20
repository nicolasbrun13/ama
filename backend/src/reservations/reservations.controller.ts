import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  /** GET /api/reservations/availability?month=YYYY-MM
   *  Retourne uniquement les créneaux pris (date + heure, aucune donnée perso). */
  @Get('availability')
  async availability(@Query('month') month: string) {
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      throw new BadRequestException('Paramètre month invalide (attendu YYYY-MM)');
    }
    const taken = await this.reservationsService.findTakenByMonth(month);
    return { taken };
  }
}

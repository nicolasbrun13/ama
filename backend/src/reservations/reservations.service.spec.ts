import { ReservationsService } from './reservations.service';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

const dto: CreateReservationDto = {
  firstName: 'Jeanne', lastName: 'Test', email: 'jeanne@example.fr', date: '2027-02-05', time: '13:30',
};

function makeService() {
  const prisma = {
    reservation: {
      create: vi.fn().mockResolvedValue({ id: 'r1', ...dto }),
      findMany: vi.fn().mockResolvedValue([]),
    },
  };
  const email = {
    sendConfirmationToAma: vi.fn().mockResolvedValue(undefined),
    sendConfirmationToClient: vi.fn().mockResolvedValue(undefined),
  };
  const service = new ReservationsService(prisma as unknown as PrismaService, email as unknown as EmailService);
  return { service, prisma, email };
}

describe('ReservationsService.create', () => {
  it('envoie les deux mails après enregistrement', async () => {
    const { service, prisma, email } = makeService();
    await service.create(dto, false, 'ORDER1');
    expect(prisma.reservation.create).toHaveBeenCalledWith({ data: expect.objectContaining({ paypalOrderId: 'ORDER1' }) });
    expect(email.sendConfirmationToAma).toHaveBeenCalled();
    expect(email.sendConfirmationToClient).toHaveBeenCalled();
  });

  it("un SMTP en échec ne fait PAS échouer la création (la résa est en base)", async () => {
    const { service, email } = makeService();
    email.sendConfirmationToAma.mockRejectedValue(new Error('SMTP down'));
    email.sendConfirmationToClient.mockRejectedValue(new Error('SMTP down'));
    await expect(service.create(dto, false, 'ORDER1')).resolves.toMatchObject({ id: 'r1' });
  });
});

describe('ReservationsService.findUpcomingTomorrow', () => {
  afterEach(() => vi.useRealTimers());

  it('à 00:30 heure de Paris, cherche bien le lendemain du jour parisien', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2027-03-11T23:30:00Z')); // 2027-03-12 00:30 Paris
    const { service, prisma } = makeService();
    await service.findUpcomingTomorrow();
    expect(prisma.reservation.findMany).toHaveBeenCalledWith({
      where: { date: '2027-03-13', reminderSentAt: null },
    });
  });

  it('factures : cherche la veille du jour parisien', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2027-03-11T23:30:00Z'));
    const { service, prisma } = makeService();
    await service.findYesterdayForInvoice();
    expect(prisma.reservation.findMany).toHaveBeenCalledWith({
      where: { date: '2027-03-11', invoiceSentAt: null },
    });
  });
});

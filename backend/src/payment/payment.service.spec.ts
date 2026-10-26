import { BadRequestException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ReservationsService } from '../reservations/reservations.service';
import { EmailService } from '../email/email.service';
import { CreateReservationDto } from '../reservations/dto/create-reservation.dto';

const dto: CreateReservationDto = {
  firstName: 'Jeanne', lastName: 'Test', email: 'jeanne@example.fr', date: '2027-02-05', time: '13:30',
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const captureBody = (value = '150.00', currency = 'EUR') => ({
  status: 'COMPLETED',
  purchase_units: [{ payments: { captures: [{ id: 'CAP1', amount: { value, currency_code: currency } } ] } }],
});

type Routes = { capture?: Response; refund?: Response; order?: Response };

function setup(routes: Routes = {}) {
  const fetchMock = vi.fn(async (url: string) => {
    if (url.endsWith('/v1/oauth2/token')) return json(200, { access_token: 'tok' });
    if (url.includes('/refund')) return routes.refund ?? json(201, { id: 'REF1', status: 'COMPLETED' });
    if (url.endsWith('/capture')) return routes.capture ?? json(201, captureBody());
    if (url.endsWith('/v2/checkout/orders')) return routes.order ?? json(201, { id: 'ORDER1' });
    throw new Error(`URL inattendue ${url}`);
  });
  vi.stubGlobal('fetch', fetchMock);

  const reservations = {
    isSlotTaken: vi.fn().mockResolvedValue(false),
    create: vi.fn().mockResolvedValue({ id: 'r1' }),
  };
  const email = {
    sendRefundFailureAlert: vi.fn().mockResolvedValue(undefined),
    sendConfirmationToAma: vi.fn().mockResolvedValue(undefined),
    sendConfirmationToClient: vi.fn().mockResolvedValue(undefined),
  };
  const service = new PaymentService(
    reservations as unknown as ReservationsService,
    email as unknown as EmailService,
  );
  const calls = (part: string) => fetchMock.mock.calls.filter(([u]) => String(u).includes(part));
  return { service, reservations, email, fetchMock, calls };
}

beforeAll(() => {
  process.env.PAYPAL_CLIENT_ID = 'id';
  process.env.PAYPAL_CLIENT_SECRET = 'secret';
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
});
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2027-01-15T10:00:00Z'));
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('PaymentService.createOrder', () => {
  it('crée la commande pour un créneau valide et libre', async () => {
    const { service } = setup();
    await expect(service.createOrder(dto)).resolves.toEqual({ orderID: 'ORDER1' });
  });

  it('date passée → 400 sans appel PayPal', async () => {
    const { service, fetchMock } = setup();
    await expect(service.createOrder({ ...dto, date: '2020-01-03' })).rejects.toBeInstanceOf(BadRequestException);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('créneau déjà pris → 409 sans appel PayPal', async () => {
    const { service, reservations, fetchMock } = setup();
    reservations.isSlotTaken.mockResolvedValue(true);
    await expect(service.createOrder(dto)).rejects.toBeInstanceOf(ConflictException);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('PaymentService.captureOrder', () => {
  it('cas nominal : capture, crée la résa, success', async () => {
    const { service, reservations } = setup();
    await expect(service.captureOrder('ORDER1', dto)).resolves.toEqual({ success: true, captureID: 'CAP1' });
    expect(reservations.create).toHaveBeenCalledWith(dto, false, 'ORDER1');
  });

  it('créneau déjà pris AVANT capture → 409 sans débiter le client', async () => {
    const { service, reservations, calls } = setup();
    reservations.isSlotTaken.mockResolvedValue(true);
    await expect(service.captureOrder('ORDER1', dto)).rejects.toBeInstanceOf(ConflictException);
    expect(calls('/capture')).toHaveLength(0);
  });

  it('montant ≠ 150 → refund + 400', async () => {
    const { service, reservations, calls } = setup({ capture: json(201, captureBody('1.00')) });
    const err = await service.captureOrder('ORDER1', dto).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(BadRequestException);
    expect((err as Error).message).toContain('remboursé');
    expect(calls('/refund')).toHaveLength(1);
    expect(reservations.create).not.toHaveBeenCalled();
  });

  it('mauvaise devise → refund + 400', async () => {
    const { service, calls } = setup({ capture: json(201, captureBody('150.00', 'USD')) });
    await expect(service.captureOrder('ORDER1', dto)).rejects.toBeInstanceOf(BadRequestException);
    expect(calls('/refund')).toHaveLength(1);
  });

  it('P2002 sur (date,time) → refund + 409 "remboursé"', async () => {
    const { service, reservations, calls, email } = setup();
    reservations.create.mockRejectedValue({ code: 'P2002', meta: { target: ['date', 'time'] } });
    const err = await service.captureOrder('ORDER1', dto).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ConflictException);
    expect((err as Error).message).toContain('Votre paiement a été remboursé');
    expect(calls('/refund')).toHaveLength(1);
    expect(email.sendRefundFailureAlert).not.toHaveBeenCalled();
  });

  it('P2002 sur paypalOrderId (paiement rejoué) → 409 SANS refund', async () => {
    const { service, reservations, calls } = setup();
    reservations.create.mockRejectedValue({ code: 'P2002', meta: { target: ['paypalOrderId'] } });
    await expect(service.captureOrder('ORDER1', dto)).rejects.toBeInstanceOf(ConflictException);
    expect(calls('/refund')).toHaveLength(0);
  });

  it('SMTP qui échoue → success quand même', async () => {
    // Le vrai ReservationsService avale les erreurs SMTP : on vérifie la chaîne complète
    const { service } = setup();
    const prisma = { reservation: { create: vi.fn().mockResolvedValue({ id: 'r1' }) } };
    const failingEmail = {
      sendConfirmationToAma: vi.fn().mockRejectedValue(new Error('SMTP down')),
      sendConfirmationToClient: vi.fn().mockRejectedValue(new Error('SMTP down')),
    };
    const realReservations = new ReservationsService(prisma as never, failingEmail as never);
    realReservations.isSlotTaken = vi.fn().mockResolvedValue(false);
    (service as unknown as { reservationsService: ReservationsService }).reservationsService = realReservations;

    await expect(service.captureOrder('ORDER1', dto)).resolves.toEqual({ success: true, captureID: 'CAP1' });
    expect(failingEmail.sendConfirmationToAma).toHaveBeenCalled();
  });

  it('refund refusé par PayPal (HTTP 422) → mail d\'alerte à Ama + message "manuellement"', async () => {
    const { service, reservations, email } = setup({ refund: json(422, { name: 'UNPROCESSABLE_ENTITY' }) });
    reservations.create.mockRejectedValue({ code: 'P2002', meta: { target: ['date', 'time'] } });
    const err = await service.captureOrder('ORDER1', dto).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ConflictException);
    expect((err as Error).message).toContain('manuellement');
    expect(email.sendRefundFailureAlert).toHaveBeenCalledWith(
      expect.objectContaining({ orderID: 'ORDER1', captureID: 'CAP1', dto }),
    );
  });

  it('refund HTTP 201 mais statut FAILED → alerte aussi', async () => {
    const { service, email } = setup({
      capture: json(201, captureBody('1.00')),
      refund: json(201, { id: 'REF1', status: 'FAILED' }),
    });
    await expect(service.captureOrder('ORDER1', dto)).rejects.toBeInstanceOf(BadRequestException);
    expect(email.sendRefundFailureAlert).toHaveBeenCalledTimes(1);
  });

  it('refund qui plante (réseau) → alerte, et l\'erreur ne remonte pas', async () => {
    const { service, reservations, email, fetchMock } = setup();
    reservations.create.mockRejectedValue({ code: 'P2002', meta: { target: ['date', 'time'] } });
    const base = fetchMock.getMockImplementation()!;
    fetchMock.mockImplementation(async (url: string) => {
      if (url.includes('/refund')) throw new Error('ECONNRESET');
      return base(url);
    });
    await expect(service.captureOrder('ORDER1', dto)).rejects.toBeInstanceOf(ConflictException);
    expect(email.sendRefundFailureAlert).toHaveBeenCalledWith(expect.objectContaining({ reason: 'ECONNRESET' }));
  });

  it('créneau invalide → 400 sans appel PayPal', async () => {
    const { service, fetchMock } = setup();
    await expect(service.captureOrder('ORDER1', { ...dto, date: '2027-02-04' })).rejects.toBeInstanceOf(BadRequestException);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('PaymentService.createManualReservation', () => {
  afterEach(() => { delete process.env.MANUAL_PAYMENT; });

  it("refuse si MANUAL_PAYMENT n'est pas activé", async () => {
    const { service, reservations } = setup();
    await expect(service.createManualReservation(dto)).rejects.toBeInstanceOf(ForbiddenException);
    expect(reservations.create).not.toHaveBeenCalled();
  });

  it('crée la résa sans appeler PayPal et envoie les mails en variante manuelle', async () => {
    process.env.MANUAL_PAYMENT = 'true';
    const { service, reservations, email, fetchMock } = setup();
    await expect(service.createManualReservation(dto)).resolves.toEqual({ success: true });
    expect(reservations.create).toHaveBeenCalledWith(dto, true);
    expect(email.sendConfirmationToAma).toHaveBeenCalledWith(dto, true);
    expect(email.sendConfirmationToClient).toHaveBeenCalledWith(dto, true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('409 si le créneau est déjà pris', async () => {
    process.env.MANUAL_PAYMENT = 'true';
    const { service, reservations } = setup();
    reservations.isSlotTaken.mockResolvedValue(true);
    await expect(service.createManualReservation(dto)).rejects.toBeInstanceOf(ConflictException);
  });
});

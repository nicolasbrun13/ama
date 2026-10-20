import { INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import request from 'supertest';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { THROTTLERS } from '../throttle.config';

// Même config que main.ts / app.module.ts (trust proxy + ThrottlerGuard global)
describe('Throttle GET /api/reservations/availability', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ThrottlerModule.forRoot(THROTTLERS)],
      controllers: [ReservationsController],
      providers: [
        { provide: ReservationsService, useValue: { findTakenByMonth: async () => [] } },
        { provide: APP_GUARD, useClass: ThrottlerGuard },
      ],
    }).compile();
    app = moduleRef.createNestApplication();
    (app.getHttpAdapter().getInstance() as { set: (k: string, v: unknown) => void }).set('trust proxy', 1);
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterEach(async () => app.close());

  const get = (ip: string) =>
    request(app.getHttpServer())
      .get('/api/reservations/availability?month=2027-02')
      .set('X-Forwarded-For', ip);

  it('20 requêtes de 20 IP différentes → aucune 429', async () => {
    const statuses: number[] = [];
    for (let i = 1; i <= 20; i++) statuses.push((await get(`203.0.113.${i}`)).status);
    expect(statuses.every((s) => s === 200)).toBe(true);
  });

  it('une même IP peut naviguer 12 mois en 10 s sans 429 (ancienne limite : 5)', async () => {
    for (let i = 0; i < 12; i++) expect((await get('198.51.100.7')).status).toBe(200);
  });

  it('une même IP qui abuse finit par prendre un 429', async () => {
    const statuses: number[] = [];
    for (let i = 0; i < 25; i++) statuses.push((await get('198.51.100.8')).status);
    expect(statuses).toContain(429);
    // et une autre IP n'est pas impactée
    expect((await get('198.51.100.9')).status).toBe(200);
  });
});

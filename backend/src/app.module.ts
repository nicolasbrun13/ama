import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ReservationsController } from './reservations/reservations.controller';
import { ReservationsService } from './reservations/reservations.service';
import { EmailService } from './email/email.service';
import { SchedulerService } from './scheduler/scheduler.service';
import { PaymentController } from './payment/payment.controller';
import { PaymentService } from './payment/payment.service';
import { PrismaService } from './prisma/prisma.service';
import { THROTTLERS } from './throttle.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot(THROTTLERS),
  ],
  controllers: [ReservationsController, PaymentController],
  providers: [
    PrismaService,
    ReservationsService,
    EmailService,
    SchedulerService,
    PaymentService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}

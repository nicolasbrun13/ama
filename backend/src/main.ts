import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createValidationPipe } from './validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Trust le proxy nginx (X-Forwarded-For / X-Real-IP) pour le rate limiting
  const expressApp = app.getHttpAdapter().getInstance() as { set: (k: string, v: unknown) => void };
  expressApp.set('trust proxy', 1);

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3202',
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  });

  app.useGlobalPipes(createValidationPipe());
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT || 3203);
  console.log(`Backend running on http://localhost:${process.env.PORT || 3203}`);
}
bootstrap();

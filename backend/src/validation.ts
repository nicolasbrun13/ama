import { ValidationPipe } from '@nestjs/common';

/** ValidationPipe globale : rejette tout champ inconnu et applique les @Transform (trim…) */
export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true });
}

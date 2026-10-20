import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  Matches,
  IsIn,
} from 'class-validator';
import { Transform } from 'class-transformer';

/** Trim uniquement les chaînes : un objet/nombre reste tel quel et sera rejeté par @IsString (400, pas 500) */
const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);
const trimLower = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Transform(trim)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Transform(trim)
  lastName: string;

  @IsString()
  @IsEmail()
  @MaxLength(254)
  @Transform(trimLower)
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  @Matches(/^[0-9 +()./-]*$/, { message: 'Numéro de téléphone invalide' })
  @Transform(trim)
  phone?: string;

  /** Format YYYY-MM-DD uniquement */
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date invalide (attendu YYYY-MM-DD)' })
  @Transform(trim)
  date: string;

  /** Seul créneau accepté : 13:30 */
  @IsIn(['13:30'], { message: 'Heure invalide (seul créneau disponible : 13:30)' })
  time: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  @Transform(trim)
  message?: string;

  @IsString()
  @IsOptional()
  @IsIn(['en ligne', 'présentiel'], { message: 'sessionType invalide' })
  sessionType?: string;
}

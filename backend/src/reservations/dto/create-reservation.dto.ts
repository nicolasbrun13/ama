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

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Transform(({ value }: { value: string }) => value?.trim())
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Transform(({ value }: { value: string }) => value?.trim())
  lastName: string;

  @IsEmail()
  @MaxLength(254)
  @Transform(({ value }: { value: string }) => value?.trim().toLowerCase())
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  @Matches(/^[0-9 +()./-]*$/, { message: 'Numéro de téléphone invalide' })
  @Transform(({ value }: { value: string }) => value?.trim())
  phone?: string;

  /** Format YYYY-MM-DD uniquement */
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date invalide (attendu YYYY-MM-DD)' })
  @Transform(({ value }: { value: string }) => value?.trim())
  date: string;

  /** Seul créneau accepté : 13:30 */
  @IsIn(['13:30'], { message: 'Heure invalide (seul créneau disponible : 13:30)' })
  time: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  @Transform(({ value }: { value: string }) => value?.trim())
  message?: string;

  @IsString()
  @IsOptional()
  @IsIn(['en ligne', 'présentiel'], { message: 'sessionType invalide' })
  sessionType?: string;
}

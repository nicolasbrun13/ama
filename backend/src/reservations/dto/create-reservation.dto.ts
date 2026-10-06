import { IsString, IsEmail, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsDateString()
  date: string; // ISO date string: "2026-10-19"

  @IsString()
  @IsNotEmpty()
  time: string; // "14:00"

  @IsString()
  @IsOptional()
  message?: string;

  @IsString()
  @IsOptional()
  sessionType?: string; // "en ligne" | "présentiel"
}

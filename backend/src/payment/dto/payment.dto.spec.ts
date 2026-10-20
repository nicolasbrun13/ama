import { BadRequestException } from '@nestjs/common';
import { createValidationPipe } from '../../validation';
import { CaptureOrderDto, CreateOrderDto } from './payment.dto';

const validReservation = () => ({
  firstName: '  Jeanne ',
  lastName: 'Test',
  email: 'Jeanne@Example.fr',
  date: '2027-02-05',
  time: '13:30',
});

const pipe = createValidationPipe();
const validate = (metatype: unknown, value: unknown) =>
  pipe.transform(value, { type: 'body', metatype: metatype as never });

describe('CaptureOrderDto (ValidationPipe globale)', () => {
  it('accepte un body valide et applique les @Transform (trim, lowercase)', async () => {
    const out = await validate(CaptureOrderDto, { orderID: 'ABC123', reservationData: validReservation() });
    expect(out).toBeInstanceOf(CaptureOrderDto);
    expect(out.reservationData.firstName).toBe('Jeanne');
    expect(out.reservationData.email).toBe('jeanne@example.fr');
  });

  it('firstName objet → 400', async () => {
    const body = { orderID: 'ABC123', reservationData: { ...validReservation(), firstName: { evil: 1 } } };
    await expect(validate(CaptureOrderDto, body)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('email avec deux destinataires → 400', async () => {
    const body = { orderID: 'ABC123', reservationData: { ...validReservation(), email: 'a@x.fr,b@y.fr' } };
    await expect(validate(CaptureOrderDto, body)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('time 14:00 → 400', async () => {
    const body = { orderID: 'ABC123', reservationData: { ...validReservation(), time: '14:00' } };
    await expect(validate(CaptureOrderDto, body)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('champ inconnu à la racine → 400', async () => {
    const body = { orderID: 'ABC123', reservationData: validReservation(), admin: true };
    await expect(validate(CaptureOrderDto, body)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('champ inconnu dans reservationData → 400', async () => {
    const body = { orderID: 'ABC123', reservationData: { ...validReservation(), paypalOrderId: 'x' } };
    await expect(validate(CaptureOrderDto, body)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('reservationData absent → 400', async () => {
    await expect(validate(CaptureOrderDto, { orderID: 'ABC123' })).rejects.toBeInstanceOf(BadRequestException);
  });

  it('orderID avec caractères de chemin → 400', async () => {
    const body = { orderID: '../../v1/x', reservationData: validReservation() };
    await expect(validate(CaptureOrderDto, body)).rejects.toBeInstanceOf(BadRequestException);
  });
});

describe('CreateOrderDto', () => {
  it('accepte un body valide', async () => {
    const out = await validate(CreateOrderDto, { reservationData: validReservation() });
    expect(out.reservationData.lastName).toBe('Test');
  });

  it('reservationData incomplet (sans email) → 400', async () => {
    const { email: _omit, ...rest } = validReservation();
    void _omit;
    await expect(validate(CreateOrderDto, { reservationData: rest })).rejects.toBeInstanceOf(BadRequestException);
  });

  it('date mal formée → 400', async () => {
    const body = { reservationData: { ...validReservation(), date: '05/02/2027' } };
    await expect(validate(CreateOrderDto, body)).rejects.toBeInstanceOf(BadRequestException);
  });
});

import { NextResponse } from 'next/server';

// Une réservation ne peut être créée que via /api/payment/capture-order (après paiement PayPal confirmé)
export async function POST() {
  return NextResponse.json({ message: 'Méthode non autorisée' }, { status: 405 });
}
export async function GET() {
  return NextResponse.json({ message: 'Méthode non autorisée' }, { status: 405 });
}

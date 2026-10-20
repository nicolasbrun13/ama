import { NextRequest, NextResponse } from 'next/server';
import { apiUrl, forwardedIpHeaders } from '@/lib/server/request';

/** Proxy vers GET /api/reservations/availability?month=YYYY-MM sur le backend NestJS.
 *  Retourne uniquement les créneaux pris { taken: {date, time}[] } (aucune donnée perso).
 *  En cas d'échec : PAS de { taken: [] } (le front croirait que tout est libre),
 *  seulement un message d'erreur avec le statut. */
export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get('month');
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ message: 'Paramètre month invalide' }, { status: 400 });
  }
  try {
    const response = await fetch(
      `${apiUrl()}/api/reservations/availability?month=${encodeURIComponent(month)}`,
      { cache: 'no-store', headers: forwardedIpHeaders(request) },
    );
    if (!response.ok) {
      return NextResponse.json(
        { message: 'Disponibilités indisponibles pour le moment' },
        { status: response.status },
      );
    }
    const data = await response.json();
    return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Availability proxy error:', error);
    return NextResponse.json({ message: 'Impossible de contacter le serveur.' }, { status: 502 });
  }
}

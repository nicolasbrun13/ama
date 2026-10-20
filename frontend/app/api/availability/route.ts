import { NextRequest, NextResponse } from 'next/server';

/** Proxy vers GET /api/reservations/availability?month=YYYY-MM sur le backend NestJS.
 *  Retourne uniquement les créneaux pris { taken: {date, time}[] } — aucune donnée perso. */
export async function GET(request: NextRequest) {
  try {
    const month = request.nextUrl.searchParams.get('month');
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json({ message: 'Paramètre month invalide' }, { status: 400 });
    }
    const apiUrl = process.env.API_URL || 'http://localhost:3203';
    const response = await fetch(
      `${apiUrl}/api/reservations/availability?month=${encodeURIComponent(month)}`,
      { cache: 'no-store' },
    );
    if (!response.ok) {
      return NextResponse.json({ taken: [] }, { status: response.status });
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Availability proxy error:', error);
    return NextResponse.json({ taken: [] }, { status: 500 });
  }
}

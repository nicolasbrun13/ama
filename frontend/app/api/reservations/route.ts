import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const apiUrl = process.env.API_URL || 'http://localhost:3203';
    const response = await fetch(`${apiUrl}/api/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: (error as { message?: string }).message || 'Erreur serveur' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Reservation proxy error:', error);
    return NextResponse.json(
      { message: 'Impossible de contacter le serveur. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}

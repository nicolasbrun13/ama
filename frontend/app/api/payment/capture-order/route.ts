import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Transmet la vraie IP Cloudflare au backend pour le rate limiting
    const realIp =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-real-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      '';

    const apiUrl = process.env.API_URL || 'http://localhost:3203';
    const response = await fetch(`${apiUrl}/api/payment/capture-order`, {
      method:  'POST',
      headers: {
        'Content-Type':    'application/json',
        ...(realIp ? { 'X-Forwarded-For': realIp } : {}),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: (error as { message?: string }).message || 'Erreur serveur' },
        { status: response.status },
      );
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Payment capture-order proxy error:', error);
    return NextResponse.json({ message: 'Impossible de contacter le serveur.' }, { status: 500 });
  }
}

import { NextRequest } from 'next/server';
import { proxyPostToBackend } from '@/lib/server/request';

export async function POST(request: NextRequest) {
  return proxyPostToBackend(request, '/api/payment/manual-reservation', 'Payment manual-reservation');
}

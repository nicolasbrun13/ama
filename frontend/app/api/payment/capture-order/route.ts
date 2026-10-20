import { NextRequest } from 'next/server';
import { proxyPostToBackend } from '@/lib/server/request';

export async function POST(request: NextRequest) {
  return proxyPostToBackend(request, '/api/payment/capture-order', 'Payment capture-order');
}

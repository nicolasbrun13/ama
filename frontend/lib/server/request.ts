import { NextResponse } from 'next/server';

/**
 * IP réelle du visiteur.
 * En prod : Cloudflare → Nginx (qui écrase CF-Connecting-IP avec $remote_addr
 * restauré depuis Cloudflare, donc non falsifiable) → Next.
 */
export function getClientIp(request: Request): string {
  const h = request.headers;
  return (
    h.get('cf-connecting-ip')?.trim() ||
    h.get('x-real-ip')?.trim() ||
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    ''
  );
}

/** En-têtes à transmettre au backend NestJS pour que son rate limiting voie la vraie IP */
export function forwardedIpHeaders(request: Request): Record<string, string> {
  const ip = getClientIp(request);
  return ip ? { 'X-Forwarded-For': ip } : {};
}

/** Lit le body JSON. Renvoie null si le JSON est mal formé (→ l'appelant répond 400). */
export async function readJsonBody(request: Request): Promise<unknown | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export const invalidJsonResponse = () =>
  NextResponse.json({ message: 'Requête invalide (JSON mal formé)' }, { status: 400 });

export const apiUrl = () => process.env.API_URL || 'http://localhost:3203';

/** Proxy POST JSON vers le backend, en transmettant l'IP réelle et le message d'erreur du backend */
export async function proxyPostToBackend(request: Request, path: string, logLabel: string) {
  const body = await readJsonBody(request);
  if (body === null) return invalidJsonResponse();
  try {
    const response = await fetch(`${apiUrl()}${path}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', ...forwardedIpHeaders(request) },
      body:    JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({})) as { message?: string | string[] };
    if (!response.ok) {
      const message = Array.isArray(data.message) ? data.message.join(' ') : data.message;
      return NextResponse.json({ message: message || 'Erreur serveur' }, { status: response.status });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error(`${logLabel} proxy error:`, error);
    return NextResponse.json({ message: 'Impossible de contacter le serveur.' }, { status: 502 });
  }
}

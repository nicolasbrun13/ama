import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';

const sendMail = vi.fn().mockResolvedValue({});
vi.mock('nodemailer', () => ({ createTransport: () => ({ sendMail }) }));

// Module rechargé à chaque test : limiteur en mémoire remis à zéro
async function loadPost() {
  vi.resetModules();
  return (await import('./route')).POST;
}

const valid = { nom: 'Jeanne', email: 'jeanne@example.fr', sujet: 'Tarifs', message: 'Bonjour', website: '' };

const post = (body: unknown, ip = '203.0.113.10') =>
  new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'cf-connecting-ip': ip },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  }) as unknown as NextRequest;

beforeEach(() => sendMail.mockClear());

describe('POST /api/contact', () => {
  it('message valide → 200 et mail envoyé avec replyTo = email du visiteur', async () => {
    const POST = await loadPost();
    const res = await POST(post(valid));
    expect(res.status).toBe(200);
    expect(sendMail).toHaveBeenCalledTimes(1);
    expect(sendMail.mock.calls[0][0].replyTo).toBe('jeanne@example.fr');
  });

  it('JSON mal formé → 400 (pas 500)', async () => {
    const POST = await loadPost();
    const res = await POST(post('{"nom":'));
    expect(res.status).toBe(400);
  });

  it('honeypot rempli → 200 silencieux, aucun mail', async () => {
    const POST = await loadPost();
    const res = await POST(post({ ...valid, website: 'http://spam.example' }));
    expect(res.status).toBe(200);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('email avec deux destinataires → 400', async () => {
    const POST = await loadPost();
    const res = await POST(post({ ...valid, email: 'a@x.fr,b@y.fr' }));
    expect(res.status).toBe(400);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('nom objet → 400', async () => {
    const POST = await loadPost();
    const res = await POST(post({ ...valid, nom: { evil: 1 } }));
    expect(res.status).toBe(400);
  });

  it('4e message de la même IP en 10 min → 429, une autre IP passe', async () => {
    const POST = await loadPost();
    for (let i = 0; i < 3; i++) expect((await POST(post(valid))).status).toBe(200);
    const blocked = await POST(post(valid));
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get('Retry-After')).toBeTruthy();
    expect((await POST(post(valid, '198.51.100.20'))).status).toBe(200);
    expect(sendMail).toHaveBeenCalledTimes(4);
  });

  it('HTML échappé dans le mail', async () => {
    const POST = await loadPost();
    await POST(post({ ...valid, message: '<script>alert(1)</script>' }));
    const html = sendMail.mock.calls[0][0].html as string;
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });
});

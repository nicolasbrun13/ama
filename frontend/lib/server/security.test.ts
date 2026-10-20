import { describe, expect, it } from 'vitest';
import { createRateLimiter } from './rateLimit';
import { forwardedIpHeaders, getClientIp, readJsonBody } from './request';
import { isSafeEmail } from '../validateEmail';

const req = (headers: Record<string, string>, body = '{}') =>
  new Request('http://localhost/api/x', { method: 'POST', headers, body });

describe('getClientIp / forwardedIpHeaders', () => {
  it('priorité à CF-Connecting-IP', () => {
    const r = req({ 'cf-connecting-ip': '203.0.113.5', 'x-real-ip': '10.0.0.1', 'x-forwarded-for': '1.1.1.1' });
    expect(getClientIp(r)).toBe('203.0.113.5');
    expect(forwardedIpHeaders(r)).toEqual({ 'X-Forwarded-For': '203.0.113.5' });
  });
  it('puis X-Real-IP, puis le premier X-Forwarded-For', () => {
    expect(getClientIp(req({ 'x-real-ip': '10.0.0.1', 'x-forwarded-for': '1.1.1.1' }))).toBe('10.0.0.1');
    expect(getClientIp(req({ 'x-forwarded-for': '1.1.1.1, 2.2.2.2' }))).toBe('1.1.1.1');
  });
  it("aucun en-tête : chaîne vide, rien n'est transmis", () => {
    expect(getClientIp(req({}))).toBe('');
    expect(forwardedIpHeaders(req({}))).toEqual({});
  });
});

describe('readJsonBody', () => {
  it('JSON mal formé → null', async () => {
    expect(await readJsonBody(req({ 'content-type': 'application/json' }, '{"a":'))).toBeNull();
  });
  it('JSON valide → objet', async () => {
    expect(await readJsonBody(req({}, '{"a":1}'))).toEqual({ a: 1 });
  });
});

describe('createRateLimiter', () => {
  it('3 / 10 min par clé, puis refus avec Retry-After', () => {
    const check = createRateLimiter({ limit: 3, windowMs: 600_000 });
    const t0 = 1_000_000;
    expect(check('a', t0).allowed).toBe(true);
    expect(check('a', t0 + 1).allowed).toBe(true);
    expect(check('a', t0 + 2).allowed).toBe(true);
    const blocked = check('a', t0 + 3);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSec).toBe(600);
    expect(check('b', t0 + 3).allowed).toBe(true); // autre IP non impactée
    expect(check('a', t0 + 600_001).allowed).toBe(true); // fenêtre écoulée
  });
});

describe('isSafeEmail', () => {
  it.each(['a@x.fr', 'jean.dupont+hre@example.co.uk'])('accepte %s', (e) => {
    expect(isSafeEmail(e)).toBe(true);
  });
  it.each([
    'a@x.fr,b@y.fr', 'a@x.fr;b@y.fr', 'a@x.fr\nBcc: b@y.fr', 'a b@x.fr', '<a@x.fr>', 'a@x', '', 'a@@x.fr',
  ])('refuse %j', (e) => {
    expect(isSafeEmail(e)).toBe(false);
  });
  it('refuse un non-string', () => {
    expect(isSafeEmail({ evil: 1 })).toBe(false);
  });
});

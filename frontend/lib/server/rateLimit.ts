/**
 * Limiteur en mémoire (fenêtre glissante) par clé (IP).
 * Suffisant ici : un seul conteneur Next en prod. Remis à zéro au redémarrage.
 */
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, number[]>();

  return function check(key: string, now = Date.now()): { allowed: boolean; retryAfterSec: number } {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

    // Ménage pour éviter que la Map grossisse indéfiniment
    if (hits.size > 5000) {
      for (const [k, ts] of hits) if (ts.every((t) => now - t >= windowMs)) hits.delete(k);
    }

    if (recent.length >= limit) {
      hits.set(key, recent);
      return { allowed: false, retryAfterSec: Math.ceil((recent[0] + windowMs - now) / 1000) };
    }
    recent.push(now);
    hits.set(key, recent);
    return { allowed: true, retryAfterSec: 0 };
  };
}

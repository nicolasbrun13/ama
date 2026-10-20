'use client';
import { useCallback, useEffect, useState } from 'react';

export type AvailabilityStatus = 'loading' | 'ready' | 'error';

const basePath = () => process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const EMPTY = new Set<string>();

/** Dates (YYYY-MM-DD) déjà réservées pour un mois "YYYY-MM". Lance une erreur si le chargement échoue. */
export async function fetchTakenDates(monthStr: string, signal?: AbortSignal): Promise<Set<string>> {
  const res = await fetch(`${basePath()}/api/availability?month=${monthStr}`, { signal, cache: 'no-store' });
  if (!res.ok) throw new Error(`availability HTTP ${res.status}`);
  const data = await res.json() as { taken?: unknown };
  if (!Array.isArray(data.taken)) throw new Error('availability: réponse invalide');
  return new Set((data.taken as { date: string }[]).map((t) => t.date));
}

/**
 * Créneaux pris pour le mois affiché (month : 0-11).
 * Tant que status !== 'ready', les calendriers ne doivent RIEN rendre sélectionnable :
 * un échec de chargement ne veut pas dire "tout est libre".
 */
export function useTakenDates(year: number, month: number) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ key: string; taken: Set<string> | null } | null>(null);

  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
  const key = `${monthStr}#${attempt}`;

  useEffect(() => {
    const ctrl = new AbortController();
    fetchTakenDates(monthStr, ctrl.signal)
      .then((taken) => setResult({ key, taken }))
      .catch(() => { if (!ctrl.signal.aborted) setResult({ key, taken: null }); });
    return () => ctrl.abort();
  }, [key, monthStr]);

  // Statut dérivé : un résultat d'un autre mois (ou d'un essai précédent) = encore en chargement
  const status: AvailabilityStatus =
    result?.key !== key ? 'loading' : result.taken ? 'ready' : 'error';
  const taken = status === 'ready' && result?.taken ? result.taken : EMPTY;

  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  return { taken, status, retry };
}

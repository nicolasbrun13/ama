import { useEffect, useState, type RefObject } from 'react';

/** Passe a true (une seule fois) quand l'element approche de l'ecran. Sert a ne charger les videos que lorsqu'elles deviennent utiles. */
export function useNearViewport(ref: RefObject<Element | null>, rootMargin = '300px 0px'): boolean {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      const t = setTimeout(() => setNear(true), 0);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setNear(true); io.disconnect(); }
    }, { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);

  return near;
}

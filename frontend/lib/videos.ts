const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/**
 * Fichiers de public/videos/ : le nom contient un hash du contenu, ce qui permet de les servir
 * avec Cache-Control immutable (voir next.config.ts). Si une video ou un poster change, regenerer
 * le fichier sous un NOUVEAU nom et mettre cette table a jour. Ne jamais reutiliser un nom.
 * Les cles sont les anciens noms logiques (/videos/1610.mp4) utilises dans les pages.
 */
const FILES: Record<string, { video: string; poster: string }> = {
  '1610':  { video: '1610.651cc8bd.mp4',  poster: '1610.5bc7e880.webp' },
  '30063': { video: '30063.f080a86f.mp4', poster: '30063.8a168c20.webp' },
  '4034':  { video: '4034.fb708897.mp4',  poster: '4034.f97b0aa4.webp' },
  '10418': { video: '10418.14093a76.mp4', poster: '10418.f6e1b1fe.webp' },
  '30073': { video: '30073.056ea76c.mp4', poster: '30073.594f1bd5.webp' },
};

/** '/videos/1610.mp4' -> { src, poster } avec le basePath ; une URL http passe telle quelle, sans poster. */
export function resolveVideo(path: string): { src: string; poster?: string } {
  if (path.startsWith('http')) return { src: path };
  const key = path.match(/\/(\d+)\.mp4$/)?.[1];
  const f = key ? FILES[key] : undefined;
  if (!f) return { src: `${BASE}${path}` };
  return { src: `${BASE}/videos/${f.video}`, poster: `${BASE}/videos/${f.poster}` };
}

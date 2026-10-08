'use client';
import { useEffect, useRef } from 'react';

const DEFAULT_VIDEO = 'https://assets.mixkit.co/videos/1610/1610-1080.mp4';

interface Props {
  overlay?: string;
  videoSrc?: string;
}

export default function VideoBackground({ overlay = 'rgba(6,3,15,.72)', videoSrc = DEFAULT_VIDEO }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    let W = 1, H = 1;

    function resize() {
      const p = canvas!.parentElement;
      if (!p) return;
      W = canvas!.width = p.clientWidth || 800;
      H = canvas!.height = p.clientHeight || 400;
    }

    function rnd(a: number, b: number) { return a + Math.random() * (b - a); }

    interface Star {
      x: number; y: number; vx: number; vy: number;
      spd: number; len: number; w: number; a: number;
      out: boolean; gold: boolean;
    }

    function makeStar(): Star {
      const angle = rnd(28, 52) * Math.PI / 180;
      const spd = rnd(5, 10);
      return {
        x: rnd(0, W * 0.88), y: rnd(-20, H * 0.55),
        vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd,
        spd, len: rnd(55, 140), w: rnd(0.7, 1.9),
        a: 0, out: false, gold: Math.random() > 0.72,
      };
    }

    let pool: Star[] = [];
    let lastSpawn = 0;
    let nextDelay = rnd(300, 900);
    let rafId: number;

    resize();
    const ro = window.ResizeObserver
      ? new ResizeObserver(resize)
      : null;
    if (ro && canvas.parentElement) ro.observe(canvas.parentElement);
    else window.addEventListener('resize', resize);

    function loop(t: number) {
      ctx.clearRect(0, 0, W, H);
      if (t - lastSpawn > nextDelay) {
        pool.push(makeStar());
        lastSpawn = t;
        nextDelay = rnd(900, 2400);
        if (pool.length > 6) pool.shift();
      }
      for (let i = pool.length - 1; i >= 0; i--) {
        const s = pool[i];
        s.x += s.vx; s.y += s.vy;
        if (!s.out) { s.a = Math.min(s.a + 0.045, 0.82); if (s.a >= 0.82) s.out = true; }
        else s.a -= 0.022;
        if (s.a <= 0 || s.x > W + 80 || s.y > H + 40) { pool.splice(i, 1); continue; }
        const nx = s.vx / s.spd, ny = s.vy / s.spd;
        const tx = s.x - nx * s.len, ty = s.y - ny * s.len;
        const g = ctx.createLinearGradient(tx, ty, s.x, s.y);
        const rgb = s.gold ? '232,191,80' : '255,255,255';
        g.addColorStop(0, `rgba(${rgb},0)`);
        g.addColorStop(0.55, `rgba(${rgb},${(s.a * 0.28).toFixed(2)})`);
        g.addColorStop(1, `rgba(${rgb},${s.a.toFixed(2)})`);
        ctx.save(); ctx.beginPath(); ctx.strokeStyle = g; ctx.lineWidth = s.w;
        ctx.lineCap = 'round'; ctx.moveTo(tx, ty); ctx.lineTo(s.x, s.y); ctx.stroke(); ctx.restore();
      }
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="vid-bg" style={{ '--vid-overlay': overlay } as React.CSSProperties}>
      <video autoPlay muted loop playsInline suppressHydrationWarning>
        <source src={videoSrc} type="video/mp4" suppressHydrationWarning />
      </video>
      <canvas ref={canvasRef} className="vid-canvas" />
    </div>
  );
}

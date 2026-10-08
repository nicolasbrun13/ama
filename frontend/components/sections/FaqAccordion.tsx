'use client';
import { useState } from 'react';

type FaqItem = { q: string; a: string };

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            background: 'rgba(6,3,15,.6)',
            border: `1px solid ${open === i ? 'rgba(200,88,122,.35)' : 'var(--border)'}`,
            borderRadius: '8px', overflow: 'hidden',
            transition: 'border-color .25s',
          }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', gap: '1rem',
              padding: '1.25rem 1.75rem', background: 'none', border: 'none',
              cursor: 'pointer', textAlign: 'left' as const,
            }}
          >
            <span style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--white)', lineHeight: 1.5 }}>
              {item.q}
            </span>
            <span style={{
              flexShrink: 0, width: '26px', height: '26px',
              border: '1px solid var(--rose)', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--rose)', fontSize: '1.1rem', lineHeight: 1,
              transition: 'transform .25s, background .25s',
              transform: open === i ? 'rotate(45deg)' : 'none',
              background: open === i ? 'rgba(200,88,122,.1)' : 'transparent',
              fontFamily: 'monospace',
            }}>
              +
            </span>
          </button>
          <div style={{
            maxHeight: open === i ? '300px' : '0',
            overflow: 'hidden',
            transition: 'max-height .38s ease',
          }}>
            <p style={{
              padding: '0 1.75rem 1.25rem',
              fontSize: '.82rem', color: 'var(--dim)', lineHeight: 1.75,
            }}>
              {item.a}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

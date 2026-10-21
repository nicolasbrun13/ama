import { useId } from 'react';

/**
 * Petite fleur du header (5 petales et un coeur creux). Dessinee en SVG : le caractere "✿" change de forme
 * selon la police du telephone, ce dessin reste identique partout. Elle prend la couleur et la taille du texte.
 */
export default function FlowerIcon({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  const petals = [-90, -18, 54, 126, 198].map((deg) => {
    const a = (deg * Math.PI) / 180;
    return { cx: 12 + 6.3 * Math.cos(a), cy: 12 + 6.3 * Math.sin(a) };
  });
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: '-0.12em' }}>
      <defs>
        <mask id={id}>
          <rect width="24" height="24" fill="white" />
          <circle cx="12" cy="12" r="2.7" fill="black" />
        </mask>
      </defs>
      <g fill="currentColor" mask={`url(#${id})`}>
        {petals.map((p, i) => <circle key={i} cx={p.cx} cy={p.cy} r="5.3" />)}
        <circle cx="12" cy="12" r="6" />
      </g>
    </svg>
  );
}

// Flower of Life — R=60 (petit modèle), deux centres gauche/droite
const R  = 60;
const H  = R * Math.sqrt(3) / 2; // ~51.96
const CY = 260;

function makeCircles(cx: number) {
  return [
    { x: cx - R,     y: CY - 2*H },
    { x: cx,         y: CY - 2*H },
    { x: cx + R,     y: CY - 2*H },
    { x: cx - 1.5*R, y: CY - H   },
    { x: cx - 0.5*R, y: CY - H   },
    { x: cx + 0.5*R, y: CY - H   },
    { x: cx + 1.5*R, y: CY - H   },
    { x: cx - 2*R,   y: CY       },
    { x: cx - R,     y: CY       },
    { x: cx,         y: CY       },
    { x: cx + R,     y: CY       },
    { x: cx + 2*R,   y: CY       },
    { x: cx - 1.5*R, y: CY + H   },
    { x: cx - 0.5*R, y: CY + H   },
    { x: cx + 0.5*R, y: CY + H   },
    { x: cx + 1.5*R, y: CY + H   },
    { x: cx - R,     y: CY + 2*H },
    { x: cx,         y: CY + 2*H },
    { x: cx + R,     y: CY + 2*H },
  ];
}

// LEFT=180 → cercle le + à gauche en cx=60, r=60 → point gauche = x=0 ✓
// RIGHT=820 → cercle le + à droite en cx=940, r=60 → point droit = x=1000 ✓
const LEFT   = 180;
const RIGHT  = 820;
const L_CIRC = makeCircles(LEFT);
const R_CIRC = makeCircles(RIGHT);

export default function SacredGeometryBg() {
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0 }}>
      <svg width="100%" height="100%" viewBox="0 0 1000 520" preserveAspectRatio="xMidYMid slice">
        <defs>
          <clipPath id="sgClip">
            <rect x="0" y="0" width="1000" height="520"/>
          </clipPath>
        </defs>

        {/* Rosace gauche */}
        <g clipPath="url(#sgClip)" opacity="0.10">
          <animateTransform
            attributeName="transform" attributeType="XML" type="rotate"
            from={`0 ${LEFT} ${CY}`} to={`360 ${LEFT} ${CY}`}
            dur="90s" repeatCount="indefinite"
          />
          {L_CIRC.map((c,i) => (
            <circle key={i} cx={c.x} cy={c.y} r={R}
              fill="none" stroke="rgba(200,88,122,1)" strokeWidth="0.8"/>
          ))}
        </g>

        {/* Rosace droite */}
        <g clipPath="url(#sgClip)" opacity="0.10">
          <animateTransform
            attributeName="transform" attributeType="XML" type="rotate"
            from={`0 ${RIGHT} ${CY}`} to={`360 ${RIGHT} ${CY}`}
            dur="90s" repeatCount="indefinite"
          />
          {R_CIRC.map((c,i) => (
            <circle key={i} cx={c.x} cy={c.y} r={R}
              fill="none" stroke="rgba(200,88,122,1)" strokeWidth="0.8"/>
          ))}
        </g>
      </svg>
    </div>
  );
}

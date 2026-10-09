// Flower of Life — R=90, rosace centrée unique
const R  = 90;
const H  = R * Math.sqrt(3) / 2; // ~77.94
const CX = 500;
const CY = 260;

const CIRCLES = [
  { x: CX - R,     y: CY - 2*H },
  { x: CX,         y: CY - 2*H },
  { x: CX + R,     y: CY - 2*H },
  { x: CX - 1.5*R, y: CY - H   },
  { x: CX - 0.5*R, y: CY - H   },
  { x: CX + 0.5*R, y: CY - H   },
  { x: CX + 1.5*R, y: CY - H   },
  { x: CX - 2*R,   y: CY       },
  { x: CX - R,     y: CY       },
  { x: CX,         y: CY       },
  { x: CX + R,     y: CY       },
  { x: CX + 2*R,   y: CY       },
  { x: CX - 1.5*R, y: CY + H   },
  { x: CX - 0.5*R, y: CY + H   },
  { x: CX + 0.5*R, y: CY + H   },
  { x: CX + 1.5*R, y: CY + H   },
  { x: CX - R,     y: CY + 2*H },
  { x: CX,         y: CY + 2*H },
  { x: CX + R,     y: CY + 2*H },
];

export default function SacredGeometryBg() {
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0 }}>
      <svg width="100%" height="100%" viewBox="0 0 1000 520" preserveAspectRatio="xMidYMid slice">
        <defs>
          <clipPath id="sgClip">
            <rect x="0" y="0" width="1000" height="520"/>
          </clipPath>
        </defs>

        <g clipPath="url(#sgClip)" opacity="0.10">
          <animateTransform
            attributeName="transform" attributeType="XML" type="rotate"
            from={`0 ${CX} ${CY}`} to={`360 ${CX} ${CY}`}
            dur="90s" repeatCount="indefinite"
          />
          {CIRCLES.map((c,i) => (
            <circle key={i} cx={c.x} cy={c.y} r={R}
              fill="none" stroke="rgba(200,88,122,1)" strokeWidth="0.8"/>
          ))}
        </g>
      </svg>
    </div>
  );
}

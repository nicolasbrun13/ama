// Vraies constellations astronomiques — coordonnées SVG 1000×470
// r = rayon visuel (proportionnel à la magnitude apparente)

type Star  = { x: number; y: number; r: number };
type Const = { stars: Star[]; lines: [number,number][] };

// ─── Cassiopée (W) ────────────────────────────────────────────────────────────
const CASSIOPEIA: Const = {
  stars:[
    { x:58,  y:72,  r:1.6 }, // Segin
    { x:118, y:44,  r:2.0 }, // Ruchbah
    { x:178, y:76,  r:2.6 }, // Cih
    { x:238, y:44,  r:2.3 }, // Schedar
    { x:296, y:70,  r:1.8 }, // Caph
  ],
  lines:[[0,1],[1,2],[2,3],[3,4]],
};

// ─── Grande Ourse ─────────────────────────────────────────────────────────────
const URSA_MAJOR: Const = {
  stars:[
    { x:425, y:56,  r:1.9 }, // Alkaid
    { x:497, y:72,  r:2.0 }, // Mizar
    { x:566, y:60,  r:2.4 }, // Alioth
    { x:614, y:100, r:1.6 }, // Megrez
    { x:606, y:46,  r:2.6 }, // Dubhe
    { x:656, y:112, r:2.2 }, // Merak
    { x:648, y:158, r:1.6 }, // Phecda
  ],
  lines:[
    [0,1],[1,2],[2,3],
    [3,4],[4,5],[5,6],[6,3],
  ],
};

// ─── Orion ────────────────────────────────────────────────────────────────────
const ORION: Const = {
  stars:[
    { x:830, y:52,  r:1.5 }, // Meissa
    { x:752, y:154, r:3.2 }, // Betelgeuse
    { x:905, y:138, r:2.2 }, // Bellatrix
    { x:768, y:260, r:2.0 }, // Mintaka
    { x:822, y:270, r:2.4 }, // Alnilam
    { x:876, y:260, r:2.0 }, // Alnitak
    { x:776, y:398, r:1.8 }, // Saiph
    { x:910, y:378, r:3.4 }, // Rigel
  ],
  lines:[
    [0,1],[0,2],
    [1,3],[2,5],
    [3,4],[4,5],
    [3,6],[5,7],
  ],
};

// ─── Cygne (Croix du Nord) ───────────────────────────────────────────────────
const CYGNUS: Const = {
  stars:[
    { x:462, y:288, r:3.0 }, // Deneb
    { x:494, y:348, r:2.0 }, // Sadr
    { x:494, y:428, r:1.6 }, // Albireo
    { x:420, y:370, r:1.4 }, // Delta
    { x:568, y:370, r:1.4 }, // Gienah
  ],
  lines:[[0,1],[1,2],[3,1],[1,4]],
};

// ─── Lyre ────────────────────────────────────────────────────────────────────
const LYRA: Const = {
  stars:[
    { x:118, y:330, r:3.5 }, // Vega
    { x:92,  y:384, r:1.2 }, // Epsilon
    { x:150, y:370, r:1.2 }, // Zeta
    { x:96,  y:420, r:1.4 }, // Sulafat
    { x:152, y:406, r:1.4 }, // Sheliak
  ],
  lines:[[0,1],[0,2],[1,3],[3,4],[4,2]],
};

const ALL: Const[] = [CASSIOPEIA, URSA_MAJOR, ORION, CYGNUS, LYRA];

// Petites étoiles de fond
const BG_STARS = [
  {x:350,y:185},{x:310,y:290},{x:380,y:390},{x:200,y:210},
  {x:680,y:320},{x:730,y:430},{x:570,y:240},{x:140,y:260},
  {x:455,y:155},{x:330,y:410},{x:720,y:180},
];

export default function ConstellationBg() {
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0 }}>
      <svg width="100%" height="100%" viewBox="0 0 1000 470" preserveAspectRatio="xMidYMid slice">

        {/* Rotation lente — ciel qui tourne (360° en 200s) */}
        <g>
          <animateTransform
            attributeName="transform" attributeType="XML" type="rotate"
            from="0 500 235" to="360 500 235"
            dur="200s" repeatCount="indefinite"
          />

          {/* Étoiles de fond */}
          <g opacity="0.12">
            {BG_STARS.map((s,i) => (
              <circle key={`bg${i}`} cx={s.x} cy={s.y} r="0.9" fill="white"/>
            ))}
          </g>

          {/* Constellations */}
          <g opacity="0.10">
            {ALL.map((c, ci) => (
              <g key={ci}>
                {c.lines.map(([a,b],i) => (
                  <line key={i}
                    x1={c.stars[a].x} y1={c.stars[a].y}
                    x2={c.stars[b].x} y2={c.stars[b].y}
                    stroke="rgba(200,88,122,1)" strokeWidth="0.6"
                  />
                ))}
                {c.stars.map((s,i) => (
                  <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white">
                    <animate
                      attributeName="opacity"
                      values={s.r >= 2.8 ? '1;0.6;1' : '1;0.75;1'}
                      dur={`${4 + (ci + i) * 0.5}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                ))}
              </g>
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}

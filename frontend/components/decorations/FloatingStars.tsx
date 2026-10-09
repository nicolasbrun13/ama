// Pluie d'étoiles — tombent du haut vers le bas en continu
const STARS = [
  { x:'2%',  size:'.9rem',  delay:'0s',    dur:'10s',   sym:'✦', rose:true  },
  { x:'7%',  size:'.65rem', delay:'3.2s',  dur:'8.5s',  sym:'⋆', rose:false },
  { x:'13%', size:'.8rem',  delay:'6.8s',  dur:'9.5s',  sym:'✧', rose:false },
  { x:'19%', size:'1rem',   delay:'1.5s',  dur:'11s',   sym:'✦', rose:false },
  { x:'26%', size:'.55rem', delay:'4.9s',  dur:'8s',    sym:'⋆', rose:true  },
  { x:'33%', size:'.85rem', delay:'2.1s',  dur:'10.5s', sym:'✦', rose:false },
  { x:'40%', size:'.7rem',  delay:'7.4s',  dur:'9s',    sym:'✧', rose:false },
  { x:'47%', size:'1.1rem', delay:'0.6s',  dur:'11.5s', sym:'✦', rose:true  },
  { x:'54%', size:'.6rem',  delay:'5.3s',  dur:'8.5s',  sym:'⋆', rose:false },
  { x:'61%', size:'.9rem',  delay:'3.7s',  dur:'10s',   sym:'✦', rose:false },
  { x:'68%', size:'.75rem', delay:'1.2s',  dur:'9.5s',  sym:'✧', rose:false },
  { x:'75%', size:'.65rem', delay:'8.0s',  dur:'8s',    sym:'⋆', rose:true  },
  { x:'82%', size:'1rem',   delay:'2.8s',  dur:'10.5s', sym:'✦', rose:false },
  { x:'88%', size:'.8rem',  delay:'6.1s',  dur:'9s',    sym:'✧', rose:false },
  { x:'94%', size:'.55rem', delay:'4.4s',  dur:'11s',   sym:'⋆', rose:true  },
  // Deuxième couche pour combler les vides
  { x:'5%',  size:'.75rem', delay:'5.6s',  dur:'9s',    sym:'✧', rose:false },
  { x:'22%', size:'.9rem',  delay:'9.2s',  dur:'10s',   sym:'✦', rose:false },
  { x:'44%', size:'.6rem',  delay:'2.4s',  dur:'8.5s',  sym:'⋆', rose:false },
  { x:'70%', size:'1rem',   delay:'7.8s',  dur:'11.5s', sym:'✦', rose:true  },
  { x:'91%', size:'.7rem',  delay:'1.8s',  dur:'9.5s',  sym:'✧', rose:false },
];

export default function FloatingStars() {
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0 }}>
      {STARS.map((s, i) => (
        <span key={i} style={{
          position:'absolute',
          left: s.x,
          top: 0,
          fontSize: s.size,
          color: s.rose ? 'var(--rose)' : 'rgba(253,240,247,1)',
          opacity: 0,
          animation: `starRain${i % 4} ${s.dur} linear ${s.delay} infinite`,
          display: 'block', lineHeight: 1,
        }}>{s.sym}</span>
      ))}
      <style>{`
        @keyframes starRain0 {
          0%   { transform: translateY(-24px) rotate(0deg);   opacity: 0; }
          8%   { opacity: 0.72; }
          82%  { opacity: 0.38; }
          100% { transform: translateY(900px) rotate(30deg);  opacity: 0; }
        }
        @keyframes starRain1 {
          0%   { transform: translateY(-24px) rotate(0deg);   opacity: 0; }
          10%  { opacity: 0.55; }
          80%  { opacity: 0.28; }
          100% { transform: translateY(900px) rotate(-18deg); opacity: 0; }
        }
        @keyframes starRain2 {
          0%   { transform: translateY(-24px) scale(1);       opacity: 0; }
          12%  { opacity: 0.65; }
          84%  { opacity: 0.32; }
          100% { transform: translateY(900px) scale(0.85);    opacity: 0; }
        }
        @keyframes starRain3 {
          0%   { transform: translateY(-24px) rotate(0deg);   opacity: 0; }
          9%   { opacity: 0.48; }
          86%  { opacity: 0.22; }
          100% { transform: translateY(900px) rotate(45deg);  opacity: 0; }
        }
      `}</style>
    </div>
  );
}

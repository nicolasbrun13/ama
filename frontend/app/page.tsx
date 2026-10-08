import HeroSection from '@/components/sections/HeroSection';
import MethodeSection from '@/components/sections/MethodeSection';
import BienfaitsSection from '@/components/sections/BienfaitsSection';
import ResaSection from '@/components/sections/ResaSection';
import YoutubeSection from '@/components/sections/YoutubeSection';
import AvisSection from '@/components/sections/AvisSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ama — Hypnose Régressive Ésotérique (HRE)',
  description: 'Avec la méthode HRE de Calogéro Grifasi, Ama vous accompagne dans une exploration profonde de votre inconscient pour libérer blocages et schémas répétitifs.',
};

const RoseLabel = ({ hex, name }: { hex: string; name: string }) => (
  <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '.6rem 0', background: 'rgba(0,0,0,.5)', borderTop: `3px solid ${hex}`, fontFamily: 'monospace', fontSize: '.75rem', letterSpacing: '.08em', color: '#fff' }}>
    {hex} — {name}
  </div>
);

export default function Home() {
  return (
    <main>
      <HeroSection />

      {/* ── Rose A : #C8587A (actuel) ── */}
      <RoseLabel hex="#C8587A" name="actuel" />
      <MethodeSection />

      {/* ── Rose B : #C4707C (doux-rosé) ── */}
      <div style={{ '--rose': '#C4707C', '--rose-deep': '#9E4A5C', '--rose-neon': '#CE7A88', '--rose-dim': 'rgba(196,112,124,.08)', '--border': 'rgba(196,112,124,.12)' } as React.CSSProperties}>
        <RoseLabel hex="#C4707C" name="rose doux-rosé" />
        <MethodeSection />
      </div>

      {/* ── Rose C : #BC6B70 (poudré / dusty) ── */}
      <div style={{ '--rose': '#BC6B70', '--rose-deep': '#8C4A4E', '--rose-neon': '#C87878', '--rose-dim': 'rgba(188,107,112,.08)', '--border': 'rgba(188,107,112,.12)' } as React.CSSProperties}>
        <RoseLabel hex="#BC6B70" name="rose poudré / dusty" />
        <MethodeSection />
      </div>

      <BienfaitsSection />
      <ResaSection />
      <YoutubeSection />
      <AvisSection />
    </main>
  );
}

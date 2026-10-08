import HeroSection from '@/components/sections/HeroSection';
import MethodeSection from '@/components/sections/MethodeSection';
import BienfaitsSection from '@/components/sections/BienfaitsSection';
import ResaSection from '@/components/sections/ResaSection';
import CalendarSection from '@/components/sections/CalendarSection';
import YoutubeSection from '@/components/sections/YoutubeSection';
import AvisSection from '@/components/sections/AvisSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ama — Hypnose Régressive Ésotérique (HRE)',
  description: 'Avec la méthode HRE de Calogéro Grifasi, Ama vous accompagne dans une exploration profonde de votre inconscient pour libérer blocages et schémas répétitifs.',
};

export default function Home() {
  return (
    <main>
      <HeroSection />
      <MethodeSection />
      <BienfaitsSection />
      <ResaSection />
      <CalendarSection />
      <YoutubeSection />
      <AvisSection />
    </main>
  );
}

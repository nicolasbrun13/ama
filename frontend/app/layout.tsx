import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Ama — Hypnose Régressive Ésotérique (HRE)",
  description: "Avec la méthode HRE de Calogéro Grifasi, Ama vous accompagne dans une exploration profonde de votre inconscient pour libérer blocages et schémas répétitifs.",
  icons: { icon: '/favicon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

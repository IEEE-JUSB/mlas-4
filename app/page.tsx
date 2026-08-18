import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import AgendaSection from "@/components/agenda-section";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <HeroSection />
      <AboutSection />
      <AgendaSection />
    </main>
  );
}

import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/front-page/about-section";
import AgendaSection from "@/components/front-page/agenda-section";
import ContactSection from "@/components/front-page/contact-us";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <HeroSection />
      <AboutSection />
      <AgendaSection />
      <ContactSection />
    </main>
  );
}

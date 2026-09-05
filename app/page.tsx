import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/front-page/about-section";
import CommunityPartnerSection from "@/components/front-page/community-partners";
import AgendaSection from "@/components/front-page/agenda-section";
import ContactSection from "@/components/front-page/contact-us";
import FAQSection from "@/components/front-page/faq-section";
import SpeakersSection from "@/components/front-page/speakers";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <HeroSection />
      <AboutSection />
      <CommunityPartnerSection />
      <SpeakersSection />
      <AgendaSection />
      <FAQSection />
      <ContactSection />
    </main>
  );
}

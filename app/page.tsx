import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/front-page/about-section";
import CommunityPartnerSection from "@/components/front-page/community-partners";
import AgendaSection from "@/components/front-page/agenda-section";
import ContactSection from "@/components/front-page/contact-us";
import FAQSection from "@/components/front-page/faq-section";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <HeroSection />
      <AboutSection />
      <CommunityPartnerSection />
      <AgendaSection />
      <FAQSection />
      <ContactSection />
    </main>
  );
}

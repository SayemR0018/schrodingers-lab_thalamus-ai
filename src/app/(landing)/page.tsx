import { About } from "@/landing/components/sections/About";
import { AudienceDifferentiation } from "@/landing/components/sections/AudienceDifferentiation";
import { BusinessQuestions } from "@/landing/components/sections/BusinessQuestions";
import { EvidenceControl } from "@/landing/components/sections/EvidenceControl";
import { Footer } from "@/landing/components/footer/Footer";
import { Hero } from "@/landing/components/hero/Hero";
import { HowItWorks } from "@/landing/components/sections/HowItWorks";
import { Integrations } from "@/landing/components/sections/Integrations";
import { Metrics } from "@/landing/components/sections/Metrics";
import { Navbar } from "@/landing/components/navigation/Navbar";
import { Newsletter } from "@/landing/components/sections/Newsletter";
import { PlatformSection } from "@/landing/components/platform/PlatformSection";
import { Pricing } from "@/landing/components/sections/Pricing";
import { ProductStory } from "@/landing/components/sections/ProductStory";
import { ProblemSection } from "@/landing/components/sections/ProblemSection";
import { Resources } from "@/landing/components/sections/Resources";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <ProblemSection />
        <Metrics />
        <HowItWorks />
        <ProductStory />
        <PlatformSection />
        <BusinessQuestions />
        <EvidenceControl />
        <Integrations />
        <AudienceDifferentiation />
        <About />
        <Resources />
        <Pricing />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}

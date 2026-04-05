export const dynamic = "force-dynamic";

import Hero from "@/components/layout/Hero";
import MissionSection from "@/components/home/MissionSection";
import Collections from "@/components/home/Collections";
import WhyThisExists from "@/components/home/WhyThisExists";
import HowItWorks from "@/components/home/HowItWorks";
import EmailSignup from "@/components/home/EmailSignup";

export default function Home() {
  return (
    <>
      <Hero
        imageSrc="/images/hero/LLHeroImage.jpg"
        subtitle="Art that reflects light, truth, and the beauty of God's creation."
      />
      <MissionSection />
      <Collections />
      <WhyThisExists />
      <HowItWorks />
      <EmailSignup />
    </>
  );
}

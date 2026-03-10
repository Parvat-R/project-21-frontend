import { Navbar } from "@/components/common/Navbar";
import HeroSection from "@/components/Home/HeroSection";
import HomeStorySection from "@/components/Home/HomeStorySection";
import EventSection from "@/components/Home/EventSection";
import ServicesSection from "@/components/Home/ServiceSection";
import WhyChooseEventSystem from "@/components/Home/WhyChooseEvent";
import EventFeaturesSection from "@/components/Home/EventFeatureSection";
import Footer from "@/components/Home/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <HeroSection />
      <HomeStorySection />
      <EventSection />
      <ServicesSection />
      <WhyChooseEventSystem />
      <EventFeaturesSection />
      <Footer />
    </div>
  );
}

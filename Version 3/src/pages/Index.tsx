import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { Stats } from "@/components/Stats";
import { Services } from "@/components/Services";
import { AboutIntro } from "@/components/AboutIntro";
import { GalleryStrip } from "@/components/GalleryStrip";
import { FounderCard } from "@/components/FounderCard";
import { FAQ } from "@/components/FAQ";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <AboutIntro />
      <GalleryStrip />
      <Stats />
      <Services />
      <FAQ />
      <FounderCard />
      <Footer />
    </div>
  );
};

export default Index;

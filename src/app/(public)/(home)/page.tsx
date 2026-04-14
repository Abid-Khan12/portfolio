// Sections
import HeroSection from "@/components/sections/home/hero-section";
import AboutMeSection from "@/components/sections/home/aboutme-section";
import FeaturedProjectsSection from "@/components/sections/home/featured-projects-section";

import { Separator } from "@/components/ui/separator";

const page = () => {
   return (
      <main className="flex flex-col gap-10">
         <HeroSection />

         <Separator />

         <FeaturedProjectsSection />

         <Separator />

         <AboutMeSection />
      </main>
   );
};

export default page;

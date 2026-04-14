// Sections
import AboutSection from "@/components/sections/about/about-section";
import CapabilitiesSection from "@/components/sections/about/capabilities-section";
import ExperianceSection from "@/components/sections/about/experiance-section";

import { Separator } from "@/components/ui/separator";

const AboutPage = () => {
   return (
      <main className="flex flex-col gap-10">
         <AboutSection />

         <Separator />

         <CapabilitiesSection />

         <Separator />

         <ExperianceSection />
      </main>
   );
};

export default AboutPage;

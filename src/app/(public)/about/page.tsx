import type { Metadata } from "next";
// Sections
import AboutSection from "@/components/sections/about/about-section";
import CapabilitiesSection from "@/components/sections/about/capabilities-section";
import ExperianceSection from "@/components/sections/about/experiance-section";

import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
   title: "About",
   description:
      "Learn more about Abid Shah Khan — a Frontend Developer with experience at Intersys, skilled in React, Next.js, TypeScript, Tailwind CSS, and React Query.",
   openGraph: {
      title: "About | Abid Shah Khan",
      description:
         "Learn more about Abid Shah Khan — a Frontend Developer with experience at Intersys, skilled in React, Next.js, TypeScript, Tailwind CSS, and React Query.",
      url: "https://abid-khan-portfolio-ebon.vercel.app/about",
   },
   twitter: {
      title: "About | Abid Shah Khan",
      description:
         "Learn more about Abid Shah Khan — a Frontend Developer with experience at Intersys, skilled in React, Next.js, TypeScript, Tailwind CSS, and React Query.",
   },
};

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

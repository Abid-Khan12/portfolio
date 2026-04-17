import type { Metadata } from "next";
// Sections
import HeroSection from "@/components/sections/home/hero-section";
import AboutMeSection from "@/components/sections/home/aboutme-section";
import FeaturedProjectsSection from "@/components/sections/home/featured-projects-section";

import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
   title: "Abid Shah Khan | Frontend Developer",
   description:
      "Hi, I'm Abid Shah Khan — a Frontend Developer from Karachi building fast, scalable web apps with Next.js, React, and TypeScript.",
   openGraph: {
      title: "Abid Shah Khan | Frontend Developer",
      description:
         "Hi, I'm Abid Shah Khan — a Frontend Developer from Karachi building fast, scalable web apps with Next.js, React, and TypeScript.",
      url: "https://abid-khan-portfolio-ebon.vercel.app",
   },
   twitter: {
      title: "Abid Shah Khan | Frontend Developer",
      description:
         "Hi, I'm Abid Shah Khan — a Frontend Developer from Karachi building fast, scalable web apps with Next.js, React, and TypeScript.",
   },
};
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

import type { Metadata } from "next";

import AllProjectsSections from "@/components/sections/projects/all-projects-section";

export const metadata: Metadata = {
   title: "Projects",
   description:
      "Explore projects by Abid Shah Khan — including Cinevia (movie platform), Chat with AI (Gemini-powered chat), and FutureTech (full-stack blog), built with Next.js and React.",
   openGraph: {
      title: "Projects | Abid Shah Khan",
      description:
         "Explore projects by Abid Shah Khan — including Cinevia, Chat with AI, and FutureTech, built with Next.js, React Query, and TypeScript.",
      url: "https://abid-khan-portfolio-ebon.vercel.app/projects",
   },
   twitter: {
      title: "Projects | Abid Shah Khan",
      description:
         "Explore projects by Abid Shah Khan built with Next.js, React Query, and TypeScript.",
   },
};
const ProjectPage = () => {
   return (
      <main className="flex flex-col gap-10">
         <AllProjectsSections />
      </main>
   );
};

export default ProjectPage;

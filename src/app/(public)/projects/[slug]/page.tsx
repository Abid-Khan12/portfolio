import type { Metadata } from "next";

import { getProjectBySlug } from "@/apis/api";

import SingleProjectSection from "@/components/sections/projects/single-project-section";

type Props = {
   params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
   const { slug } = await params;
   const project = await getProjectBySlug(slug);

   if (!project) {
      return {
         title: "Project Not Found",
         description: "This project could not be found.",
         robots: { index: false, follow: false },
      };
   }

   return {
      title: project.title,
      description: project.description,
      openGraph: {
         title: `${project.title} | Abid Shah Khan`,
         description: project.description,
         url: `https://abid-khan-portfolio-ebon.vercel.app/projects/${slug}`,
         images: project.imageUrl
            ? [{ url: project.imageUrl, width: 1200, height: 630, alt: project.title }]
            : undefined,
      },
      twitter: {
         title: `${project.title} | Abid Shah Khan`,
         description: project.description,
         images: project.imageUrl ? [project.imageUrl] : undefined,
      },
   };
}

const SingleProjectPage = async ({ params }: Props) => {
   const { slug } = await params;

   return (
      <main className="flex flex-col gap-10">
         <SingleProjectSection slug={slug} />
      </main>
   );
};

export default SingleProjectPage;

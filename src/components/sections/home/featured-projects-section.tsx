"use client";

import StarterKit from "@tiptap/starter-kit";
import { Editor } from "@tiptap/react";

import { IProject } from "@/models/project-model";

import useFetch from "@/hooks/use-fetch";

import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import ProjectCard from "@/components/card/project-card";

type ProjectResponse = { projects: IProject[] };

const FeaturedProjectsSection = () => {
   const { data, isLoading } = useFetch<ProjectResponse>({
      api_key: ["projects_fetched"],
      api_url: "/projects",
      params: {
         limit: 3,
      },
   });

   if (isLoading) {
      return (
         <section className="w-full flex flex-col gap-10 max-w-7xl mx-auto py-10 px-6">
            <div className="flex  flex-col gap-2">
               <h2 className="font-heading text-4xl tracking-wide font-bold">Recent Projects</h2>
               <p className="text-muted-foreground text-sm max-w-[600px] font-medium">
                  Here are some of the selected projects that showcase my passion for front-end
                  development.
               </p>
            </div>
            <div className="flex flex-col gap-12 w-full">
               {Array.from({ length: 3 }).map((_, i) => (
                  <div
                     key={`item-${i}`}
                     className="w-full grid md:grid-cols-2 gap-4"
                  >
                     <Skeleton className="h-[400px] w-full rounded-xl" />

                     <div className="flex flex-col gap-3">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-25 w-full" />
                        <div className="flex flex-col gap-3">
                           <Skeleton className="h-10 w-40" />
                           <Separator />
                           <div className="flex items-center justify-between">
                              <Skeleton className="h-10 w-40" />
                              <Skeleton className="h-10 w-40" />
                           </div>
                           <Separator />
                           <div className="flex items-center justify-between">
                              <Skeleton className="h-10 w-40" />
                              <Skeleton className="h-10 w-40" />
                           </div>
                           <Separator />
                        </div>
                        <div className="flex items-center justify-between flex-wrap gap-y-3 gap-x-2 ">
                           <Skeleton className="h-10 w-30" />
                           <Skeleton className="h-10 w-30" />
                           <Skeleton className="h-10 w-30" />
                        </div>
                     </div>
                  </div>
               ))}
            </div>
            ;
         </section>
      );
   }

   const projects = data?.data.projects ?? [];

   return (
      <section className="w-full flex flex-col gap-10 max-w-7xl mx-auto py-10 px-6">
         <div className="flex flex-col gap-2">
            <h2 className="font-heading text-4xl tracking-wide font-bold">Recent Projects</h2>
            <p className="text-muted-foreground text-sm max-w-[600px] font-medium">
               Here are some of the selected projects that showcase my passion for front-end
               development.
            </p>
         </div>
         {projects.length === 0 ? (
            <div className="min-h-[60svh] w-full flex items-center justify-center">
               <h3 className="font-heading text-4xl font-semibold">no projects found</h3>
            </div>
         ) : (
            <div className="flex flex-col gap-16">
               {projects.map((item) => {
                  const {
                     projectImage,
                     title,
                     description,
                     createdAt,
                     githubLink,
                     liveLink,
                     role,
                     slug,
                  } = item;
                  const editor = new Editor({
                     extensions: [StarterKit],
                     content: description,
                     editable: false,
                     autofocus: false,
                  });

                  return (
                     <div key={slug}>
                        <ProjectCard
                           slug={slug}
                           title={title}
                           description={editor.getText()}
                           role={role}
                           liveLink={liveLink ?? undefined}
                           githubLink={githubLink}
                           createdAt={createdAt}
                           projectImage={projectImage}
                        />
                     </div>
                  );
               })}
            </div>
         )}
      </section>
   );
};

export default FeaturedProjectsSection;

"use client";

import Image from "next/image";
import StarterKit from "@tiptap/starter-kit";
import { Editor } from "@tiptap/react";
import { format } from "date-fns";

import { IProject } from "@/models/project-model";

import useFetch from "@/hooks/use-fetch";

import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Github } from "@/public";

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
               <h2 className="font-heading text-4xl tracking-wide font-bold">Featured Projects</h2>
               <p className="text-muted-foreground text-sm max-w-[600px] font-medium">
                  Here are some of the selected projects that showcase my passion for front-end
                  development.
               </p>
            </div>
            <div className="flex flex-col gap-12 w-full">
               {Array.from({ length: 3 }).map((_, i) => (
                  <div
                     key={`item-${i}`}
                     className="w-full grid md:grid-cols-2"
                  >
                     <Skeleton className="h-[400px] md:w-[calc(100%-2rem)] w-full rounded-xl" />

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
                           <Skeleton className="h-10 w-40" />
                           <Skeleton className="h-10 w-40" />
                           <Skeleton className="h-10 w-40" />
                        </div>
                     </div>
                  </div>
               ))}
            </div>
            ;
         </section>
      );
   }

   const projects = data?.data.projects;

   return (
      <section className="w-full flex flex-col gap-10 max-w-7xl mx-auto py-10 px-6">
         <div className="flex flex-col gap-2">
            <h2 className="font-heading text-4xl tracking-wide font-bold">Recent Projects</h2>
            <p className="text-muted-foreground text-sm max-w-[600px] font-medium">
               Here are some of the selected projects that showcase my passion for front-end
               development.
            </p>
         </div>
         {!projects ? (
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
                     <div
                        key={item.slug}
                        className="w-full grid md:grid-cols-2 gap-4"
                     >
                        <div className="h-[400px] md:w-[calc(100%-2rem)] w-full bg-secondary rounded-xl flex items-center justify-center">
                           <div className="md:size-9/12 size-10/12 relative overflow-hidden rounded-xl">
                              <Image
                                 src={projectImage.url}
                                 alt={title}
                                 className="object-cover"
                                 sizes="100%"
                                 fill
                                 priority
                              />
                           </div>
                        </div>
                        <div className="flex flex-col gap-3">
                           <h4 className="text-4xl font-bold">{title}</h4>
                           <p className="font-medium text-sm line-clamp-4 flex-1">
                              {editor.getText()}
                           </p>
                           <div className="flex flex-col gap-3">
                              <h5 className="text-xl font-medium uppercase">Project Info</h5>
                              <Separator />
                              <div className="flex items-center justify-between font-medium text-sm ">
                                 <span>Created At</span>
                                 <span className="text-muted-foreground">
                                    {format(new Date(createdAt), "MMM dd, yyyy")}
                                 </span>
                              </div>
                              <Separator />
                              <div className="flex items-center justify-between font-medium text-sm">
                                 <span>Role</span>
                                 <span className="text-muted-foreground">
                                    {role === "Frontend" ? "Front-end Developer" : "MERN Developer"}
                                 </span>
                              </div>
                              <Separator />
                           </div>
                           <div className="flex items-center justify-between flex-wrap gap-y-3 gap-x-2 mt-3">
                              <Link
                                 href={`/projects/${slug}`}
                                 target="_blank"
                              >
                                 <button
                                    className={cn(
                                       "flex items-center gap-1 uppercase tracking-wide md:text-base text-sm relative font-bold group transition-colors duration-100",
                                       "md:hover:text-primary",
                                    )}
                                 >
                                    <span>Project Details</span>
                                    <ArrowUpRight className="size-5 md:rotate-45 transition-transform duration-100 md:group-hover:rotate-0" />

                                    <span className="absolute -bottom-1 left-0 right-0 w-0 h-0.5 bg-primary -z-10 transition-all duration-100 md:group-hover:w-full" />
                                 </button>
                              </Link>

                              <Link
                                 href={liveLink ?? "#"}
                                 target="_blank"
                              >
                                 <button
                                    className={cn(
                                       "flex items-center gap-1 uppercase tracking-wide md:text-base text-sm relative font-bold group transition-colors duration-100",
                                       "md:hover:text-primary",
                                    )}
                                 >
                                    <span>Live Demo</span>

                                    <ArrowUpRight className="size-5 md:rotate-45 transition-transform duration-100 md:group-hover:rotate-0" />

                                    <span className="absolute -bottom-1 left-0 right-0 w-0 h-0.5 bg-primary -z-10 transition-all duration-100 md:group-hover:w-full" />
                                 </button>
                              </Link>
                              <Link
                                 href={githubLink ?? "#"}
                                 target="_blank"
                              >
                                 <button
                                    className={cn(
                                       "flex items-center gap-1 uppercase tracking-wide md:text-base text-sm relative font-bold group transition-colors duration-100",
                                       "md:hover:text-primary",
                                    )}
                                 >
                                    <span>See on github</span>
                                    <Image
                                       src={Github}
                                       alt="github-icon"
                                       className="size-6"
                                       width={22}
                                       height={22}
                                    />
                                    <span className="absolute -bottom-1 left-0 right-0 w-0 h-0.5 bg-primary -z-10 transition-all duration-100 md:group-hover:w-full" />
                                 </button>
                              </Link>
                           </div>
                        </div>
                     </div>
                  );
               })}
            </div>
         )}
      </section>
   );
};

export default FeaturedProjectsSection;

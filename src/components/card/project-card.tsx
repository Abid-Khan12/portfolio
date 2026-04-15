import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

import { IProject } from "@/models/project-model";

import { Github } from "@/public";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "../ui/aspect-ratio";

type ProjectCardProps = Pick<
   IProject,
   | "title"
   | "createdAt"
   | "liveLink"
   | "githubLink"
   | "role"
   | "slug"
   | "projectImage"
   | "description"
>;

const ProjectCard = ({
   slug,
   role,
   githubLink,
   liveLink,
   title,
   description,
   createdAt,
   projectImage,
}: ProjectCardProps) => {
   return (
      <div className="w-full grid md:grid-cols-2 gap-4">
         <div className="h-[400px] md:w-[calc(100%-2rem)] w-full bg-secondary rounded-xl flex items-center justify-center">
            <AspectRatio
               ratio={16 / 9}
               className="md:size-10/12 size-10/12 relative overflow-hidden rounded-xl"
            >
               <Image
                  src={projectImage.url}
                  alt={`project image: ${title}`}
                  className="size-full object-cover"
                  width={projectImage.width}
                  height={projectImage.height}
               />
            </AspectRatio>
         </div>
         <div className="flex flex-col gap-3">
            <h4 className="text-4xl font-bold">{title}</h4>
            <p className="font-medium text-sm line-clamp-4 flex-1">{description}</p>
            <div className="flex flex-col gap-3">
               <h5 className="text-xl font-medium uppercase">Project Info</h5>
               <Separator />
               <div className="flex items-center justify-between font-medium text-sm ">
                  <span>Published At</span>
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
               <Link href={`/projects/${slug}`}>
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
                  href={liveLink ?? ""}
                  target="_blank"
                  className={cn(!liveLink && "opacity-60 pointer-events-none cursor-default")}
               >
                  <button
                     className={cn(
                        "flex items-center gap-1 uppercase tracking-wide md:text-base text-sm relative font-bold group transition-colors duration-100",
                        "md:hover:text-primary ",
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
};

export default ProjectCard;

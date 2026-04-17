"use client";

import Image from "next/image";
import StarterKit from "@tiptap/starter-kit";
import { Editor, EditorContent } from "@tiptap/react";
import { useRouter } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import { IProject } from "@/models/project-model";

import useFetch from "@/hooks/use-fetch";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type SingleProjectResponse = {
   project: IProject;
};

const SingleProjectSection = ({ slug }: { slug: string }) => {
   const router = useRouter();
   const { data, isLoading } = useFetch<SingleProjectResponse>({
      api_key: ["single_project_fetched", slug],
      api_url: "/projects",
      slug,
   });

   if (isLoading) {
      return (
         <section className="w-full space-y-5 max-w-7xl mx-auto py-8 px-6 relative">
            <Button
               className={"sticky top-0 left-0"}
               size={"icon"}
               variant={"outline"}
               onClick={() => router.back()}
            >
               <ArrowLeft />
            </Button>

            <div className="flex flex-col gap-5">
               <Skeleton className="h-20 w-full" />

               <Separator />

               <div className="flex items-center justify-between w-full">
                  <div className="font-medium flex items-center gap-2">
                     <span className="font-bold">Role : </span>
                     <Skeleton className="h-5 w-30" />
                  </div>
                  <div className="font-medium flex items-center gap-2">
                     <span className="font-bold">Published At : </span>
                     <Skeleton className="h-5 w-30" />
                  </div>
               </div>

               <div className="flex items-center gap-3 w-full flex-wrap font-medium">
                  <span className="font-bold">Tech Stack : </span>
                  {Array.from({ length: 3 }).map((_, i) => (
                     <Skeleton
                        key={`skeleton-${i}`}
                        className="h-6 w-20"
                     />
                  ))}
               </div>

               <Separator />

               <AspectRatio
                  ratio={21 / 9}
                  className="rounded-xl h-[400px] overflow-hidden bg-border border border-border"
               >
                  <Skeleton className="size-full" />
               </AspectRatio>

               <Skeleton className="w-full h-[400px]" />
            </div>
         </section>
      );
   }

   const project = data?.data.project;

   if (!project) {
      return (
         <section className="page flex items-center justify-center max-w-7xl mx-auto py-10 px-6">
            <h1 className="font-heading text-5xl font-bold tracking-wide">project not found</h1>
         </section>
      );
   }

   const editor = new Editor({
      extensions: [StarterKit],
      content: project.description,
      editable: false,
      autofocus: false,
   });

   return (
      <section className="w-full space-y-5 max-w-7xl mx-auto py-8 px-6 relative">
         <Button
            className={"sticky top-0 left-0"}
            size={"icon"}
            variant={"outline"}
            onClick={() => router.back()}
         >
            <ArrowLeft />
         </Button>

         <div className="flex flex-col gap-5">
            <h1 className="font-heading tracking-wider lg:text-4xl md:text-3xl text-xl font-bold">
               {project.title}
            </h1>

            <Separator />

            <div className="flex items-center justify-between w-full">
               <p className="font-medium">
                  <span className="font-bold">Role : </span>
                  <span className="text-muted-foreground">
                     {project.role === "Frontend" ? "Front-end Developer" : "MERN Developer"}
                  </span>
               </p>
               <p className="font-medium">
                  <span className="font-bold">Published At : </span>
                  <span className="text-muted-foreground">
                     {new Date(project.createdAt).toLocaleDateString("en-US", {
                        dateStyle: "medium",
                     })}
                  </span>
               </p>
            </div>

            <div className="flex items-center gap-3 w-full flex-wrap font-medium">
               <span className="font-bold">Tech Stack : </span>
               {project.techStack.map((item) => (
                  <Badge key={item}>{item}</Badge>
               ))}
            </div>

            <Separator />

            <AspectRatio
               ratio={21 / 9}
               className="rounded-xl overflow-hidden bg-border border border-border"
            >
               <Image
                  src={project.projectImage.url}
                  width={project.projectImage.width}
                  height={project.projectImage.height}
                  alt={`Project image:${project.title}`}
                  className="size-full object-cover"
               />
            </AspectRatio>

            <EditorContent editor={editor} />
         </div>
      </section>
   );
};

export default SingleProjectSection;

"use client";

import StarterKit from "@tiptap/starter-kit";
import { Editor, EditorContent } from "@tiptap/react";

import useFetch from "@/hooks/use-fetch";

import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { cn } from "@/lib/utils";

type AboutResponse = { about: string };

const AboutMeSection = () => {
   const { data, isLoading } = useFetch<AboutResponse>({
      api_key: ["about_fetched"],
      api_url: "/about",
   });

   if (isLoading) {
      return (
         <section className="min-h-[50svh] w-full grid md:grid-cols-2 max-w-7xl mx-auto py-16 px-6">
            <div className="flex items-start justify-start">
               <h2 className="font-heading text-8xl">About Me</h2>
            </div>
            <Skeleton className="min-h-[400px] max-w-[700px] w-full" />
         </section>
      );
   }

   const aboutMe = data?.data.about;

   const editor = new Editor({
      extensions: [StarterKit],
      content: aboutMe,
      editable: false,
      autofocus: false,
   });

   return (
      <section className="min-h-[60svh] w-full flex justify-between lg:gap-10 gap-5 max-w-7xl mx-auto py-16 px-6 lg:flex-nowrap flex-wrap">
         <div className="flex items-start justify-start shrink-0">
            <h2 className="font-heading md:text-8xl text-7xl">About Me</h2>
         </div>
         <div className="flex flex-col gap-4 max-w-[600px]">
            <EditorContent
               editor={editor}
               className="line-clamp-10"
            />
            <Link
               href={`/about`}
               className="w-fit"
            >
               <button
                  className={cn(
                     "flex items-center gap-1 uppercase tracking-wide md:text-base text-sm relative font-bold group transition-colors duration-100",
                     "md:hover:text-primary",
                  )}
               >
                  <span>More about me</span>

                  <span className="absolute -bottom-1 left-0 right-0 w-0 h-0.5 bg-primary -z-10 transition-all duration-100 md:group-hover:w-full" />
               </button>
            </Link>
         </div>
      </section>
   );
};

export default AboutMeSection;

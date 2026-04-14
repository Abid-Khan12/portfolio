"use client";

import Link from "next/link";
import StarterKit from "@tiptap/starter-kit";
import { Editor, EditorContent } from "@tiptap/react";

import { Github, LinkedIn } from "@/public";
import { DownloadIcon } from "lucide-react";

import useFetch from "@/hooks/use-fetch";

import IconButton from "@/components/buttons/icon-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type AboutResponse = { about: string };

const AboutSection = () => {
   const { data, isLoading } = useFetch<AboutResponse>({
      api_key: ["about_fetched"],
      api_url: "/about",
   });

   if (isLoading) {
      return (
         <section className="min-h-[60svh] w-full flex justify-between gap-5 lg:flex-nowrap flex-wrap max-w-7xl mx-auto py-16 px-6">
            <div className="flex items-start justify-start shrink-0">
               <h2 className="font-heading md:text-8xl text-7xl">About Me</h2>
            </div>
            <div className="flex flex-col gap-6 items-start w-full lg:max-w-[700px]">
               <Skeleton className="min-h-[380px] w-full" />
               <div className="flex items-center md:gap-4 gap-2">
                  <Button
                     nativeButton={false}
                     render={<Link href="#" />}
                     className={
                        "rounded-full w-[187px] h-[48px] md:h-[54px] font-bold md:gap-x-5 gap-3 uppercase text-xs "
                     }
                  >
                     <span>Download Resume</span>
                     <DownloadIcon className="size-5" />
                  </Button>
                  <Link
                     href={"https://www.linkedin.com/in/abid-shah-khan"}
                     target="_blank"
                  >
                     <IconButton
                        src={LinkedIn}
                        alt="github-icon"
                        className="md:size-7"
                     />
                  </Link>
                  <Link
                     href={"https://github.com/Abid-Khan12"}
                     target="_blank"
                  >
                     <IconButton
                        src={Github}
                        alt="github-icon"
                        className="md:size-7"
                     />
                  </Link>
               </div>
            </div>
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
         <div className="flex flex-col gap-6 items-start lg:max-w-[700px]">
            <EditorContent
               editor={editor}
               className="text-balance leading-7 max-md:text-sm"
            />
            <div className="flex items-center md:gap-4 gap-2">
               <Button
                  nativeButton={false}
                  render={<a href="#" />}
                  className={
                     "rounded-full w-[187px] h-[48px] md:h-[54px] font-bold md:gap-x-5 gap-3 uppercase text-xs "
                  }
               >
                  <span>Download Resume</span>
                  <DownloadIcon className="size-5" />
               </Button>
               <Link
                  href={"https://www.linkedin.com/in/abid-shah-khan"}
                  target="_blank"
               >
                  <IconButton
                     src={LinkedIn}
                     alt="github-icon"
                     className="md:size-7"
                  />
               </Link>
               <Link
                  href={"https://github.com/Abid-Khan12"}
                  target="_blank"
               >
                  <IconButton
                     src={Github}
                     alt="github-icon"
                     className="md:size-7"
                  />
               </Link>
            </div>
         </div>
      </section>
   );
};

export default AboutSection;

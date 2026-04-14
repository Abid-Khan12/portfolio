import Image from "next/image";

import { Github, LinkedIn } from "@/public";
import { DownloadIcon } from "lucide-react";

import IconButton from "@/components/buttons/icon-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
   return (
      <section className="min-h-[60svh] w-full py-6 max-w-7xl mx-auto px-6">
         <div className="grid md:grid-cols-2 gap-6">
            {/* Content-Part */}
            <div className="flex flex-col items-start md:justify-center md:gap-5 gap-3 max-w-[554px]">
               <p className="text-muted-foreground font-medium text-sm md:order-1 order-2">
                  A Sydney based front-end developer passionate about building accessible and user
                  friendly websites.
               </p>
               <h1 className="font-heading xl:text-8xl lg:text-7xl sm:text-6xl text-5xl font-bold md:order-2 order-1">
                  hi, i am <br /> Abid Shah Khan
               </h1>
               <div className="flex items-center md:gap-4 gap-2 md:order-3 order-3">
                  <Button
                     nativeButton={false}
                     render={<a href="#" />}
                     className={
                        "rounded-full sm:w-[187px] h-[48px] md:h-[54px] font-bold md:gap-x-5 gap-3 uppercase text-xs "
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

            {/* Image-Part */}
            <div className="relative w-full md:h-[600px] h-[300px] border rounded-xl">
               {/* <Image
                  src={""}
                  alt="hero-image"
                  className="object-cover"
                  sizes="100%"
                  fill
               /> */}
            </div>
         </div>
      </section>
   );
};

export default HeroSection;

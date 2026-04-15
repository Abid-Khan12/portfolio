import Image from "next/image";
import Link from "next/link";

import { Github, HeroImage, LinkedIn } from "@/public";

import IconButton from "@/components/buttons/icon-button";
import ResumeButton from "@/components/buttons/resume-button";

const HeroSection = () => {
   return (
      <section className="min-h-[60svh] w-full py-6 max-w-7xl mx-auto px-6">
         <div className="grid md:grid-cols-2 gap-6">
            {/* Content-Part */}
            <div className="flex flex-col items-start md:justify-center md:gap-5 gap-3 max-w-[554px]">
               <p className="text-muted-foreground font-medium text-sm md:order-1 order-2">
                  Frontend Developer based in Karachi, focused on building scalable,
                  high-performance, and user-friendly web experiences.
               </p>
               <h1 className="font-heading xl:text-8xl lg:text-7xl sm:text-6xl text-5xl font-bold md:order-2 order-1">
                  hi, i am <br /> Abid Shah Khan
               </h1>
               <div className="flex items-center md:gap-4 gap-2 md:order-3 order-3">
                  <ResumeButton />

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
            <div className="flex items-center justify-center">
               <div className="relative w-full md:w-[550px] md:h-[550px] h-[300px] rounded-xl bg-muted-foreground overflow-hidden">
                  <Image
                     src={HeroImage}
                     alt="hero-image"
                     className="object-cover absolute bottom-0 left-1/2 -translate-x-1/2 lg:size-full md:size-10/12 size-11/11"
                     priority
                  />
               </div>
            </div>
         </div>
      </section>
   );
};

export default HeroSection;

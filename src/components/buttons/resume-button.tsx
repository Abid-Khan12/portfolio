import { DownloadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

const ResumeButton = () => {
   return (
      <Button
         nativeButton={false}
         render={
            <a
               href="/Abid_Frontend_Resume.pdf"
               download
            />
         }
         className="rounded-full sm:w-[187px] h-[48px] md:h-[54px] font-bold uppercase text-xs text-foreground dark:text-black"
      >
         <span className="inline-flex items-center gap-3">
            <span>Download Resume</span>
            <DownloadIcon className="size-5" />
         </span>
      </Button>
   );
};

export default ResumeButton;

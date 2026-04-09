import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "../ui/button";

const IconButton = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
   return (
      <Button
         className="bg-secondary rounded-full size-10"
         size={"icon-lg"}
      >
         <Image
            src={src}
            alt={alt ?? "icon-alt"}
            className={cn("size-6.5", className)}
            width={26}
            height={26}
         />
      </Button>
   );
};

export default IconButton;

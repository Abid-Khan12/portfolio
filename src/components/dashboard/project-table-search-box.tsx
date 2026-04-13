import React from "react";
import { motion, AnimatePresence } from "motion/react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";

const SearchBox = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
   const [open, setOpen] = React.useState(false);
   const inputRef = React.useRef<HTMLInputElement>(null);

   const handleOpen = () => {
      setOpen(!open);
      setTimeout(() => inputRef.current?.focus(), 50);
   };

   return (
      <div className="flex items-center justify-end">
         <Button
            variant={open ? "secondary" : "outline"}
            size="icon"
            onClick={open ? undefined : handleOpen}
            aria-label="Search"
         >
            <SearchIcon className="size-4" />
         </Button>
         <AnimatePresence initial={false}>
            {open && (
               <motion.div
                  key="search-input"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  className="overflow-hidden ml-2 "
               >
                  <Input
                     ref={inputRef}
                     value={value}
                     onChange={(e) => onChange(e.target.value)}
                     placeholder="Search projects…"
                     onBlur={() => {
                        if (!value) setOpen(false);
                     }}
                     className="ring-0! "
                  />
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
};

export default SearchBox;

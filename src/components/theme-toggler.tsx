"use client";

import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "./ui/button";

const ThemeToggler = () => {
   const { theme, setTheme } = useTheme();
   const [mounted, setMounted] = useState(false);

   // Prevent hydration mismatch
   useEffect(() => {
      setMounted(true);
   }, []);

   const isDark = mounted ? theme === "dark" : false;

   const handleToggle = (pressed: boolean) => {
      setTheme(pressed ? "dark" : "light");
   };

   return (
      <Toggle
         pressed={isDark}
         onPressedChange={handleToggle}
         aria-label="Toggle theme"
         render={
            <Button
               className={"relative overflow-hidden"}
               size={"icon"}
               variant={"outline"}
            />
         }
      >
         <AnimatePresence
            mode="wait"
            initial={false}
         >
            {isDark ? (
               <motion.span
                  key="moon"
                  initial={{ y: 12, opacity: 0, rotate: -45 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: -12, opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="absolute flex items-center justify-center"
               >
                  <Moon />
               </motion.span>
            ) : (
               <motion.span
                  key="sun"
                  initial={{ y: 12, opacity: 0, rotate: 45 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: -12, opacity: 0, rotate: -45 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="absolute flex items-center justify-center"
               >
                  <Sun />
               </motion.span>
            )}
         </AnimatePresence>
      </Toggle>
   );
};

export default ThemeToggler;

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { useScroll } from "@/hooks/use-scroll";

import MobileNav from "@/components/header/mobile-nav";
import ThemeToggler from "@/components/theme-toggler";
import { Button } from "@/components/ui/button";

export const navLinks = [
   {
      href: "/about",
      label: "About Me",
   },
   {
      href: "/projects",
      label: "Projects",
   },
];

const Header = () => {
   const pathname = usePathname();
   const scrolled = useScroll(15);

   return (
      <header
         className={cn("w-full sticky top-0 z-50 border-transparent border-b", {
            "border-border bg-background/70 backdrop-blur-sm supports-backdrop-filter:bg-background/50":
               scrolled,
         })}
      >
         <nav className="mx-auto w-full max-w-7xl px-4 h-14 flex items-center justify-between">
            <Button
               nativeButton={false}
               render={<Link href={"/"} />}
               variant={"ghost"}
               size={"lg"}
               className={cn(
                  "font-heading text-3xl tracking-wide transition-colors duration-300 text-foreground max-md:px-0",
                  pathname === "/"
                     ? "dark:text-primary dark:hover:text-foreground"
                     : "dark:text-foreground dark:hover:text-primary",
               )}
            >
               Abid Khan
            </Button>
            <div className="flex items-center md:gap-3 gap-4">
               <div className="hidden md:flex items-center gap-4">
                  {navLinks.map((item) => {
                     const isActive = pathname === item.href;

                     return (
                        <Button
                           key={item.label}
                           nativeButton={false}
                           render={<Link href={item.href} />}
                           variant={"secondary"}
                           size={"lg"}
                           className={cn(
                              "px-4 rounded-full relative overflow-hidden",
                              "before:absolute before:inset-x-0 before:bottom-0",
                              "before:bg-primary before:-z-10 z-0",
                              // inactive: fill animates up on hover
                              !isActive && [
                                 "before:h-0",
                                 "before:transition-all before:duration-300 before:ease-out",
                                 "hover:before:h-full hover:text-primary-foreground",
                                 "transition-colors duration-300",
                              ],
                              // active: fill already full, no animation needed
                              isActive && "before:h-full text-primary-foreground",
                           )}
                        >
                           {item.label}
                        </Button>
                     );
                  })}
               </div>
               <ThemeToggler />
               <MobileNav />
            </div>
         </nav>
      </header>
   );
};

export default Header;

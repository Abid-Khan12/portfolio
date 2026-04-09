import Link from "next/link";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import ThemeToggler from "@/components/theme-toggler";

const navLinks = [
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
   return (
      <header className="w-full sticky top-0 h-8 py-1">
         <nav className="flex justify-between items-center">
            <Button
               variant={"ghost"}
               nativeButton={false}
               render={<Link href={"/"} />}
               className={cn("text-2xl font-heading tracking-wide ")}
               size={"lg"}
            >
               Abid Khan
            </Button>
            <div className="flex items-center gap-5">
               <ul className="flex items-center gap-5">
                  {navLinks.map((item) => (
                     <li key={item.label}>
                        <Button
                           nativeButton={false}
                           render={<Link href={item.href} />}
                           variant={"ghost"}
                        >
                           {item.label}
                        </Button>
                     </li>
                  ))}
               </ul>
               <ThemeToggler />
            </div>
         </nav>
      </header>
   );
};

export default Header;

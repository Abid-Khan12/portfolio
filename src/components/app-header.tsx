import ThemeToggler from "@/components/theme-toggler";
import { SidebarTrigger } from "@/components/ui/sidebar";

const AppHeader = () => {
   return (
      <header className="sticky top-0 z-40 border-b border-border px-4 bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50">
         <nav className="h-14 w-full flex md:justify-end justify-between items-center ">
            <SidebarTrigger
               className={"md:hidden"}
               iconVariant="right"
            />

            <ThemeToggler />
         </nav>
      </header>
   );
};

export default AppHeader;

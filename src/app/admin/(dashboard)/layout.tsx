import { ChildrenProp } from "@/types/type";

import AppHeader from "@/components/app-header";
import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const layout = ({ children }: ChildrenProp) => {
   return (
      <SidebarProvider>
         <AppSidebar />
         <main className="w-full">
            <AppHeader />
            <div className={cn("page px-4 pt-4")}>{children}</div>
         </main>
      </SidebarProvider>
   );
};

export default layout;

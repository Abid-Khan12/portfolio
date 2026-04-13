import { ChildrenProp } from "@/types/type";

import { cn } from "@/lib/utils";

import AppHeader from "@/components/dashboard/app-header";
import AppSidebar from "@/components/dashboard/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const layout = ({ children }: ChildrenProp) => {
   return (
      <SidebarProvider>
         <AppSidebar />
         <SidebarInset className="w-full overflow-hidden">
            <AppHeader />
            <div className={cn("page px-4 pt-4")}>{children}</div>
         </SidebarInset>
      </SidebarProvider>
   );
};

export default layout;

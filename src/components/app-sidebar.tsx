"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { FolderKanbanIcon, LayoutDashboardIcon, UserRoundIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import NavUser from "@/components/nav-user";
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarTrigger,
   useSidebar,
} from "@/components/ui/sidebar";

const navLinks = [
   { href: "/admin", label: "Dashboard", icon: LayoutDashboardIcon },
   { href: "/admin/projects", label: "Projects", icon: FolderKanbanIcon },
   { href: "/admin/about", label: "About Me", icon: UserRoundIcon },
];

// ── Header: logo + trigger ───────────────────────────────────────────────────
const AppSidebarHeader = () => {
   const { open, isMobile, toggleSidebar } = useSidebar();

   return (
      <SidebarHeader
         className={cn(
            "flex flex-row items-center  border-b border-border h-14",
            !open ? "px-0 justify-center" : "px-4 justify-between",
         )}
      >
         {/* Logo — hidden when collapsed on desktop */}
         <span
            className={cn("font-heading text-xl tracking-wide text-primary truncate", {
               hidden: !open,
            })}
         >
            Abid Khan
         </span>

         {/* Trigger — PanelLeft on desktop, X on mobile when open */}
         <SidebarTrigger
            className={"flex size-8 items-center justify-center hover:text-muted-foreground"}
            iconVariant={isMobile ? "cancel" : "left"}
         />
      </SidebarHeader>
   );
};

// ── Nav links ────────────────────────────────────────────────────────────────
const AppSidebarNav = () => {
   const pathname = usePathname();

   return (
      <SidebarGroup>
         <SidebarGroupLabel>Navigation</SidebarGroupLabel>
         <SidebarGroupContent>
            <SidebarMenu className="gap-y-3">
               {navLinks.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname === href;
                  return (
                     <SidebarMenuItem key={href}>
                        <SidebarMenuButton
                           isActive={isActive}
                           tooltip={label}
                           render={<Link href={href} />}
                           className={cn(
                              "transition-colors duration-200",
                              isActive && "text-primary font-medium",
                           )}
                        >
                           <Icon />
                           <span>{label}</span>
                        </SidebarMenuButton>
                     </SidebarMenuItem>
                  );
               })}
            </SidebarMenu>
         </SidebarGroupContent>
      </SidebarGroup>
   );
};

// ── Footer ───────────────────────────────────────────────────────────────────
const AppSidebarFooter = () => {
   return (
      <SidebarFooter className="border-t border-border  py-3">
         <NavUser />
      </SidebarFooter>
   );
};

// ── Root ─────────────────────────────────────────────────────────────────────
export default function AppSidebar() {
   return (
      <Sidebar collapsible="icon">
         <AppSidebarHeader />
         <SidebarContent>
            <AppSidebarNav />
         </SidebarContent>
         <AppSidebarFooter />
      </Sidebar>
   );
}

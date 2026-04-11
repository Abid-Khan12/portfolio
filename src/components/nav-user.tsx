"use client";

import { useEffect, useState } from "react";

import { ChevronsUpDownIcon, SparklesIcon, LogOutIcon } from "lucide-react";

import useAdminContext from "@/context/admin-context";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   useSidebar,
} from "@/components/ui/sidebar";
import useLogout from "@/hooks/use-logout";

export default function NavUser() {
   const [open, setOpen] = useState(false);
   const { user } = useAdminContext();
   const { isMobile } = useSidebar();

   const { logoutFn } = useLogout();

   return (
      <SidebarMenu>
         <SidebarMenuItem>
            <DropdownMenu
               open={open}
               onOpenChange={setOpen}
            >
               <DropdownMenuTrigger
                  render={<SidebarMenuButton className="text-muted-foreground" />}
               >
                  <Avatar className="size-6">
                     <AvatarImage
                        alt={user?.userName}
                        src={user?.avatar}
                     />
                     <AvatarFallback>{user?.userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">{user?.userName.split(" ")[0]}</span>
                  <ChevronsUpDownIcon className="ml-auto size-3!" />
               </DropdownMenuTrigger>
               <DropdownMenuContent
                  align="end"
                  className="min-w-48"
                  side={isMobile ? "bottom" : "right"}
                  sideOffset={8}
               >
                  <DropdownMenuGroup>
                     <DropdownMenuItem>
                        <SparklesIcon />
                        Update Profile
                     </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                     variant="destructive"
                     onClick={logoutFn}
                  >
                     <LogOutIcon />
                     Sign Out
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </SidebarMenuItem>
      </SidebarMenu>
   );
}

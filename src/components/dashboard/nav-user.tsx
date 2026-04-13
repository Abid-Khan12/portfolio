"use client";

import { useState } from "react";

import { ChevronsUpDown, LogOutIcon, Settings2 } from "lucide-react";

import { cn } from "@/lib/utils";

import useAdminContext from "@/context/admin-context";

import LogoutDialog from "@/components/dialogs/logout-dialog";
import {
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SettingsDailog from "@/components/dialogs/setting-dialog";

const NavUser = () => {
   const { user } = useAdminContext();
   const { isMobile } = useSidebar();
   const [settingDialog, setSettingDialog] = useState(false);
   const [dialogOpen, setDialogOpen] = useState(false);

   return (
      <>
         <SidebarMenu>
            {!user ? (
               <Skeleton className="h-12" />
            ) : (
               <SidebarMenuItem>
                  <DropdownMenu>
                     <DropdownMenuTrigger
                        render={
                           <SidebarMenuButton
                              size="lg"
                              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                           >
                              <Avatar className="size-8 rounded-lg">
                                 <AvatarImage src={user.avatar} />
                                 <AvatarFallback className="rounded-lg">
                                    {user.userName.charAt(0).toUpperCase()}
                                 </AvatarFallback>
                              </Avatar>
                              <div className="grid flex-1 text-left text-sm leading-tight">
                                 <span className="truncate font-medium capitalize">
                                    {user.userName}
                                 </span>
                              </div>
                              <ChevronsUpDown className="ml-auto size-4" />
                           </SidebarMenuButton>
                        }
                     />

                     <DropdownMenuContent
                        className="min-w-56 rounded-lg space-y-2"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={6}
                     >
                        <DropdownMenuGroup>
                           <DropdownMenuLabel className="p-0 font-normal">
                              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                 <Avatar className="size-8 rounded-lg">
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback className="rounded-lg">
                                       {user.userName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                 </Avatar>
                                 <div className="grid flex-1 text-left text-sm leading-tight text-foreground">
                                    <span className="truncate font-medium capitalize">
                                       {user.userName}
                                    </span>
                                    <span className="truncate text-xs">{user.email}</span>
                                 </div>
                              </div>
                           </DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                           <DropdownMenuItem onClick={() => setSettingDialog(true)}>
                              <Settings2 />
                              Update Profile
                           </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                           <DropdownMenuItem
                              variant="destructive"
                              onClick={() => setDialogOpen(true)}
                           >
                              <LogOutIcon />
                              Log out
                           </DropdownMenuItem>
                        </DropdownMenuGroup>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </SidebarMenuItem>
            )}
         </SidebarMenu>
         <LogoutDialog
            open={dialogOpen}
            setOpen={setDialogOpen}
         />
         <SettingsDailog
            open={settingDialog}
            setOpen={setSettingDialog}
         />
      </>
   );
};

export default NavUser;

"use client";

import { ReactElement, useEffect, useState } from "react";

import { LogOutIcon } from "lucide-react";

import useLogout from "@/hooks/use-logout";

import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type TriggerProp = { trigger: ReactElement; nativeButton?: boolean };

const LogoutDialog = ({ trigger, nativeButton = true }: TriggerProp) => {
   const { logoutFn, isPending, isSuccess, isError } = useLogout();
   const [open, setOpen] = useState(false);

   useEffect(() => {
      if (!isPending && (isSuccess || isError)) {
         setOpen(false);
      }
   }, [isSuccess, isError, isPending]);

   return (
      <AlertDialog
         open={open}
         onOpenChange={setOpen}
      >
         <AlertDialogTrigger
            nativeButton={nativeButton}
            render={trigger}
         />
         <AlertDialogContent className={"sm:max-w-xl! "}>
            <AlertDialogHeader>
               <div className="flex flex-col justify-center items-center gap-3 mb-1 w-full">
                  <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
                     <LogOutIcon className="size-6 text-destructive" />
                  </div>
                  <AlertDialogTitle className={"text-3xl"}>Sign out?</AlertDialogTitle>
               </div>
               <AlertDialogDescription className={"text-center w-full"}>
                  You'll be returned to the login screen. Any unsaved changes will be lost.
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="justify-between!">
               <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
               <AlertDialogAction
                  variant={"destructive"}
                  disabled={isPending}
                  onClick={logoutFn}
               >
                  {isPending ? "Signing out..." : "Sign out"}
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
};

export default LogoutDialog;

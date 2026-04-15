"use client";

import { useEffect } from "react";

import { LogOutIcon } from "lucide-react";

import useLogout from "@/hooks/use-logout";

import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LogoutDialogProps {
   open: boolean;
   setOpen: (value: boolean) => void;
}

const LogoutDialog = ({ open, setOpen }: LogoutDialogProps) => {
   const { logoutFn, isPending, isSuccess, isError } = useLogout();

   useEffect(() => {
      if (!isPending && (isSuccess || isError)) {
         setOpen(false);
      }
   }, [isSuccess, isError, isPending, setOpen]);

   return (
      <Dialog
         open={open}
         onOpenChange={setOpen}
      >
         <DialogContent className={"sm:max-w-xl!"}>
            <DialogHeader>
               <div className="flex flex-col justify-center items-center gap-3 mb-1 w-full">
                  <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
                     <LogOutIcon className="size-6 text-destructive" />
                  </div>
                  <DialogTitle className={"text-3xl"}>Sign out?</DialogTitle>
               </div>
               <DialogDescription className={"text-center w-full"}>
                  You&apos;ll be returned to the login screen. Any unsaved changes will be lost.
               </DialogDescription>
            </DialogHeader>
            <DialogFooter className="justify-between!">
               <DialogClose
                  disabled={isPending}
                  render={<Button variant={"outline"} />}
               >
                  Cancel
               </DialogClose>
               <Button
                  variant={"destructive"}
                  disabled={isPending}
                  onClick={logoutFn}
               >
                  {isPending ? "Signing out..." : "Sign out"}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

export default LogoutDialog;

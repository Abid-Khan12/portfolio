import { Loader, Trash2Icon } from "lucide-react";

import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useCustomMutation from "@/hooks/use-mutation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface ConfirmationDialogProps {
   open: boolean;
   setOpen: (value: boolean) => void;
   slug: string;
}

const ProjectDeleteConfirmationDialog = ({ open, setOpen, slug }: ConfirmationDialogProps) => {
   const queryClient = useQueryClient();
   const { mutate, isPending } = useCustomMutation({
      api_key: ["project_delete_mutation"],
      api_url: "/admin/projects",
   });
   const handleFn = () => {
      mutate(
         { payload: {}, slug, method: "delete" },
         {
            onSuccess({ message }) {
               toast.success(message);
               setOpen(false);
               queryClient.refetchQueries({
                  queryKey: ["projects_table_fetch"],
               });
               queryClient.refetchQueries({
                  queryKey: ["dashboard_state"],
                  exact: true,
               });
            },
            onError({ message }) {
               toast.error(message);
               queryClient.refetchQueries({
                  queryKey: ["projects_table_fetch"],
               });
               queryClient.refetchQueries({
                  queryKey: ["dashboard_state"],
                  exact: true,
               });
            },
         },
      );
   };
   return (
      <AlertDialog
         open={open}
         onOpenChange={setOpen}
      >
         <AlertDialogContent className="sm:max-w-xl!">
            <AlertDialogHeader>
               <div className="flex flex-col justify-center items-center gap-3 mb-1 w-full">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                     <Trash2Icon className="size-6 text-destructive" />
                  </div>
                  <AlertDialogTitle className="text-3xl">Delete Project</AlertDialogTitle>
               </div>
               <AlertDialogDescription className={"text-center"}>
                  Are you sure you want to delete this project? This action is permanent and cannot
                  be undone. All associated data including images and links will be removed.
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
               <AlertDialogAction
                  disabled={isPending}
                  onClick={handleFn}
                  variant="destructive"
               >
                  {isPending ? (
                     <Loader className="animate-spin" />
                  ) : (
                     <Trash2Icon className="size-4" />
                  )}
                  {isPending ? "Deleting..." : "Delete"}
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
};

export default ProjectDeleteConfirmationDialog;

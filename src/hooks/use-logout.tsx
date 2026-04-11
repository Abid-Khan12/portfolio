"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import useCustomMutation from "@/hooks/use-mutation";
import useAdminContext from "@/context/admin-context";

const useLogout = () => {
   const queryClient = useQueryClient();
   const { setUser } = useAdminContext();
   const router = useRouter();

   const { mutate, ...data } = useCustomMutation({
      api_key: ["logout_mutation"],
      api_url: "/admin/auth/logout",
   });

   return {
      logoutFn: () =>
         mutate(
            { payload: {} },
            {
               onSuccess({ message }) {
                  toast.success(message ?? "Logged out successfully");
                  localStorage.removeItem("userData");
                  localStorage.removeItem("accessToken");
                  setUser(null);
                  queryClient.clear();
                  router.replace("/admin/auth/login");
               },
               onError({ message }) {
                  toast.error(message ?? "Failed to logout. Please try again.");
                  localStorage.removeItem("userData");
                  localStorage.removeItem("accessToken");
                  setUser(null);
               },
            },
         ),
      ...data,
   };
};

export default useLogout;

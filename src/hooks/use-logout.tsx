"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import useCustomMutation from "@/hooks/use-mutation";
import useAdminContext from "@/context/admin-context";

const useLogout = () => {
   const router = useRouter();
   const queryClient = useQueryClient();
   const { setUser } = useAdminContext();

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
                  
                  router.replace("/admin/login");

                  queryClient.clear();
               },
               onError({ message }) {
                  toast.error(message ?? "Failed to logout. Please try again.");

                  localStorage.removeItem("userData");
                  localStorage.removeItem("accessToken");

                  setUser(null);

                  router.replace("/admin/login");

                  queryClient.clear();
               },
            },
         ),
      ...data,
   };
};

export default useLogout;

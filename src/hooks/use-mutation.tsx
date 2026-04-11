"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

import type { ApiError, ApiResponse, HookProps, MutationVaraibles } from "@/types/type";

import useAdminContext from "@/context/admin-context";

import { handleDelete, handlePost, handleUpdate } from "@/apis/api";

const useCustomMutation = <TPayload = any, TResponse = {}>({ api_key, api_url }: HookProps) => {
   const { setUser } = useAdminContext();

   const router = useRouter();

   const mutation = useMutation<ApiResponse<TResponse>, ApiError, MutationVaraibles<TPayload>>({
      mutationKey: api_key,
      mutationFn: ({ payload, method = "post", slug }) => {
         switch (method) {
            case "post":
               return handlePost<TPayload, TResponse>({ api_url, api_key, payload });
            case "delete":
               return handleDelete<TResponse>({ api_key, api_url, slug });
            case "put":
               return handleUpdate<TPayload, TResponse>({
                  api_key,
                  api_url,
                  payload,
                  slug,
               });
         }
      },
   });

   useEffect(() => {
      if (!mutation.isPending && mutation.isError && mutation.error) {
         const { status } = mutation.error;

         if (status === 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("userData");
            setUser(null);
            router.replace("/admin/auth/login");
            return;
         }
      }
   }, [mutation.isPending, mutation.isError, mutation.error?.message]);

   return mutation;
};

export default useCustomMutation;

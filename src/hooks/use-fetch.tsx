"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect } from "react";

import type { ApiError, ApiResponse, HookProps } from "@/types/type";

import useAdminContext from "@/context/admin-context";

import { handleFetch } from "@/apis/api";
import { useRouter } from "next/navigation";

type FetchHookProps = {
   slug?: string;
   params?: Record<string, string | number>;
} & HookProps;

const useFetch = <TResponse = any,>({ api_key, api_url, slug, params }: FetchHookProps) => {
   const router = useRouter();
   const queryClient = useQueryClient();
   const { setUser } = useAdminContext();

   const query = useQuery<ApiResponse<TResponse>, ApiError>({
      queryKey: api_key,
      queryFn: () => handleFetch<TResponse>({ api_key, api_url, slug, params }),
   });

   useEffect(() => {
      if (!query.isLoading && query.isError && query.error) {
         const { status, message } = query.error;

         if (status === 401) {
            toast.error(message);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("userData");
            setUser(null);
            queryClient.cancelQueries();
            router.replace("/admin/auth/login");
            return;
         }
      }
   }, [query.isLoading, query.isError, query.error?.message]);

   return query;
};

export default useFetch;

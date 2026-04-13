"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect } from "react";

import type { ApiError, ApiResponse, HookProps } from "@/types/type";

import useAdminContext from "@/context/admin-context";

import { handleFetch } from "@/apis/api";

type FetchHookProps = {
   slug?: string;
   params?: Record<string, string | number>;
} & HookProps;

const useFetch = <TResponse = any,>({ api_key, api_url, slug, params }: FetchHookProps) => {
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
            // clear storage first
            localStorage.removeItem("accessToken");
            localStorage.removeItem("userData");

            // show toast
            toast.error(message ?? "Session expired. Please login again.");

            // cancel queries before redirect
            queryClient.cancelQueries();
            queryClient.clear(); // clear all cached data too

            // clear user state
            setUser(null);

            // hard redirect — more reliable than router.replace for auth
            window.location.href = "/admin/login";
         }
      }
   }, [query.isLoading, query.isError, query.error]);

   return query;
};

export default useFetch;

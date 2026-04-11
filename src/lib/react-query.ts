import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         staleTime: 1000 * 60 * 5, // 5 min — don't refetch if data is fresh
         gcTime: 1000 * 60 * 10, // 10 min — keep inactive cache alive
         retry: 0, // retry failed requests once
         retryDelay: 1000, // wait 1s before retry
         refetchOnWindowFocus: false, // don't refetch when tab regains focus
         refetchOnReconnect: true, // refetch when network reconnects
         refetchOnMount: true, // refetch when component mounts if stale
      },
      mutations: {
         retry: 0, // never retry mutations — avoid double submits
         gcTime: 1000 * 60 * 5, // 5 min — keep mutation cache
      },
   },
});

export default queryClient;

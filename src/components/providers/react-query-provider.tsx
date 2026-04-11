"use client";

import { QueryClientProvider } from "@tanstack/react-query";

import { ChildrenProp } from "@/types/type";

import queryClient from "@/lib/react-query";

const ReactQueryProvider = ({ children }: ChildrenProp) => {
   return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default ReactQueryProvider;

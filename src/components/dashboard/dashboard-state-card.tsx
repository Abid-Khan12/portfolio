"use client";

import { formatDistanceToNow } from "date-fns";

import useFetch from "@/hooks/use-fetch";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FolderKanbanIcon, ClockIcon, CodeIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type TechStat = { _id: string; count: number };

type DashboardStatsResponse = {
   totalProjects: number;
   lastUploadedProject: { slug: string; title: string; createdAt: string };
   techStackStats: TechStat[];
};

const DashboardStatsSkeleton = () => (
   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
         <Card
            key={i}
            className="border-border"
         >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
               <Skeleton className="h-4 w-28" />
               <Skeleton className="size-9 rounded-full" />
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
               <Skeleton className="h-9 w-20" />
               <Skeleton className="h-3 w-36" />
            </CardContent>
         </Card>
      ))}
   </div>
);

const DashboardStats = () => {
   const { data, isLoading } = useFetch<DashboardStatsResponse>({
      api_key: ["dashboard_state"],
      api_url: "/admin/dashboard",
   });

   if (isLoading) return <DashboardStatsSkeleton />;
   if (!data?.data) return null;

   const { totalProjects, lastUploadedProject, techStackStats } = data.data;
   const lastProject = lastUploadedProject;

   return (
      <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-4">
         {/* Total Projects */}
         <Card className="border-border justify-between">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-lg font-medium text-muted-foreground tracking-wide">
                  Total Projects
               </CardTitle>
               <div className="flex size-9 items-center justify-center rounded-full dark:bg-primary/10 bg-primary">
                  <FolderKanbanIcon className="size-4 dark:text-primary" />
               </div>
            </CardHeader>
            <CardContent>
               <p className="font-heading text-4xl tracking-wide">{totalProjects}</p>
               <CardDescription className="mt-1 text-xs">
                  Projects in your portfolio
               </CardDescription>
            </CardContent>
         </Card>

         {/* Last Uploaded */}
         <Card className="border-border justify-between">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-lg font-medium text-muted-foreground tracking-wide">
                  Last Uploaded
               </CardTitle>
               <div className="flex size-9 items-center justify-center rounded-full dark:bg-primary/10 bg-primary">
                  <ClockIcon className="size-4 dark:text-primary" />
               </div>
            </CardHeader>
            <CardContent className="h-full content-between">
               <p className="font-heading text-4xl tracking-wide truncate">
                  {lastProject?.title ?? "—"}
               </p>
               <CardDescription className="mt-1 text-xs">
                  {lastProject
                     ? `${formatDistanceToNow(new Date(lastProject.createdAt))} ago`
                     : "No projects yet"}
               </CardDescription>
            </CardContent>
         </Card>

         {/* Tech Stack */}
         <Card className="border-border justify-between">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-lg font-medium text-muted-foreground tracking-wide">
                  Top 3 Most Used Tech
               </CardTitle>
               <div className="flex size-9 items-center justify-center rounded-full dark:bg-primary/10 bg-primary">
                  <CodeIcon className="size-4 dark:text-primary" />
               </div>
            </CardHeader>
            <CardContent>
               <div className="flex flex-wrap gap-1.5 mt-1">
                  {techStackStats.length === 0 ? (
                     <p className="font-heading text-4xl">—</p>
                  ) : (
                     techStackStats.map((tech) => (
                        <Badge
                           key={tech._id}
                           className="space-x-1"
                        >
                           <span>{tech._id}</span>
                           <span className="">×{tech.count}</span>
                        </Badge>
                     ))
                  )}
               </div>
               <CardDescription className="mt-2 text-xs">Across all projects</CardDescription>
            </CardContent>
         </Card>
      </div>
   );
};

export default DashboardStats;

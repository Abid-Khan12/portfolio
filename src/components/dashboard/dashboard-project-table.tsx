"use client";

import * as React from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";

import { IProject } from "@/models/project-model";

import { FolderKanbanIcon } from "lucide-react";

import useFetch from "@/hooks/use-fetch";

import { cn } from "@/lib/utils";

import projectColumns from "@/components/dashboard/project-column";

import { Button } from "@/components/ui/button";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

export type ColumnType = Pick<
   IProject,
   | "liveLink"
   | "githubLink"
   | "title"
   | "projectImage"
   | "slug"
   | "techStack"
   | "role"
   | "description"
   | "createdAt"
>;

type ProjectTableFetch = {
   projects: ColumnType[];
   total: number;
};

// ── Table skeleton ────────────────────────────────────────────────────────────
const TableSkeleton = ({ cols, rows = 5 }: { cols: number; rows?: number }) => (
   <>
      {Array.from({ length: rows }).map((_, i) => (
         <TableRow key={i}>
            {Array.from({ length: cols }).map((_, j) => (
               <TableCell
                  key={j}
                  className="py-3"
               >
                  {j === 0 ? (
                     <div className="flex items-center gap-4">
                        <Skeleton className="shrink-0 w-30 h-17 rounded-md" />
                        <div className="flex flex-col gap-2 flex-1 max-w-[50ch]">
                           <Skeleton className="h-4 w-2/3 rounded-md" />
                           <Skeleton className="h-3 w-2/3 rounded-md" />
                        </div>
                     </div>
                  ) : (
                     <Skeleton className="h-10 w-full rounded-md" />
                  )}
               </TableCell>
            ))}
         </TableRow>
      ))}
   </>
);

// ── Table ────────────────────────────────────────────────────────────────────
const ProjectsTable = ({
   limit = 5,
   skeletonLimit = 4,
   api_key = "",
}: {
   limit?: number;
   skeletonLimit?: number;
   api_key?: string;
}) => {
   const [offset, setOffset] = React.useState(0);
   const { data, isLoading } = useFetch<ProjectTableFetch>({
      api_key: ["projects_table_fetch", offset, api_key],
      api_url: "/admin/projects",
      params: {
         limit: limit,
         offset,
      },
   });

   const projects = data?.data.projects ?? [];
   const totalProjects = data?.data.total ?? 0;

   // eslint-disable-next-line react-hooks/incompatible-library
   const table = useReactTable({
      data: projects,
      columns: projectColumns,
      getCoreRowModel: getCoreRowModel(),
   });

   const totalPages = Math.ceil(totalProjects / limit);
   const currentPage = Math.floor(offset / limit); // 0-indexed
   const from = totalProjects === 0 ? 0 : offset + 1;
   const to = Math.min(offset + limit, totalProjects);

   return (
      <div className="flex flex-col gap-3 h-full">
         {/* table */}
         <div className="rounded-lg border border-border w-full min-w-0">
            <ScrollArea>
               <Table>
                  <TableHeader>
                     {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                           key={headerGroup.id}
                           className="bg-muted/50 hover:bg-muted/50"
                        >
                           {headerGroup.headers.map((header) => (
                              <TableHead key={header.id}>
                                 {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                         header.column.columnDef.header,
                                         header.getContext(),
                                      )}
                              </TableHead>
                           ))}
                        </TableRow>
                     ))}
                  </TableHeader>
                  <TableBody>
                     {isLoading ? (
                        <TableSkeleton
                           cols={projectColumns.length}
                           rows={skeletonLimit}
                        />
                     ) : projects.length === 0 ? (
                        <TableRow>
                           <TableCell
                              colSpan={projectColumns.length}
                              className="text-center text-muted-foreground py-16"
                           >
                              <div className="flex flex-col items-center gap-2">
                                 <FolderKanbanIcon className="size-8 text-muted-foreground/50" />
                                 <p className="text-sm">No projects yet.</p>
                              </div>
                           </TableCell>
                        </TableRow>
                     ) : (
                        table.getRowModel().rows.map((row) => (
                           <TableRow
                              key={row.id}
                              className="group"
                           >
                              {row.getVisibleCells().map((cell) => (
                                 <TableCell
                                    key={cell.id}
                                    className="py-3"
                                 >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                 </TableCell>
                              ))}
                           </TableRow>
                        ))
                     )}
                  </TableBody>
               </Table>
            </ScrollArea>
         </div>

         {/* pagination */}
         <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 text-sm text-muted-foreground flex-1">
            {/* count */}
            <p className="text-center sm:text-left">
               {totalProjects === 0 ? "No results" : `Showing ${from}–${to} of ${totalProjects}`}
            </p>

            <div className="flex items-center justify-between sm:justify-end gap-2">
               <Button
                  variant="outline"
                  size="sm"
                  className="text-foreground"
                  onClick={() => setOffset((prev) => Math.max(0, prev - limit))}
                  disabled={offset === 0 || isLoading}
               >
                  Previous
               </Button>

               {/* page numbers — sm+ */}
               <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                     <Button
                        key={i}
                        variant={currentPage === i ? "secondary" : "ghost"}
                        size="icon-sm"
                        onClick={() => setOffset(i * limit)}
                        disabled={isLoading}
                        className={cn(
                           "size-7 text-xs",
                           currentPage === i && "text-foreground font-bold",
                        )}
                     >
                        {i + 1}
                     </Button>
                  ))}
               </div>

               {/* mobile: current / total */}
               <span className="flex sm:hidden text-xs font-medium text-foreground">
                  {currentPage + 1} / {totalPages || 1}
               </span>

               <Button
                  variant="outline"
                  size="sm"
                  className="text-foreground"
                  onClick={() => setOffset((prev) => prev + limit)}
                  disabled={offset + limit >= totalProjects || isLoading}
               >
                  Next
               </Button>
            </div>
         </div>
      </div>
   );
};

export default ProjectsTable;

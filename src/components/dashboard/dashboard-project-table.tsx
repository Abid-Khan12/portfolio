"use client";

import * as React from "react";
import {
   useReactTable,
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   flexRender,
} from "@tanstack/react-table";

import { IProject } from "@/models/project-model";

import { cn } from "@/lib/utils";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";

import projectColumns from "@/components/dashboard/project-column";
import SearchBox from "@/components/dashboard/project-table-search-box";
import useFetch from "@/hooks/use-fetch";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderKanbanIcon, SearchIcon } from "lucide-react";

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
};

// ── Table skeleton ────────────────────────────────────────────────────────────
const TableSkeleton = ({ cols, rows = 5 }: { cols: number; rows?: number }) => (
   <>
      {Array.from({ length: rows }).map((_, i) => (
         <TableRow key={i}>
            {Array.from({ length: cols }).map((_, j) => (
               <TableCell key={j}>
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
}: {
   limit?: number;
   skeletonLimit?: number;
}) => {
   const [globalFilter, setGlobalFilter] = React.useState("");
   const { data, isLoading } = useFetch<ProjectTableFetch>({
      api_key: ["projects_table_fetch"],
      api_url: "/admin/projects",
   });

   const projects = data?.data.projects ?? [];

   const table = useReactTable({
      data: projects,
      columns: projectColumns,
      state: {
         globalFilter,
      },
      onGlobalFilterChange: setGlobalFilter,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      initialState: {
         pagination: {
            pageSize: limit,
         },
      },
   });

   const { pageIndex, pageSize } = table.getState().pagination;
   const totalRows = table.getFilteredRowModel().rows.length;
   const from = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
   const to = Math.min((pageIndex + 1) * pageSize, totalRows);

   return (
      <div className="flex flex-col gap-3">
         {/* toolbar */}
         <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg tracking-wide">Projects</h2>
            <SearchBox
               value={globalFilter}
               onChange={setGlobalFilter}
            />
         </div>

         {/* table */}

         <div className="rounded-lg border border-border w-full min-w-0">
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
                                 : flexRender(header.column.columnDef.header, header.getContext())}
                           </TableHead>
                        ))}
                     </TableRow>
                  ))}
               </TableHeader>
               <TableBody>
                  {isLoading ? (
                     <TableSkeleton
                        cols={projectColumns.length}
                        rows={limit}
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
                  ) : table.getRowModel().rows.length === 0 ? (
                     <TableRow>
                        <TableCell
                           colSpan={projectColumns.length}
                           className="text-center text-muted-foreground py-16"
                        >
                           <div className="flex flex-col items-center gap-2">
                              <SearchIcon className="size-8 text-muted-foreground/50" />
                              <p className="text-sm">No results for your search.</p>
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
                              <TableCell key={cell.id}>
                                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                           ))}
                        </TableRow>
                     ))
                  )}
               </TableBody>
            </Table>
         </div>

         {/* pagination */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-muted-foreground">
            {/* count */}
            <p className="text-center sm:text-left">
               {totalRows === 0 ? "No results" : `Showing ${from}–${to} of ${totalRows}`}
            </p>

            <div className="flex items-center justify-between sm:justify-end gap-2">
               <Button
                  variant="outline"
                  size="sm"
                  className="text-foreground"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
               >
                  Previous
               </Button>

               {/* page numbers — hidden on very small screens, show on sm+ */}
               <div className="hidden xs:flex sm:flex items-center gap-1">
                  {Array.from({ length: table.getPageCount() }, (_, i) => (
                     <Button
                        key={i}
                        variant={pageIndex === i ? "secondary" : "ghost"}
                        size="icon-sm"
                        onClick={() => table.setPageIndex(i)}
                        className={cn(
                           "size-7 text-xs",
                           pageIndex === i && "text-primary font-bold",
                        )}
                     >
                        {i + 1}
                     </Button>
                  ))}
               </div>

               {/* mobile: show current page / total instead of buttons */}
               <span className="flex sm:hidden text-xs font-medium text-foreground">
                  {pageIndex + 1} / {table.getPageCount()}
               </span>

               <Button
                  variant="outline"
                  size="sm"
                  className="text-foreground"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
               >
                  Next
               </Button>
            </div>
         </div>
      </div>
   );
};

export default ProjectsTable;

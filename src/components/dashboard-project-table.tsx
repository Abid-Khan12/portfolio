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

import projectColumns from "@/components/column";
import SearchBox from "@/components/project-table-search-box";

export type ColumnType = Pick<
   IProject,
   "liveLink" | "githubLink" | "title" | "projectImage" | "slug" | "techStack" | "role"
>;

const ROLES = "Frontend";

const TECH_OPTIONS = [
   ["Next.js", "TypeScript", "Tailwind"],
   ["React", "Node.js", "MongoDB"],
   ["Vue.js", "Express", "PostgreSQL"],
   ["React Native", "Firebase", "Redux"],
   ["Next.js", "Prisma", "tRPC"],
];

// ── Dummy data ───────────────────────────────────────────────────────────────
const DUMMY_PROJECTS: ColumnType[] = Array.from({ length: 20 }, (_, i) => ({
   slug: String(i + 1),
   title: [
      "Portfolio Website Redesign",
      "E-Commerce Dashboard",
      "AI Chat Interface",
      "Task Management App",
      "Real-time Analytics",
      "Design System Library",
      "Mobile Banking App",
      "Social Media Dashboard",
      "Weather Forecast App",
      "Recipe Finder Platform",
   ][i % 10],
   projectImage: {
      url: `https://picsum.photos/seed/${i + 10}/64/64`,
      public_id: "",
      width: 64,
      height: 64,
   },
   githubLink: "https://github.com",
   liveLink: "https://linkedin.com",
   techStack: TECH_OPTIONS[i % 5],
   role: ROLES,
}));

// ── Table ────────────────────────────────────────────────────────────────────
const ProjectsTable = () => {
   const [globalFilter, setGlobalFilter] = React.useState("");

   const table = useReactTable({
      data: DUMMY_PROJECTS,
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
            pageSize: 6,
         },
      },
   });

   const { pageIndex, pageSize } = table.getState().pagination;
   const totalRows = table.getFilteredRowModel().rows.length;
   const from = pageIndex * pageSize + 1;
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
         <div className="rounded-lg border border-border overflow-hidden">
            <ScrollArea className="w-full">
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
                     {table.getRowModel().rows.length === 0 ? (
                        <TableRow>
                           <TableCell
                              colSpan={projectColumns.length}
                              className="text-center text-muted-foreground py-10"
                           >
                              No projects found.
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
               <ScrollBar orientation="horizontal" />
            </ScrollArea>
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

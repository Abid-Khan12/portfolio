"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import StarterKit from "@tiptap/starter-kit";
import { Editor } from "@tiptap/react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { ColumnType } from "./dashboard-project-table";

import {
   CodeIcon,
   ChevronDownIcon,
   MoreHorizontalIcon,
   PencilIcon,
   Trash2Icon,
   Globe,
   GitBranchIcon,
} from "lucide-react";

import ProjectDeleteConfirmationDialog from "@/components/dialogs/delete-confirmation-dialog";

import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

// ── Tech Stack Popover ───────────────────────────────────────────────────────
const TechStackPopover = ({ techs }: { techs: string[] }) => {
   const [open, setOpen] = React.useState(false);

   return (
      <Popover
         open={open}
         onOpenChange={setOpen}
      >
         <PopoverTrigger
            render={
               <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs h-7"
               />
            }
         >
            <CodeIcon className="size-3" />
            Stack
            <ChevronDownIcon className="size-3 text-muted-foreground" />
         </PopoverTrigger>
         <PopoverContent
            align="center"
            sideOffset={10}
            className="w-73"
         >
            {techs.length === 0 ? (
               <p className="text-xs text-muted-foreground px-2 py-1">No tech listed.</p>
            ) : (
               <div className="grid grid-cols-3 gap-2">
                  {techs.map((tech) => (
                     <Badge
                        key={tech}
                        className="justify-center truncate"
                     >
                        {tech}
                     </Badge>
                  ))}
               </div>
            )}
         </PopoverContent>
      </Popover>
   );
};

const projectColumns: ColumnDef<ColumnType>[] = [
   {
      accessorKey: "title",
      header: "Project",
      cell: ({ row }) => {
         const project = row.original;
         const editor = new Editor({
            extensions: [StarterKit],
            content: project.description,
            editable: false,
            autofocus: false,
         });
         return (
            <Link
               className="flex items-center gap-4 group"
               href={`/project/${project.slug}`}
            >
               <figure className="shrink-0 w-30 h-17 rounded-md overflow-hidden">
                  <Image
                     src={project.projectImage.url}
                     width={project.projectImage.width}
                     height={project.projectImage.height}
                     alt={project.title}
                     className="size-full object-cover"
                  />
               </figure>
               <div className="max-w-[50ch]">
                  <h3 className="font-semibold truncate group-hover:underline mb-1">
                     {project.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-2 text-wrap">{editor.getText()}</p>
               </div>
            </Link>
         );
      },
   },
   {
      id: "links",
      header: "Links",
      cell: ({ row }) => (
         <div className="flex items-center gap-2 shrink-0">
            <Tooltip>
               <TooltipTrigger>
                  <Button
                     nativeButton={false}
                     render={
                        <Link
                           href={row.original.githubLink}
                           target="_blank"
                           rel="noopener noreferrer"
                        />
                     }
                     variant={"outline"}
                     size={"icon"}
                  >
                     <GitBranchIcon />
                  </Button>
               </TooltipTrigger>
               <TooltipContent>Github Link</TooltipContent>
            </Tooltip>

            {row.original.liveLink && (
               <Tooltip>
                  <TooltipTrigger>
                     <Button
                        nativeButton={false}
                        render={
                           <Link
                              href={row.original.liveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                           />
                        }
                        variant={"outline"}
                        size={"icon"}
                     >
                        <Globe />
                     </Button>
                  </TooltipTrigger>
                  <TooltipContent>Live Link</TooltipContent>
               </Tooltip>
            )}
         </div>
      ),
   },
   {
      id: "techStack",
      header: "Stack",
      cell: ({ row }) => <TechStackPopover techs={row.original.techStack ?? []} />,
   },
   {
      accessorKey: "role",
      header: "Role",
      cell: ({ getValue }) => {
         const role = getValue<string>();
         return (
            <Badge
               variant={role === "Frontend" ? "default" : "secondary"}
               className="px-3"
            >
               {role ?? "-"}
            </Badge>
         );
      },
   },
   {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ getValue }) => (
         <p className="truncate max-w-[160px] sm:max-w-[260px] text-sm font-medium">
            {format(new Date(getValue<string>()), "MMM dd, yyyy")}
         </p>
      ),
   },
   {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
         const [open, setOpen] = useState(false);

         const { slug } = row.original;

         return (
            <>
               <DropdownMenu>
                  <DropdownMenuTrigger
                     render={
                        <Button
                           variant="outline"
                           size="icon"
                        />
                     }
                  >
                     <MoreHorizontalIcon />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                     align="end"
                     className={"space-y-2"}
                  >
                     <DropdownMenuItem render={<Link href={`/admin/projects/update/${slug}`} />}>
                        <PencilIcon className="size-3.5" />
                        Edit
                     </DropdownMenuItem>

                     <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setOpen(true)}
                     >
                        <Trash2Icon className="size-3.5" />
                        Delete
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>

               <ProjectDeleteConfirmationDialog
                  open={open}
                  setOpen={setOpen}
                  slug={slug}
               />
            </>
         );
      },
   },
];

export default projectColumns;

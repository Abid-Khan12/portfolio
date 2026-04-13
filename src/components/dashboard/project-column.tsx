"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import StarterKit from "@tiptap/starter-kit";
import { Editor } from "@tiptap/react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { ColumnType } from "./dashboard-project-table";

import { Github, LinkedIn } from "@/public";

import {
   CodeIcon,
   ChevronDownIcon,
   MoreHorizontalIcon,
   PencilIcon,
   Trash2Icon,
} from "lucide-react";

import ProjectDeleteConfirmationDialog from "@/components/dialogs/delete-confirmation-dialog";
import UpdateDrawerDialog from "@/components/drawer/project-update-drawer";
import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

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
            <Link
               href={row.original.githubLink}
               target="_blank"
               rel="noopener noreferrer"
               className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
               <Image
                  src={Github}
                  alt="github-icon"
                  className="size-5"
                  width={22}
                  height={22}
               />
            </Link>
            {row.original.liveLink && (
               <Link
                  href={row.original.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" text-muted-foreground hover:text-foreground transition-colors shrink-0"
               >
                  <Image
                     src={LinkedIn}
                     alt="LinkedIn-icon"
                     className="size-5"
                     width={22}
                     height={22}
                  />
               </Link>
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
      cell: ({ getValue }) => <Badge>{getValue<string>() ?? "—"}</Badge>,
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
         const [showUpdateDrawer, setShowUpdateDrawer] = useState(false);
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
                     <DropdownMenuItem onClick={() => setShowUpdateDrawer(true)}>
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
               <UpdateDrawerDialog
                  open={showUpdateDrawer}
                  setOpen={setShowUpdateDrawer}
                  slug={slug}
               />
            </>
         );
      },
   },
];

export default projectColumns;

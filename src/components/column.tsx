"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";

import { ColumnType } from "./dashboard-project-table";

import { Github, LinkedIn } from "@/public";
import { CodeIcon, ChevronDownIcon } from "lucide-react";

import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react";

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
            className="w-48"
         >
            {techs.length === 0 ? (
               <p className="text-xs text-muted-foreground px-2 py-1">No tech listed.</p>
            ) : (
               <div className="flex flex-wrap gap-2 gap-y-3">
                  {techs.map((tech) => (
                     <Badge key={tech}>{tech}</Badge>
                  ))}
               </div>
            )}
         </PopoverContent>
      </Popover>
   );
};

const projectColumns: ColumnDef<ColumnType>[] = [
   {
      id: "image",
      header: "Image",
      cell: ({ row }) => (
         <div className="size-12 rounded-md overflow-hidden border border-border bg-muted relative">
            <Image
               src={row.original.projectImage.url}
               alt={row.original.title}
               sizes="100%"
               fill
            />
         </div>
      ),
   },
   {
      accessorKey: "title",
      header: "Title",
      cell: ({ getValue }) => (
         <p className="truncate max-w-[160px] sm:max-w-[260px] text-sm font-medium">
            {getValue<string>()}
         </p>
      ),
   },
   {
      id: "links",
      header: "Links",
      cell: ({ row }) => (
         <div className="flex items-center gap-2">
            <Link
               href={row.original.githubLink}
               target="_blank"
               rel="noopener noreferrer"
               className="text-muted-foreground hover:text-foreground transition-colors"
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
                  className=" text-muted-foreground hover:text-foreground transition-colors"
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
      id: "actions",
      header: "Actions",
      cell: () => (
         <DropdownMenu>
            <DropdownMenuTrigger
               render={
                  <Button
                     variant="ghost"
                     size="icon-sm"
                     className=""
                  />
               }
            >
               <MoreHorizontalIcon className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
               align="end"
               className={"space-y-2"}
            >
               <DropdownMenuItem render={<Link href={"#"} />}>
                  <PencilIcon className="size-3.5" />
                  Edit
               </DropdownMenuItem>
               <DropdownMenuItem
                  variant="destructive"
                  render={<Link href={"#"} />}
               >
                  <Trash2Icon className="size-3.5" />
                  Delete
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      ),
   },
];

export default projectColumns;

"use client";

import { useCurrentEditor, useEditorState } from "@tiptap/react";

import {
   Bold,
   Italic,
   Strikethrough,
   Underline,
   Code,
   List,
   ListOrdered,
   ListCollapse,
   AlignLeft,
   AlignCenter,
   AlignRight,
   AlignJustify,
   Highlighter,
   Undo,
   Redo,
   ChevronDown,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const HEADINGS = [
   { label: "Paragraph", value: 0 },
   { label: "Heading 1", value: 1 },
   { label: "Heading 2", value: 2 },
   { label: "Heading 3", value: 3 },
];

const ALIGNMENTS = [
   { icon: AlignLeft, label: "Align left", value: "left" },
   { icon: AlignCenter, label: "Align center", value: "center" },
   { icon: AlignRight, label: "Align right", value: "right" },
   { icon: AlignJustify, label: "Align justify", value: "justify" },
];

const TooltipToggle = ({
   label,
   active,
   onClick,
   children,
   disabled = false,
}: {
   label: string;
   active?: boolean;
   onClick: () => void;
   children: React.ReactNode;
   disabled?: boolean;
}) => (
   <Tooltip>
      <TooltipTrigger
         render={
            <Toggle
               size="sm"
               pressed={active}
               onPressedChange={onClick}
               disabled={disabled}
               aria-label={label}
            >
               {children}
            </Toggle>
         }
      />
      <TooltipContent>{label}</TooltipContent>
   </Tooltip>
);

const Toolbar = () => {
   const { editor } = useCurrentEditor();

   if (!editor) return null;

   const { currentHeading, currentAlignment } = useEditorState({
      editor,
      selector: ({ editor }) => {
         const currentHeading = HEADINGS.find((h) =>
            h.value === 0
               ? editor.isActive("paragraph")
               : editor.isActive("heading", { level: h.value }),
         );

         const currentAlignment =
            ALIGNMENTS.find((a) => editor.isActive({ textAlign: a.value })) ?? ALIGNMENTS[0];

         return { currentHeading, currentAlignment };
      },
   });

   const AlignIcon = currentAlignment.icon;

   return (
      <div className="flex flex-wrap items-center gap-0.5 border dark:border-border border-transparent rounded-t-lg p-1.5 bg-muted/40 border-b-0">
         {/* Undo / Redo */}
         <Tooltip>
            <TooltipTrigger
               render={
                  <Button
                     type="button"
                     size="sm"
                     variant="ghost"
                     onClick={() => editor.chain().focus().undo().run()}
                     disabled={!editor.can().undo()}
                  >
                     <Undo size={15} />
                  </Button>
               }
            />
            <TooltipContent>Undo</TooltipContent>
         </Tooltip>

         <Tooltip>
            <TooltipTrigger
               render={
                  <Button
                     type="button"
                     size="sm"
                     variant="ghost"
                     onClick={() => editor.chain().focus().redo().run()}
                     disabled={!editor.can().redo()}
                  >
                     <Redo size={15} />
                  </Button>
               }
            />
            <TooltipContent>Redo</TooltipContent>
         </Tooltip>

         <Separator
            orientation="vertical"
            className="h-6 mx-1"
         />

         {/* Heading dropdown */}
         <DropdownMenu>
            <Tooltip>
               <TooltipTrigger
                  render={
                     <DropdownMenuTrigger
                        render={
                           <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="gap-1 px-2 min-w-28 justify-between"
                           >
                              {currentHeading?.label ?? "Paragraph"}
                              <ChevronDown size={13} />
                           </Button>
                        }
                     />
                  }
               />
               <TooltipContent>Text style</TooltipContent>
            </Tooltip>

            <DropdownMenuContent>
               {HEADINGS.map(({ label, value }) => {
                  const isActive =
                     value === 0
                        ? editor.isActive("paragraph")
                        : editor.isActive("heading", { level: value });

                  return (
                     <DropdownMenuItem
                        key={value}
                        onMouseDown={(e) => {
                           e.preventDefault();

                           if (value === 0) {
                              editor.chain().focus().setParagraph().run();
                           } else {
                              editor
                                 .chain()
                                 .focus()
                                 .toggleHeading({ level: value as 1 | 2 | 3 | 4 })
                                 .run();
                           }
                        }}
                        className={cn("gap-2", isActive && "bg-accent text-accent-foreground")}
                     >
                        {label}
                     </DropdownMenuItem>
                  );
               })}
            </DropdownMenuContent>
         </DropdownMenu>

         <Separator
            orientation="vertical"
            className="h-6 mx-1"
         />

         {/* Text formatting */}
         <TooltipToggle
            label="Bold"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
         >
            <Bold size={15} />
         </TooltipToggle>

         <TooltipToggle
            label="Italic"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
         >
            <Italic size={15} />
         </TooltipToggle>

         <TooltipToggle
            label="Underline"
            active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
         >
            <Underline size={15} />
         </TooltipToggle>

         <TooltipToggle
            label="Strikethrough"
            active={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
         >
            <Strikethrough size={15} />
         </TooltipToggle>

         <TooltipToggle
            label="Highlight"
            active={editor.isActive("highlight")}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
         >
            <Highlighter size={15} />
         </TooltipToggle>

         <TooltipToggle
            label="Inline code"
            active={editor.isActive("code")}
            onClick={() => editor.chain().focus().toggleCode().run()}
         >
            <Code size={15} />
         </TooltipToggle>

         <Separator
            orientation="vertical"
            className="h-6 mx-1"
         />

         {/* Lists */}
         <TooltipToggle
            label="Bullet list"
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
         >
            <List size={15} />
         </TooltipToggle>

         <TooltipToggle
            label="Ordered list"
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
         >
            <ListOrdered size={15} />
         </TooltipToggle>

         <TooltipToggle
            label="Block quote"
            active={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
         >
            <ListCollapse size={15} />
         </TooltipToggle>

         <Separator
            orientation="vertical"
            className="h-6 mx-1"
         />

         {/* Alignment dropdown */}
         <DropdownMenu>
            <Tooltip>
               <TooltipTrigger
                  render={
                     <DropdownMenuTrigger
                        render={
                           <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="gap-1 px-2"
                           >
                              <AlignIcon size={15} />
                              <ChevronDown size={13} />
                           </Button>
                        }
                     />
                  }
               />

               <TooltipContent>Text alignment</TooltipContent>
            </Tooltip>
            <DropdownMenuContent>
               {ALIGNMENTS.map(({ icon: Icon, label, value }) => (
                  <DropdownMenuItem
                     key={value}
                     onMouseDown={(e) => {
                        e.preventDefault(); // ✅ prevents editor blur
                        editor.chain().focus().setTextAlign(value).run();
                     }}
                     className="gap-2"
                  >
                     <Icon size={15} />
                     {label}
                  </DropdownMenuItem>
               ))}
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   );
};

export default Toolbar;

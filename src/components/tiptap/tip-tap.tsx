"use client";

import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { EditorProvider } from "@tiptap/react";
import { Controller, type FieldValues } from "react-hook-form";

import type { PrimaryInputProps } from "@/types/type";

import { cn } from "@/lib/utils";

import Toolbar from "@/components/tiptap/tool-bar";

import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";

export const extensions = [
   StarterKit.configure({
      bulletList: { keepMarks: true, keepAttributes: false },
      orderedList: { keepMarks: true, keepAttributes: false },
   }),
   Placeholder.configure({ placeholder: "Enter content here" }),
   Highlight.configure({ multicolor: false }),
   TextAlign.configure({ types: ["heading", "paragraph"] }),
];

type TipTapPros<T extends FieldValues> = { className?: string } & PrimaryInputProps<T>;

const TipTap = <T extends FieldValues>({ control, name, label, className }: TipTapPros<T>) => {
   return (
      <Controller
         control={control}
         name={name}
         render={({ field, fieldState }) => (
            <Field className="relative min-h-[180px]">
               <FieldLabel htmlFor={name}>{label}</FieldLabel>
               <FieldContent>
                  <EditorProvider
                     key={field.value ? "loaded" : "empty"}
                     immediatelyRender={false}
                     slotBefore={<Toolbar />}
                     extensions={extensions}
                     editorContainerProps={{
                        className: cn(
                           "w-full bg-background/50 px-4 py-3 text-sm text-foreground overflow-y-auto rounded-b-lg",
                           // editor area
                           "[&_.tiptap]:outline-none",
                           "[&_.tiptap]:h-[300px]",
                           "[&_.tiptap]:leading-7",
                           // placeholder
                           "[&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
                           "[&_.tiptap_p.is-editor-empty:first-child::before]:text-muted-foreground",
                           "[&_.tiptap_p.is-editor-empty:first-child::before]:float-left",
                           "[&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none",
                           "[&_.tiptap_p.is-editor-empty:first-child::before]:h-0",
                           // headings
                           "[&_.tiptap_h1]:font-heading [&_.tiptap_h1]:mt-3 [&_.tiptap_h1]:text-2xl [&_.tiptap_h1]:mb-2 [&_.tiptap_h1]:font-semibold [&_.tiptap_h1]:tracking-wide",
                           "[&_.tiptap_h2]:font-heading [&_.tiptap_h2]:text-xl [&_.tiptap_h2]:font-semibold [&_.tiptap_h2]:mt-3 [&_.tiptap_h2]:mb-2 [&_.tiptap_h2]:tracking-wide",
                           "[&_.tiptap_h3]:font-heading [&_.tiptap_h3]:text-lg [&_.tiptap_h3]:font-semibold [&_.tiptap_h3]:mt-4 [&_.tiptap_h3]:mb-2 [&_.tiptap_h3]:tracking-wide",
                           // paragraph
                           "[&_.tiptap_p]:mb-2",
                           // lists
                           "[&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-3 [&_.tiptap_ul]:mb-2",
                           "[&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-3 [&_.tiptap_ol]:mb-2",
                           "[&_.tiptap_li]:mb-1.5",
                           // blockquote
                           "[&_.tiptap_blockquote]:border-l-[3px] [&_.tiptap_blockquote]:border-primary",
                           "[&_.tiptap_blockquote]:pl-4 [&_.tiptap_blockquote]:my-4",
                           "[&_.tiptap_blockquote]:italic [&_.tiptap_blockquote]:text-muted-foreground",
                           // inline code
                           "[&_.tiptap_code]:bg-muted [&_.tiptap_code]:text-foreground",
                           "[&_.tiptap_code]:px-1.5 [&_.tiptap_code]:py-0.5",
                           "[&_.tiptap_code]:rounded [&_.tiptap_code]:text-xs [&_.tiptap_code]:font-mono",
                           // code block
                           "[&_.tiptap_pre]:bg-muted [&_.tiptap_pre]:rounded-lg",
                           "[&_.tiptap_pre]:p-4 [&_.tiptap_pre]:my-4 [&_.tiptap_pre]:overflow-x-auto",
                           "[&_.tiptap_pre_code]:bg-transparent [&_.tiptap_pre_code]:p-0 [&_.tiptap_pre_code]:text-xs",
                           // highlight
                           "[&_.tiptap_mark]:bg-primary/25 [&_.tiptap_mark]:rounded-sm [&_.tiptap_mark]:px-0.5",
                           // horizontal rule
                           "[&_.tiptap_hr]:border-border [&_.tiptap_hr]:my-6",
                           // strong / em
                           "[&_.tiptap_strong]:font-semibold [&_.tiptap_strong]:text-foreground",
                           "[&_.tiptap_em]:italic",
                           className,
                        ),
                        id: name,
                     }}
                     content={field.value ?? ""}
                     onUpdate={({ editor }) => field.onChange(editor.getHTML())}
                  />
               </FieldContent>
               {fieldState.invalid && fieldState.error && (
                  <FieldError className="absolute -bottom-6 left-0">
                     {fieldState.error.message}
                  </FieldError>
               )}
            </Field>
         )}
      />
   );
};

export default TipTap;

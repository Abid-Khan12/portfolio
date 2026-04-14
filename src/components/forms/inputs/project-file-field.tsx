"use client";

import * as React from "react";
import Image from "next/image";
import { Controller, FieldValues } from "react-hook-form";
import { UploadIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { PrimaryInputProps } from "@/types/type";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldError } from "@/components/ui/field";

type ProjectFieldProps<T extends FieldValues> = { existingUrl?: string | null } & PrimaryInputProps<T>;

const ProjectFileField = <T extends FieldValues>({
   control,
   name,
   existingUrl,
}: ProjectFieldProps<T>) => {
   const inputRef = React.useRef<HTMLInputElement>(null);
   const [preview, setPreview] = React.useState<string | null>(null);

   React.useEffect(() => {
      if (existingUrl) {
         setPreview(existingUrl);
      }
   }, [existingUrl]);

   return (
      <Controller
         control={control}
         name={name}
         render={({ field: { onChange, value, ref, ...rest }, fieldState }) => (
            <Field className="relative">
               <FieldContent className="gap-y-2">
                  {/* Drop zone */}
                  <button
                     type="button"
                     onClick={() => inputRef.current?.click()}
                     className={cn(
                        "relative w-full rounded-xl border-2 border-dashed border-border",
                        "bg-muted hover:bg-accent transition-colors overflow-hidden",
                        "flex items-center justify-center cursor-pointer group",
                        preview ? "h-56" : "h-40",
                        fieldState.error && "border-destructive",
                     )}
                  >
                     {preview ? (
                        <Image
                           src={preview}
                           alt="project preview"
                           sizes="100%"
                           fill
                           className="object-cover"
                        />
                     ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors pointer-events-none">
                           <UploadIcon className="size-8" />
                           <p className="text-sm font-medium">Click to upload image</p>
                           <p className="text-xs">PNG, JPG, WEBP · Max 1MB</p>
                        </div>
                     )}
                  </button>

                  {/* Actions row */}
                  {preview && (
                     <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground truncate max-w-[60%]">
                           {value?.name ?? "Selected file"}
                        </p>
                        <Button
                           type="button"
                           variant="destructive"
                           size="sm"
                           className="gap-1.5"
                           onClick={() => {
                              setPreview(null);
                              onChange(undefined);
                              if (inputRef.current) inputRef.current.value = "";
                           }}
                        >
                           <XIcon className="size-3.5" />
                           Remove
                        </Button>
                     </div>
                  )}

                  {/* Error */}
                  {fieldState.error && (
                     <FieldError className="absolute -bottom-6 left-0">
                        {fieldState.error.message}
                     </FieldError>
                  )}

                  {/* Hidden input */}
                  <input
                     id={name}
                     type="file"
                     accept="image/png, image/jpeg, image/webp"
                     className="sr-only"
                     ref={(el) => {
                        ref(el);
                        // @ts-ignore
                        inputRef.current = el;
                     }}
                     onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setPreview(URL.createObjectURL(file));
                        onChange(file);
                     }}
                     {...rest}
                  />
               </FieldContent>
            </Field>
         )}
      />
   );
};

export default ProjectFileField;

import { useEffect, useRef, useState } from "react";
import type { PrimaryInputProps } from "@/types/type";
import { Controller, type FieldValues } from "react-hook-form";

import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import { UploadIcon, X } from "lucide-react";

type FileFieldProps<T extends FieldValues> = { existingUrl?: string } & PrimaryInputProps<T>;

const FileField = <T extends FieldValues>({ control, name, existingUrl }: FileFieldProps<T>) => {
   const inputRef = useRef<HTMLInputElement>(null);
   const [preview, setPreview] = useState<string | null>(null);

   return (
      <Controller
         control={control}
         name={name}
         render={({ field, fieldState }) => {
            const showPreview = (file: File | null) => {
               if (!file) {
                  setPreview(null);
                  return;
               }

               const objectUrl = URL.createObjectURL(file);
               setPreview(objectUrl);
            };

            useEffect(() => {
               if (existingUrl) {
                  setPreview(existingUrl);
               }
            }, [existingUrl]);

            return (
               <div className="">
                  {preview ? (
                     <div className="relative size-16 group overflow-hidden rounded-full">
                        <img
                           className="size-full absolute object-cover"
                           src={preview}
                           alt="image-preview"
                        />
                        <div
                           className="absolute group-hover:opacity-100 opacity-0 transition-opacity duration-200 flex items-center justify-center size-full bg-destructive/40 z-20 cursor-pointer"
                           onClick={() => setPreview(null)}
                        >
                           <X />
                        </div>
                     </div>
                  ) : (
                     <>
                        <div
                           className={cn(
                              "size-16 rounded-full flex items-center justify-center border cursor-pointer",
                              fieldState.invalid && "border-destructive",
                           )}
                           onClick={() => inputRef.current?.click()}
                        >
                           <UploadIcon />
                        </div>
                        <Input
                           accept="image/*"
                           ref={(el) => {
                              inputRef.current = el;
                              field.ref(el);
                           }}
                           type="file"
                           className="hidden"
                           onChange={(e) => {
                              field.onChange(e.target.files?.[0] || undefined);
                              showPreview(e.target.files?.[0] || null);
                           }}
                        />{" "}
                     </>
                  )}
               </div>
            );
         }}
      />
   );
};

export default FileField;

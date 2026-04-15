import Image from "next/image";
import { useRef, useState } from "react";
import { Controller, type FieldValues } from "react-hook-form";

import type { PrimaryInputProps } from "@/types/type";

import { UploadIcon, X } from "lucide-react";

import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";

type FileFieldProps<T extends FieldValues> = { existingUrl?: string } & PrimaryInputProps<T>;

const FileField = <T extends FieldValues>({ control, name, existingUrl }: FileFieldProps<T>) => {
   const inputRef = useRef<HTMLInputElement>(null);
   const [preview, setPreview] = useState<string | null>(existingUrl ?? "");

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

            return (
               <div className="">
                  {preview ? (
                     <div className="relative size-16 group overflow-hidden rounded-full">
                        <Image
                           src={preview}
                           alt="image-preview"
                           sizes="100%"
                           fill
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

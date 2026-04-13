import * as React from "react";
import { Controller, FieldValues } from "react-hook-form";

import { PrimaryInputProps } from "@/types/type";

import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import {
   Combobox,
   ComboboxChip,
   ComboboxChips,
   ComboboxChipsInput,
   ComboboxCollection,
   ComboboxContent,
   ComboboxEmpty,
   ComboboxGroup,
   ComboboxItem,
   ComboboxLabel,
   ComboboxList,
   ComboboxSeparator,
   ComboboxValue,
   useComboboxAnchor,
} from "@/components/ui/combobox";

const techStackOptions = [
   {
      value: "Languages",
      items: [
         "JavaScript",
         "TypeScript",
         "Python",
         "Rust",
         "Go",
         "Java",
         "C++",
         "PHP",
         "HTML",
         "CSS",
      ],
   },
   {
      value: "Frontend Framework",
      items: [
         "React",
         "Next.js",
         "Vue.js",
         "Nuxt.js",
         "Svelte",
         "SvelteKit",
         "Astro",
         "Remix",
         "Angular",
         "Solid.js",
      ],
   },
   {
      value: "Backend Framework",
      items: [
         "Node.js",
         "Express.js",
         "Fastify",
         "NestJS",
         "Django",
         "FastAPI",
         "Laravel",
         "Spring Boot",
      ],
   },
   {
      value: "Databases",
      items: [
         "MongoDB",
         "PostgreSQL",
         "MySQL",
         "Redis",
         "SQLite",
         "Prisma",
         "Mongoose",
         "Supabase",
         "Firebase",
      ],
   },
   {
      value: "Styling",
      items: ["Tailwind CSS", "Sass", "shadcn/ui", "MUI", "Chakra UI", "Framer Motion"],
   },
   {
      value: "Devops / Cloud",
      items: ["Docker", "AWS", "Vercel", "Cloudinary", "Nginx"],
   },
   {
      value: "Tools",
      items: [
         "GraphQL",
         "tRPC",
         "REST API",
         "Socket.io",
         "JWT",
         "Zod",
         "React Query",
         "Redux",
         "Zustand",
      ],
   },
] as const;

const ProjectCombobox = <T extends FieldValues>({ control, name, label }: PrimaryInputProps<T>) => {
   const anchor = useComboboxAnchor();

   return (
      <Controller
         control={control}
         name={name}
         render={({ field, fieldState }) => (
            <Field className="relative">
               <FieldLabel htmlFor={name}>{label}</FieldLabel>
               <FieldContent>
                  <Combobox
                     multiple
                     autoHighlight
                     items={techStackOptions}
                     value={field.value ?? []}
                     onValueChange={field.onChange}
                     id={name}
                  >
                     <ComboboxChips
                        ref={anchor}
                        className="w-full"
                     >
                        <ComboboxValue>
                           {(values) => (
                              <React.Fragment>
                                 {values.map((value: string) => (
                                    <ComboboxChip key={value}>{value}</ComboboxChip>
                                 ))}
                                 <ComboboxChipsInput
                                    placeholder="Search tech stack..."
                                    aria-invalid={fieldState.invalid}
                                 />
                              </React.Fragment>
                           )}
                        </ComboboxValue>
                     </ComboboxChips>
                     <ComboboxContent
                        anchor={anchor}
                        sideOffset={5}
                     >
                        <ComboboxEmpty>No items found.</ComboboxEmpty>
                        <ComboboxList>
                           {(group, index) => (
                              <ComboboxGroup
                                 key={group.value}
                                 items={group.items}
                              >
                                 <ComboboxLabel>{group.value}</ComboboxLabel>
                                 <ComboboxCollection>
                                    {(item) => (
                                       <ComboboxItem
                                          key={item}
                                          value={item}
                                       >
                                          {item}
                                       </ComboboxItem>
                                    )}
                                 </ComboboxCollection>
                                 {index < techStackOptions.length - 1 && <ComboboxSeparator />}
                              </ComboboxGroup>
                           )}
                        </ComboboxList>
                     </ComboboxContent>
                  </Combobox>
               </FieldContent>
               {fieldState.error && <FieldError className="absolute -bottom-6 left-0">{fieldState.error.message}</FieldError>}
            </Field>
         )}
      />
   );
};

export default ProjectCombobox;

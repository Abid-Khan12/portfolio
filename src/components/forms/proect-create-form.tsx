"use client";

import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

import useCustomMutation from "@/hooks/use-mutation";

import ProjectFileField from "@/components/forms/inputs/project-file-field";
import ProjectSelect from "@/components/forms/inputs/project-select";
import ProjectCombobox from "@/components/forms/inputs/project-combobox";
import TipTap from "@/components/tiptap/tip-tap";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import createProjectSchema, { CreateProjectDataType } from "@/schemas/projects/create";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const CreateProjectForm = () => {
   const router = useRouter();
   const queryClient = useQueryClient();
   const {
      handleSubmit,
      reset,
      register,
      control,
      formState: { errors },
   } = useForm<CreateProjectDataType>({
      resolver: zodResolver(createProjectSchema),
      defaultValues: {
         projectImage: undefined,
         title: "",
         description: "",
         role: "Frontend",
         techStack: [],
         githubLink: "",
         liveLink: "",
      },
      mode: "all",
   });

   const { mutate, isPending } = useCustomMutation<CreateProjectDataType>({
      api_key: ["project_create_mutation"],
      api_url: "/admin/projects",
   });

   const onSubmit = (values: CreateProjectDataType) => {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
         if (value === undefined || value === null) return;

         if (Array.isArray(value)) {
            value.forEach((item) => formData.append(key, item));
         } else if (value instanceof File) {
            formData.append(key, value);
         } else {
            formData.append(key, String(value));
         }
      });
      mutate(
         { payload: formData },
         {
            onSuccess({ message }) {
               toast.success(message);
               queryClient.refetchQueries({
                  queryKey: ["projects_table_fetch"],
                  exact: true,
               });
               queryClient.refetchQueries({
                  queryKey: ["dashboard_state"],
                  exact: true,
               });
               router.back();
               reset();
            },
            onError({ message, error }) {
               if (!(typeof error === "string") && error) {
                  Object.entries(error).forEach(([key, value]) => {
                     toast.error(`${key}: ${value[0]}`);
                  });

                  return;
               }
               toast.error(message ?? "Error while creating project");
            },
         },
      );
   };

   return (
      <Card className="sm:max-w-4xl w-full h-fit mx-auto">
         <CardHeader className="relative">
            <Button
               variant={"outline"}
               className="sticky z-20 left-0 top-0 w-fit mb-2"
               onClick={() => router.back()}
            >
               <ArrowLeft />
            </Button>
            <CardTitle className="text-3xl">Add New Project</CardTitle>
            <CardDescription>
               Fill in the details below to add a new project to your portfolio. All fields marked
               as required must be completed before submitting.
            </CardDescription>
         </CardHeader>
         <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
               <FieldGroup className="gap-y-6.5">
                  <ProjectFileField
                     control={control}
                     name="projectImage"
                  />
                  <Field className="relative">
                     <FieldLabel htmlFor="title">Project title</FieldLabel>
                     <FieldContent>
                        <Input
                           id="title"
                           placeholder="E-commerce etc."
                           aria-invalid={!!errors.title}
                           {...register("title")}
                        />
                     </FieldContent>
                     {errors.title && (
                        <FieldError className="absolute -bottom-6 left-0">
                           {errors.title.message}
                        </FieldError>
                     )}
                  </Field>
                  <TipTap
                     control={control}
                     name="description"
                     label="Project description"
                  />
                  <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mt-1">
                     <ProjectSelect
                        control={control}
                        name="role"
                        label="Project role"
                     />
                     <ProjectCombobox
                        control={control}
                        name="techStack"
                        label="Project techStack"
                     />
                  </div>
                  <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                     <Field className="relative">
                        <FieldLabel htmlFor="github">Project github link</FieldLabel>
                        <FieldContent>
                           <Input
                              id="github"
                              placeholder="Repo Link"
                              {...register("githubLink")}
                              aria-invalid={!!errors.githubLink}
                           />
                        </FieldContent>
                        {errors.githubLink && (
                           <FieldError className="absolute -bottom-6 left-0">
                              {errors.githubLink.message}
                           </FieldError>
                        )}
                     </Field>
                     <Field>
                        <FieldLabel htmlFor="livelink">Project live link</FieldLabel>
                        <FieldContent>
                           <Input
                              id="livelink"
                              placeholder="Live link (optional)"
                              {...register("liveLink")}
                           />
                        </FieldContent>
                     </Field>
                  </div>
                  <Field className="mt-3">
                     <Button
                        type="submit"
                        size={"lg"}
                        disabled={isPending}
                     >
                        {isPending ? "Creating Project..." : "Create Project"}
                     </Button>
                  </Field>
               </FieldGroup>
            </form>
         </CardContent>
      </Card>
   );
};

export default CreateProjectForm;

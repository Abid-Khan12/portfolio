"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { IProject } from "@/models/project-model";

import { ArrowLeft } from "lucide-react";

import useFetch from "@/hooks/use-fetch";
import useCustomMutation from "@/hooks/use-mutation";

import ProjectFileField from "@/components/forms/inputs/project-file-field";
import TipTap from "@/components/tiptap/tip-tap";
import ProjectSelect from "@/components/forms/inputs/project-select";
import ProjectCombobox from "@/components/forms/inputs/project-combobox";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

import updateProjectSchema, { UpdateProjectFormData } from "@/schemas/projects/update";

interface UpdteDialogProps {
   slug: string;
}

interface ProjectDetailsResponse {
   project: Pick<
      IProject,
      "title" | "description" | "githubLink" | "liveLink" | "projectImage" | "role" | "techStack"
   >;
}

export default function ProjectUpdateForm({ slug }: UpdteDialogProps) {
   const router = useRouter();
   const queryClient = useQueryClient();

   const { data, isLoading } = useFetch<ProjectDetailsResponse>({
      api_key: ["project_details_fetched", slug],
      api_url: "/admin/projects",
      slug,
   });

   const {
      handleSubmit,
      reset,
      control,
      register,
      watch,
      formState: { errors },
   } = useForm<UpdateProjectFormData>({
      resolver: zodResolver(updateProjectSchema),
      defaultValues: {
         title: "",
         description: "",
         githubLink: "",
         liveLink: "",
         projectImage: undefined,
         role: "Frontend",
         techStack: [],
      },
      mode: "all",
   });

   const { title, githubLink, liveLink } = watch();

   const { mutate, isPending } = useCustomMutation({
      api_key: ["project_update_mutation", slug],
      api_url: "/admin/projects",
   });

   const onSubmit = (values: UpdateProjectFormData) => {
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
         { payload: formData, slug, method: "put" },
         {
            onSuccess({ message }) {
               toast.success(message);
               queryClient.refetchQueries({
                  queryKey: ["projects_table_fetch"],
                  exact: true,
               });
               router.back();
            },
            onError({ message, error }) {
               if (!(typeof error === "string") && error) {
                  Object.entries(error).forEach(([key, value]) => {
                     toast.error(`${key}: ${value[0]}`);
                  });

                  return;
               }
               toast.error(message ?? "Error while updating the project");
            },
         },
      );
   };

   React.useEffect(() => {
      if (!isLoading && data?.data) {
         const projectDetails = data.data.project;
         const { projectImage, ...projectData } = projectDetails;
         reset(projectData);
      }
   }, [data, isLoading]);

   if (isLoading) {
      return (
         <Card className="w-full sm:max-w-4xl">
            <CardHeader>
               <CardTitle className="text-3xl">Edit Project</CardTitle>
               <CardDescription>
                  Make changes to your project here. Click save when you&apos;re done.
               </CardDescription>
            </CardHeader>
            <CardContent>
               <FieldGroup className="gap-y-6.5">
                  <Skeleton className="h-40" />
                  <Field className="relative">
                     <FieldLabel htmlFor="title">Project title</FieldLabel>
                     <FieldContent>
                        <Skeleton className="h-10" />
                     </FieldContent>
                  </Field>
                  <Field className="relative">
                     <FieldLabel htmlFor="title">Project description</FieldLabel>
                     <FieldContent>
                        <Skeleton className="h-[300px]" />
                     </FieldContent>
                  </Field>
                  <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mt-1">
                     <Field className="relative">
                        <FieldLabel htmlFor="title">Project role</FieldLabel>
                        <FieldContent>
                           <Skeleton className="h-10" />
                        </FieldContent>
                     </Field>
                     <Field className="relative">
                        <FieldLabel htmlFor="title">Project tech stack</FieldLabel>
                        <FieldContent>
                           <Skeleton className="h-10" />
                        </FieldContent>
                     </Field>
                  </div>
                  <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                     <Field className="relative">
                        <FieldLabel htmlFor="title">Project github Link</FieldLabel>
                        <FieldContent>
                           <Skeleton className="h-10" />
                        </FieldContent>
                     </Field>
                     <Field className="relative">
                        <FieldLabel htmlFor="title">Project live link</FieldLabel>
                        <FieldContent>
                           <Skeleton className="h-10" />
                        </FieldContent>
                     </Field>
                  </div>
               </FieldGroup>
            </CardContent>
         </Card>
      );
   }

   return (
      <Card className="w-full sm:max-w-4xl">
         <CardHeader className="relative">
            <Button
               variant={"outline"}
               className="sticky z-20 left-0 top-0 w-fit"
               onClick={() => router.back()}
            >
               <ArrowLeft />
            </Button>
            <CardTitle className="text-3xl">Edit Project</CardTitle>
            <CardDescription>
               Make changes to your project here. Click save when you&apos;re done.
            </CardDescription>
         </CardHeader>
         <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
               <FieldGroup className="gap-y-6.5">
                  <ProjectFileField
                     control={control}
                     name="projectImage"
                     existingUrl={data?.data.project.projectImage.url ?? null}
                  />
                  <Field className="relative">
                     <FieldLabel htmlFor="title">Project title</FieldLabel>
                     <FieldContent>
                        <Input
                           id="title"
                           placeholder="E-commerce etc."
                           aria-invalid={!!errors.title}
                           value={title}
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
                     className=""
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
                        label="Project tech stack"
                     />
                  </div>
                  <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                     <Field className="relative">
                        <FieldLabel htmlFor="github">Project github link</FieldLabel>
                        <FieldContent>
                           <Input
                              id="github"
                              placeholder="Repo Link"
                              value={githubLink}
                              aria-invalid={!!errors.githubLink}
                              {...register("githubLink")}
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
                              value={liveLink}
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
}

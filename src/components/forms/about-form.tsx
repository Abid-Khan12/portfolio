"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect } from "react";

import useFetch from "@/hooks/use-fetch";
import useCustomMutation from "@/hooks/use-mutation";

import TipTap from "@/components/tiptap/tip-tap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";

import updateAboutSchema, { UpdateAboutFormData } from "@/schemas/profile/update-about";

type UpdateAboutResponse = {
   about: string;
};

type AboutFetchResponse = {
   about: string;
};

const AboutMeForm = () => {
   const { data, isLoading } = useFetch<AboutFetchResponse>({
      api_key: ["about_fetch"],
      api_url: "/about",
   });

   const { handleSubmit, control, reset } = useForm<UpdateAboutFormData>({
      resolver: zodResolver(updateAboutSchema),
      defaultValues: {
         about: "",
      },
   });

   const { mutate, isPending } = useCustomMutation<UpdateAboutFormData, UpdateAboutResponse>({
      api_key: ["about_mutation"],
      api_url: "/admin/profile/about",
   });

   const onSubmit = (values: UpdateAboutFormData) => {
      mutate(
         { payload: { ...values }, method: "put" },
         {
            onSuccess({ message, data }) {
               toast.success(message);
               reset({ about: data.about });
            },
            onError({ message, error }) {
               if (!(typeof error === "string") && error) {
                  Object.entries(error).forEach(([key, value]) => {
                     toast.error(`${key}: ${value[0]}`);
                  });

                  return;
               }
               toast.error(message ?? "Error while Signing Up");
            },
         },
      );
   };

   useEffect(() => {
      if (!isLoading && data?.data) {
         reset({ about: data.data.about });
      }
   }, [data, isLoading]);

   return (
      <Card className="sm:max-w-4xl w-full">
         <CardHeader>
            <CardTitle className="text-2xl"></CardTitle>
            <CardDescription></CardDescription>
         </CardHeader>
         <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
               <FieldGroup>
                  <TipTap
                     control={control}
                     name="about"
                     label="About Me"
                     className="min-h-[400px]"
                  />
                  <Field className="mt-4">
                     <Button
                        type="submit"
                        size={"lg"}
                        disabled={isPending || isLoading}
                     >
                        {isLoading
                           ? "Fetching About Me"
                           : isPending
                             ? "Updating About Me"
                             : "Update About Me"}
                     </Button>
                  </Field>
               </FieldGroup>
            </form>
         </CardContent>
      </Card>
   );
};

export default AboutMeForm;

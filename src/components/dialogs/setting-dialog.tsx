"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { UserResponse } from "@/types/type";

import useAppContext from "@/context/admin-context";

import useCustomMutation from "@/hooks/use-mutation";

import FileField from "@/components/forms/inputs/file-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import {
   Field,
   FieldDescription,
   FieldError,
   FieldGroup,
   FieldLabel,
   FieldSeparator,
} from "@/components/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

import updateProfileSchema, { UpdateFormData } from "@/schemas/profile/update";
import {
   UpdateUserPasswordFormData,
   updateUserPasswordSchema,
} from "@/schemas/profile/update-password";

type UpdateResponse = UserResponse;

// Profile form
const ProfileSettingForm = ({ setOpen }: { setOpen: (value: boolean) => void }) => {
   const { user, setUser } = useAppContext();

   const { handleSubmit, reset, register, control } = useForm<UpdateFormData>({
      resolver: zodResolver(updateProfileSchema),
      defaultValues: {
         avatar: undefined,
         userName: user?.userName ?? "",
      },
      mode: "all",
   });

   const { mutate, isPending } = useCustomMutation<UpdateFormData, UpdateResponse>({
      api_key: ["update_mutation"],
      api_url: "/admin/profile",
   });

   const onSubmit = (values: UpdateFormData) => {
      const formData = new FormData();

      formData.append("userName", values.userName!);

      if (values.avatar) {
         formData.append("avatar", values.avatar);
      }

      mutate(
         { payload: formData, method: "put" },
         {
            onSuccess({ data, message }) {
               if (!data) return;
               localStorage.setItem("userData", JSON.stringify({ ...data }));
               setUser(data);
               setOpen(false);
               toast.success(message);
               reset();
            },
            onError({ error, message }) {
               if (!(typeof error === "string") && error) {
                  Object.entries(error).forEach(([key, value]) => {
                     toast.error(`${key}: ${value[0]}`);
                  });
                  return;
               }
               toast.error(message ?? "Error while updating");
            },
         },
      );
   };

   return (
      <Card className="p-0 bg-transparent ring-0">
         <CardHeader className="px-1">
            <CardTitle className="text-2xl">Personal Info</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
               Update your photo and username here.
            </CardDescription>
         </CardHeader>
         <CardContent className="px-1">
            <form onSubmit={handleSubmit(onSubmit)}>
               <FieldSeparator className="my-2 w-full" />
               <FieldGroup className="gap-5 py-2">
                  {/* Avatar */}
                  <div className="flex items-center justify-center">
                     <FileField
                        control={control}
                        name="avatar"
                        existingUrl={user?.avatar ?? ""}
                     />
                  </div>
                  <div className="w-full grid sm:grid-cols-2 grid-cols-1 gap-4">
                     {/* Username */}
                     <Field>
                        <FieldLabel htmlFor="username">Username</FieldLabel>
                        <Input
                           id="username"
                           placeholder="Username"
                           {...register("userName")}
                        />
                     </Field>

                     {/* Email — read only */}
                     <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                           id="email"
                           type="email"
                           value={user?.email ?? ""}
                           disabled
                        />
                        <FieldDescription className="text-xs">
                           Email cannot be changed.
                        </FieldDescription>
                     </Field>
                  </div>

                  <FieldSeparator />

                  <div className="flex items-center justify-end gap-3">
                     <DialogClose
                        render={
                           <Button
                              type="button"
                              className={"px-5"}
                              variant="outline"
                           />
                        }
                        disabled={isPending}
                     >
                        Close
                     </DialogClose>
                     <Button
                        type="submit"
                        className={"px-5"}
                        disabled={isPending}
                     >
                        {isPending ? "Saving..." : "Save"}
                     </Button>
                  </div>
               </FieldGroup>
            </form>
         </CardContent>
      </Card>
   );
};

// Password form
const PasswordSettingForm = ({ setOpen }: { setOpen: (value: boolean) => void }) => {
   const {
      handleSubmit,
      reset,
      register,
      formState: { errors },
   } = useForm<UpdateUserPasswordFormData>({
      resolver: zodResolver(updateUserPasswordSchema),
      defaultValues: {
         oldPassword: "",
         newPassword: "",
         confirmNewPassword: "",
      },
      mode: "all",
   });
   const { mutate, isPending } = useCustomMutation<UpdateUserPasswordFormData>({
      api_key: ["password_update_mutation"],
      api_url: "/admin/profile/password",
   });

   const onSubmit = (values: UpdateUserPasswordFormData) => {
      const payload = { ...values };

      mutate(
         { payload, method: "put" },
         {
            onSuccess({ message }) {
               toast.success(message);
               setOpen(false);
               reset();
            },
            onError({ error, message }) {
               if (!(typeof error === "string") && error) {
                  Object.entries(error).forEach(([key, value]) => {
                     toast.error(`${key}: ${value[0]}`);
                  });

                  return;
               }
               toast.error(message ?? "Error while updating");
            },
         },
      );
   };
   return (
      <Card className="p-0 bg-transparent ring-0">
         <CardHeader className="px-1">
            <CardTitle className="text-2xl">Password</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
               Please enter your old password to change your password.
            </CardDescription>
            <CardContent className="px-1">
               <form onSubmit={handleSubmit(onSubmit)}>
                  <FieldSeparator className="my-2 w-full" />
                  <FieldGroup className="gap-3 space-y-3 py-2">
                     <Field data-invalid={!!errors.oldPassword}>
                        <FieldLabel htmlFor="oldpassword">Old Password</FieldLabel>
                        <Input
                           id="oldpassword"
                           type="password"
                           placeholder="********"
                           aria-invalid={!!errors.oldPassword}
                           {...register("oldPassword")}
                        />
                        {errors.oldPassword && (
                           <FieldError>{errors.oldPassword.message}</FieldError>
                        )}
                     </Field>
                     <Field data-invalid={!!errors.newPassword}>
                        <FieldLabel htmlFor="newpassword">New Password</FieldLabel>
                        <Input
                           id="newpassword"
                           type="password"
                           placeholder="********"
                           aria-invalid={!!errors.newPassword}
                           {...register("newPassword")}
                        />
                        {errors.newPassword && (
                           <FieldError>{errors.newPassword.message}</FieldError>
                        )}
                     </Field>
                     <Field data-invalid={!!errors.confirmNewPassword}>
                        <FieldLabel htmlFor="confirmNewPassword">Confirm New Password</FieldLabel>
                        <Input
                           id="confirmNewPassword"
                           type="password"
                           placeholder="********"
                           aria-invalid={!!errors.confirmNewPassword}
                           {...register("confirmNewPassword")}
                        />
                        {errors.confirmNewPassword && (
                           <FieldError>{errors.confirmNewPassword.message}</FieldError>
                        )}
                     </Field>
                     <FieldSeparator className="mt-1" />
                     <div className="mt-2 flex items-center justify-end gap-5">
                        <DialogClose
                           render={
                              <Button
                                 type="button"
                                 className={"px-5"}
                                 variant="outline"
                              />
                           }
                           disabled={isPending}
                        >
                           Close
                        </DialogClose>
                        <Button
                           type="submit"
                           className={"px-5"}
                           disabled={isPending}
                        >
                           {isPending ? "Saving..." : "Save"}
                        </Button>
                     </div>
                  </FieldGroup>
               </form>
            </CardContent>
         </CardHeader>
      </Card>
   );
};

const SettingsDailog = ({
   open,
   setOpen,
}: {
   open: boolean;
   setOpen: (value: boolean) => void;
}) => {
   return (
      <Dialog
         open={open}
         onOpenChange={setOpen}
      >
         <DialogContent className={"sm:max-w-[80vw] xl:max-w-4xl"}>
            <DialogHeader>
               <DialogTitle className={"text-2xl"}>Settings Menu</DialogTitle>
            </DialogHeader>
            <Tabs
               defaultValue={"profile"}
               className={"flex-col gap-5"}
            >
               <TabsList className={"w-full"}>
                  <TabsTrigger
                     value={"profile"}
                     className={"py-1"}
                  >
                     Profile
                  </TabsTrigger>
                  <TabsTrigger value={"password"}>Password</TabsTrigger>
               </TabsList>
               <TabsContent value="profile">
                  <ProfileSettingForm setOpen={setOpen} />
               </TabsContent>
               <TabsContent value="password">
                  <PasswordSettingForm setOpen={setOpen} />
               </TabsContent>
            </Tabs>
         </DialogContent>
      </Dialog>
   );
};

export default SettingsDailog;

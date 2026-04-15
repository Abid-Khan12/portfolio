"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { UserResponse } from "@/types/type";

import { cn } from "@/lib/utils";

import loginSchema, { LoginDataType } from "@/schemas/auth/login-schema";

import useCustomMutation from "@/hooks/use-mutation";
import useAdminContext from "@/context/admin-context";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type LoginResponse = { accessToken: string } & UserResponse;

const LoginForm = () => {
   const { setUser } = useAdminContext();
   const router = useRouter();
   const {
      handleSubmit,
      register,
      formState: { errors },

      reset,
   } = useForm<LoginDataType>({
      resolver: zodResolver(loginSchema),
      defaultValues: { email: "", password: "" },
      mode: "all",
   });

   const { mutate, isPending } = useCustomMutation<LoginDataType, LoginResponse>({
      api_key: ["login_mutation"],
      api_url: "/admin/auth/login",
   });

   const onSubmit = (values: LoginDataType) => {
      const payload = { ...values };
      mutate(
         { payload },
         {
            onSuccess({ message, data }) {
               if (data) {
                  const { accessToken, ...userData } = data;
                  localStorage.setItem("userData", JSON.stringify(userData));
                  localStorage.setItem("accessToken", accessToken);
                  setUser(userData);
               }

               toast.success(message);
               router.replace("/admin");
               reset();
            },
            onError({ error, message }) {
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

   return (
      <Card className="w-full max-w-4xl overflow-hidden p-0 shadow-xl">
         <div className="grid grid-cols-1 md:grid-cols-2">
            {/* ── Left: image panel ─────────────────────────── */}
            <div
               className={cn(
                  "relative hidden md:flex flex-col justify-between",
                  "bg-secondary p-10 min-h-[560px]",
               )}
            >
               {/* decorative primary blob */}
               <div className="absolute -top-16 -left-16 size-64 rounded-full bg-primary/50 blur-3xl pointer-events-none" />
               <div className="absolute bottom-0 right-0 size-48 rounded-full bg-primary/50 blur-2xl pointer-events-none" />

               {/* logo / brand */}
               <div className="relative z-10">
                  <span className="font-heading text-2xl tracking-wide dark:text-primary text-foreground">
                     Abid Khan
                  </span>
               </div>

               {/* center graphic — lime accent square grid */}
               <div className="relative z-10 flex flex-col gap-3 my-auto">
                  <div className="grid grid-cols-3 gap-2 w-fit">
                     {Array.from({ length: 9 }).map((_, i) => (
                        <div
                           key={i}
                           className={cn(
                              "size-10 rounded-md",
                              i % 3 === 0
                                 ? "bg-primary"
                                 : i % 2 === 0
                                   ? "bg-primary/50"
                                   : "bg-secondary-foreground/30",
                           )}
                        />
                     ))}
                  </div>
                  <p className="text-muted-foreground font-medium text-sm mt-4 max-w-[220px] leading-relaxed">
                     Admin access only. Sign in to manage your workspace.
                  </p>
               </div>

               {/* bottom quote */}
               <p className="relative z-10 text-xs text-muted-foreground font-medium">
                  © {new Date().getFullYear()} Abid Khan. All rights reserved.
               </p>
            </div>

            {/* ── Right: form panel ─────────────────────────── */}
            <CardContent className="flex flex-col justify-center p-8 md:p-12 gap-8">
               {/* heading */}
               <div className="flex flex-col gap-1">
                  <h1 className="font-heading text-2xl tracking-wide text-foreground">
                     Welcome back
                  </h1>
                  <p className="text-sm text-muted-foreground">
                     Enter your credentials to continue
                  </p>
               </div>

               {/* form */}
               <form
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
               >
                  <FieldGroup>
                     <Field data-invalid={!!errors.email}>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                           id="email"
                           type="email"
                           autoComplete="email"
                           placeholder="you@example.com"
                           aria-invalid={!!errors.email}
                           {...register("email")}
                        />
                        {errors.email && <FieldError>{errors.email.message}</FieldError>}
                     </Field>

                     <Field data-invalid={!!errors.password}>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Input
                           id="password"
                           type="password"
                           autoComplete="current-password"
                           placeholder="••••••••"
                           aria-invalid={!!errors.password}
                           {...register("password")}
                        />
                        {errors.password && <FieldError>{errors.password.message}</FieldError>}
                     </Field>

                     <Field>
                        <Button
                           type="submit"
                           size="lg"
                           className="w-full mt-2"
                           disabled={isPending}
                        >
                           {isPending ? "Signing in…" : "Sign in"}
                        </Button>
                     </Field>
                  </FieldGroup>
               </form>
            </CardContent>
         </div>
      </Card>
   );
};

export default LoginForm;

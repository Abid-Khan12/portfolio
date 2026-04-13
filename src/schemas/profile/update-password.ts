import z from "zod";

export const updateUserPasswordSchema = z
   .object({
      oldPassword: z.string().nonempty("Old password is required"),
      newPassword: z
         .string()
         .nonempty("New password is required")
         .min(8, "Minimum 8 characters long"),
      confirmNewPassword: z.string().nonempty("Confirm password is required"),
   })
   .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: "Password does not match",
      path: ["confirmNewPassword"],
   });

export type UpdateUserPasswordFormData = z.infer<typeof updateUserPasswordSchema>;

import z from "zod";

const updateProfileSchema = z.object({
   userName: z.string().min(1, "User name is required").optional(),
   avatar: z.custom<File>().optional(),
});

export type UpdateFormData = z.infer<typeof updateProfileSchema>;

export default updateProfileSchema;

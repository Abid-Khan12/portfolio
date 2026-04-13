import z from "zod";

const updateAboutSchema = z.object({
   about: z.string().min(1, "About is required"),
});

export type UpdateAboutFormData = z.infer<typeof updateAboutSchema>;

export default updateAboutSchema;

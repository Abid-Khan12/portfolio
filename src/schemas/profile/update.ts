import z from "zod";

const updateProfileSchema = z.object({
   userName: z.string().min(1, "User name is required").optional(),
   about: z.string().min(1, "About me is required").optional(),
   avatar: z.custom<File>().optional(),
});

export default updateProfileSchema;

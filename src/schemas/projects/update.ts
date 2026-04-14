import z from "zod";

const updateProjectSchema = z.object({
   title: z.string().min(1, "Title is required").optional(),
   description: z.string().min(1, "Description is required").optional(),
   role: z.enum(["Frontend", "MERN"], "Either Frontend OR MERN").optional(),
   githubLink: z.string().min(1, "Github link is required").optional(),
   liveLink: z.string().optional(),
   techStack: z.array(z.string()).min(1, "Minimum one technology is required").optional(),
   projectImage: z
      .custom<File>()
      .refine((file) => file.size <= 2097152, "File size must be less than 2 MB")
      .optional(),
});

export type UpdateProjectFormData = z.infer<typeof updateProjectSchema>;

export default updateProjectSchema;

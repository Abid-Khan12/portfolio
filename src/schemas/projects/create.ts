import z from "zod";

const createProjectSchema = z.object({
   title: z.string().min(1, "Title is required"),
   description: z.string().min(1, "Description is required"),
   role: z.enum(["Frontend", "MERN"], "Either Frontend OR MERN"),
   githubLink: z.string().min(1, "Github link is required"),
   liveLink: z.string().optional(),
   techStack: z.array(z.string()),
   projectImage: z
      .custom<File>()
      .refine((file) => file.size <= 2097152, "File size must be less than 2 MB"),
});

export type CreateProjectDataType = z.infer<typeof createProjectSchema>;

export default createProjectSchema;

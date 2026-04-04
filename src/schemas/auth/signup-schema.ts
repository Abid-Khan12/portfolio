import z from "zod";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const signUpSchema = z.object({
   userName: z.string().min(1, "user name is required"),
   email: z.string().min(1, "Email is required").regex(emailRegex, {
      error: "Invalid email address",
   }),
   password: z.string().min(1, "Password is required"),
   avatar: z.custom<File>(),
});

export default signUpSchema;

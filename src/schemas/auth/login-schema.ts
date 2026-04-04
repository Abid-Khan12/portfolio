import z from "zod";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").regex(emailRegex, {
    error: "Invalid email address",
  }),
  password: z.string().min(1, "Password is required"),
});

export default loginSchema;

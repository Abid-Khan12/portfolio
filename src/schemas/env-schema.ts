import z from "zod";

const envSchema = z.object({
   MONGO_URI: z.string().nonempty(),
   CLOUDINARY_API_KEY: z.string().nonempty(),
   CLOUDINARY_CLOUD_NAME: z.string().nonempty(),
   CLOUDINARY_API_SECRET: z.string().nonempty(),
   CLOUDINARY_FOLDER_NAME: z.string().nonempty(),
   JWT_ACCESS_SECRET: z.string().nonempty(),
   ACCESS_TOKEN_EXPIRY: z.string().nonempty(),
   QUERY_OFFSET: z.string().nonempty(),
   QUERY_LIMIT: z.string().nonempty(),
   NODE_ENV: z.enum(["development", "production"]),
});

const env = envSchema.parse(process.env);

export default env;

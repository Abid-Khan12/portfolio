import z from "zod";
import { NextRequest, NextResponse } from "next/server";

import logger from "@/lib/winston";
import { uploadToCloudinary } from "@/lib/cloudinary";

import signUpSchema from "@/schemas/auth/signup-schema";

import UserModel from "@/models/user-model";
import connectDB from "@/lib/mongoose";

export async function POST(request: NextRequest) {
   try {
      const formData = await request.formData();
      const body = Object.fromEntries(formData.entries());

      const { success, data: parsedBody, error } = signUpSchema.safeParse(body);

      if (!success) {
         const formatedErrors = z.flattenError(error);

         return NextResponse.json(
            {
               success: false,
               status: 400,
               message: "Validation error",
               error: formatedErrors.fieldErrors,
            },
            { status: 400 },
         );
      }

      const arrayBuffer = await parsedBody.avatar.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      await connectDB();

      const userCount = await UserModel.countDocuments();

      if (userCount >= 1) {
         logger.warn(
            `Someone tried to create account with these credentials: ${JSON.stringify(parsedBody)}`,
         );
         return NextResponse.json(
            { success: false, status: 400, message: "Nice try buddy" },
            { status: 400 },
         );
      }

      const result = await uploadToCloudinary(buffer, "my-avatar");

      if (!result) {
         logger.error("Error while uploading to cloudinary");
         return NextResponse.json(
            { success: false, status: 500, message: "Error while uploading to cloudinary" },
            { status: 500 },
         );
      }

      const user = await UserModel.create({
         ...parsedBody,
         avatar: {
            url: result.secure_url,
            public_id: result.public_id,
         },
      });

      if (!user) {
         logger.error("Error while creating account");
         return NextResponse.json(
            { success: false, status: 500, message: "Error while creating account" },
            { status: 500 },
         );
      }

      logger.info(`Signed up successfully by: ${user._id.toString()}`);

      return NextResponse.json(
         { success: true, status: 201, message: "Signed up successfully" },
         { status: 201 },
      );
   } catch (error) {
      const err = error as Error;

      logger.error("Sign up API Error", { error: err });
      return NextResponse.json(
         { success: false, status: 500, message: "Internal server error", error: err.message },
         { status: 500 },
      );
   }
}

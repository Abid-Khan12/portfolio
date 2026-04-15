import z from "zod";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import connectDB from "@/lib/mongoose";
import logger from "@/lib/winston";
import { removeFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";
import { verifyAccessToken } from "@/utils/generate-token";

import updateProfileSchema from "@/schemas/profile/update";

import UserModel, { IUser } from "@/models/user-model";

type UpdateData = Partial<
   Pick<IUser, "userName" | "about"> & {
      avatar:
         | File
         | {
              url: string;
              public_id: string;
           };
   }
>;

export async function PATCH(request: NextRequest) {
   try {
      const accessToken = (await cookies()).get("accessToken")?.value;

      if (!accessToken) {
         logger.warn("Someone tried to update profile");
         return NextResponse.json(
            { success: false, status: 401, message: "Unauthorized" },
            { status: 401 },
         );
      }

      const decoded = verifyAccessToken(accessToken);

      if (!decoded) {
         logger.warn("Invalid OR Expired token provided");
         return NextResponse.json(
            { success: false, status: 401, message: "Invalid OR Expired token" },
            { status: 401 },
         );
      }
      const { userId } = decoded;
      const formData = await request.formData();
      const body = Object.fromEntries(formData.entries());

      const { success, data: parsedBody, error } = updateProfileSchema.safeParse(body);

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

      await connectDB();

      const user = await UserModel.findById<IUser>(userId).exec();

      if (!user) {
         logger.warn("Someone tried to update profile : ", { userId });
         return NextResponse.json(
            {
               success: false,
               status: 404,
               message: "User not found",
            },
            { status: 404 },
         );
      }

      const updatedUserData: UpdateData = { ...parsedBody };

      if (parsedBody.avatar) {
         const arrayBuffer = await parsedBody.avatar.arrayBuffer();
         const buffer = Buffer.from(arrayBuffer);

         await removeFromCloudinary(user.avatar.public_id);

         const result = await uploadToCloudinary(buffer, "my-avatar");

         if (!result) {
            logger.error("Error while uploading to cloudinary");
            return NextResponse.json(
               {
                  success: false,
                  status: 500,
                  message: "Internal server error",
                  error: "Error while uploading to cloudinary",
               },
               { status: 500 },
            );
         }

         updatedUserData.avatar = {
            url: result.secure_url,
            public_id: result.public_id,
         };
      }

      const updatedUser = await UserModel.findByIdAndUpdate<IUser>(
         userId,
         { ...updatedUserData },
         { returnDocument: "after" },
      ).exec();

      if (!updatedUser) {
         return NextResponse.json(
            {
               success: false,
               status: 500,
               message: "Internal server error",
               error: "Error while updating profile",
            },
            { status: 500 },
         );
      }

      logger.info("Profile updated by : ", { userId });

      return NextResponse.json(
         {
            success: true,
            status: 200,
            message: "Profile updated successfully",
            data: {
               userName: updatedUser.userName,
               email: updatedUser.email,
               avatar: updatedUser.avatar.url,
            },
         },
         { status: 200 },
      );
   } catch (error) {
      const err = error as Error;
      logger.error("Profile Api error : ", { message: err.message, cause: err.cause });
      return NextResponse.json(
         { success: false, status: 500, message: "Internal server error", error: err.message },
         { status: 500 },
      );
   }
}

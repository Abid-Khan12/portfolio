import z from "zod";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import connectDB from "@/lib/mongoose";
import logger from "@/lib/winston";
import { verifyAccessToken } from "@/utils/generate-token";

import { updateUserPasswordSchema } from "@/schemas/profile/update-password";

import UserModel from "@/models/user-model";

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

      const body = await request.json();

      const { success, data: parsedBody, error } = updateUserPasswordSchema.safeParse(body);

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

      const user = await UserModel.findById(userId).select("+password").lean().exec();

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

      const isOldPassCorrect = await bcrypt.compare(parsedBody.oldPassword, user.password);

      if (!isOldPassCorrect) {
         return NextResponse.json(
            { success: false, status: 400, message: "Invalid old password" },
            { status: 400 },
         );
      }

      const hashedNewPass = await bcrypt.hash(parsedBody.newPassword, 10);

      logger.info(hashedNewPass)

      const updatedUser = await UserModel.findByIdAndUpdate(userId, {
         password: hashedNewPass,
      }).exec();

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

      logger.info("Password updated by : ", { userId });

      return NextResponse.json(
         {
            success: true,
            status: 200,
            message: "Password updated successfully",
         },
         { status: 200 },
      );
   } catch (error) {
      const err = error as Error;
      logger.error("Password Api error : ", { message: err.message, cause: err.cause });
      return NextResponse.json(
         { success: false, status: 500, message: "Internal server error", error: err.message },
         { status: 500 },
      );
   }
}

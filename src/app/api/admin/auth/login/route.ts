import z, { json } from "zod";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import connectDB from "@/lib/mongoose";
import logger from "@/lib/winston";
import { generateAccessToken } from "@/utils/generate-token";

import env from "@/schemas/env-schema";
import loginSchema from "@/schemas/auth/login-schema";

import UserModel from "@/models/user-model";

export async function POST(request: NextRequest) {
   try {
      const cookieStore = await cookies();
      const body = await request.json();

      const { success, data: parsedBody, error } = loginSchema.safeParse(body);

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

      const user = await UserModel.findOne({ email: parsedBody.email })
         .select("+password")
         .lean()
         .exec();

      if (!user) {
         logger.warn(`Someone tried to login with these credentials: `, parsedBody);
         return NextResponse.json(
            { success: false, status: 404, message: "User not found" },
            { status: 404 },
         );
      }

      const isPassCorrect = await bcrypt.compare(parsedBody.password, user.password);

      if (!isPassCorrect) {
         return NextResponse.json(
            { success: false, status: 400, message: "Invalid password" },
            { status: 400 },
         );
      }

      const accessToken = generateAccessToken(user._id);

      cookieStore.set("accessToken", accessToken, {
         httpOnly: true,
         secure: env.NODE_ENV === "production",
         sameSite: "lax",
         maxAge: 60 * 60 * 1,
         path: "/",
      });

      return NextResponse.json(
         {
            success: true,
            message: "Logged in successfully",
            data: {
               userName: user.userName,
               email: user.email,
               avatar: user.avatar.url,
               accessToken,
            },
         },
         { status: 200 },
      );
   } catch (error) {
      const err = error as Error;

      logger.error("Login API Error : ", { error: err });
      return NextResponse.json(
         { success: false, status: 500, message: "Internal server error", error: err.message },
         { status: 500 },
      );
   }
}

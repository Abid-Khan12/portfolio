import { NextRequest, NextResponse } from "next/server";

import logger from "@/lib/winston";
import connectDB from "@/lib/mongoose";

import env from "@/schemas/env-schema";

import UserModel, { IUser } from "@/models/user-model";

export async function GET(request: NextRequest) {
   try {
      await connectDB();

      const user = await UserModel.findOne<IUser>({ email: env.MY_GMAIL }).select("about").exec();

      if (!user) {
         logger.warn(
            "Cannot get the user about because either gmail not provided or incorrect gmail",
         );
         return NextResponse.json(
            { success: false, status: 404, message: "Failed to fetched user about" },
            { status: 404 },
         );
      }

      logger.info("User fetched successfully");

      return NextResponse.json(
         {
            success: true,
            status: 200,
            message: "About me fetched successfully",
            data: {
               about: user.about,
            },
         },
         { status: 200 },
      );
   } catch (error) {
      const err = error as Error;
      logger.error("Profile Api error : ", { ...err });
      return NextResponse.json(
         { success: false, status: 500, message: "Internal server error", error: err.message },
         { status: 500 },
      );
   }
}

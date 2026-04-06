import z from "zod";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/mongoose";
import logger from "@/lib/winston";
import generateSlug from "@/utils/generate-slug";
import { verifyAccessToken } from "@/utils/generate-token";
import { uploadToCloudinary } from "@/lib/cloudinary";

import createProjectSchema from "@/schemas/projects/create";

import UserModel from "@/models/user-model";
import ProjectModel from "@/models/project-model";

export async function POST(request: NextRequest) {
   try {
      const accessToken = (await cookies()).get("accessToken")?.value;

      if (!accessToken) {
         logger.warn("Someone tried to create project");
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
      const body = {
         ...Object.fromEntries(formData.entries()),
         techStack: formData.getAll("techStack"),
      };

      const { success, data: parsedBody, error } = createProjectSchema.safeParse(body);

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

      const arrayBuffer = await parsedBody.projectImage.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      await connectDB();

      const user = await UserModel.findById(userId).lean().exec();

      if (!user) {
         logger.warn("Someone tried to create a project by this id : ", { userId });
         return NextResponse.json(
            { success: false, status: 404, message: "User not found" },
            { status: 404 },
         );
      }

      const result = await uploadToCloudinary(buffer, "project-banners");

      if (!result) {
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

      const newProject = await ProjectModel.create({
         ...parsedBody,
         slug: generateSlug(),
         projectImage: {
            width: result.width,
            height: result.height,
            url: result.secure_url,
            public_id: result.public_id,
         },
      });

      if (!newProject) {
         return NextResponse.json(
            {
               success: false,
               status: 500,
               message: "Internal server error",
               error: "Error while creating project",
            },
            { status: 500 },
         );
      }

      logger.info("Project created successfully by : ", { userId, projectId: newProject._id });
      return NextResponse.json(
         { success: false, status: 201, message: "Project created successfully" },
         { status: 201 },
      );
   } catch (error) {
      const err = error as Error;

      logger.error("Create Project API Error : ", { error: err });
      return NextResponse.json(
         { success: false, status: 500, message: "Internal server error", error: err.message },
         { status: 500 },
      );
   }
}

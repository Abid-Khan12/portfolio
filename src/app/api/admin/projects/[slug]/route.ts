import z from "zod";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/mongoose";
import logger from "@/lib/winston";
import purify from "@/lib/purify";
import { removeFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";
import { verifyAccessToken } from "@/utils/generate-token";

import updateProjectSchema from "@/schemas/projects/update";

import ProjectModel, { IProject } from "@/models/project-model";

type UpdateData = Partial<
   Pick<IProject, "githubLink" | "liveLink" | "role" | "description" | "title" | "techStack"> & {
      projectImage:
         | File
         | {
              width: number;
              height: number;
              url: string;
              public_id: string;
           };
   }
>;

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
   try {
      const accessToken = (await cookies()).get("accessToken")?.value;

      if (!accessToken) {
         logger.warn("Someone tried to get projects");
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
      const { slug } = await params;

      await connectDB();

      const project = await ProjectModel.findOne({ slug })
         .select("-__v -updatedAt -_id")
         .lean()
         .exec();

      logger.info("Project fetched successfully by : ", { userId });

      return NextResponse.json(
         {
            success: true,
            status: 200,
            message: "Project fetched successfully",
            data: {
               project,
            },
         },
         { status: 200 },
      );
   } catch (error) {
      const err = error as Error;
      logger.error("Projects GET Api Error : ", { message: err.message });

      return NextResponse.json(
         { success: false, status: 500, message: "Internal server error", error: err.message },
         { status: 500 },
      );
   }
}

export async function PATCH(
   request: NextRequest,
   { params }: { params: Promise<{ slug: string }> },
) {
   try {
      const accessToken = (await cookies()).get("accessToken")?.value;
      const formData = await request.formData();
      const techStack = formData.getAll("techStack");
      const body = {
         ...Object.fromEntries(formData.entries()),
         ...(techStack.length > 0 && { techStack }),
      };
      const { slug } = await params;

      if (!accessToken) {
         logger.warn("Someone tried to get projects");
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

      const { success, data: parsedBody, error } = updateProjectSchema.safeParse(body);

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

      if (parsedBody.description) {
      }

      parsedBody.description = purify.sanitize(parsedBody.description);

      await connectDB();

      const project = await ProjectModel.findOne({ slug }).lean().exec();

      let newData: UpdateData = { ...parsedBody };

      if (parsedBody.projectImage) {
         const arrayBuffer = await parsedBody.projectImage.arrayBuffer();
         const buffer = Buffer.from(arrayBuffer);

         await removeFromCloudinary(project.projectImage.public_id);

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

         newData.projectImage = {
            width: result.width,
            height: result.height,
            url: result.secure_url,
            public_id: result.public_id,
         };
      }

      const updatedProject = await ProjectModel.findOneAndUpdate(
         { slug },
         { ...newData },
         { returnDocument: "after" },
      )
         .select("-__v -_id -updatedAt")
         .lean()
         .exec();

      logger.info("Project updated successfully by : ", { userId });

      return NextResponse.json(
         {
            success: false,
            status: 200,
            message: "Project updated successfully",
            data: {
               project: updatedProject,
            },
         },
         { status: 200 },
      );
   } catch (error) {
      const err = error as Error;
      logger.error("Projects GET Api Error : ", { message: err.message });

      return NextResponse.json(
         { success: false, status: 500, message: "Internal server error", error: err.message },
         { status: 500 },
      );
   }
}

export async function DELETE(
   request: NextRequest,
   { params }: { params: Promise<{ slug: string }> },
) {
   try {
      const { slug } = await params;

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

      await connectDB();

      const project = await ProjectModel.findOne({ slug }).exec();

      if (!project) {
         return NextResponse.json(
            { success: false, status: 404, message: "Project not found" },
            { status: 404 },
         );
      }

      const result = await removeFromCloudinary(project.projectImage.public_id);

      if (!result) {
         return NextResponse.json(
            {
               success: false,
               status: 500,
               message: "Internal server error",
               error: "Error while removing project image",
            },
            { status: 500 },
         );
      }

      await ProjectModel.findOneAndDelete({ slug });

      logger.info("Project Deleted by : ", { userId: decoded.userId });

      return NextResponse.json(
         { success: true, status: 200, message: "Project deleted successfully" },
         { status: 200 },
      );
   } catch (error) {
      const err = error as Error;

      logger.error("Delete Project API Error : ", { message: err.message });
      return NextResponse.json(
         { success: false, status: 500, message: "Internal server error", error: err.message },
         { status: 500 },
      );
   }
}

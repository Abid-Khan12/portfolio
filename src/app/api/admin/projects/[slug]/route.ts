import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import connectDB from "@/lib/mongoose";
import logger from "@/lib/winston";
import { verifyAccessToken } from "@/utils/generate-token";
import { removeFromCloudinary } from "@/lib/cloudinary";

import ProjectModel from "@/models/project-model";

export async function GET(request: NextRequest) {}

export async function PATCH(request: NextRequest) {}

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

      logger.error("Delete Project API Error : ", { error: err });
      return NextResponse.json(
         { success: false, status: 500, message: "Internal server error", error: err.message },
         { status: 500 },
      );
   }
}

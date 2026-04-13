import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/mongoose";
import logger from "@/lib/winston";

import ProjectModel from "@/models/project-model";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
   try {
      const { slug } = await params;

      await connectDB();

      const project = await ProjectModel.findOne({ slug })
         .select("-__v -updatedAt -_id")
         .lean()
         .exec();

      logger.info("Project fetched successfully");

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

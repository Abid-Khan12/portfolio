import { NextRequest, NextResponse } from "next/server";

import logger from "@/lib/winston";

import env from "@/schemas/env-schema";
import connectDB from "@/lib/mongoose";

import ProjectModel from "@/models/project-model";

export async function GET(request: NextRequest) {
   try {
      const { searchParams } = request.nextUrl;

      const offset = parseInt((searchParams.get("offset") as string) ?? env.QUERY_OFFSET);
      const limit = parseInt((searchParams.get("limit") as string) ?? env.QUERY_LIMIT);
      const sortByRole = (searchParams.get("sortByRole") as string) ?? "";

      await connectDB();

      const totalProjects = await ProjectModel.countDocuments();

      const projects = await ProjectModel.find({
         ...(sortByRole && { role: sortByRole }),
      })
         .select("-__v -updatedAt -_id")
         .limit(limit)
         .skip(offset)
         .sort({ createdAt: -1 })
         .lean()
         .exec();

      logger.info("All projects fetched successfully");

      return NextResponse.json(
         {
            success: true,
            status: 200,
            message: "Project fetched successfully",
            data: {
               projects,
               total: totalProjects,
               limit,
               offset,
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

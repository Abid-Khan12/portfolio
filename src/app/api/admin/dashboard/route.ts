import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import connectDB from "@/lib/mongoose";
import logger from "@/lib/winston";
import { verifyAccessToken } from "@/utils/generate-token";
import ProjectModel from "@/models/project-model";

export async function GET(request: NextRequest) {
   try {
      const accessToken = (await cookies()).get("accessToken")?.value;

      if (!accessToken) {
         logger.warn("Someone tried to see dashboard data");
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

      await connectDB();

      const totalProjects = await ProjectModel.countDocuments().lean().exec();

      const lastUploadedProject = await ProjectModel.findOne()
         .select("-_id title slug createdAt")
         .sort({ createdAt: -1 })
         .limit(1)
         .lean()
         .exec();

      const techStackStats = await ProjectModel.aggregate([
         { $unwind: "$techStack" },
         { $group: { _id: "$techStack", count: { $sum: 1 } } },
         { $sort: { count: -1 } },
         { $limit: 3 },
      ]);

      logger.info("Dashboard data fetched successfully by : ", { userId });

      return NextResponse.json(
         {
            success: true,
            status: 200,
            message: "Data fetched successfully",
            data: {
               totalProjects,
               lastUploadedProject,
               techStackStats,
            },
         },
         { status: 200 },
      );
   } catch (error) {
      const err = error as Error;
      logger.error("Dashboard Api error : ", { ...err });
      return NextResponse.json(
         { success: false, status: 500, message: "Internal server error", error: err.message },
         { status: 500 },
      );
   }
}

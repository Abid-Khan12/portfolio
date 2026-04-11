import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import logger from "@/lib/winston";
import { verifyAccessToken } from "@/utils/generate-token";

export async function POST(request: NextRequest) {
   try {
      const cookieStore = await cookies();
      const accessToken = cookieStore.get("accessToken")?.value;

      if (!accessToken) {
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

      cookieStore.delete("accessToken");

      logger.info("Logout successfully by : ", { userId: decoded.userId });

      return NextResponse.json(
         {
            success: true,
            status: 200,
            message: "Logout Successfully",
         },
         { status: 200 },
      );
   } catch (error) {
      const err = error as Error;

      logger.error("Logout API Error : ", { error: err });
      return NextResponse.json(
         { success: false, status: 500, message: "Internal server error", error: err.message },
         { status: 500 },
      );
   }
}

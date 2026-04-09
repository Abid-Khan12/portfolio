import { type NextRequest, NextResponse } from "next/server";

import ratelimit from "@/lib/rate-limit";

export default async function proxy(request: NextRequest) {
   const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
   const { success, limit, remaining, reset } = await ratelimit.limit(ip);

   if (!success) {
      return NextResponse.json(
         { success: false, status: 429, message: "Too many requests, slow down" },
         {
            status: 429,
            headers: {
               "X-RateLimit-Limit": limit.toString(),
               "X-RateLimit-Remaining": remaining.toString(),
               "X-RateLimit-Reset": reset.toString(),
            },
         },
      );
   }

   return NextResponse.next();
}

export const config = {
   matcher: "/api/:path*",
};

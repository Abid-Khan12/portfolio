import { type NextRequest, NextResponse } from "next/server";

import ratelimit from "@/lib/rate-limit";

const PROTECTED_PAGES = ["/admin", "/admin/projects", "/admin/about"];

const AUTH_PAGE = "/admin/login";

export default async function middleware(request: NextRequest) {
   const { pathname } = request.nextUrl;
   const ip = request.headers.get("x-forwarded-for") ?? "anonymous";

   if (pathname !== AUTH_PAGE) {
      const { success, limit, remaining, reset } = await ratelimit.limit(ip);

      if (!success) {
         return NextResponse.json(
            {
               success: false,
               status: 429,
               message: "Too many requests, slow down",
            },
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
   }

   const token = request.cookies.get("accessToken")?.value;

   // 🔐 Check if route is protected
   const isProtected = PROTECTED_PAGES.includes(pathname);

   // 🚫 If NOT logged in & trying to access protected route → redirect to login
   if (isProtected && !token) {
      return NextResponse.redirect(new URL(AUTH_PAGE, request.url));
   }

   // 🔁 If logged in & trying to access login page → redirect to admin
   if (pathname === AUTH_PAGE && token) {
      return NextResponse.redirect(new URL("/admin", request.url));
   }

   return NextResponse.next();
}

export const config = {
   matcher: "/((?!api|_next/static|_next/image|.*\\.png$).*)",
};

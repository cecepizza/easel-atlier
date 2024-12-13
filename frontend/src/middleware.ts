// this file acts like a security guard at the entrance of the application- to check if users have permission to access different pages

import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)", "/admin/:path*"],
};

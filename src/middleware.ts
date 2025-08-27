import authConfig from "@/lib/auth.config";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { menuPageItems, adminPageItems } from "@/lib/page-data"

const MODE = "dev"
const protectedRoutes = [...menuPageItems, ...adminPageItems];

export async function middleware(request: NextRequest) {
  // Get the session using next-auth
  const session = await auth();
  const response = NextResponse.next()
  const path = request.nextUrl.pathname

  // if not authenticated, redirect to login
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const userRole = session?.user?.accessType || "user";

  // dashboard is always accessible
  if (path === "/dashboard") {
    return response;
  }

  // approval queue is accessible to approvers
  if (path.startsWith("/dashboard/approve")) {
    if (session.user?.isApprover) {
      return response;
    }
    return NextResponse.redirect(new URL("/dashboard/error?id=403", request.url));
  } 

  if (path.startsWith("/dashboard/documents")) {
    if (session.user?.isFileOwner) {
      return response;
    }
    return NextResponse.redirect(new URL("/dashboard/error?id=403", request.url));
  }

  // check against defined routes in /lib/page-data.ts
  const matchedRoute = protectedRoutes.slice(1).find((route) =>
    path.startsWith(route.start)
  );

  if (matchedRoute) {
    if (matchedRoute.role.includes(userRole)) {
      return response;
    }
    return NextResponse.redirect(new URL("/dashboard/error?id=403", request.url));
  }

  // error is always allowed
  if (path.startsWith("/dashboard/error")) {
    return response;
  }

  return MODE === "dev" ? response : NextResponse.redirect(new URL("/dashboard/error?id=405", request.url));
}
  

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - login page
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public|login).*)",
  ],
}



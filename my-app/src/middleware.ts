import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard")
    const isOnLogin = req.nextUrl.pathname.startsWith("/login")
    // Redirect unauthenticated users away from protected routes
    if (!isLoggedIn && isOnDashboard) {
        return NextResponse.redirect(new URL("/login", req.url))
    }
    // Redirect authenticated users away from login page
    if (isOnLogin && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
    // Only run middleware on these routes — skip static files, images, etc.
    export const config = {
        matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],

    }
)
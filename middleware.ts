import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export function middleware(request: NextRequest) {
  // Protected routes
  const protectedRoutes = ["/api/incidents", "/api/chat", "/api/notifications"]
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  if (isProtectedRoute) {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 })
    }

    // Add user ID to headers for API routes
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", decoded.userId)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/incidents/:path*", "/api/chat/:path*", "/api/notifications/:path*"],
}

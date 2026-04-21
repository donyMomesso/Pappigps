import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { decodeSession, SESSION_COOKIE_NAME } from "@/lib/auth/session"

export function middleware(request: NextRequest) {
  const session = decodeSession(request.cookies.get(SESSION_COOKIE_NAME)?.value)
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/dashboard")) {
    if (!session || session.role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  if (pathname.startsWith("/entregador/painel") || pathname.startsWith("/entregador/termo")) {
    if (!session || session.role !== "deliverer") {
      return NextResponse.redirect(new URL("/entregador", request.url))
    }
  }

  if (pathname === "/login" && session?.role === "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (pathname === "/entregador" && session?.role === "deliverer") {
    return NextResponse.redirect(new URL("/entregador/painel", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/entregador", "/entregador/painel/:path*", "/entregador/termo", "/login"]
}

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const EXEMPT_PATHS = ["/complete-profile", "/login"]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (EXEMPT_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (token && !token.phone) {
    return NextResponse.redirect(new URL("/complete-profile", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|teams|.*\\.svg).*)"],
}

import { NextRequest, NextResponse } from "next/server"

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Agathos Admin", charset="UTF-8"',
    },
  })
}

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return unauthorized()
  }

  const base64Credentials = authHeader.split(" ")[1]
  const decoded = atob(base64Credentials)
  const [username, password] = decoded.split(":")

  const adminUser = process.env.ADMIN_USERNAME
  const adminPass = process.env.ADMIN_PASSWORD

  if (!adminUser || !adminPass) {
    return new NextResponse("Admin credentials not configured", {
      status: 500,
    })
  }

  if (username !== adminUser || password !== adminPass) {
    return unauthorized()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

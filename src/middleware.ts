import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  if (!host.startsWith("www.")) {
    return NextResponse.next();
  }

  const apex = host.slice(4);
  const url = request.nextUrl.clone();
  url.protocol = "https:";
  url.host = apex;
  url.port = "";
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

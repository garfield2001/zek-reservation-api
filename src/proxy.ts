import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Retrieve the current origin from the request headers
  const origin = request.headers.get("origin") || "";

  // Define allowed origins
  // In development, you might want to allow localhost or specific domains
  // In production, add your actual domain(s)
  const allowedOrigins = [
    "http://localhost:3005",
    "https://admin.zekcatering.com",
    "https://zekcatering.com",
  ];

  // Check if the origin is allowed, or allow all in development if you prefer
  // Ideally, exact matching is safer than "*" if you use credentials
  const isAllowed = allowedOrigins.includes(origin) || !origin;

  const response = NextResponse.next();

  if (isAllowed) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  } else {
    // Optional: Fallback for other origins, or just don't set the header (blocking them)
    // response.headers.set("Access-Control-Allow-Origin", "null");
  }

  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,DELETE,PATCH,POST,PUT,OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      headers: response.headers,
    });
  }

  return response;
}

export const config = {
  matcher: "/api/:path*",
};

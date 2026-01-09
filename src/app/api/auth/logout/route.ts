import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { logout } from "@/services/authService";
import { handleRouteError } from "@/lib/routeError";

export async function POST(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    await logout(authUser);
    return NextResponse.json({ message: "Logged out" });
  } catch (error) {
    return handleRouteError(error);
  }
}

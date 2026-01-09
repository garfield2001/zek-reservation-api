import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getCurrentUser } from "@/services/authService";
import { handleRouteError } from "@/lib/routeError";

export async function GET(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    const user = await getCurrentUser(authUser);
    return NextResponse.json(user);
  } catch (error) {
    return handleRouteError(error);
  }
}

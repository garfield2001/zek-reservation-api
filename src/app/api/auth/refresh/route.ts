import { NextResponse } from "next/server";
import { refreshSchema } from "@/lib/validations/auth";
import { z } from "zod";
import { refreshSession } from "@/services/authService";
import { handleRouteError } from "@/lib/routeError";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = refreshSchema.parse(json);

    const result = await refreshSession(body.refreshToken);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 400 });
    }

    return handleRouteError(error);
  }
}

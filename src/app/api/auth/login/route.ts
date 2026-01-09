import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations/auth";
import { z } from "zod";
import { login } from "@/services/authService";
import { handleRouteError } from "@/lib/routeError";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = loginSchema.parse(json);

    const result = await login(body.username, body.password);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 400 });
    }

    return handleRouteError(error);
  }
}

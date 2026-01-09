import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "./errors";
import { AuthError } from "@/errors/authErros";

export function handleRouteError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(error.issues, { status: 400 });
  }

  if (error instanceof AuthError) {
    return NextResponse.json(
      { message: error.message, code: error.code },
      { status: error.status }
    );
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      { message: error.message, code: error.code },
      { status: error.status }
    );
  }

  console.error(error);
  return NextResponse.json(
    { message: "Internal Server Error" },
    { status: 500 }
  );
}

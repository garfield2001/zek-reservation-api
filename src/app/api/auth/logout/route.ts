import { NextResponse } from "next/server";
import { getAuthUser, AuthError } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    try {
      await getAuthUser(request);
    } catch (error) {
      if (error instanceof AuthError) {
        return NextResponse.json(
          { message: error.message },
          { status: error.status }
        );
      }
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json({ message: "Logged out" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}


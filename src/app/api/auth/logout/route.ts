import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser, AuthError } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    try {
      const authUser = await getAuthUser(request);

      await prisma.session.updateMany({
        where: {
          id: authUser.sessionId,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });
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

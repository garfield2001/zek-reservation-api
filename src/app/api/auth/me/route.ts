import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser, AuthError } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    try {
      const authUser = await getAuthUser(request);

      const user = await prisma.user.findUnique({
        where: { id: authUser.id },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          email: true,
          phoneNumber: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(user);
    } catch (error) {
      if (error instanceof AuthError) {
        return NextResponse.json(
          { message: error.message },
          { status: error.status }
        );
      }
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

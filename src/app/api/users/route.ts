import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { userCreateSchema } from "@/lib/validations/user";
import { z } from "zod";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = userCreateSchema.parse(json);

    // Hash the password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        username: body.username,
        email: body.email,
        phoneNumber: body.phoneNumber,
        password: hashedPassword,
        role: body.role,
      },
    });

    // Don't return the password
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 400 });
    }

    // Handle Prisma unique constraint error
    if ((error as any).code === "P2002") {
      return NextResponse.json(
        { message: "User with this email or username already exists" },
        { status: 409 }
      );
    }

    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const users = await prisma.user.findMany({
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
    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

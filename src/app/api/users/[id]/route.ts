import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { userUpdateSchema } from "@/lib/validations/user";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

type RouteParams = {
  params: {
    id: string;
  };
};

function parseId(id: string) {
  const numericId = Number(id);

  if (Number.isNaN(numericId) || numericId <= 0) {
    return null;
  }

  return numericId;
}

function getPrismaErrorCode(error: unknown) {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = (error as { code?: unknown }).code;
    if (typeof code === "string") {
      return code;
    }
  }

  return undefined;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        role: "ADMIN" | "STAFF";
      };

      if (decoded.role !== "ADMIN" && decoded.role !== "STAFF") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const id = parseId(params.id);

    if (!id) {
      return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
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
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        role: "ADMIN" | "STAFF";
      };

      if (decoded.role !== "ADMIN" && decoded.role !== "STAFF") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const id = parseId(params.id);

    if (!id) {
      return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
    }

    const json = await request.json();
    const body = userUpdateSchema.parse(json);

    const data: {
      firstName?: string;
      lastName?: string;
      username?: string;
      email?: string;
      phoneNumber?: string;
      password?: string;
      role?: "ADMIN" | "STAFF";
    } = {};

    if (body.firstName !== undefined) data.firstName = body.firstName;
    if (body.lastName !== undefined) data.lastName = body.lastName;
    if (body.username !== undefined) data.username = body.username;
    if (body.email !== undefined) data.email = body.email;
    if (body.phoneNumber !== undefined) data.phoneNumber = body.phoneNumber;
    if (body.role !== undefined) data.role = body.role;

    if (body.password !== undefined) {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      data.password = hashedPassword;
    }

    try {
      const user = await prisma.user.update({
        where: { id },
        data,
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

      return NextResponse.json(user);
    } catch (error) {
      const code = getPrismaErrorCode(error);

      if (code === "P2025") {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      if (code === "P2002") {
        return NextResponse.json(
          { message: "User with this email or username already exists" },
          { status: 409 }
        );
      }

      throw error;
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 400 });
    }

    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        role: "ADMIN" | "STAFF";
      };

      if (decoded.role !== "ADMIN") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const id = parseId(params.id);

    if (!id) {
      return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
    }

    try {
      await prisma.user.delete({
        where: { id },
      });

      return NextResponse.json({ message: "User deleted" });
    } catch (error) {
      const code = getPrismaErrorCode(error);

      if (code === "P2025") {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      throw error;
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { userUpdateSchema } from "@/lib/validations/user";
import { z } from "zod";
import { getAuthUser } from "@/lib/auth";
import { UpdateUserInput } from "@/types/types";
import { deleteUser, getUserById, updateUser } from "@/services/userService";
import { handleRouteError } from "@/lib/routeError";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

function parseId(id: string) {
  const numericId = Number(id);

  if (Number.isNaN(numericId) || numericId <= 0) {
    return null;
  }

  return numericId;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const authUser = await getAuthUser(request);
    if (authUser.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const resolvedParams = await params;
    const id = parseId(resolvedParams.id);

    if (!id) {
      return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
    }

    const user = await getUserById(id);
    return NextResponse.json(user);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const authUser = await getAuthUser(request);
    if (authUser.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const resolvedParams = await params;
    const id = parseId(resolvedParams.id);

    if (!id) {
      return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
    }

    const json = await request.json();
    const body = userUpdateSchema.parse(json);

    const input: UpdateUserInput = {
      firstName: body.firstName,
      lastName: body.lastName,
      username: body.username,
      email: body.email,
      phoneNumber: body.phoneNumber,
      password: body.password,
      role: body.role,
    };

    const user = await updateUser(id, input);
    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 400 });
    }

    return handleRouteError(error);
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const authUser = await getAuthUser(request);
    if (authUser.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const resolvedParams = await params;
    const id = parseId(resolvedParams.id);

    if (!id) {
      return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
    }

    await deleteUser(id);
    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    return handleRouteError(error);
  }
}

import { NextResponse } from "next/server";
import { userCreateSchema } from "@/lib/validations/user";
import { z } from "zod";
import { getAuthUser } from "@/lib/auth";
import { CreateUserInput, createUser, listUsers } from "@/services/userService";
import { handleRouteError } from "@/lib/routeError";

export async function POST(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    if (authUser.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const json = await request.json();
    const body = userCreateSchema.parse(json);

    const input: CreateUserInput = {
      firstName: body.firstName,
      lastName: body.lastName,
      username: body.username,
      email: body.email,
      phoneNumber: body.phoneNumber,
      password: body.password,
      role: body.role,
    };

    const user = await createUser(input);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 400 });
    }

    return handleRouteError(error);
  }
}

export async function GET(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    if (authUser.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const users = await listUsers();
    return NextResponse.json(users);
  } catch (error) {
    return handleRouteError(error);
  }
}

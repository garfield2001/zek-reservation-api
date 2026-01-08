import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { refreshSchema } from "@/lib/validations/auth";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import {
  JWT_SECRET,
  AUTH_SESSION_MAX_AGE_SECONDS,
  AUTH_ACCESS_TOKEN_EXPIRES_IN_SECONDS,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = refreshSchema.parse(json);

    const session = await prisma.session.findUnique({
      where: { refreshToken: body.refreshToken },
      include: {
        user: true,
      },
    });

    if (
      !session ||
      session.revokedAt !== null ||
      session.expiresAt <= new Date()
    ) {
      return NextResponse.json(
        { message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    const newRefreshToken = randomUUID();

    const updatedSession = await prisma.session.update({
      where: { id: session.id },
      data: {
        refreshToken: newRefreshToken,
      },
      include: {
        user: true,
      },
    });

    const payload = {
      userId: updatedSession.userId,
      email: updatedSession.user.email,
      role: updatedSession.user.role,
      sessionId: updatedSession.id,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: AUTH_ACCESS_TOKEN_EXPIRES_IN_SECONDS,
    });

    const userWithoutPassword = {
      id: updatedSession.user.id,
      firstName: updatedSession.user.firstName,
      lastName: updatedSession.user.lastName,
      username: updatedSession.user.username,
      email: updatedSession.user.email,
      phoneNumber: updatedSession.user.phoneNumber,
      role: updatedSession.user.role,
      createdAt: updatedSession.user.createdAt,
      updatedAt: updatedSession.user.updatedAt,
    };

    return NextResponse.json({
      user: userWithoutPassword,
      token,
      refreshToken: newRefreshToken,
      accessTokenExpiresInSeconds: AUTH_ACCESS_TOKEN_EXPIRES_IN_SECONDS,
      sessionMaxAgeSeconds: AUTH_SESSION_MAX_AGE_SECONDS,
    });
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

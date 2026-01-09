import jwt from "jsonwebtoken";
import prisma from "./prisma";
import { AuthUser } from "@/types/types";
import { AuthError } from "@/errors/authErros";

const JWT_SECRET = process.env.JWT_SECRET || "zek-secret-123";

export const AUTH_SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 Days
export const AUTH_ACCESS_TOKEN_EXPIRES_IN_SECONDS = 15 * 60; // 15 mins

export async function getAuthUser(request: Request): Promise<AuthUser> {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AuthError("Unauthorized", 401, "UNAUTHORIZED");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      sessionId: number;
    };

    if (typeof decoded.sessionId !== "number") {
      throw new AuthError("Invalid token", 401, "INVALID_TOKEN");
    }

    const session = await prisma.session.findUnique({
      where: { id: decoded.sessionId },
      select: {
        id: true,
        userId: true,
        expiresAt: true,
        revokedAt: true,
      },
    });

    if (
      !session ||
      session.userId !== decoded.userId ||
      session.revokedAt !== null ||
      session.expiresAt <= new Date()
    ) {
      throw new AuthError("Invalid token", 401, "INVALID_TOKEN");
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      throw new AuthError("User not found", 404, "USER_NOT_FOUND");
    }

    return {
      id: user.id,
      role: user.role,
      sessionId: session.id,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }

    throw new AuthError("Invalid token", 401, "INVALID_TOKEN");
  }
}

export { JWT_SECRET };

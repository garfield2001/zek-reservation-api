import jwt from "jsonwebtoken";
import {
  JWT_SECRET,
  AUTH_ACCESS_TOKEN_EXPIRES_IN_SECONDS,
  AUTH_SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth";
import { PublicUser, AuthTokensResult } from "@/types/types";

export type AuthTokenPayload = {
  userId: number;
  email: string;
  role: "ADMIN" | "STAFF";
  sessionId: number;
};

export function signAccessToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: AUTH_ACCESS_TOKEN_EXPIRES_IN_SECONDS,
  });
}

export function createAuthTokensResult(
  user: PublicUser,
  token: string,
  refreshToken: string
): AuthTokensResult {
  return {
    user,
    token,
    refreshToken,
    accessTokenExpiresInSeconds: AUTH_ACCESS_TOKEN_EXPIRES_IN_SECONDS,
    sessionMaxAgeSeconds: AUTH_SESSION_MAX_AGE_SECONDS,
  };
}

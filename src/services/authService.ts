import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { SessionRepository } from "@/repositories/sessionRepository";
import { AuthUser, PublicUser, AuthTokensResult } from "@/types/types";
import { UserRepository } from "@/repositories/userRepository";
import { prismaSessionRepository } from "@/repositories/sessionRepository";
import { prismaUserRepository } from "@/repositories/userRepository";
import { AUTH_SESSION_MAX_AGE_SECONDS } from "@/lib/auth";
import {
  InvalidCredentialsError,
  InvalidRefreshTokenError,
  UserNotFoundError,
} from "@/errors/authErros";
import {
  AuthTokenPayload,
  signAccessToken,
  createAuthTokensResult,
} from "@/lib/authTokens";
import { toPublicUser } from "@/mappers/userMapper";

export interface AuthService {
  login(username: string, password: string): Promise<AuthTokensResult>;
  refreshSession(refreshToken: string): Promise<AuthTokensResult>;
  getCurrentUser(authUser: AuthUser): Promise<PublicUser>;
  logout(authUser: AuthUser): Promise<void>;
}

export function createAuthService(
  sessionRepository: SessionRepository,
  userRepository: UserRepository
): AuthService {
  return {
    async login(username, password) {
      const user = await userRepository.findByUsername(username);

      if (!user) {
        throw new InvalidCredentialsError();
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new InvalidCredentialsError();
      }

      const refreshToken = randomUUID();
      const sessionExpiresAt = new Date(
        Date.now() + AUTH_SESSION_MAX_AGE_SECONDS * 1000
      );

      const session = await sessionRepository.create({
        userId: user.id,
        refreshToken,
        expiresAt: sessionExpiresAt,
      });

      const payload: AuthTokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        sessionId: session.id,
      };

      const token = signAccessToken(payload);

      const userWithoutPassword = toPublicUser(user);

      return createAuthTokensResult(userWithoutPassword, token, refreshToken);
    },

    async refreshSession(refreshToken) {
      const session = await sessionRepository.findByRefreshToken(refreshToken);

      if (
        !session ||
        session.revokedAt !== null ||
        session.expiresAt <= new Date()
      ) {
        throw new InvalidRefreshTokenError();
      }

      const newRefreshToken = randomUUID();

      const updatedSession = await sessionRepository.updateRefreshToken(
        session.id,
        newRefreshToken
      );

      const payload: AuthTokenPayload = {
        userId: updatedSession.userId,
        email: updatedSession.user.email,
        role: updatedSession.user.role,
        sessionId: updatedSession.id,
      };

      const token = signAccessToken(payload);

      const userWithoutPassword = toPublicUser(updatedSession.user);

      return createAuthTokensResult(
        userWithoutPassword,
        token,
        newRefreshToken
      );
    },

    async getCurrentUser(authUser) {
      const user = await userRepository.findById(authUser.id);

      if (!user) {
        throw new UserNotFoundError();
      }

      return toPublicUser(user);
    },

    async logout(authUser) {
      await sessionRepository.revoke(authUser.sessionId);
    },
  };
}

const defaultAuthService = createAuthService(
  prismaSessionRepository,
  prismaUserRepository
);

export const login = defaultAuthService.login.bind(defaultAuthService);
export const refreshSession =
  defaultAuthService.refreshSession.bind(defaultAuthService);
export const getCurrentUser =
  defaultAuthService.getCurrentUser.bind(defaultAuthService);
export const logout = defaultAuthService.logout.bind(defaultAuthService);

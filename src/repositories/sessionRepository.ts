import prisma from "@/lib/prisma";
import { SessionWithUser, CreateSessionData } from "@/types/types";

export interface SessionRepository {
  create(data: CreateSessionData): Promise<{ id: number; userId: number }>;
  findByRefreshToken(refreshToken: string): Promise<SessionWithUser | null>;
  updateRefreshToken(
    id: number,
    refreshToken: string
  ): Promise<SessionWithUser>;
  revoke(id: number): Promise<void>;
}

async function createSessionInternal(
  data: CreateSessionData
): Promise<{ id: number; userId: number }> {
  const session = await prisma.session.create({
    data,
  });

  return {
    id: session.id,
    userId: session.userId,
  };
}

async function findSessionByRefreshTokenInternal(
  refreshToken: string
): Promise<SessionWithUser | null> {
  const session = await prisma.session.findUnique({
    where: { refreshToken },
    include: {
      user: true,
    },
  });

  return session as SessionWithUser | null;
}

async function updateSessionRefreshTokenInternal(
  id: number,
  refreshToken: string
): Promise<SessionWithUser> {
  const session = await prisma.session.update({
    where: { id },
    data: {
      refreshToken,
    },
    include: {
      user: true,
    },
  });

  return session as SessionWithUser;
}

async function revokeSessionInternal(id: number): Promise<void> {
  await prisma.session.updateMany({
    where: {
      id,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

export const prismaSessionRepository: SessionRepository = {
  create: createSessionInternal,
  findByRefreshToken: findSessionByRefreshTokenInternal,
  updateRefreshToken: updateSessionRefreshTokenInternal,
  revoke: revokeSessionInternal,
};

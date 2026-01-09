import prisma from "@/lib/prisma";
import {
  CreateUserData,
  UserRecord,
  PublicUserRecord,
  UpdateUserData,
} from "@/types/types";

export interface UserRepository {
  findByUsername(username: string): Promise<UserRecord | null>;
  findById(id: number): Promise<PublicUserRecord | null>;
  create(data: CreateUserData): Promise<PublicUserRecord>;
  list(): Promise<PublicUserRecord[]>;
  update(id: number, data: UpdateUserData): Promise<PublicUserRecord>;
  delete(id: number): Promise<void>;
}

export function getPrismaErrorCode(error: unknown) {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = (error as { code?: unknown }).code;
    if (typeof code === "string") {
      return code;
    }
  }

  return undefined;
}

async function findUserByUsernameInternal(
  username: string
): Promise<UserRecord | null> {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  return user;
}

async function findUserByIdInternal(
  id: number
): Promise<PublicUserRecord | null> {
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

  return user;
}

async function createUserInternal(
  data: CreateUserData
): Promise<PublicUserRecord> {
  const user = await prisma.user.create({
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

  return user;
}

async function listUsersInternal(): Promise<PublicUserRecord[]> {
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

  return users;
}

async function updateUserInternal(
  id: number,
  data: UpdateUserData
): Promise<PublicUserRecord> {
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

  return user;
}

async function deleteUserInternal(id: number): Promise<void> {
  await prisma.user.delete({
    where: { id },
  });
}

export const prismaUserRepository: UserRepository = {
  findByUsername: findUserByUsernameInternal,
  findById: findUserByIdInternal,
  create: createUserInternal,
  list: listUsersInternal,
  update: updateUserInternal,
  delete: deleteUserInternal,
};

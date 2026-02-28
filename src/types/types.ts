import {
  PermissionAction,
  PermissionResource,
  Role as PrismaRole,
} from "@prisma/client";

export type UserRole = PrismaRole;

export type CreateUserData = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: UserRole;
};

export type UserRecord = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateUserData = {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  role?: UserRole;
};

export type PublicUser = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserInput = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: UserRole;
};

export type UpdateUserInput = {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  role?: UserRole;
};

export type AuthUser = {
  id: number;
  role: UserRole;
  sessionId: number;
};

export type AuthTokensResult = {
  user: PublicUser;
  token: string;
  refreshToken: string;
  accessTokenExpiresInSeconds: number;
  sessionMaxAgeSeconds: number;
};

export type SessionWithUser = {
  id: number;
  userId: number;
  refreshToken: string;
  expiresAt: Date;
  revokedAt: Date | null;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
  };
};

export type CreateSessionData = {
  userId: number;
  refreshToken: string;
  expiresAt: Date;
};

export type PublicUserRecord = Omit<UserRecord, "password">;

export type PermissionResourceType = PermissionResource;
export type PermissionActionType = PermissionAction;

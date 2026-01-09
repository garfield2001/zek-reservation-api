import { PermissionAction, PermissionResource } from "@prisma/client";

export type CreateUserData = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: "ADMIN" | "STAFF";
};

export type UserRecord = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: "ADMIN" | "STAFF";
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
  role?: "ADMIN" | "STAFF";
};

export type PublicUser = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  role: "ADMIN" | "STAFF";
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
  role: "ADMIN" | "STAFF";
};

export type UpdateUserInput = {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  role?: "ADMIN" | "STAFF";
};

export type AuthUser = {
  id: number;
  role: "ADMIN" | "STAFF";
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
    role: "ADMIN" | "STAFF";
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

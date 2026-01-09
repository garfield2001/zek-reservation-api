import {
  PublicUser,
  PublicUserRecord,
  UserRecord,
} from "@/types/types";

export function toPublicUser(
  user: PublicUserRecord | UserRecord
): PublicUser {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}


import prisma from "./prisma";
import type { AuthUser } from "./auth";
import { PermissionResource, PermissionAction } from "@prisma/client";

export type PermissionResourceType = PermissionResource;
export type PermissionActionType = PermissionAction;

export async function checkPermission(
  user: AuthUser,
  resource: PermissionResourceType,
  action: PermissionActionType
): Promise<boolean> {
  if (user.role === "ADMIN") {
    return true;
  }

  const permission = await prisma.permission.findUnique({
    where: {
      userId_resource_action: {
        userId: user.id,
        resource,
        action,
      },
    },
  });

  return Boolean(permission);
}

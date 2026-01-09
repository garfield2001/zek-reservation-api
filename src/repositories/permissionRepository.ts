import prisma from "@/lib/prisma";
import { PermissionResourceType, PermissionActionType } from "@/types/types";

export interface PermissionRepository {
  hasPermission(
    userId: number,
    resource: PermissionResourceType,
    action: PermissionActionType
  ): Promise<boolean>;
}

async function hasPermissionInternal(
  userId: number,
  resource: PermissionResourceType,
  action: PermissionActionType
): Promise<boolean> {
  const permission = await prisma.permission.findUnique({
    where: {
      userId_resource_action: {
        userId,
        resource,
        action,
      },
    },
  });

  return Boolean(permission);
}

export const prismaPermissionRepository: PermissionRepository = {
  hasPermission: hasPermissionInternal,
};

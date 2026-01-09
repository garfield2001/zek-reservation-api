import { AuthUser } from "@/types/types";
import {
  PermissionRepository,
  prismaPermissionRepository,
} from "@/repositories/permissionRepository";

import { PermissionResourceType, PermissionActionType } from "@/types/types";

export interface PermissionService {
  has(
    user: AuthUser,
    resource: PermissionResourceType,
    action: PermissionActionType
  ): Promise<boolean>;
}

export function createPermissionService(
  repository: PermissionRepository
): PermissionService {
  return {
    async has(user, resource, action) {
      if (user.role === "ADMIN") {
        return true;
      }

      return repository.hasPermission(user.id, resource, action);
    },
  };
}

const defaultPermissionService = createPermissionService(
  prismaPermissionRepository
);

export const hasPermission = defaultPermissionService.has.bind(
  defaultPermissionService
);

import {
  AuthUser,
  PermissionActionType,
  PermissionResourceType,
} from "@/types/types";
import { hasPermission } from "@/services/permissionService";

export async function checkPermission(
  user: AuthUser,
  resource: PermissionResourceType,
  action: PermissionActionType
): Promise<boolean> {
  return hasPermission(user, resource, action);
}

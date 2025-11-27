/**
 * 権限・ロール関連の定数
 */

export const ROLE_PERMISSIONS = {
  user: [
    'diagnosis:view',
    'diagnosis:take',
    'profile:view',
    'profile:edit',
    'chat:view',
    'chat:send',
    'credit:view',
    'credit:purchase',
    'payment:view',
    'payment:create',
    'report:view',
    'affiliate:view',
    'affiliate:join',
  ],
  counselor: [
    'diagnosis:view',
    'diagnosis:take',
    'profile:view',
    'profile:edit',
    'chat:view',
    'chat:send',
    'chat:manage',
    'credit:view',
    'payment:view',
    'report:view',
    'users:view_assigned',
  ],
  admin: [
    'diagnosis:view',
    'diagnosis:take',
    'diagnosis:manage',
    'profile:view',
    'profile:edit',
    'chat:view',
    'chat:send',
    'chat:manage',
    'credit:view',
    'credit:manage',
    'payment:view',
    'payment:manage',
    'report:view',
    'report:regenerate',
    'users:view',
    'users:manage',
    'counselors:view',
    'counselors:manage',
    'affiliate:view',
    'affiliate:manage',
    'analytics:view',
  ],
  super_admin: [
    'diagnosis:view',
    'diagnosis:take',
    'diagnosis:manage',
    'profile:view',
    'profile:edit',
    'chat:view',
    'chat:send',
    'chat:manage',
    'credit:view',
    'credit:manage',
    'payment:view',
    'payment:manage',
    'payment:refund',
    'report:view',
    'report:regenerate',
    'users:view',
    'users:manage',
    'users:delete',
    'counselors:view',
    'counselors:manage',
    'affiliate:view',
    'affiliate:manage',
    'affiliate:payout',
    'analytics:view',
    'analytics:export',
    'company:view',
    'company:manage',
    'company:create',
    'company:delete',
    'settings:view',
    'settings:manage',
  ],
} as const;

export type Permission = (typeof ROLE_PERMISSIONS)[keyof typeof ROLE_PERMISSIONS][number];

export const ROLE_HIERARCHY = {
  user: 1,
  counselor: 2,
  admin: 3,
  super_admin: 4,
} as const;

export const hasPermission = (
  userRole: keyof typeof ROLE_PERMISSIONS,
  permission: Permission
): boolean => {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false;
};

export const hasMinimumRole = (
  userRole: keyof typeof ROLE_HIERARCHY,
  requiredRole: keyof typeof ROLE_HIERARCHY
): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

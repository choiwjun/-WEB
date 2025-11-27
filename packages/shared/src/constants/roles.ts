/**
 * 権限・ロール関連の定数
 */

// 모든 권한을 명시적으로 정의
export const ALL_PERMISSIONS = [
  'diagnosis:view',
  'diagnosis:take',
  'diagnosis:manage',
  'profile:view',
  'profile:edit',
  'chat:view',
  'chat:send',
  'chat:manage',
  'credit:view',
  'credit:purchase',
  'credit:manage',
  'payment:view',
  'payment:create',
  'payment:manage',
  'payment:refund',
  'report:view',
  'report:regenerate',
  'users:view',
  'users:view_assigned',
  'users:manage',
  'users:delete',
  'counselors:view',
  'counselors:manage',
  'affiliate:view',
  'affiliate:join',
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
] as const;

export type Permission = (typeof ALL_PERMISSIONS)[number];

export const ROLE_PERMISSIONS: Record<string, readonly Permission[]> = {
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
};

export type RoleKey = keyof typeof ROLE_PERMISSIONS;

export const ROLE_HIERARCHY: Record<string, number> = {
  user: 1,
  counselor: 2,
  admin: 3,
  super_admin: 4,
};

export const hasPermission = (
  userRole: string,
  permission: Permission
): boolean => {
  const permissions = ROLE_PERMISSIONS[userRole];
  if (!permissions) return false;
  return permissions.includes(permission);
};

export const hasMinimumRole = (
  userRole: string,
  requiredRole: string
): boolean => {
  const userLevel = ROLE_HIERARCHY[userRole] ?? 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] ?? 0;
  return userLevel >= requiredLevel;
};

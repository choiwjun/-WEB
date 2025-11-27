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

// 각 역할별 권한을 string[] 타입으로 정의
const userPermissions: string[] = [
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
];

const counselorPermissions: string[] = [
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
];

const adminPermissions: string[] = [
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
];

const superAdminPermissions: string[] = [
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
];

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  user: userPermissions,
  counselor: counselorPermissions,
  admin: adminPermissions,
  super_admin: superAdminPermissions,
};

export type RoleKey = 'user' | 'counselor' | 'admin' | 'super_admin';

export const ROLE_HIERARCHY: Record<string, number> = {
  user: 1,
  counselor: 2,
  admin: 3,
  super_admin: 4,
};

/**
 * 사용자가 특정 권한을 가지고 있는지 확인
 */
export function hasPermission(userRole: string, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[userRole];
  if (!permissions) return false;
  return permissions.includes(permission);
}

/**
 * 사용자가 최소 역할 요구사항을 충족하는지 확인
 */
export function hasMinimumRole(userRole: string, requiredRole: string): boolean {
  const userLevel = ROLE_HIERARCHY[userRole] ?? 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] ?? 0;
  return userLevel >= requiredLevel;
}

/**
 * 역할에 대한 모든 권한 가져오기
 */
export function getPermissionsForRole(role: string): string[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

/**
 * 권한이 유효한지 확인
 */
export function isValidPermission(permission: string): permission is Permission {
  return (ALL_PERMISSIONS as readonly string[]).includes(permission);
}

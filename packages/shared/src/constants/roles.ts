/**
 * 権限・ロール関連の定数
 */

// Permission type as a simple string union
export type Permission =
  | 'diagnosis:view'
  | 'diagnosis:take'
  | 'diagnosis:manage'
  | 'profile:view'
  | 'profile:edit'
  | 'chat:view'
  | 'chat:send'
  | 'chat:manage'
  | 'credit:view'
  | 'credit:purchase'
  | 'credit:manage'
  | 'payment:view'
  | 'payment:create'
  | 'payment:manage'
  | 'payment:refund'
  | 'report:view'
  | 'report:regenerate'
  | 'users:view'
  | 'users:view_assigned'
  | 'users:manage'
  | 'users:delete'
  | 'counselors:view'
  | 'counselors:manage'
  | 'affiliate:view'
  | 'affiliate:join'
  | 'affiliate:manage'
  | 'affiliate:payout'
  | 'analytics:view'
  | 'analytics:export'
  | 'company:view'
  | 'company:manage'
  | 'company:create'
  | 'company:delete'
  | 'settings:view'
  | 'settings:manage';

// All permissions list for validation
export const ALL_PERMISSIONS: Permission[] = [
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
];

// Role permissions mapping
export const ROLE_PERMISSIONS: { [key: string]: Permission[] } = {
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

export type RoleKey = 'user' | 'counselor' | 'admin' | 'super_admin';

export const ROLE_HIERARCHY: { [key: string]: number } = {
  user: 1,
  counselor: 2,
  admin: 3,
  super_admin: 4,
};

/**
 * Check if user has a specific permission
 */
export function hasPermission(userRole: string, permission: Permission): boolean {
  const perms = ROLE_PERMISSIONS[userRole];
  if (!perms) return false;
  return perms.indexOf(permission) !== -1;
}

/**
 * Check if user meets minimum role requirement
 */
export function hasMinimumRole(userRole: string, requiredRole: string): boolean {
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
  return userLevel >= requiredLevel;
}

/**
 * Get all permissions for a role
 */
export function getPermissionsForRole(role: string): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Check if a string is a valid permission
 */
export function isValidPermission(value: string): value is Permission {
  return ALL_PERMISSIONS.indexOf(value as Permission) !== -1;
}

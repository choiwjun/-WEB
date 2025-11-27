/**
 * 会社コード・企業管理関連の型定義
 */

export enum CompanyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  TRIAL = 'trial',
}

export enum CompanyPlan {
  FREE = 'free',
  BASIC = 'basic',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
}

export interface Company {
  id: string;
  code: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  logoUrl?: string;
  status: CompanyStatus;
  plan: CompanyPlan;
  maxUsers: number;
  currentUsers: number;
  customDomain?: string;
  settings: CompanySettings;
  contractStartDate: Date;
  contractEndDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanySettings {
  allowedDiagnoses: string[];
  customBranding: boolean;
  brandColors?: {
    primary: string;
    secondary: string;
  };
  allowAffiliates: boolean;
  allowCreditPurchase: boolean;
  monthlyCreditsAllocation: number;
  customEmailTemplates: boolean;
  ssoEnabled: boolean;
  ssoConfig?: SSOConfig;
}

export interface SSOConfig {
  provider: 'saml' | 'oidc';
  entityId?: string;
  ssoUrl?: string;
  certificate?: string;
  clientId?: string;
  clientSecret?: string;
  issuer?: string;
}

export interface CompanyAdmin {
  id: string;
  companyId: string;
  userId: string;
  role: 'owner' | 'admin' | 'manager';
  permissions: CompanyPermission[];
  createdAt: Date;
}

export enum CompanyPermission {
  MANAGE_USERS = 'manage_users',
  MANAGE_DIAGNOSES = 'manage_diagnoses',
  MANAGE_PAYMENTS = 'manage_payments',
  MANAGE_REPORTS = 'manage_reports',
  MANAGE_SETTINGS = 'manage_settings',
  VIEW_ANALYTICS = 'view_analytics',
}

export interface CompanyInvitation {
  id: string;
  companyId: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  invitedBy: string;
  expiresAt: Date;
  acceptedAt?: Date;
  createdAt: Date;
}

export interface CompanyStats {
  totalUsers: number;
  activeUsers: number;
  totalDiagnoses: number;
  completedDiagnoses: number;
  totalCreditsUsed: number;
  usersByMonth: Array<{
    month: string;
    count: number;
  }>;
  diagnosesByMonth: Array<{
    month: string;
    count: number;
  }>;
}

export interface CreateCompanyRequest {
  name: string;
  email: string;
  phone?: string;
  plan: CompanyPlan;
  maxUsers: number;
}

export interface UpdateCompanyRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  logoUrl?: string;
  status?: CompanyStatus;
  plan?: CompanyPlan;
  maxUsers?: number;
  settings?: Partial<CompanySettings>;
}

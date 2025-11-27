/**
 * アフィリエイト関連の型定義
 */

export enum AffiliateStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export enum PayoutStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum PayoutMethod {
  WISE = 'wise',
  BANK_TRANSFER = 'bank_transfer',
  PAYPAL = 'paypal',
}

export interface Affiliate {
  id: string;
  userId: string;
  referralCode: string;
  status: AffiliateStatus;
  commissionRate: number;
  totalReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  payoutMethod?: PayoutMethod;
  payoutDetails?: PayoutDetails;
  createdAt: Date;
  updatedAt: Date;
}

export interface PayoutDetails {
  bankName?: string;
  accountNumber?: string;
  accountHolderName?: string;
  swiftCode?: string;
  wiseEmail?: string;
  paypalEmail?: string;
  currency: string;
  country: string;
}

export interface AffiliateReferral {
  id: string;
  affiliateId: string;
  referredUserId: string;
  referralDate: Date;
  convertedAt?: Date;
  totalPurchases: number;
  totalCommission: number;
}

export interface AffiliateCommission {
  id: string;
  affiliateId: string;
  referralId: string;
  paymentId: string;
  amount: number;
  commissionRate: number;
  commissionAmount: number;
  status: PayoutStatus;
  paidAt?: Date;
  createdAt: Date;
}

export interface AffiliatePayout {
  id: string;
  affiliateId: string;
  amount: number;
  currency: string;
  method: PayoutMethod;
  status: PayoutStatus;
  transactionId?: string;
  processedAt?: Date;
  errorMessage?: string;
  createdAt: Date;
}

export interface AffiliateStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  thisMonthEarnings: number;
  conversionRate: number;
  referralsByMonth: Array<{
    month: string;
    count: number;
  }>;
  earningsByMonth: Array<{
    month: string;
    amount: number;
  }>;
}

export interface CreateAffiliateRequest {
  payoutMethod: PayoutMethod;
  payoutDetails: PayoutDetails;
}

export interface RequestPayoutRequest {
  amount: number;
  method: PayoutMethod;
}

/**
 * クレジット関連の型定義
 */

export enum CreditTransactionType {
  PURCHASE = 'purchase',
  BONUS = 'bonus',
  DIAGNOSIS_USE = 'diagnosis_use',
  CHAT_USE = 'chat_use',
  REFUND = 'refund',
  ADMIN_ADJUSTMENT = 'admin_adjustment',
  AFFILIATE_REWARD = 'affiliate_reward',
  EXPIRATION = 'expiration',
}

export interface CreditBalance {
  userId: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  lastUpdatedAt: Date;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  type: CreditTransactionType;
  amount: number;
  balanceAfter: number;
  description: string;
  relatedEntityId?: string;
  relatedEntityType?: 'payment' | 'diagnosis' | 'chat' | 'affiliate';
  createdAt: Date;
}

export interface CreditUsageRequest {
  userId: string;
  amount: number;
  type: CreditTransactionType;
  relatedEntityId?: string;
  relatedEntityType?: string;
  description?: string;
}

export interface CreditHistory {
  transactions: CreditTransaction[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AddCreditsRequest {
  userId: string;
  amount: number;
  type: CreditTransactionType;
  description?: string;
}

export interface DeductCreditsRequest {
  userId: string;
  amount: number;
  type: CreditTransactionType;
  relatedEntityId: string;
  relatedEntityType: string;
  description?: string;
}

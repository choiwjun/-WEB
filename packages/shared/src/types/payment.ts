/**
 * 決済関連の型定義
 */

export enum PaymentProvider {
  STRIPE = 'stripe',
  BYPAY = 'bypay',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}

export enum PaymentType {
  CREDIT_PURCHASE = 'credit_purchase',
  DIAGNOSIS_PURCHASE = 'diagnosis_purchase',
  SUBSCRIPTION = 'subscription',
}

export interface Payment {
  id: string;
  userId: string;
  provider: PaymentProvider;
  providerPaymentId: string;
  type: PaymentType;
  amount: number;
  currency: string;
  status: PaymentStatus;
  metadata?: Record<string, unknown>;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface PaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

export interface CreatePaymentRequest {
  type: PaymentType;
  amount: number;
  currency?: string;
  provider?: PaymentProvider;
  metadata?: Record<string, unknown>;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  currency: string;
  bonusCredits: number;
  isPopular: boolean;
  isActive: boolean;
  order: number;
}

export interface PaymentHistory {
  payments: Payment[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface RefundRequest {
  paymentId: string;
  reason: string;
  amount?: number;
}

export interface PaymentWebhookEvent {
  id: string;
  provider: PaymentProvider;
  eventType: string;
  payload: Record<string, unknown>;
  processedAt?: Date;
  createdAt: Date;
}

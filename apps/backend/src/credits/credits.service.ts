import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreditTransactionType } from '@prisma/client';

@Injectable()
export class CreditsService {
  constructor(private readonly prisma: PrismaService) {}

  async getBalance(userId: string) {
    const balance = await this.prisma.creditBalance.findUnique({
      where: { userId },
    });

    return balance || { userId, balance: 0, totalEarned: 0, totalSpent: 0 };
  }

  async addCredits(data: {
    userId: string;
    amount: number;
    type: CreditTransactionType;
    paymentId?: string;
    description?: string;
  }) {
    const { userId, amount, type, paymentId, description } = data;

    return this.prisma.$transaction(async (tx) => {
      // Get or create balance
      let balance = await tx.creditBalance.findUnique({
        where: { userId },
      });

      if (!balance) {
        balance = await tx.creditBalance.create({
          data: { userId, balance: 0, totalEarned: 0, totalSpent: 0 },
        });
      }

      const newBalance = balance.balance + amount;

      // Update balance
      await tx.creditBalance.update({
        where: { userId },
        data: {
          balance: newBalance,
          totalEarned: { increment: amount },
          lastUpdatedAt: new Date(),
        },
      });

      // Create transaction record
      const transaction = await tx.creditTransaction.create({
        data: {
          userId,
          type,
          amount,
          balanceAfter: newBalance,
          description: description || this.getDefaultDescription(type, amount),
          paymentId,
        },
      });

      return { balance: newBalance, transaction };
    });
  }

  async deductCredits(data: {
    userId: string;
    amount: number;
    type: CreditTransactionType;
    relatedEntityId?: string;
    relatedEntityType?: string;
    description?: string;
  }) {
    const { userId, amount, type, relatedEntityId, relatedEntityType, description } = data;

    return this.prisma.$transaction(async (tx) => {
      const balance = await tx.creditBalance.findUnique({
        where: { userId },
      });

      if (!balance || balance.balance < amount) {
        throw new BadRequestException('クレジットが不足しています');
      }

      const newBalance = balance.balance - amount;

      // Update balance
      await tx.creditBalance.update({
        where: { userId },
        data: {
          balance: newBalance,
          totalSpent: { increment: amount },
          lastUpdatedAt: new Date(),
        },
      });

      // Create transaction record
      const transaction = await tx.creditTransaction.create({
        data: {
          userId,
          type,
          amount: -amount,
          balanceAfter: newBalance,
          description: description || this.getDefaultDescription(type, amount),
          relatedEntityId,
          relatedEntityType,
        },
      });

      return { balance: newBalance, transaction };
    });
  }

  async getTransactionHistory(
    userId: string,
    options: { skip?: number; take?: number; type?: CreditTransactionType },
  ) {
    const { skip = 0, take = 20, type } = options;

    const where: any = { userId };
    if (type) where.type = type;

    const [transactions, total] = await Promise.all([
      this.prisma.creditTransaction.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.creditTransaction.count({ where }),
    ]);

    return {
      transactions,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
      totalPages: Math.ceil(total / take),
    };
  }

  async hasEnoughCredits(userId: string, amount: number): Promise<boolean> {
    const balance = await this.getBalance(userId);
    return balance.balance >= amount;
  }

  private getDefaultDescription(type: CreditTransactionType, amount: number): string {
    const descriptions: Record<CreditTransactionType, string> = {
      PURCHASE: `クレジット購入: ${amount}クレジット`,
      BONUS: `ボーナスクレジット: ${amount}クレジット`,
      DIAGNOSIS_USE: `診断利用: ${amount}クレジット消費`,
      CHAT_USE: `相談利用: ${amount}クレジット消費`,
      REFUND: `返金: ${amount}クレジット`,
      ADMIN_ADJUSTMENT: `管理者調整: ${amount}クレジット`,
      AFFILIATE_REWARD: `アフィリエイト報酬: ${amount}クレジット`,
      EXPIRATION: `期限切れ: ${amount}クレジット失効`,
    };
    return descriptions[type] || `クレジット取引: ${amount}`;
  }
}

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AffiliateStatus, PayoutMethod, PayoutStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AffiliatesService {
  constructor(private readonly prisma: PrismaService) {}

  async register(userId: string, payoutMethod: PayoutMethod, payoutDetails: any) {
    // Check if already registered
    const existing = await this.prisma.affiliate.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new BadRequestException('既にアフィリエイトに登録されています');
    }

    // Generate unique referral code
    const referralCode = this.generateReferralCode();

    return this.prisma.affiliate.create({
      data: {
        userId,
        referralCode,
        status: AffiliateStatus.ACTIVE,
        commissionRate: 0.1, // 10% default commission
        payoutMethod,
        payoutDetails,
      },
    });
  }

  async getAffiliateByUserId(userId: string) {
    const affiliate = await this.prisma.affiliate.findUnique({
      where: { userId },
      include: {
        referrals: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!affiliate) {
      throw new NotFoundException('アフィリエイト情報が見つかりません');
    }

    return affiliate;
  }

  async getAffiliateByReferralCode(referralCode: string) {
    return this.prisma.affiliate.findUnique({
      where: { referralCode },
    });
  }

  async recordReferral(affiliateId: string, referredUserId: string) {
    return this.prisma.affiliateReferral.create({
      data: {
        affiliateId,
        referredUserId,
      },
    });
  }

  async getStats(userId: string) {
    const affiliate = await this.prisma.affiliate.findUnique({
      where: { userId },
      include: {
        referrals: true,
        commissions: true,
      },
    });

    if (!affiliate) {
      throw new NotFoundException('アフィリエイト情報が見つかりません');
    }

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const thisMonthCommissions = affiliate.commissions.filter(
      (c) => c.createdAt >= thisMonth,
    );

    const thisMonthEarnings = thisMonthCommissions.reduce(
      (sum, c) => sum + c.commissionAmount,
      0,
    );

    return {
      totalReferrals: affiliate.totalReferrals,
      activeReferrals: affiliate.referrals.filter((r) => r.convertedAt).length,
      totalEarnings: affiliate.totalEarnings,
      pendingEarnings: affiliate.pendingEarnings,
      thisMonthEarnings,
      conversionRate:
        affiliate.totalReferrals > 0
          ? affiliate.referrals.filter((r) => r.convertedAt).length /
            affiliate.totalReferrals
          : 0,
    };
  }

  async requestPayout(userId: string, amount: number, method: PayoutMethod) {
    const affiliate = await this.prisma.affiliate.findUnique({
      where: { userId },
    });

    if (!affiliate) {
      throw new NotFoundException('アフィリエイト情報が見つかりません');
    }

    if (affiliate.pendingEarnings < amount) {
      throw new BadRequestException('出金可能額を超えています');
    }

    // Minimum payout threshold (e.g., 5000 JPY)
    if (amount < 5000) {
      throw new BadRequestException('最低出金額は5,000円です');
    }

    const payout = await this.prisma.affilaitePayout.create({
      data: {
        affiliateId: affiliate.id,
        amount,
        method,
        status: PayoutStatus.PENDING,
      },
    });

    // Deduct from pending earnings
    await this.prisma.affiliate.update({
      where: { id: affiliate.id },
      data: {
        pendingEarnings: { decrement: amount },
      },
    });

    return payout;
  }

  async getPayoutHistory(userId: string, options: { skip?: number; take?: number }) {
    const { skip = 0, take = 20 } = options;

    const affiliate = await this.prisma.affiliate.findUnique({
      where: { userId },
    });

    if (!affiliate) {
      throw new NotFoundException('アフィリエイト情報が見つかりません');
    }

    return this.prisma.affilaitePayout.findMany({
      where: { affiliateId: affiliate.id },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  private generateReferralCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}

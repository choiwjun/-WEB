import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreditsService } from '../credits/credits.service';
import { PaymentProvider, PaymentType, PaymentStatus, CreditTransactionType } from '@prisma/client';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly creditsService: CreditsService,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });
  }

  async getCreditPackages() {
    return this.prisma.creditPackage.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  async createPaymentIntent(
    userId: string,
    packageId: string,
  ) {
    const creditPackage = await this.prisma.creditPackage.findUnique({
      where: { id: packageId },
    });

    if (!creditPackage || !creditPackage.isActive) {
      throw new BadRequestException('無効なパッケージです');
    }

    // Create payment record
    const payment = await this.prisma.payment.create({
      data: {
        userId,
        provider: PaymentProvider.STRIPE,
        type: PaymentType.CREDIT_PURCHASE,
        amount: creditPackage.price,
        currency: creditPackage.currency,
        status: PaymentStatus.PENDING,
        metadata: {
          packageId,
          credits: creditPackage.credits,
          bonusCredits: creditPackage.bonusCredits,
        },
      },
    });

    // Create Stripe PaymentIntent
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: creditPackage.price,
      currency: creditPackage.currency.toLowerCase(),
      metadata: {
        paymentId: payment.id,
        userId,
        packageId,
      },
    });

    // Update payment with Stripe ID
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        providerPaymentId: paymentIntent.id,
        status: PaymentStatus.PROCESSING,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: creditPackage.price,
      currency: creditPackage.currency,
    };
  }

  async handleStripeWebhook(payload: Buffer, signature: string) {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret || '');
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;
    }

    return { received: true };
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const payment = await this.prisma.payment.findFirst({
      where: { providerPaymentId: paymentIntent.id },
    });

    if (!payment) return;

    const metadata = payment.metadata as { credits: number; bonusCredits: number };
    const totalCredits = (metadata.credits || 0) + (metadata.bonusCredits || 0);

    // Update payment status
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.COMPLETED,
        completedAt: new Date(),
      },
    });

    // Add credits to user
    await this.creditsService.addCredits({
      userId: payment.userId,
      amount: totalCredits,
      type: CreditTransactionType.PURCHASE,
      paymentId: payment.id,
      description: `クレジット購入: ${metadata.credits}クレジット${metadata.bonusCredits > 0 ? ` + ${metadata.bonusCredits}ボーナス` : ''}`,
    });
  }

  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    await this.prisma.payment.updateMany({
      where: { providerPaymentId: paymentIntent.id },
      data: {
        status: PaymentStatus.FAILED,
        errorMessage: paymentIntent.last_payment_error?.message,
      },
    });
  }

  async getUserPayments(userId: string, options: { skip?: number; take?: number }) {
    const { skip = 0, take = 20 } = options;

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where: { userId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.count({ where: { userId } }),
    ]);

    return {
      payments,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
      totalPages: Math.ceil(total / take),
    };
  }
}

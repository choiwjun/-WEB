import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Headers,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('packages')
  @Public()
  @ApiOperation({ summary: 'クレジットパッケージ一覧取得' })
  @ApiResponse({ status: 200, description: 'パッケージ一覧' })
  async getCreditPackages() {
    return this.paymentsService.getCreditPackages();
  }

  @Post('create-payment-intent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '決済インテント作成' })
  @ApiResponse({ status: 201, description: '決済インテント' })
  async createPaymentIntent(
    @CurrentUser('id') userId: string,
    @Body('packageId') packageId: string,
  ) {
    return this.paymentsService.createPaymentIntent(userId, packageId);
  }

  @Post('webhook/stripe')
  @Public()
  @ApiOperation({ summary: 'Stripe Webhook' })
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.paymentsService.handleStripeWebhook(req.rawBody!, signature);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '決済履歴取得' })
  @ApiResponse({ status: 200, description: '決済履歴' })
  async getPaymentHistory(
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    const skip = ((page || 1) - 1) * (pageSize || 20);
    return this.paymentsService.getUserPayments(userId, { skip, take: pageSize || 20 });
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AffiliatesService } from './affiliates.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PayoutMethod } from '@prisma/client';

@ApiTags('affiliates')
@Controller('affiliates')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AffiliatesController {
  constructor(private readonly affiliatesService: AffiliatesService) {}

  @Post('register')
  @ApiOperation({ summary: 'アフィリエイト登録' })
  @ApiResponse({ status: 201, description: '登録完了' })
  async register(
    @CurrentUser('id') userId: string,
    @Body() body: { payoutMethod: PayoutMethod; payoutDetails: any },
  ) {
    return this.affiliatesService.register(userId, body.payoutMethod, body.payoutDetails);
  }

  @Get('me')
  @ApiOperation({ summary: 'アフィリエイト情報取得' })
  @ApiResponse({ status: 200, description: 'アフィリエイト情報' })
  async getMyAffiliate(@CurrentUser('id') userId: string) {
    return this.affiliatesService.getAffiliateByUserId(userId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'アフィリエイト統計取得' })
  @ApiResponse({ status: 200, description: '統計情報' })
  async getStats(@CurrentUser('id') userId: string) {
    return this.affiliatesService.getStats(userId);
  }

  @Post('payout')
  @ApiOperation({ summary: '報酬出金リクエスト' })
  @ApiResponse({ status: 201, description: '出金リクエスト作成完了' })
  async requestPayout(
    @CurrentUser('id') userId: string,
    @Body() body: { amount: number; method: PayoutMethod },
  ) {
    return this.affiliatesService.requestPayout(userId, body.amount, body.method);
  }

  @Get('payouts')
  @ApiOperation({ summary: '出金履歴取得' })
  @ApiResponse({ status: 200, description: '出金履歴' })
  async getPayoutHistory(
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    const skip = ((page || 1) - 1) * (pageSize || 20);
    return this.affiliatesService.getPayoutHistory(userId, { skip, take: pageSize || 20 });
  }
}

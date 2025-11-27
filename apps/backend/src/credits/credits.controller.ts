import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CreditsService } from './credits.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreditTransactionType } from '@prisma/client';

@ApiTags('credits')
@Controller('credits')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}

  @Get('balance')
  @ApiOperation({ summary: 'クレジット残高取得' })
  @ApiResponse({ status: 200, description: 'クレジット残高' })
  async getBalance(@CurrentUser('id') userId: string) {
    return this.creditsService.getBalance(userId);
  }

  @Get('history')
  @ApiOperation({ summary: 'クレジット利用履歴取得' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, enum: CreditTransactionType })
  @ApiResponse({ status: 200, description: '利用履歴' })
  async getTransactionHistory(
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('type') type?: CreditTransactionType,
  ) {
    const skip = ((page || 1) - 1) * (pageSize || 20);
    return this.creditsService.getTransactionHistory(userId, {
      skip,
      take: pageSize || 20,
      type,
    });
  }
}

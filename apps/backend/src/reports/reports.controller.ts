import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole, Language } from '@prisma/client';

@ApiTags('reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('generate/:diagnosisResultId')
  @ApiOperation({ summary: 'AIレポート生成' })
  @ApiResponse({ status: 201, description: 'レポート生成開始' })
  async generateReport(
    @CurrentUser('id') userId: string,
    @Param('diagnosisResultId') diagnosisResultId: string,
    @Query('language') language?: Language,
  ) {
    return this.reportsService.generateReport(userId, diagnosisResultId, language);
  }

  @Get(':id')
  @ApiOperation({ summary: 'レポート取得' })
  @ApiResponse({ status: 200, description: 'レポート詳細' })
  async getReport(@Param('id') id: string) {
    return this.reportsService.getReport(id);
  }

  @Get()
  @ApiOperation({ summary: 'ユーザーのレポート一覧' })
  @ApiResponse({ status: 200, description: 'レポート一覧' })
  async getUserReports(
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    const skip = ((page || 1) - 1) * (pageSize || 20);
    return this.reportsService.getUserReports(userId, { skip, take: pageSize || 20 });
  }

  @Post(':id/regenerate')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'レポート再生成（管理者用）' })
  @ApiResponse({ status: 200, description: '再生成開始' })
  async regenerateReport(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.reportsService.regenerateReport(id, userId);
  }
}

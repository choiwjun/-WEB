import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole, CompanyStatus, CompanyPlan, CompanyAdminRole } from '@prisma/client';

@ApiTags('companies')
@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: '会社作成' })
  @ApiResponse({ status: 201, description: '会社作成完了' })
  async create(
    @Body() body: {
      name: string;
      email: string;
      phone?: string;
      plan?: CompanyPlan;
      maxUsers?: number;
    },
  ) {
    return this.companiesService.create(body);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: '会社一覧取得' })
  @ApiResponse({ status: 200, description: '会社一覧' })
  async findAll(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('status') status?: CompanyStatus,
    @Query('plan') plan?: CompanyPlan,
  ) {
    const skip = ((page || 1) - 1) * (pageSize || 20);
    return this.companiesService.findAll({
      skip,
      take: pageSize || 20,
      status,
      plan,
    });
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: '会社詳細取得' })
  @ApiResponse({ status: 200, description: '会社詳細' })
  async findOne(@Param('id') id: string) {
    return this.companiesService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: '会社情報更新' })
  @ApiResponse({ status: 200, description: '更新完了' })
  async update(
    @Param('id') id: string,
    @Body() body: {
      name?: string;
      email?: string;
      phone?: string;
      plan?: CompanyPlan;
      maxUsers?: number;
      settings?: any;
    },
  ) {
    return this.companiesService.update(id, body);
  }

  @Put(':id/status')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: '会社ステータス更新' })
  @ApiResponse({ status: 200, description: 'ステータス更新完了' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: CompanyStatus,
  ) {
    return this.companiesService.updateStatus(id, status);
  }

  @Get(':id/stats')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: '会社統計取得' })
  @ApiResponse({ status: 200, description: '統計情報' })
  async getStats(@Param('id') id: string) {
    return this.companiesService.getStats(id);
  }

  @Post(':id/admins')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: '会社管理者追加' })
  @ApiResponse({ status: 201, description: '管理者追加完了' })
  async addAdmin(
    @Param('id') companyId: string,
    @Body() body: { userId: string; role: CompanyAdminRole },
  ) {
    return this.companiesService.addAdmin(companyId, body.userId, body.role);
  }

  @Delete(':id/admins/:userId')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: '会社管理者削除' })
  @ApiResponse({ status: 200, description: '管理者削除完了' })
  async removeAdmin(
    @Param('id') companyId: string,
    @Param('userId') userId: string,
  ) {
    return this.companiesService.removeAdmin(companyId, userId);
  }

  @Post(':id/invitations')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: '招待メール送信' })
  @ApiResponse({ status: 201, description: '招待作成完了' })
  async createInvitation(
    @CurrentUser('id') userId: string,
    @Param('id') companyId: string,
    @Body() body: { email: string; role: CompanyAdminRole },
  ) {
    return this.companiesService.createInvitation(
      companyId,
      body.email,
      body.role,
      userId,
    );
  }
}

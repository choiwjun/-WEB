import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CompanyStatus, CompanyPlan, CompanyAdminRole, Prisma } from '@prisma/client';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    name: string;
    email: string;
    phone?: string;
    plan?: CompanyPlan;
    maxUsers?: number;
  }) {
    const code = this.generateCompanyCode();

    // Check if code exists
    const existing = await this.prisma.company.findUnique({
      where: { code },
    });

    if (existing) {
      // Generate new code if collision
      return this.create(data);
    }

    return this.prisma.company.create({
      data: {
        code,
        name: data.name,
        email: data.email,
        phone: data.phone,
        plan: data.plan || CompanyPlan.TRIAL,
        maxUsers: data.maxUsers || 10,
        status: CompanyStatus.TRIAL,
      },
    });
  }

  async findAll(options: {
    skip?: number;
    take?: number;
    status?: CompanyStatus;
    plan?: CompanyPlan;
  }) {
    const { skip = 0, take = 20, status, plan } = options;

    const where: Prisma.CompanyWhereInput = {};
    if (status) where.status = status;
    if (plan) where.plan = plan;

    const [companies, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { users: true },
          },
        },
      }),
      this.prisma.company.count({ where }),
    ]);

    return {
      companies,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
      totalPages: Math.ceil(total / take),
    };
  }

  async findById(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true,
            lastLoginAt: true,
          },
        },
        admins: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundException('会社が見つかりません');
    }

    return company;
  }

  async findByCode(code: string) {
    const company = await this.prisma.company.findUnique({
      where: { code },
    });

    if (!company) {
      throw new NotFoundException('会社コードが無効です');
    }

    return company;
  }

  async update(id: string, data: Prisma.CompanyUpdateInput) {
    return this.prisma.company.update({
      where: { id },
      data,
    });
  }

  async updateStatus(id: string, status: CompanyStatus) {
    return this.prisma.company.update({
      where: { id },
      data: { status },
    });
  }

  async addAdmin(companyId: string, userId: string, role: CompanyAdminRole) {
    const existing = await this.prisma.companyAdmin.findUnique({
      where: {
        companyId_userId: { companyId, userId },
      },
    });

    if (existing) {
      throw new ConflictException('このユーザーは既に管理者として登録されています');
    }

    return this.prisma.companyAdmin.create({
      data: {
        companyId,
        userId,
        role,
      },
    });
  }

  async removeAdmin(companyId: string, userId: string) {
    return this.prisma.companyAdmin.delete({
      where: {
        companyId_userId: { companyId, userId },
      },
    });
  }

  async getStats(companyId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    if (!company) {
      throw new NotFoundException('会社が見つかりません');
    }

    const [totalDiagnoses, completedDiagnoses, totalCreditsUsed] = await Promise.all([
      this.prisma.diagnosisSession.count({
        where: {
          user: { companyCode: company.code },
        },
      }),
      this.prisma.diagnosisSession.count({
        where: {
          user: { companyCode: company.code },
          status: 'COMPLETED',
        },
      }),
      this.prisma.creditTransaction.aggregate({
        where: {
          user: { companyCode: company.code },
          amount: { lt: 0 },
        },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalUsers: company._count.users,
      activeUsers: company.currentUsers,
      totalDiagnoses,
      completedDiagnoses,
      totalCreditsUsed: Math.abs(totalCreditsUsed._sum.amount || 0),
    };
  }

  async createInvitation(companyId: string, email: string, role: CompanyAdminRole, invitedBy: string) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    return this.prisma.companyInvitation.create({
      data: {
        companyId,
        email,
        role,
        invitedBy,
        expiresAt,
      },
    });
  }

  private generateCompanyCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}

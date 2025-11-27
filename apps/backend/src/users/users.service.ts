import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User, UserRole, AuthProvider, Language } from '@prisma/client';

// Custom type for creating user with companyCode as string
interface CreateUserInput {
  email: string;
  password?: string;
  name: string;
  companyCode?: string;
  language?: Language;
  role?: UserRole;
  authProvider?: AuthProvider;
  avatar?: string;
  isEmailVerified?: boolean;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // Create user with proper company relation handling
  async createUser(data: CreateUserInput): Promise<User> {
    const { companyCode, ...userData } = data;
    
    return this.prisma.user.create({
      data: {
        ...userData,
        language: data.language || Language.JA,
        role: data.role || UserRole.USER,
        authProvider: data.authProvider || AuthProvider.EMAIL,
        ...(companyCode && {
          company: {
            connect: { code: companyCode },
          },
        }),
        creditBalance: {
          create: {
            balance: 0,
            totalEarned: 0,
            totalSpent: 0,
          },
        },
      },
    });
  }

  // Legacy create method for Prisma.UserCreateInput
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...data,
        creditBalance: {
          create: {
            balance: 0,
            totalEarned: 0,
            totalSpent: 0,
          },
        },
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        preferences: true,
        creditBalance: true,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('ユーザーが見つかりません');
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  async findAll(options: {
    skip?: number;
    take?: number;
    companyCode?: string;
    role?: string;
  }) {
    const { skip = 0, take = 20, companyCode, role } = options;

    const where: Prisma.UserWhereInput = {};
    if (companyCode) where.companyCode = companyCode;
    if (role) where.role = role as any;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          nickname: true,
          avatar: true,
          role: true,
          language: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
      totalPages: Math.ceil(total / take),
    };
  }

  async updateProfile(
    userId: string,
    data: {
      name?: string;
      nickname?: string;
      avatar?: string;
      birthDate?: Date;
      gender?: string;
      occupation?: string;
      bio?: string;
    },
  ) {
    const { name, nickname, avatar, ...profileData } = data;

    // Update user data
    if (name || nickname || avatar) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...(name && { name }),
          ...(nickname && { nickname }),
          ...(avatar && { avatar }),
        },
      });
    }

    // Update or create profile
    if (Object.keys(profileData).length > 0) {
      await this.prisma.userProfile.upsert({
        where: { userId },
        update: profileData as any,
        create: {
          userId,
          ...profileData as any,
        },
      });
    }

    return this.findById(userId);
  }

  async deactivate(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async activate(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { isActive: true },
    });
  }
}

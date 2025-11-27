import { PrismaClient, UserRole, AuthProvider, Language } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@shindan.com' },
    update: {
      password: adminPassword,
      name: '管理者',
      role: UserRole.SUPER_ADMIN,
    },
    create: {
      email: 'admin@shindan.com',
      password: adminPassword,
      name: '管理者',
      nickname: 'Admin',
      role: UserRole.SUPER_ADMIN,
      authProvider: AuthProvider.EMAIL,
      language: Language.JA,
      isEmailVerified: true,
      isActive: true,
    },
  });

  console.log(`Admin user created/updated: ${adminUser.email}`);

  // Create a regular admin user
  const regularAdminPassword = await bcrypt.hash('admin123', 10);

  const regularAdmin = await prisma.user.upsert({
    where: { email: 'manager@shindan.com' },
    update: {
      password: regularAdminPassword,
      name: '運営管理者',
      role: UserRole.ADMIN,
    },
    create: {
      email: 'manager@shindan.com',
      password: regularAdminPassword,
      name: '運営管理者',
      nickname: 'Manager',
      role: UserRole.ADMIN,
      authProvider: AuthProvider.EMAIL,
      language: Language.JA,
      isEmailVerified: true,
      isActive: true,
    },
  });

  console.log(`Regular admin created/updated: ${regularAdmin.email}`);

  // Create test user
  const testUserPassword = await bcrypt.hash('user123', 10);

  const testUser = await prisma.user.upsert({
    where: { email: 'user@shindan.com' },
    update: {
      password: testUserPassword,
      name: 'テストユーザー',
    },
    create: {
      email: 'user@shindan.com',
      password: testUserPassword,
      name: 'テストユーザー',
      nickname: 'TestUser',
      role: UserRole.USER,
      authProvider: AuthProvider.EMAIL,
      language: Language.JA,
      isEmailVerified: true,
      isActive: true,
    },
  });

  console.log(`Test user created/updated: ${testUser.email}`);

  // Create test counselor
  const counselorPassword = await bcrypt.hash('counselor123', 10);

  const counselorUser = await prisma.user.upsert({
    where: { email: 'counselor@shindan.com' },
    update: {
      password: counselorPassword,
      name: '田中美咲',
      role: UserRole.COUNSELOR,
    },
    create: {
      email: 'counselor@shindan.com',
      password: counselorPassword,
      name: '田中美咲',
      nickname: 'Misaki',
      role: UserRole.COUNSELOR,
      authProvider: AuthProvider.EMAIL,
      language: Language.JA,
      isEmailVerified: true,
      isActive: true,
    },
  });

  console.log(`Counselor user created/updated: ${counselorUser.email}`);

  console.log('Seed completed successfully!');
  console.log('\n=== Login Credentials ===');
  console.log('Super Admin: admin@shindan.com / admin');
  console.log('Admin: manager@shindan.com / admin123');
  console.log('User: user@shindan.com / user123');
  console.log('Counselor: counselor@shindan.com / counselor123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

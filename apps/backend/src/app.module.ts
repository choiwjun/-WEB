import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DiagnosisModule } from './diagnosis/diagnosis.module';
import { ChatModule } from './chat/chat.module';
import { PaymentsModule } from './payments/payments.module';
import { CreditsModule } from './credits/credits.module';
import { AffiliatesModule } from './affiliates/affiliates.module';
import { ReportsModule } from './reports/reports.module';
import { CompaniesModule } from './companies/companies.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    DiagnosisModule,
    ChatModule,
    PaymentsModule,
    CreditsModule,
    AffiliatesModule,
    ReportsModule,
    CompaniesModule,
  ],
})
export class AppModule {}

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('診断プラットフォーム API')
    .setDescription('心理・性格診断プラットフォームのAPI仕様書')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', '認証')
    .addTag('users', 'ユーザー管理')
    .addTag('diagnosis', '診断')
    .addTag('chat', 'チャット')
    .addTag('payments', '決済')
    .addTag('credits', 'クレジット')
    .addTag('affiliates', 'アフィリエイト')
    .addTag('reports', 'AIレポート')
    .addTag('companies', '企業管理')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();

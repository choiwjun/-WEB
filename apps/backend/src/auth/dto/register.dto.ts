import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Language } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'メールアドレス' })
  @IsEmail({}, { message: '有効なメールアドレスを入力してください' })
  email: string;

  @ApiProperty({ example: 'Password123', description: 'パスワード（8文字以上）' })
  @IsString()
  @MinLength(8, { message: 'パスワードは8文字以上である必要があります' })
  password: string;

  @ApiProperty({ example: '山田太郎', description: '名前' })
  @IsString()
  @MinLength(1, { message: '名前を入力してください' })
  name: string;

  @ApiPropertyOptional({ example: 'COMPANY123', description: '会社コード' })
  @IsOptional()
  @IsString()
  companyCode?: string;

  @ApiPropertyOptional({ enum: Language, example: 'JA', description: '言語設定' })
  @IsOptional()
  @IsEnum(Language)
  language?: Language;
}

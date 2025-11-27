import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'メールアドレス' })
  @IsEmail({}, { message: '有効なメールアドレスを入力してください' })
  email: string;

  @ApiProperty({ example: 'Password123', description: 'パスワード' })
  @IsString()
  @MinLength(1, { message: 'パスワードを入力してください' })
  password: string;
}

import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { MessageType, SenderType } from '@prisma/client';

@ApiTags('chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('counselors')
  @ApiOperation({ summary: '相談員一覧取得' })
  @ApiResponse({ status: 200, description: '相談員一覧' })
  async getCounselors() {
    return this.chatService.getCounselors();
  }

  @Post('rooms')
  @ApiOperation({ summary: 'チャットルーム作成' })
  @ApiResponse({ status: 201, description: 'ルーム作成完了' })
  async createRoom(
    @CurrentUser('id') userId: string,
    @Body('counselorId') counselorId: string,
  ) {
    return this.chatService.createRoom(userId, counselorId);
  }

  @Get('rooms')
  @ApiOperation({ summary: 'チャットルーム一覧取得' })
  @ApiResponse({ status: 200, description: 'ルーム一覧' })
  async getRooms(@CurrentUser('id') userId: string) {
    return this.chatService.getUserRooms(userId);
  }

  @Get('rooms/:id/messages')
  @ApiOperation({ summary: 'メッセージ一覧取得' })
  @ApiResponse({ status: 200, description: 'メッセージ一覧' })
  async getMessages(
    @CurrentUser('id') userId: string,
    @Param('id') roomId: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    const skip = ((page || 1) - 1) * (pageSize || 50);
    return this.chatService.getMessages(roomId, userId, { skip, take: pageSize || 50 });
  }

  @Post('rooms/:id/messages')
  @ApiOperation({ summary: 'メッセージ送信' })
  @ApiResponse({ status: 201, description: 'メッセージ送信完了' })
  async sendMessage(
    @CurrentUser('id') userId: string,
    @Param('id') roomId: string,
    @Body() body: {
      content: string;
      messageType?: MessageType;
      fileUrl?: string;
      fileName?: string;
      fileSize?: number;
    },
  ) {
    const { content, messageType, ...fileData } = body;
    return this.chatService.sendMessage(
      roomId,
      userId,
      SenderType.USER,
      content,
      messageType || MessageType.TEXT,
      fileData,
    );
  }

  @Put('rooms/:id/read')
  @ApiOperation({ summary: 'メッセージ既読処理' })
  @ApiResponse({ status: 200, description: '既読処理完了' })
  async markAsRead(
    @CurrentUser('id') userId: string,
    @Param('id') roomId: string,
  ) {
    return this.chatService.markAsRead(roomId, userId);
  }

  @Put('rooms/:id/close')
  @ApiOperation({ summary: 'チャットルームを閉じる' })
  @ApiResponse({ status: 200, description: 'ルームクローズ完了' })
  async closeRoom(
    @CurrentUser('id') userId: string,
    @Param('id') roomId: string,
  ) {
    return this.chatService.closeRoom(roomId, userId);
  }
}

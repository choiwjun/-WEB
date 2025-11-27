import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { MessageType, SenderType } from '@prisma/client';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, string[]> = new Map();

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.auth.userId;
    if (userId) {
      const userSocketIds = this.userSockets.get(userId) || [];
      userSocketIds.push(client.id);
      this.userSockets.set(userId, userSocketIds);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.auth.userId;
    if (userId) {
      const userSocketIds = this.userSockets.get(userId) || [];
      const index = userSocketIds.indexOf(client.id);
      if (index !== -1) {
        userSocketIds.splice(index, 1);
        if (userSocketIds.length === 0) {
          this.userSockets.delete(userId);
        } else {
          this.userSockets.set(userId, userSocketIds);
        }
      }
    }
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    client.join(`room:${data.roomId}`);
    return { success: true };
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    client.leave(`room:${data.roomId}`);
    return { success: true };
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      roomId: string;
      content: string;
      messageType?: MessageType;
      senderType: SenderType;
    },
  ) {
    const userId = client.handshake.auth.userId;
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    try {
      const message = await this.chatService.sendMessage(
        data.roomId,
        userId,
        data.senderType,
        data.content,
        data.messageType || MessageType.TEXT,
      );

      // Broadcast to room
      this.server.to(`room:${data.roomId}`).emit('newMessage', message);

      return { success: true, message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; isTyping: boolean },
  ) {
    const userId = client.handshake.auth.userId;
    client.to(`room:${data.roomId}`).emit('userTyping', {
      userId,
      isTyping: data.isTyping,
    });
  }

  @SubscribeMessage('markRead')
  async handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    const userId = client.handshake.auth.userId;
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    try {
      await this.chatService.markAsRead(data.roomId, userId);
      client.to(`room:${data.roomId}`).emit('messagesRead', { userId });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

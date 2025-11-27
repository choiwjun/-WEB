import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatRoomStatus, MessageType, SenderType, Prisma } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async getCounselors() {
    return this.prisma.counselor.findMany({
      where: { isAvailable: true },
      include: {
        schedules: true,
      },
      orderBy: { rating: 'desc' },
    });
  }

  async createRoom(userId: string, counselorId: string) {
    // Check for existing active room
    const existingRoom = await this.prisma.chatRoom.findFirst({
      where: {
        userId,
        counselorId,
        status: ChatRoomStatus.ACTIVE,
      },
    });

    if (existingRoom) {
      return existingRoom;
    }

    return this.prisma.chatRoom.create({
      data: {
        userId,
        counselorId,
        status: ChatRoomStatus.ACTIVE,
      },
    });
  }

  async getUserRooms(userId: string) {
    return this.prisma.chatRoom.findMany({
      where: { userId },
      include: {
        counselor: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });
  }

  async getCounselorRooms(counselorId: string) {
    return this.prisma.chatRoom.findMany({
      where: { counselorId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });
  }

  async getMessages(roomId: string, userId: string, options: { skip?: number; take?: number }) {
    const { skip = 0, take = 50 } = options;

    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: { counselor: true },
    });

    if (!room) {
      throw new NotFoundException('チャットルームが見つかりません');
    }

    // Check access
    if (room.userId !== userId && room.counselor.userId !== userId) {
      throw new ForbiddenException('このチャットルームにアクセスする権限がありません');
    }

    return this.prisma.chatMessage.findMany({
      where: { roomId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async sendMessage(
    roomId: string,
    senderId: string,
    senderType: SenderType,
    content: string,
    messageType: MessageType = MessageType.TEXT,
    fileData?: { fileUrl?: string; fileName?: string; fileSize?: number },
  ) {
    const message = await this.prisma.chatMessage.create({
      data: {
        roomId,
        senderId,
        senderType,
        messageType,
        content,
        ...fileData,
      },
    });

    // Update room's last message info
    await this.prisma.chatRoom.update({
      where: { id: roomId },
      data: {
        lastMessageAt: new Date(),
        lastMessagePreview: content.substring(0, 100),
        ...(senderType === SenderType.USER
          ? { unreadCountCounselor: { increment: 1 } }
          : { unreadCountUser: { increment: 1 } }),
      },
    });

    return message;
  }

  async markAsRead(roomId: string, userId: string) {
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: { counselor: true },
    });

    if (!room) {
      throw new NotFoundException('チャットルームが見つかりません');
    }

    const isUser = room.userId === userId;
    const isCounselor = room.counselor.userId === userId;

    if (!isUser && !isCounselor) {
      throw new ForbiddenException('アクセス権限がありません');
    }

    // Mark messages as read
    await this.prisma.chatMessage.updateMany({
      where: {
        roomId,
        senderId: { not: userId },
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    // Reset unread count
    await this.prisma.chatRoom.update({
      where: { id: roomId },
      data: isUser
        ? { unreadCountUser: 0 }
        : { unreadCountCounselor: 0 },
    });
  }

  async closeRoom(roomId: string, userId: string) {
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: { counselor: true },
    });

    if (!room) {
      throw new NotFoundException('チャットルームが見つかりません');
    }

    if (room.userId !== userId && room.counselor.userId !== userId) {
      throw new ForbiddenException('アクセス権限がありません');
    }

    return this.prisma.chatRoom.update({
      where: { id: roomId },
      data: { status: ChatRoomStatus.CLOSED },
    });
  }
}

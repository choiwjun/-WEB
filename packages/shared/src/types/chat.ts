/**
 * チャット関連の型定義
 */

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  SYSTEM = 'system',
}

export enum ChatRoomStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
  ARCHIVED = 'archived',
}

export interface ChatRoom {
  id: string;
  userId: string;
  counselorId: string;
  status: ChatRoomStatus;
  lastMessageAt?: Date;
  lastMessagePreview?: string;
  unreadCountUser: number;
  unreadCountCounselor: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderType: 'user' | 'counselor' | 'system';
  messageType: MessageType;
  content: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

export interface SendMessageRequest {
  roomId: string;
  messageType: MessageType;
  content: string;
  file?: File;
}

export interface ChatRoomWithDetails extends ChatRoom {
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  counselor: {
    id: string;
    name: string;
    avatar?: string;
    specialties: string[];
  };
  messages: ChatMessage[];
}

export interface Counselor {
  id: string;
  userId: string;
  displayName: string;
  bio: string;
  specialties: string[];
  qualifications: string[];
  avatar?: string;
  isAvailable: boolean;
  rating: number;
  totalConsultations: number;
  createdAt: Date;
}

export interface CounselorSchedule {
  id: string;
  counselorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

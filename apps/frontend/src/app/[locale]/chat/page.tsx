'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import {
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
  Search,
  Plus,
  Star,
  Clock,
  CheckCircle,
  User,
  MessageCircle,
  ChevronLeft,
  Image,
  FileText,
  Mic,
  ArrowLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Counselor {
  id: string;
  name: string;
  avatar?: string;
  specialty: string[];
  status: 'online' | 'busy' | 'offline';
  rating: number;
  responseTime: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  fileName?: string;
  fileSize?: string;
}

interface ChatRoom {
  id: string;
  counselor: Counselor;
  messages: Message[];
  createdAt: string;
  status: 'active' | 'ended';
}

const statusColors = {
  online: 'bg-green-500',
  busy: 'bg-yellow-500',
  offline: 'bg-gray-400',
};

const statusLabels = {
  online: 'オンライン',
  busy: '対応中',
  offline: 'オフライン',
};

export default function ChatPage() {
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(true);
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCounselorList, setShowCounselorList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatRoom?.messages]);

  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockCounselors: Counselor[] = [
        {
          id: 'COUN001',
          name: '田中美咲',
          specialty: ['メンタルヘルス', 'ストレス管理'],
          status: 'online',
          rating: 4.9,
          responseTime: '約5分',
          lastMessage: 'お気軽にご相談ください。',
          lastMessageTime: '14:30',
          unreadCount: 2,
        },
        {
          id: 'COUN002',
          name: '鈴木健太',
          specialty: ['キャリア相談', '職場の悩み'],
          status: 'online',
          rating: 4.8,
          responseTime: '約10分',
          lastMessage: '前回の続きからお話しましょう。',
          lastMessageTime: '昨日',
          unreadCount: 0,
        },
        {
          id: 'COUN003',
          name: '佐藤恵子',
          specialty: ['人間関係', '家族問題'],
          status: 'busy',
          rating: 4.9,
          responseTime: '約15分',
          lastMessage: '',
          lastMessageTime: '',
          unreadCount: 0,
        },
        {
          id: 'COUN004',
          name: '山本隆',
          specialty: ['うつ・不安', '自己啓発'],
          status: 'offline',
          rating: 4.7,
          responseTime: '約20分',
          lastMessage: 'また何かあればいつでもどうぞ。',
          lastMessageTime: '3日前',
          unreadCount: 0,
        },
        {
          id: 'COUN005',
          name: '伊藤麻衣',
          specialty: ['恋愛相談', '人間関係'],
          status: 'online',
          rating: 4.8,
          responseTime: '約8分',
          lastMessage: '',
          lastMessageTime: '',
          unreadCount: 0,
        },
        {
          id: 'COUN006',
          name: '김지현',
          specialty: ['커리어 상담', '스트레스 관리'],
          status: 'online',
          rating: 4.9,
          responseTime: '약 5분',
          lastMessage: '편하게 상담해 주세요.',
          lastMessageTime: '10:20',
          unreadCount: 1,
        },
        {
          id: 'COUN007',
          name: '박민수',
          specialty: ['인간관계', '가족 문제'],
          status: 'busy',
          rating: 4.7,
          responseTime: '약 15분',
          lastMessage: '',
          lastMessageTime: '',
          unreadCount: 0,
        },
      ];

      setCounselors(mockCounselors);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleSelectCounselor = (counselor: Counselor) => {
    setSelectedCounselor(counselor);
    setShowCounselorList(false);

    // Load mock chat room
    const mockChatRoom: ChatRoom = {
      id: `CHAT-${counselor.id}`,
      counselor,
      messages: [
        {
          id: 'MSG001',
          senderId: 'system',
          content: `${counselor.name}さんとのチャットが開始されました。`,
          type: 'system',
          timestamp: '2024-03-20 14:00',
          status: 'read',
        },
        {
          id: 'MSG002',
          senderId: counselor.id,
          content: `こんにちは。${counselor.name}です。本日はどのようなご相談でしょうか？お気軽にお話しください。`,
          type: 'text',
          timestamp: '2024-03-20 14:01',
          status: 'read',
        },
        {
          id: 'MSG003',
          senderId: 'user',
          content: 'こんにちは。最近、仕事のストレスが溜まっていて、どうしたらいいか分からなくて...',
          type: 'text',
          timestamp: '2024-03-20 14:05',
          status: 'read',
        },
        {
          id: 'MSG004',
          senderId: counselor.id,
          content: 'そうでしたか。お仕事のストレス、大変ですよね。具体的にはどのようなことがストレスになっていますか？',
          type: 'text',
          timestamp: '2024-03-20 14:07',
          status: 'read',
        },
        {
          id: 'MSG005',
          senderId: 'user',
          content: '上司との関係がうまくいっていなくて、毎日プレッシャーを感じています。',
          type: 'text',
          timestamp: '2024-03-20 14:10',
          status: 'read',
        },
        {
          id: 'MSG006',
          senderId: counselor.id,
          content: 'なるほど、上司との関係性でお悩みなのですね。それは本当に辛い状況だと思います。少しお話を聞かせていただいてもよろしいでしょうか？',
          type: 'text',
          timestamp: '2024-03-20 14:12',
          status: 'read',
        },
        {
          id: 'MSG007',
          senderId: counselor.id,
          content: '例えば、上司とのやり取りで特に辛いと感じる場面はありますか？',
          type: 'text',
          timestamp: '2024-03-20 14:13',
          status: 'read',
        },
      ],
      createdAt: '2024-03-20 14:00',
      status: 'active',
    };

    setChatRoom(mockChatRoom);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !chatRoom) return;

    const newMessage: Message = {
      id: `MSG${Date.now()}`,
      senderId: 'user',
      content: messageInput,
      type: 'text',
      timestamp: new Date().toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'sending',
    };

    setChatRoom({
      ...chatRoom,
      messages: [...chatRoom.messages, newMessage],
    });
    setMessageInput('');

    // Simulate message sent
    setTimeout(() => {
      setChatRoom((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          messages: prev.messages.map((msg) =>
            msg.id === newMessage.id ? { ...msg, status: 'sent' as const } : msg
          ),
        };
      });
    }, 500);

    // Simulate counselor response
    setTimeout(() => {
      setChatRoom((prev) => {
        if (!prev) return null;
        const counselorResponse: Message = {
          id: `MSG${Date.now()}`,
          senderId: prev.counselor.id,
          content: 'ありがとうございます。お気持ちをお聞かせいただいて、とても嬉しいです。一緒に解決策を考えていきましょう。',
          type: 'text',
          timestamp: new Date().toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }),
          status: 'read',
        };
        return {
          ...prev,
          messages: [...prev.messages, counselorResponse],
        };
      });
    }, 2000);
  };

  const filteredCounselors = counselors.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.specialty.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex h-[calc(100vh-80px)]">
          {/* Counselor List - Mobile Toggle */}
          <AnimatePresence>
            {(showCounselorList || !selectedCounselor) && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                className={cn(
                  'w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col',
                  selectedCounselor && 'hidden md:flex'
                )}
              >
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                  <h1 className="text-xl font-bold text-gray-900 mb-4">チャット相談</h1>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="カウンセラーを検索..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Counselor List */}
                <div className="flex-1 overflow-y-auto">
                  {filteredCounselors.map((counselor) => (
                    <motion.div
                      key={counselor.id}
                      whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                      onClick={() => handleSelectCounselor(counselor)}
                      className={cn(
                        'p-4 border-b border-gray-100 cursor-pointer',
                        selectedCounselor?.id === counselor.id && 'bg-primary-50'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-medium">
                            {counselor.name.charAt(0)}
                          </div>
                          <div
                            className={cn(
                              'absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white',
                              statusColors[counselor.status]
                            )}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900 truncate">{counselor.name}</h3>
                            {counselor.lastMessageTime && (
                              <span className="text-xs text-gray-500">{counselor.lastMessageTime}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs text-gray-600">{counselor.rating}</span>
                            <span className="text-xs text-gray-400 mx-1">·</span>
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{counselor.responseTime}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {counselor.specialty.slice(0, 2).map((s) => (
                              <span
                                key={s}
                                className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                          {counselor.lastMessage && (
                            <p className="text-sm text-gray-500 truncate mt-1">{counselor.lastMessage}</p>
                          )}
                        </div>
                        {counselor.unreadCount ? (
                          <div className="w-5 h-5 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center">
                            {counselor.unreadCount}
                          </div>
                        ) : null}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* New Chat Button */}
                <div className="p-4 border-t border-gray-200">
                  <Button className="w-full" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    新しいカウンセラーを探す
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-white">
            {selectedCounselor && chatRoom ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowCounselorList(true)}
                      className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-medium">
                        {selectedCounselor.name.charAt(0)}
                      </div>
                      <div
                        className={cn(
                          'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white',
                          statusColors[selectedCounselor.status]
                        )}
                      />
                    </div>
                    <div>
                      <h2 className="font-medium text-gray-900">{selectedCounselor.name}</h2>
                      <span className="text-xs text-gray-500">{statusLabels[selectedCounselor.status]}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Phone className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Video className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {chatRoom.messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex',
                        message.senderId === 'user' ? 'justify-end' : 'justify-start',
                        message.type === 'system' && 'justify-center'
                      )}
                    >
                      {message.type === 'system' ? (
                        <div className="text-xs text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                          {message.content}
                        </div>
                      ) : (
                        <div
                          className={cn(
                            'max-w-[70%] rounded-2xl px-4 py-2',
                            message.senderId === 'user'
                              ? 'bg-primary-600 text-white rounded-br-sm'
                              : 'bg-white text-gray-900 rounded-bl-sm shadow-sm'
                          )}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <div
                            className={cn(
                              'flex items-center justify-end gap-1 mt-1',
                              message.senderId === 'user' ? 'text-primary-200' : 'text-gray-400'
                            )}
                          >
                            <span className="text-xs">
                              {message.timestamp.split(' ')[1]}
                            </span>
                            {message.senderId === 'user' && (
                              <CheckCircle
                                className={cn(
                                  'w-3 h-3',
                                  message.status === 'read' && 'text-blue-400'
                                )}
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Paperclip className="w-5 h-5 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Image className="w-5 h-5 text-gray-500" />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="メッセージを入力..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="w-full px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Smile className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className={cn(
                        'p-2 rounded-lg transition-colors',
                        messageInput.trim()
                          ? 'bg-primary-600 text-white hover:bg-primary-700'
                          : 'bg-gray-100 text-gray-400'
                      )}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mb-6">
                  <MessageCircle className="w-12 h-12 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">チャット相談を始めましょう</h2>
                <p className="text-gray-600 mb-6 max-w-md">
                  左側のリストからカウンセラーを選択して、相談を始めてください。
                  専門家があなたのお悩みに寄り添います。
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <Clock className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                    <p className="font-medium text-gray-900">24時間対応</p>
                    <p className="text-gray-500 text-xs mt-1">いつでも相談可能</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <User className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                    <p className="font-medium text-gray-900">専門カウンセラー</p>
                    <p className="text-gray-500 text-xs mt-1">資格を持つ専門家</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

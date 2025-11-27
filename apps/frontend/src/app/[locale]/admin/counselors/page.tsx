'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import {
  Search,
  Plus,
  Star,
  MessageCircle,
  Clock,
  Users,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Calendar,
  Award,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Counselor {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  specialties: string[];
  status: 'active' | 'inactive' | 'vacation';
  rating: number;
  totalSessions: number;
  activeChatRooms: number;
  responseTime: string; // average response time
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  joinedAt: string;
  lastActiveAt: string;
}

const statusConfig: Record<Counselor['status'], { label: string; color: string }> = {
  active: { label: 'オンライン', color: 'bg-green-100 text-green-700' },
  inactive: { label: 'オフライン', color: 'bg-gray-100 text-gray-700' },
  vacation: { label: '休暇中', color: 'bg-yellow-100 text-yellow-700' },
};

const specialtyColors: Record<string, string> = {
  'メンタルヘルス': 'bg-purple-100 text-purple-700',
  'キャリア相談': 'bg-blue-100 text-blue-700',
  '人間関係': 'bg-pink-100 text-pink-700',
  'ストレス管理': 'bg-orange-100 text-orange-700',
  '自己啓発': 'bg-green-100 text-green-700',
  '家族問題': 'bg-teal-100 text-teal-700',
};

export default function CounselorsManagementPage() {
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(true);
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const loadCounselors = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockCounselors: Counselor[] = [
        {
          id: 'CNS001',
          name: '山本カウンセラー',
          email: 'yamamoto@example.com',
          specialties: ['メンタルヘルス', 'ストレス管理'],
          status: 'active',
          rating: 4.8,
          totalSessions: 523,
          activeChatRooms: 5,
          responseTime: '15分',
          availability: {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: false,
            sunday: false,
          },
          joinedAt: '2023-06-15',
          lastActiveAt: '2024-03-20 15:30',
        },
        {
          id: 'CNS002',
          name: '佐々木カウンセラー',
          email: 'sasaki@example.com',
          specialties: ['キャリア相談', '自己啓発'],
          status: 'active',
          rating: 4.9,
          totalSessions: 412,
          activeChatRooms: 3,
          responseTime: '10分',
          availability: {
            monday: true,
            tuesday: true,
            wednesday: false,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: false,
          },
          joinedAt: '2023-08-20',
          lastActiveAt: '2024-03-20 14:45',
        },
        {
          id: 'CNS003',
          name: '中村カウンセラー',
          email: 'nakamura@example.com',
          specialties: ['人間関係', '家族問題'],
          status: 'vacation',
          rating: 4.7,
          totalSessions: 287,
          activeChatRooms: 0,
          responseTime: '20分',
          availability: {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: false,
            saturday: false,
            sunday: false,
          },
          joinedAt: '2023-10-01',
          lastActiveAt: '2024-03-15 12:00',
        },
        {
          id: 'CNS004',
          name: '小林カウンセラー',
          email: 'kobayashi@example.com',
          specialties: ['メンタルヘルス', '人間関係', 'ストレス管理'],
          status: 'inactive',
          rating: 4.6,
          totalSessions: 156,
          activeChatRooms: 0,
          responseTime: '25分',
          availability: {
            monday: false,
            tuesday: false,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: true,
          },
          joinedAt: '2024-01-10',
          lastActiveAt: '2024-03-18 18:00',
        },
        {
          id: 'CNS005',
          name: '加藤カウンセラー',
          email: 'kato@example.com',
          specialties: ['キャリア相談', 'メンタルヘルス'],
          status: 'active',
          rating: 4.5,
          totalSessions: 98,
          activeChatRooms: 2,
          responseTime: '30分',
          availability: {
            monday: true,
            tuesday: false,
            wednesday: true,
            thursday: false,
            friday: true,
            saturday: false,
            sunday: false,
          },
          joinedAt: '2024-02-01',
          lastActiveAt: '2024-03-20 16:15',
        },
      ];

      setCounselors(mockCounselors);
      setIsLoading(false);
    };

    loadCounselors();
  }, []);

  const allSpecialties = Array.from(
    new Set(counselors.flatMap((c) => c.specialties))
  );

  const filteredCounselors = counselors.filter((counselor) => {
    const matchesSearch =
      counselor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      counselor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || counselor.status === statusFilter;
    const matchesSpecialty =
      specialtyFilter === 'all' || counselor.specialties.includes(specialtyFilter);
    return matchesSearch && matchesStatus && matchesSpecialty;
  });

  const totalPages = Math.ceil(filteredCounselors.length / itemsPerPage);
  const paginatedCounselors = filteredCounselors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: counselors.length,
    active: counselors.filter((c) => c.status === 'active').length,
    totalSessions: counselors.reduce((acc, c) => acc + c.totalSessions, 0),
    avgRating: (counselors.reduce((acc, c) => acc + c.rating, 0) / counselors.length).toFixed(1),
  };

  const renderAvailability = (availability: Counselor['availability']) => {
    const days = [
      { key: 'monday', label: '月' },
      { key: 'tuesday', label: '火' },
      { key: 'wednesday', label: '水' },
      { key: 'thursday', label: '木' },
      { key: 'friday', label: '金' },
      { key: 'saturday', label: '土' },
      { key: 'sunday', label: '日' },
    ];

    return (
      <div className="flex gap-1">
        {days.map((day) => (
          <div
            key={day.key}
            className={cn(
              'w-6 h-6 rounded text-xs flex items-center justify-center font-medium',
              availability[day.key as keyof typeof availability]
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-400'
            )}
          >
            {day.label}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">相談員管理</h1>
          <p className="text-gray-500 mt-1">相談員のプロフィールと稼働状況の管理</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>新規相談員登録</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-500">総相談員数</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-sm text-gray-500">オンライン</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalSessions.toLocaleString()}</p>
                <p className="text-sm text-gray-500">総セッション数</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.avgRating}</p>
                <p className="text-sm text-gray-500">平均評価</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="名前またはメールで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-navy/20 focus:border-deep-navy"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-navy/20 focus:border-deep-navy"
            >
              <option value="all">すべてのステータス</option>
              <option value="active">オンライン</option>
              <option value="inactive">オフライン</option>
              <option value="vacation">休暇中</option>
            </select>
            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-navy/20 focus:border-deep-navy"
            >
              <option value="all">すべての専門分野</option>
              {allSpecialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Counselors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-48 bg-gray-100 rounded" />
              </CardContent>
            </Card>
          ))
        ) : paginatedCounselors.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            相談員が見つかりませんでした
          </div>
        ) : (
          paginatedCounselors.map((counselor, index) => (
            <motion.div
              key={counselor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={cn(counselor.status !== 'active' && 'opacity-75')}>
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-deep-navy rounded-full flex items-center justify-center text-white font-bold text-lg relative">
                        {counselor.name.charAt(0)}
                        <div
                          className={cn(
                            'absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white',
                            counselor.status === 'active'
                              ? 'bg-green-500'
                              : counselor.status === 'vacation'
                              ? 'bg-yellow-500'
                              : 'bg-gray-400'
                          )}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{counselor.name}</h3>
                        <p className="text-sm text-gray-500">{counselor.email}</p>
                      </div>
                    </div>
                    <Badge className={statusConfig[counselor.status].color}>
                      {statusConfig[counselor.status].label}
                    </Badge>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {counselor.specialties.map((specialty) => (
                      <Badge
                        key={specialty}
                        className={cn('text-xs', specialtyColors[specialty] || 'bg-gray-100 text-gray-700')}
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-semibold">{counselor.rating}</span>
                      </div>
                      <p className="text-xs text-gray-500">評価</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-gray-900">{counselor.totalSessions}</p>
                      <p className="text-xs text-gray-500">セッション</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-gray-900">{counselor.activeChatRooms}</p>
                      <p className="text-xs text-gray-500">進行中</p>
                    </div>
                  </div>

                  {/* Response Time */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Clock className="w-4 h-4" />
                    <span>平均応答時間: {counselor.responseTime}</span>
                  </div>

                  {/* Availability */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">勤務可能日</p>
                    {renderAvailability(counselor.availability)}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400">登録日: {counselor.joinedAt}</span>
                    <div className="flex items-center gap-1">
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="詳細">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="編集">
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="スケジュール">
                        <Calendar className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="削除">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={cn(
                'w-8 h-8 rounded-lg text-sm',
                currentPage === i + 1 ? 'bg-deep-navy text-white' : 'hover:bg-gray-100'
              )}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

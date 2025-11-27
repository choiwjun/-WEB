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
  Phone,
  Mail,
  TrendingUp,
  BarChart3,
  ThumbsUp,
  Shield,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface CounselorStats {
  totalSessions: number;
  completedSessions: number;
  avgSessionDuration: number; // minutes
  satisfactionRate: number; // percentage
  repeatRate: number; // percentage
  monthlyEarnings: number;
}

interface Counselor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio: string;
  specialties: string[];
  certifications: string[];
  status: 'active' | 'inactive' | 'vacation' | 'pending';
  verificationStatus: 'verified' | 'pending' | 'rejected';
  rating: number;
  totalReviews: number;
  stats: CounselorStats;
  activeChatRooms: number;
  waitingClients: number;
  responseTime: string;
  availability: {
    monday: { available: boolean; hours?: string };
    tuesday: { available: boolean; hours?: string };
    wednesday: { available: boolean; hours?: string };
    thursday: { available: boolean; hours?: string };
    friday: { available: boolean; hours?: string };
    saturday: { available: boolean; hours?: string };
    sunday: { available: boolean; hours?: string };
  };
  hourlyRate: number;
  languages: string[];
  joinedAt: string;
  lastActiveAt: string;
}

const statusConfig: Record<Counselor['status'], { label: string; color: string }> = {
  active: { label: 'オンライン', color: 'bg-green-100 text-green-700' },
  inactive: { label: 'オフライン', color: 'bg-gray-100 text-gray-700' },
  vacation: { label: '休暇中', color: 'bg-yellow-100 text-yellow-700' },
  pending: { label: '承認待ち', color: 'bg-orange-100 text-orange-700' },
};

const verificationConfig: Record<Counselor['verificationStatus'], { label: string; color: string; icon: React.ReactNode }> = {
  verified: { label: '認証済み', color: 'text-green-600', icon: <CheckCircle className="w-4 h-4" /> },
  pending: { label: '審査中', color: 'text-yellow-600', icon: <Clock className="w-4 h-4" /> },
  rejected: { label: '却下', color: 'text-red-600', icon: <XCircle className="w-4 h-4" /> },
};

const specialtyColors: Record<string, string> = {
  'メンタルヘルス': 'bg-purple-100 text-purple-700',
  'キャリア相談': 'bg-blue-100 text-blue-700',
  '人間関係': 'bg-pink-100 text-pink-700',
  'ストレス管理': 'bg-orange-100 text-orange-700',
  '自己啓発': 'bg-green-100 text-green-700',
  '家族問題': 'bg-teal-100 text-teal-700',
  '恋愛相談': 'bg-rose-100 text-rose-700',
  '職場の悩み': 'bg-indigo-100 text-indigo-700',
  'うつ・不安': 'bg-violet-100 text-violet-700',
  '子育て': 'bg-amber-100 text-amber-700',
};

export default function CounselorsManagementPage() {
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(true);
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const loadCounselors = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockCounselors: Counselor[] = [
        {
          id: 'CNS001',
          name: '山本 美咲',
          email: 'yamamoto@counselor.com',
          phone: '090-1234-5678',
          bio: '臨床心理士として10年以上の経験があります。特にメンタルヘルスとストレス管理を専門としています。',
          specialties: ['メンタルヘルス', 'ストレス管理', 'うつ・不安'],
          certifications: ['臨床心理士', '公認心理師', 'メンタルヘルスマネジメント検定I種'],
          status: 'active',
          verificationStatus: 'verified',
          rating: 4.9,
          totalReviews: 234,
          stats: {
            totalSessions: 1523,
            completedSessions: 1498,
            avgSessionDuration: 48,
            satisfactionRate: 98.2,
            repeatRate: 72.5,
            monthlyEarnings: 456000,
          },
          activeChatRooms: 5,
          waitingClients: 3,
          responseTime: '2分',
          availability: {
            monday: { available: true, hours: '9:00-18:00' },
            tuesday: { available: true, hours: '9:00-18:00' },
            wednesday: { available: true, hours: '9:00-18:00' },
            thursday: { available: true, hours: '9:00-18:00' },
            friday: { available: true, hours: '9:00-18:00' },
            saturday: { available: false },
            sunday: { available: false },
          },
          hourlyRate: 5000,
          languages: ['日本語', '英語'],
          joinedAt: '2021-06-15',
          lastActiveAt: '2024-03-20 16:45',
        },
        {
          id: 'CNS002',
          name: '佐々木 健太',
          email: 'sasaki@counselor.com',
          phone: '080-9876-5432',
          bio: 'キャリアコンサルタントとして、転職・キャリアチェンジの相談を得意としています。',
          specialties: ['キャリア相談', '職場の悩み', '自己啓発'],
          certifications: ['キャリアコンサルタント', '産業カウンセラー'],
          status: 'active',
          verificationStatus: 'verified',
          rating: 4.8,
          totalReviews: 187,
          stats: {
            totalSessions: 987,
            completedSessions: 965,
            avgSessionDuration: 52,
            satisfactionRate: 96.8,
            repeatRate: 65.3,
            monthlyEarnings: 325000,
          },
          activeChatRooms: 3,
          waitingClients: 1,
          responseTime: '5分',
          availability: {
            monday: { available: true, hours: '10:00-19:00' },
            tuesday: { available: true, hours: '10:00-19:00' },
            wednesday: { available: false },
            thursday: { available: true, hours: '10:00-19:00' },
            friday: { available: true, hours: '10:00-19:00' },
            saturday: { available: true, hours: '10:00-15:00' },
            sunday: { available: false },
          },
          hourlyRate: 4500,
          languages: ['日本語'],
          joinedAt: '2022-03-20',
          lastActiveAt: '2024-03-20 15:30',
        },
        {
          id: 'CNS003',
          name: '中村 理恵',
          email: 'nakamura@counselor.com',
          bio: '家族療法と子育て相談を専門としています。10年以上の実績があります。',
          specialties: ['家族問題', '子育て', '人間関係'],
          certifications: ['家族療法士', '保育士', '社会福祉士'],
          status: 'vacation',
          verificationStatus: 'verified',
          rating: 4.7,
          totalReviews: 156,
          stats: {
            totalSessions: 756,
            completedSessions: 743,
            avgSessionDuration: 55,
            satisfactionRate: 95.4,
            repeatRate: 68.9,
            monthlyEarnings: 0,
          },
          activeChatRooms: 0,
          waitingClients: 0,
          responseTime: '-',
          availability: {
            monday: { available: true, hours: '9:00-17:00' },
            tuesday: { available: true, hours: '9:00-17:00' },
            wednesday: { available: true, hours: '9:00-17:00' },
            thursday: { available: true, hours: '9:00-17:00' },
            friday: { available: false },
            saturday: { available: false },
            sunday: { available: false },
          },
          hourlyRate: 4000,
          languages: ['日本語'],
          joinedAt: '2022-08-10',
          lastActiveAt: '2024-03-15 12:00',
        },
        {
          id: 'CNS004',
          name: '小林 誠',
          email: 'kobayashi@counselor.com',
          phone: '070-1111-2222',
          bio: '恋愛・婚活相談のスペシャリスト。1000組以上のカップルをサポートしてきました。',
          specialties: ['恋愛相談', '人間関係'],
          certifications: ['心理カウンセラー', '婚活アドバイザー'],
          status: 'inactive',
          verificationStatus: 'verified',
          rating: 4.6,
          totalReviews: 312,
          stats: {
            totalSessions: 1234,
            completedSessions: 1198,
            avgSessionDuration: 42,
            satisfactionRate: 94.2,
            repeatRate: 58.7,
            monthlyEarnings: 0,
          },
          activeChatRooms: 0,
          waitingClients: 0,
          responseTime: '-',
          availability: {
            monday: { available: false },
            tuesday: { available: false },
            wednesday: { available: true, hours: '18:00-22:00' },
            thursday: { available: true, hours: '18:00-22:00' },
            friday: { available: true, hours: '18:00-22:00' },
            saturday: { available: true, hours: '10:00-20:00' },
            sunday: { available: true, hours: '10:00-20:00' },
          },
          hourlyRate: 3500,
          languages: ['日本語'],
          joinedAt: '2021-11-05',
          lastActiveAt: '2024-03-18 22:30',
        },
        {
          id: 'CNS005',
          name: '加藤 由美',
          email: 'kato@counselor.com',
          bio: '企業向けメンタルヘルスコンサルティングの経験が豊富です。',
          specialties: ['メンタルヘルス', '職場の悩み', 'ストレス管理'],
          certifications: ['公認心理師', 'EAP専門家', '産業カウンセラー'],
          status: 'active',
          verificationStatus: 'verified',
          rating: 4.5,
          totalReviews: 98,
          stats: {
            totalSessions: 456,
            completedSessions: 448,
            avgSessionDuration: 45,
            satisfactionRate: 93.5,
            repeatRate: 62.1,
            monthlyEarnings: 178000,
          },
          activeChatRooms: 2,
          waitingClients: 0,
          responseTime: '8分',
          availability: {
            monday: { available: true, hours: '9:00-18:00' },
            tuesday: { available: false },
            wednesday: { available: true, hours: '9:00-18:00' },
            thursday: { available: false },
            friday: { available: true, hours: '9:00-18:00' },
            saturday: { available: false },
            sunday: { available: false },
          },
          hourlyRate: 5500,
          languages: ['日本語', '英語'],
          joinedAt: '2023-02-01',
          lastActiveAt: '2024-03-20 17:15',
        },
        {
          id: 'CNS006',
          name: '田中 翔太',
          email: 'tanaka.shota@counselor.com',
          bio: '若者向けのキャリアカウンセリングを専門としています。',
          specialties: ['キャリア相談', '自己啓発'],
          certifications: ['キャリアコンサルタント'],
          status: 'pending',
          verificationStatus: 'pending',
          rating: 0,
          totalReviews: 0,
          stats: {
            totalSessions: 0,
            completedSessions: 0,
            avgSessionDuration: 0,
            satisfactionRate: 0,
            repeatRate: 0,
            monthlyEarnings: 0,
          },
          activeChatRooms: 0,
          waitingClients: 0,
          responseTime: '-',
          availability: {
            monday: { available: true, hours: '10:00-20:00' },
            tuesday: { available: true, hours: '10:00-20:00' },
            wednesday: { available: true, hours: '10:00-20:00' },
            thursday: { available: true, hours: '10:00-20:00' },
            friday: { available: true, hours: '10:00-20:00' },
            saturday: { available: false },
            sunday: { available: false },
          },
          hourlyRate: 3000,
          languages: ['日本語'],
          joinedAt: '2024-03-15',
          lastActiveAt: '-',
        },
        {
          id: 'CNS007',
          name: '伊藤 さくら',
          email: 'ito.sakura@counselor.com',
          phone: '090-3333-4444',
          bio: '女性特有の悩みやライフステージの相談を得意としています。',
          specialties: ['メンタルヘルス', '人間関係', '恋愛相談', '子育て'],
          certifications: ['臨床心理士', '公認心理師', '女性相談員'],
          status: 'active',
          verificationStatus: 'verified',
          rating: 4.8,
          totalReviews: 178,
          stats: {
            totalSessions: 867,
            completedSessions: 854,
            avgSessionDuration: 50,
            satisfactionRate: 97.1,
            repeatRate: 70.2,
            monthlyEarnings: 287000,
          },
          activeChatRooms: 4,
          waitingClients: 2,
          responseTime: '3分',
          availability: {
            monday: { available: true, hours: '10:00-18:00' },
            tuesday: { available: true, hours: '10:00-18:00' },
            wednesday: { available: true, hours: '10:00-18:00' },
            thursday: { available: true, hours: '10:00-18:00' },
            friday: { available: true, hours: '10:00-18:00' },
            saturday: { available: true, hours: '10:00-14:00' },
            sunday: { available: false },
          },
          hourlyRate: 4500,
          languages: ['日本語', '韓国語'],
          joinedAt: '2022-05-20',
          lastActiveAt: '2024-03-20 18:00',
        },
        {
          id: 'CNS008',
          name: 'Michael Chen',
          email: 'michael.chen@counselor.com',
          bio: 'バイリンガルカウンセラーとして、海外駐在員や国際的なキャリアの相談を専門としています。',
          specialties: ['キャリア相談', 'ストレス管理', '職場の悩み'],
          certifications: ['Licensed Professional Counselor (LPC)', 'Global Career Counselor'],
          status: 'active',
          verificationStatus: 'verified',
          rating: 4.7,
          totalReviews: 89,
          stats: {
            totalSessions: 345,
            completedSessions: 338,
            avgSessionDuration: 55,
            satisfactionRate: 95.8,
            repeatRate: 64.5,
            monthlyEarnings: 234000,
          },
          activeChatRooms: 2,
          waitingClients: 1,
          responseTime: '10分',
          availability: {
            monday: { available: true, hours: '9:00-17:00' },
            tuesday: { available: true, hours: '9:00-17:00' },
            wednesday: { available: true, hours: '9:00-17:00' },
            thursday: { available: true, hours: '9:00-17:00' },
            friday: { available: true, hours: '9:00-17:00' },
            saturday: { available: false },
            sunday: { available: false },
          },
          hourlyRate: 6000,
          languages: ['日本語', '英語', '中国語'],
          joinedAt: '2023-06-01',
          lastActiveAt: '2024-03-20 14:30',
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
    const matchesVerification = 
      verificationFilter === 'all' || counselor.verificationStatus === verificationFilter;
    return matchesSearch && matchesStatus && matchesSpecialty && matchesVerification;
  });

  const totalPages = Math.ceil(filteredCounselors.length / itemsPerPage);
  const paginatedCounselors = filteredCounselors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: counselors.length,
    active: counselors.filter((c) => c.status === 'active').length,
    pending: counselors.filter((c) => c.verificationStatus === 'pending').length,
    totalSessions: counselors.reduce((acc, c) => acc + c.stats.totalSessions, 0),
    avgRating: (counselors.filter((c) => c.rating > 0).reduce((acc, c) => acc + c.rating, 0) / counselors.filter((c) => c.rating > 0).length).toFixed(1),
    totalEarnings: counselors.reduce((acc, c) => acc + c.stats.monthlyEarnings, 0),
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
        {days.map((day) => {
          const dayAvail = availability[day.key as keyof typeof availability];
          return (
            <div
              key={day.key}
              className={cn(
                'w-6 h-6 rounded text-xs flex items-center justify-center font-medium',
                dayAvail.available
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-400'
              )}
              title={dayAvail.hours || '休み'}
            >
              {day.label}
            </div>
          );
        })}
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-gray-500">総相談員</p>
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
                <p className="text-xs text-gray-500">オンライン</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-gray-500">承認待ち</p>
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
                <p className="text-xs text-gray-500">総セッション</p>
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
                <p className="text-xs text-gray-500">平均評価</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">¥{(stats.totalEarnings / 1000).toFixed(0)}k</p>
                <p className="text-xs text-gray-500">月間収益</p>
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
              <option value="pending">承認待ち</option>
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
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-navy/20 focus:border-deep-navy"
            >
              <option value="all">すべての認証状態</option>
              <option value="verified">認証済み</option>
              <option value="pending">審査中</option>
              <option value="rejected">却下</option>
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
                <div className="h-64 bg-gray-100 rounded" />
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
                              : counselor.status === 'pending'
                              ? 'bg-orange-500'
                              : 'bg-gray-400'
                          )}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{counselor.name}</h3>
                          <div className={cn('flex items-center gap-0.5', verificationConfig[counselor.verificationStatus].color)}>
                            {verificationConfig[counselor.verificationStatus].icon}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">{counselor.email}</p>
                        <p className="text-xs text-gray-400">{counselor.id}</p>
                      </div>
                    </div>
                    <Badge className={statusConfig[counselor.status].color}>
                      {statusConfig[counselor.status].label}
                    </Badge>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{counselor.bio}</p>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {counselor.specialties.map((specialty) => (
                      <Badge
                        key={specialty}
                        className={cn('text-xs', specialtyColors[specialty] || 'bg-gray-100 text-gray-700')}
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  {/* Languages */}
                  <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                    <span>対応言語:</span>
                    {counselor.languages.map((lang, i) => (
                      <span key={lang}>
                        {lang}{i < counselor.languages.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="font-semibold text-sm">{counselor.rating || '-'}</span>
                      </div>
                      <p className="text-xs text-gray-500">{counselor.totalReviews}件</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-sm text-gray-900">{counselor.stats.completedSessions}</p>
                      <p className="text-xs text-gray-500">セッション</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-sm text-gray-900">{counselor.stats.satisfactionRate || '-'}%</p>
                      <p className="text-xs text-gray-500">満足度</p>
                    </div>
                  </div>

                  {/* Current Status */}
                  {counselor.status === 'active' && (
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg mb-4 text-sm">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3 text-blue-600" />
                          対応中: {counselor.activeChatRooms}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-blue-600" />
                          待機: {counselor.waitingClients}
                        </span>
                      </div>
                      <span className="text-xs text-blue-600">応答 {counselor.responseTime}</span>
                    </div>
                  )}

                  {/* Rate & Availability */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm">
                      <span className="text-gray-500">時給: </span>
                      <span className="font-semibold">¥{counselor.hourlyRate.toLocaleString()}</span>
                    </div>
                    {renderAvailability(counselor.availability)}
                  </div>

                  {/* Certifications */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">保有資格</p>
                    <div className="flex flex-wrap gap-1">
                      {counselor.certifications.slice(0, 2).map((cert) => (
                        <span key={cert} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                          {cert}
                        </span>
                      ))}
                      {counselor.certifications.length > 2 && (
                        <span className="text-xs text-gray-400">+{counselor.certifications.length - 2}</span>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400">登録: {counselor.joinedAt}</span>
                    <div className="flex items-center gap-1">
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="詳細">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="編集">
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="統計">
                        <BarChart3 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="スケジュール">
                        <Calendar className="w-4 h-4 text-gray-600" />
                      </button>
                      {counselor.verificationStatus === 'pending' && (
                        <button className="p-2 hover:bg-gray-100 rounded-lg" title="承認">
                          <Shield className="w-4 h-4 text-green-600" />
                        </button>
                      )}
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

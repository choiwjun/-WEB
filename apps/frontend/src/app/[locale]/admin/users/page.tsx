'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import {
  Search,
  Filter,
  MoreHorizontal,
  UserPlus,
  Download,
  Mail,
  Shield,
  ShieldOff,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  CreditCard,
  FileText,
  MessageCircle,
  Building2,
  Globe,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'USER' | 'COUNSELOR' | 'ADMIN' | 'SUPER_ADMIN';
  status: 'active' | 'inactive' | 'suspended';
  companyCode?: string;
  companyName?: string;
  authProvider: 'EMAIL' | 'LINE' | 'GOOGLE' | 'APPLE';
  language: 'ja' | 'ko' | 'en';
  creditBalance: number;
  totalDiagnoses: number;
  totalPayments: number;
  createdAt: string;
  lastLoginAt?: string;
  phone?: string;
  prefecture?: string;
}

export default function UsersManagementPage() {
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [providerFilter, setProviderFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  const itemsPerPage = 15;

  useEffect(() => {
    const loadUsers = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockUsers: User[] = [
        {
          id: 'USR001',
          name: '山田太郎',
          email: 'yamada.taro@example.com',
          role: 'USER',
          status: 'active',
          authProvider: 'EMAIL',
          language: 'ja',
          creditBalance: 2500,
          totalDiagnoses: 12,
          totalPayments: 15000,
          createdAt: '2024-01-15',
          lastLoginAt: '2024-03-20 14:30',
          prefecture: '東京都',
        },
        {
          id: 'USR002',
          name: '佐藤花子',
          email: 'sato.hanako@company.co.jp',
          role: 'USER',
          status: 'active',
          companyCode: 'TECHCORP',
          companyName: '株式会社テクノロジー',
          authProvider: 'GOOGLE',
          language: 'ja',
          creditBalance: 8500,
          totalDiagnoses: 28,
          totalPayments: 45000,
          createdAt: '2024-02-10',
          lastLoginAt: '2024-03-20 16:45',
          prefecture: '大阪府',
        },
        {
          id: 'USR003',
          name: '田中一郎',
          email: 'tanaka.ichiro@example.com',
          role: 'COUNSELOR',
          status: 'active',
          authProvider: 'EMAIL',
          language: 'ja',
          creditBalance: 0,
          totalDiagnoses: 0,
          totalPayments: 0,
          createdAt: '2024-01-20',
          lastLoginAt: '2024-03-20 09:15',
          phone: '090-1234-5678',
          prefecture: '神奈川県',
        },
        {
          id: 'USR004',
          name: '鈴木美咲',
          email: 'suzuki.misaki@example.com',
          role: 'USER',
          status: 'inactive',
          authProvider: 'LINE',
          language: 'ja',
          creditBalance: 500,
          totalDiagnoses: 3,
          totalPayments: 3000,
          createdAt: '2024-02-05',
          lastLoginAt: '2024-02-28 11:20',
          prefecture: '愛知県',
        },
        {
          id: 'USR005',
          name: '高橋健太',
          email: 'takahashi.kenta@admin.com',
          role: 'ADMIN',
          status: 'active',
          authProvider: 'EMAIL',
          language: 'ja',
          creditBalance: 0,
          totalDiagnoses: 5,
          totalPayments: 0,
          createdAt: '2023-12-01',
          lastLoginAt: '2024-03-20 18:00',
          phone: '080-9876-5432',
          prefecture: '東京都',
        },
        {
          id: 'USR006',
          name: '伊藤さくら',
          email: 'ito.sakura@company2.co.jp',
          role: 'USER',
          status: 'active',
          companyCode: 'INNOV',
          companyName: '株式会社イノベーション',
          authProvider: 'GOOGLE',
          language: 'ja',
          creditBalance: 12000,
          totalDiagnoses: 45,
          totalPayments: 98000,
          createdAt: '2024-03-01',
          lastLoginAt: '2024-03-20 12:30',
          prefecture: '福岡県',
        },
        {
          id: 'USR007',
          name: '渡辺大輔',
          email: 'watanabe.daisuke@example.com',
          role: 'USER',
          status: 'active',
          authProvider: 'APPLE',
          language: 'ja',
          creditBalance: 1800,
          totalDiagnoses: 8,
          totalPayments: 12000,
          createdAt: '2024-02-28',
          lastLoginAt: '2024-03-19 20:15',
          prefecture: '北海道',
        },
        {
          id: 'USR008',
          name: '小林真理',
          email: 'kobayashi.mari@example.com',
          role: 'COUNSELOR',
          status: 'inactive',
          authProvider: 'EMAIL',
          language: 'ja',
          creditBalance: 0,
          totalDiagnoses: 0,
          totalPayments: 0,
          createdAt: '2024-01-10',
          lastLoginAt: '2024-03-01 15:45',
          phone: '070-1111-2222',
          prefecture: '京都府',
        },
        {
          id: 'USR009',
          name: '김민수',
          email: 'kim.minsu@example.kr',
          role: 'USER',
          status: 'active',
          authProvider: 'GOOGLE',
          language: 'ko',
          creditBalance: 5000,
          totalDiagnoses: 15,
          totalPayments: 25000,
          createdAt: '2024-03-05',
          lastLoginAt: '2024-03-20 10:00',
        },
        {
          id: 'USR010',
          name: 'John Smith',
          email: 'john.smith@example.com',
          role: 'USER',
          status: 'active',
          authProvider: 'GOOGLE',
          language: 'en',
          creditBalance: 3500,
          totalDiagnoses: 6,
          totalPayments: 8000,
          createdAt: '2024-03-10',
          lastLoginAt: '2024-03-20 08:30',
        },
        {
          id: 'USR011',
          name: '中村優子',
          email: 'nakamura.yuko@example.com',
          role: 'USER',
          status: 'suspended',
          authProvider: 'LINE',
          language: 'ja',
          creditBalance: 0,
          totalDiagnoses: 2,
          totalPayments: 1000,
          createdAt: '2024-02-15',
          lastLoginAt: '2024-02-20 14:00',
          prefecture: '埼玉県',
        },
        {
          id: 'USR012',
          name: '加藤裕也',
          email: 'kato.yuya@company.co.jp',
          role: 'USER',
          status: 'active',
          companyCode: 'TECHCORP',
          companyName: '株式会社テクノロジー',
          authProvider: 'EMAIL',
          language: 'ja',
          creditBalance: 4200,
          totalDiagnoses: 18,
          totalPayments: 32000,
          createdAt: '2024-01-25',
          lastLoginAt: '2024-03-20 11:15',
          prefecture: '東京都',
        },
        {
          id: 'USR013',
          name: '松本彩香',
          email: 'matsumoto.ayaka@example.com',
          role: 'USER',
          status: 'active',
          authProvider: 'LINE',
          language: 'ja',
          creditBalance: 7800,
          totalDiagnoses: 32,
          totalPayments: 65000,
          createdAt: '2024-01-08',
          lastLoginAt: '2024-03-20 17:30',
          prefecture: '兵庫県',
        },
        {
          id: 'USR014',
          name: '井上大樹',
          email: 'inoue.daiki@example.com',
          role: 'USER',
          status: 'active',
          authProvider: 'EMAIL',
          language: 'ja',
          creditBalance: 950,
          totalDiagnoses: 4,
          totalPayments: 5500,
          createdAt: '2024-03-12',
          lastLoginAt: '2024-03-19 13:45',
          prefecture: '千葉県',
        },
        {
          id: 'USR015',
          name: '木村和也',
          email: 'kimura.kazuya@super.admin.com',
          role: 'SUPER_ADMIN',
          status: 'active',
          authProvider: 'EMAIL',
          language: 'ja',
          creditBalance: 0,
          totalDiagnoses: 0,
          totalPayments: 0,
          createdAt: '2023-11-01',
          lastLoginAt: '2024-03-20 19:00',
          phone: '090-0000-0001',
          prefecture: '東京都',
        },
        {
          id: 'USR016',
          name: '박지영',
          email: 'park.jiyoung@example.kr',
          role: 'USER',
          status: 'active',
          authProvider: 'APPLE',
          language: 'ko',
          creditBalance: 2200,
          totalDiagnoses: 9,
          totalPayments: 18000,
          createdAt: '2024-02-20',
          lastLoginAt: '2024-03-20 09:45',
        },
        {
          id: 'USR017',
          name: 'Emily Johnson',
          email: 'emily.johnson@example.com',
          role: 'USER',
          status: 'active',
          authProvider: 'GOOGLE',
          language: 'en',
          creditBalance: 6500,
          totalDiagnoses: 22,
          totalPayments: 42000,
          createdAt: '2024-01-30',
          lastLoginAt: '2024-03-20 07:15',
        },
        {
          id: 'USR018',
          name: '斎藤健',
          email: 'saito.ken@example.com',
          role: 'USER',
          status: 'active',
          authProvider: 'EMAIL',
          language: 'ja',
          creditBalance: 300,
          totalDiagnoses: 1,
          totalPayments: 1000,
          createdAt: '2024-03-18',
          lastLoginAt: '2024-03-20 16:00',
          prefecture: '静岡県',
        },
        {
          id: 'USR019',
          name: '山口美穂',
          email: 'yamaguchi.miho@company3.co.jp',
          role: 'USER',
          status: 'active',
          companyCode: 'SAMPLE01',
          companyName: '株式会社サンプル',
          authProvider: 'GOOGLE',
          language: 'ja',
          creditBalance: 15000,
          totalDiagnoses: 56,
          totalPayments: 125000,
          createdAt: '2023-12-15',
          lastLoginAt: '2024-03-20 14:00',
          prefecture: '大阪府',
        },
        {
          id: 'USR020',
          name: '清水拓也',
          email: 'shimizu.takuya@example.com',
          role: 'USER',
          status: 'active',
          authProvider: 'LINE',
          language: 'ja',
          creditBalance: 4100,
          totalDiagnoses: 14,
          totalPayments: 28000,
          createdAt: '2024-02-08',
          lastLoginAt: '2024-03-19 21:30',
          prefecture: '広島県',
        },
      ];

      setUsers(mockUsers);
      setIsLoading(false);
    };

    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesProvider = providerFilter === 'all' || user.authProvider === providerFilter;
    return matchesSearch && matchesRole && matchesStatus && matchesProvider;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === 'active').length,
    totalCredits: users.reduce((acc, u) => acc + u.creditBalance, 0),
    totalPayments: users.reduce((acc, u) => acc + u.totalPayments, 0),
  };

  const getRoleBadge = (role: User['role']) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Badge variant="error">スーパー管理者</Badge>;
      case 'ADMIN':
        return <Badge variant="warning">管理者</Badge>;
      case 'COUNSELOR':
        return <Badge variant="info">相談員</Badge>;
      default:
        return <Badge variant="default">ユーザー</Badge>;
    }
  };

  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">有効</Badge>;
      case 'inactive':
        return <Badge variant="default">無効</Badge>;
      case 'suspended':
        return <Badge variant="error">停止</Badge>;
    }
  };

  const getAuthProviderIcon = (provider: User['authProvider']) => {
    switch (provider) {
      case 'LINE':
        return <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded">LINE</span>;
      case 'GOOGLE':
        return <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">Google</span>;
      case 'APPLE':
        return <span className="text-xs bg-gray-800 text-white px-1.5 py-0.5 rounded">Apple</span>;
      default:
        return <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded">Email</span>;
    }
  };

  const getLanguageFlag = (lang: User['language']) => {
    switch (lang) {
      case 'ja':
        return '🇯🇵';
      case 'ko':
        return '🇰🇷';
      case 'en':
        return '🇺🇸';
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map((u) => u.id));
    }
  };

  const handleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleToggleStatus = (user: User) => {
    setUsers(
      users.map((u) =>
        u.id === user.id
          ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' as User['status'] }
          : u
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ユーザー管理</h1>
          <p className="text-gray-500 mt-1">全ユーザーの管理と権限設定</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            エクスポート
          </Button>
          <Button leftIcon={<UserPlus className="w-4 h-4" />}>新規ユーザー</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total.toLocaleString()}</p>
                <p className="text-sm text-gray-500">総ユーザー数</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.active.toLocaleString()}</p>
                <p className="text-sm text-gray-500">有効ユーザー</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalCredits.toLocaleString()}</p>
                <p className="text-sm text-gray-500">総クレジット残高</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">¥{stats.totalPayments.toLocaleString()}</p>
                <p className="text-sm text-gray-500">総購入金額</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="名前、メール、IDで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-navy/20 focus:border-deep-navy"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-navy/20 focus:border-deep-navy"
            >
              <option value="all">すべての役割</option>
              <option value="USER">ユーザー</option>
              <option value="COUNSELOR">相談員</option>
              <option value="ADMIN">管理者</option>
              <option value="SUPER_ADMIN">スーパー管理者</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-navy/20 focus:border-deep-navy"
            >
              <option value="all">すべてのステータス</option>
              <option value="active">有効</option>
              <option value="inactive">無効</option>
              <option value="suspended">停止</option>
            </select>

            {/* Auth Provider Filter */}
            <select
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-navy/20 focus:border-deep-navy"
            >
              <option value="all">すべての認証方法</option>
              <option value="EMAIL">メール</option>
              <option value="LINE">LINE</option>
              <option value="GOOGLE">Google</option>
              <option value="APPLE">Apple</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-deep-navy text-white p-4 rounded-lg flex items-center justify-between"
        >
          <span>{selectedUsers.length}件選択中</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Mail className="w-4 h-4 mr-2" />
              メール送信
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <CreditCard className="w-4 h-4 mr-2" />
              クレジット付与
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <ShieldOff className="w-4 h-4 mr-2" />
              無効化
            </Button>
          </div>
        </motion.div>
      )}

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ユーザー</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">役割</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">認証</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">企業</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ステータス</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">クレジット</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">診断数</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">最終ログイン</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  [...Array(10)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-4" colSpan={10}>
                        <div className="h-12 bg-gray-100 rounded" />
                      </td>
                    </tr>
                  ))
                ) : paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center text-gray-500">
                      ユーザーが見つかりませんでした
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-deep-navy rounded-full flex items-center justify-center text-white font-medium">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <span>{getLanguageFlag(user.language)}</span>
                            </div>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <p className="text-xs text-gray-400">{user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">{getRoleBadge(user.role)}</td>
                      <td className="px-4 py-4">{getAuthProviderIcon(user.authProvider)}</td>
                      <td className="px-4 py-4">
                        {user.companyName ? (
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.companyName}</p>
                            <p className="text-xs font-mono text-gray-500">{user.companyCode}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4">{getStatusBadge(user.status)}</td>
                      <td className="px-4 py-4 text-right">
                        <span className={cn(
                          'font-medium',
                          user.creditBalance > 5000 ? 'text-green-600' : 
                          user.creditBalance > 0 ? 'text-gray-900' : 'text-gray-400'
                        )}>
                          {user.creditBalance.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right text-gray-600">{user.totalDiagnoses}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {user.lastLoginAt || '-'}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-2 hover:bg-gray-100 rounded-lg" title="詳細">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg" title="編集">
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            title={user.status === 'active' ? '無効化' : '有効化'}
                          >
                            {user.status === 'active' ? (
                              <ShieldOff className="w-4 h-4 text-orange-600" />
                            ) : (
                              <Shield className="w-4 h-4 text-green-600" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {filteredUsers.length}件中 {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, filteredUsers.length)}件を表示
              </p>
              <div className="flex items-center gap-2">
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
                      currentPage === i + 1
                        ? 'bg-deep-navy text-white'
                        : 'hover:bg-gray-100'
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

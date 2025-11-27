'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import {
  Search,
  Plus,
  Building2,
  Users,
  CreditCard,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Settings,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Crown,
  Shield,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Company {
  id: string;
  name: string;
  code: string;
  plan: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  status: 'active' | 'inactive' | 'suspended';
  totalUsers: number;
  maxUsers: number;
  totalDiagnoses: number;
  totalCreditsUsed: number;
  adminCount: number;
  createdAt: string;
}

const planConfig: Record<Company['plan'], { label: string; color: string; icon: React.ReactNode }> = {
  FREE: { label: '無料', color: 'bg-gray-100 text-gray-700', icon: null },
  BASIC: { label: 'ベーシック', color: 'bg-blue-100 text-blue-700', icon: null },
  PREMIUM: { label: 'プレミアム', color: 'bg-purple-100 text-purple-700', icon: <Crown className="w-3 h-3" /> },
  ENTERPRISE: { label: 'エンタープライズ', color: 'bg-amber-100 text-amber-700', icon: <Shield className="w-3 h-3" /> },
};

const statusConfig: Record<Company['status'], { label: string; color: string }> = {
  active: { label: '有効', color: 'bg-green-100 text-green-700' },
  inactive: { label: '無効', color: 'bg-gray-100 text-gray-700' },
  suspended: { label: '停止中', color: 'bg-red-100 text-red-700' },
};

export default function CompaniesManagementPage() {
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadCompanies = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockCompanies: Company[] = [
        {
          id: 'COMP001',
          name: '株式会社テストコーポレーション',
          code: 'TESTCORP',
          plan: 'ENTERPRISE',
          status: 'active',
          totalUsers: 150,
          maxUsers: 200,
          totalDiagnoses: 1250,
          totalCreditsUsed: 125000,
          adminCount: 3,
          createdAt: '2024-01-01',
        },
        {
          id: 'COMP002',
          name: '株式会社サンプル',
          code: 'SAMPLE01',
          plan: 'PREMIUM',
          status: 'active',
          totalUsers: 45,
          maxUsers: 50,
          totalDiagnoses: 320,
          totalCreditsUsed: 32000,
          adminCount: 2,
          createdAt: '2024-02-15',
        },
        {
          id: 'COMP003',
          name: 'デモ株式会社',
          code: 'DEMO0001',
          plan: 'BASIC',
          status: 'active',
          totalUsers: 18,
          maxUsers: 20,
          totalDiagnoses: 89,
          totalCreditsUsed: 8900,
          adminCount: 1,
          createdAt: '2024-03-01',
        },
        {
          id: 'COMP004',
          name: 'トライアル企業',
          code: 'TRIAL001',
          plan: 'FREE',
          status: 'inactive',
          totalUsers: 5,
          maxUsers: 10,
          totalDiagnoses: 12,
          totalCreditsUsed: 0,
          adminCount: 1,
          createdAt: '2024-03-10',
        },
        {
          id: 'COMP005',
          name: '停止中企業',
          code: 'SUSPEND1',
          plan: 'BASIC',
          status: 'suspended',
          totalUsers: 25,
          maxUsers: 30,
          totalDiagnoses: 156,
          totalCreditsUsed: 15600,
          adminCount: 2,
          createdAt: '2024-01-20',
        },
      ];

      setCompanies(mockCompanies);
      setIsLoading(false);
    };

    loadCompanies();
  }, []);

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = planFilter === 'all' || company.plan === planFilter;
    const matchesStatus = statusFilter === 'all' || company.status === statusFilter;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: companies.length,
    active: companies.filter((c) => c.status === 'active').length,
    totalUsers: companies.reduce((acc, c) => acc + c.totalUsers, 0),
    totalCredits: companies.reduce((acc, c) => acc + c.totalCreditsUsed, 0),
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">企業管理</h1>
          <p className="text-gray-500 mt-1">登録企業の管理とプラン設定（スーパー管理者専用）</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowCreateModal(true)}>
          新規企業登録
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-500">総企業数</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-sm text-gray-500">有効企業</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-sm text-gray-500">総ユーザー数</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalCredits.toLocaleString()}</p>
                <p className="text-sm text-gray-500">総クレジット使用量</p>
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
                placeholder="企業名または企業コードで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-navy/20 focus:border-deep-navy"
              />
            </div>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-navy/20 focus:border-deep-navy"
            >
              <option value="all">すべてのプラン</option>
              <option value="FREE">無料</option>
              <option value="BASIC">ベーシック</option>
              <option value="PREMIUM">プレミアム</option>
              <option value="ENTERPRISE">エンタープライズ</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-navy/20 focus:border-deep-navy"
            >
              <option value="all">すべてのステータス</option>
              <option value="active">有効</option>
              <option value="inactive">無効</option>
              <option value="suspended">停止中</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-40 bg-gray-100 rounded" />
              </CardContent>
            </Card>
          ))
        ) : paginatedCompanies.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-gray-500">
            企業が見つかりませんでした
          </div>
        ) : (
          paginatedCompanies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={cn(company.status !== 'active' && 'opacity-70')}>
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-deep-navy rounded-lg flex items-center justify-center text-white font-bold">
                        {company.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{company.name}</h3>
                        <p className="text-sm font-mono text-gray-500">{company.code}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={cn('flex items-center gap-1', planConfig[company.plan].color)}>
                        {planConfig[company.plan].icon}
                        {planConfig[company.plan].label}
                      </Badge>
                      <Badge className={statusConfig[company.status].color}>
                        {statusConfig[company.status].label}
                      </Badge>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                        <Users className="w-4 h-4" />
                        ユーザー数
                      </div>
                      <p className="font-semibold">
                        {company.totalUsers} / {company.maxUsers}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div
                          className="bg-deep-navy h-1.5 rounded-full"
                          style={{ width: `${(company.totalUsers / company.maxUsers) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                        <BarChart3 className="w-4 h-4" />
                        診断数
                      </div>
                      <p className="font-semibold">{company.totalDiagnoses.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                        <CreditCard className="w-4 h-4" />
                        クレジット使用
                      </div>
                      <p className="font-semibold">{company.totalCreditsUsed.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                        <Shield className="w-4 h-4" />
                        管理者数
                      </div>
                      <p className="font-semibold">{company.adminCount}名</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400">登録日: {company.createdAt}</span>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="詳細">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="編集">
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="管理者追加">
                        <UserPlus className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="設定">
                        <Settings className="w-4 h-4 text-gray-600" />
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

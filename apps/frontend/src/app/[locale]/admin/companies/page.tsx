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
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  FileText,
  Globe,
  Key,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface CompanyAdmin {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'BILLING_ADMIN' | 'USER_ADMIN';
}

interface Company {
  id: string;
  name: string;
  code: string;
  email: string;
  phone?: string;
  website?: string;
  plan: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  status: 'active' | 'inactive' | 'suspended' | 'trial';
  totalUsers: number;
  maxUsers: number;
  activeUsers: number;
  totalDiagnoses: number;
  completedDiagnoses: number;
  totalCreditsUsed: number;
  monthlyCreditsLimit?: number;
  admins: CompanyAdmin[];
  industry?: string;
  employeeCount?: string;
  contractStartDate: string;
  contractEndDate?: string;
  billingCycle: 'monthly' | 'yearly';
  monthlyFee: number;
  createdAt: string;
  lastActivityAt: string;
}

const planConfig: Record<Company['plan'], { label: string; color: string; icon: React.ReactNode; features: string[] }> = {
  FREE: { 
    label: '無料', 
    color: 'bg-gray-100 text-gray-700', 
    icon: null,
    features: ['最大10ユーザー', '基本診断のみ', 'メールサポート'],
  },
  BASIC: { 
    label: 'ベーシック', 
    color: 'bg-blue-100 text-blue-700', 
    icon: null,
    features: ['最大50ユーザー', '全診断利用可', 'チャットサポート'],
  },
  PREMIUM: { 
    label: 'プレミアム', 
    color: 'bg-purple-100 text-purple-700', 
    icon: <Crown className="w-3 h-3" />,
    features: ['最大200ユーザー', 'AIレポート', '優先サポート', '分析ダッシュボード'],
  },
  ENTERPRISE: { 
    label: 'エンタープライズ', 
    color: 'bg-amber-100 text-amber-700', 
    icon: <Shield className="w-3 h-3" />,
    features: ['無制限ユーザー', 'カスタム診断', '専任担当者', 'API連携', 'SSO対応'],
  },
};

const statusConfig: Record<Company['status'], { label: string; color: string }> = {
  active: { label: '有効', color: 'bg-green-100 text-green-700' },
  inactive: { label: '無効', color: 'bg-gray-100 text-gray-700' },
  suspended: { label: '停止中', color: 'bg-red-100 text-red-700' },
  trial: { label: 'トライアル', color: 'bg-yellow-100 text-yellow-700' },
};

export default function CompaniesManagementPage() {
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const itemsPerPage = 8;

  useEffect(() => {
    const loadCompanies = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockCompanies: Company[] = [
        {
          id: 'COMP001',
          name: '株式会社テクノロジー',
          code: 'TECHCORP',
          email: 'admin@tech-corp.co.jp',
          phone: '03-1234-5678',
          website: 'https://tech-corp.co.jp',
          plan: 'ENTERPRISE',
          status: 'active',
          totalUsers: 156,
          maxUsers: 500,
          activeUsers: 142,
          totalDiagnoses: 4567,
          completedDiagnoses: 4234,
          totalCreditsUsed: 456700,
          admins: [
            { id: 'ADM001', name: '田中部長', email: 'tanaka@tech-corp.co.jp', role: 'ADMIN' },
            { id: 'ADM002', name: '山田課長', email: 'yamada@tech-corp.co.jp', role: 'USER_ADMIN' },
            { id: 'ADM003', name: '経理太郎', email: 'keiri@tech-corp.co.jp', role: 'BILLING_ADMIN' },
          ],
          industry: 'IT・通信',
          employeeCount: '500-1000名',
          contractStartDate: '2023-04-01',
          contractEndDate: '2025-03-31',
          billingCycle: 'yearly',
          monthlyFee: 298000,
          createdAt: '2023-03-15',
          lastActivityAt: '2024-03-20 16:45',
        },
        {
          id: 'COMP002',
          name: '株式会社イノベーション',
          code: 'INNOV',
          email: 'contact@innovation.co.jp',
          phone: '06-9876-5432',
          website: 'https://innovation.co.jp',
          plan: 'PREMIUM',
          status: 'active',
          totalUsers: 78,
          maxUsers: 200,
          activeUsers: 65,
          totalDiagnoses: 1876,
          completedDiagnoses: 1654,
          totalCreditsUsed: 187600,
          admins: [
            { id: 'ADM004', name: '佐藤社長', email: 'sato@innovation.co.jp', role: 'ADMIN' },
            { id: 'ADM005', name: '鈴木マネージャー', email: 'suzuki@innovation.co.jp', role: 'USER_ADMIN' },
          ],
          industry: '製造業',
          employeeCount: '100-500名',
          contractStartDate: '2023-10-01',
          billingCycle: 'monthly',
          monthlyFee: 49800,
          createdAt: '2023-09-20',
          lastActivityAt: '2024-03-20 14:30',
        },
        {
          id: 'COMP003',
          name: '株式会社サンプル',
          code: 'SAMPLE01',
          email: 'info@sample.co.jp',
          plan: 'BASIC',
          status: 'active',
          totalUsers: 23,
          maxUsers: 50,
          activeUsers: 18,
          totalDiagnoses: 345,
          completedDiagnoses: 312,
          totalCreditsUsed: 34500,
          admins: [
            { id: 'ADM006', name: '高橋代表', email: 'takahashi@sample.co.jp', role: 'ADMIN' },
          ],
          industry: 'サービス業',
          employeeCount: '50-100名',
          contractStartDate: '2024-01-01',
          billingCycle: 'monthly',
          monthlyFee: 19800,
          createdAt: '2023-12-15',
          lastActivityAt: '2024-03-19 10:15',
        },
        {
          id: 'COMP004',
          name: 'スタートアップ株式会社',
          code: 'STARTUP1',
          email: 'hello@startup.io',
          website: 'https://startup.io',
          plan: 'FREE',
          status: 'trial',
          totalUsers: 8,
          maxUsers: 10,
          activeUsers: 6,
          totalDiagnoses: 45,
          completedDiagnoses: 42,
          totalCreditsUsed: 0,
          admins: [
            { id: 'ADM007', name: 'CEO 山本', email: 'yamamoto@startup.io', role: 'ADMIN' },
          ],
          industry: 'スタートアップ',
          employeeCount: '10名未満',
          contractStartDate: '2024-03-01',
          contractEndDate: '2024-03-31',
          billingCycle: 'monthly',
          monthlyFee: 0,
          createdAt: '2024-03-01',
          lastActivityAt: '2024-03-20 09:00',
        },
        {
          id: 'COMP005',
          name: '大手コンサルティング株式会社',
          code: 'CONSULT1',
          email: 'admin@consulting.co.jp',
          phone: '03-5555-1234',
          website: 'https://consulting.co.jp',
          plan: 'ENTERPRISE',
          status: 'active',
          totalUsers: 312,
          maxUsers: 1000,
          activeUsers: 287,
          totalDiagnoses: 8765,
          completedDiagnoses: 8432,
          totalCreditsUsed: 876500,
          monthlyCreditsLimit: 1000000,
          admins: [
            { id: 'ADM008', name: '人事部長 伊藤', email: 'ito@consulting.co.jp', role: 'ADMIN' },
            { id: 'ADM009', name: 'システム管理 中村', email: 'nakamura@consulting.co.jp', role: 'USER_ADMIN' },
            { id: 'ADM010', name: '経理部 小林', email: 'kobayashi@consulting.co.jp', role: 'BILLING_ADMIN' },
          ],
          industry: 'コンサルティング',
          employeeCount: '1000名以上',
          contractStartDate: '2022-04-01',
          contractEndDate: '2025-03-31',
          billingCycle: 'yearly',
          monthlyFee: 498000,
          createdAt: '2022-03-01',
          lastActivityAt: '2024-03-20 18:00',
        },
        {
          id: 'COMP006',
          name: '医療法人メディカル',
          code: 'MEDICAL1',
          email: 'jimu@medical-group.or.jp',
          phone: '042-123-4567',
          plan: 'PREMIUM',
          status: 'active',
          totalUsers: 45,
          maxUsers: 200,
          activeUsers: 38,
          totalDiagnoses: 1234,
          completedDiagnoses: 1156,
          totalCreditsUsed: 123400,
          admins: [
            { id: 'ADM011', name: '事務長 渡辺', email: 'watanabe@medical-group.or.jp', role: 'ADMIN' },
          ],
          industry: '医療・福祉',
          employeeCount: '100-500名',
          contractStartDate: '2023-07-01',
          billingCycle: 'yearly',
          monthlyFee: 49800,
          createdAt: '2023-06-15',
          lastActivityAt: '2024-03-20 11:30',
        },
        {
          id: 'COMP007',
          name: '株式会社リテールチェーン',
          code: 'RETAIL01',
          email: 'hr@retail-chain.co.jp',
          phone: '0120-123-456',
          plan: 'BASIC',
          status: 'suspended',
          totalUsers: 67,
          maxUsers: 50,
          activeUsers: 0,
          totalDiagnoses: 890,
          completedDiagnoses: 876,
          totalCreditsUsed: 89000,
          admins: [
            { id: 'ADM012', name: '人事 加藤', email: 'kato@retail-chain.co.jp', role: 'ADMIN' },
          ],
          industry: '小売業',
          employeeCount: '500-1000名',
          contractStartDate: '2023-05-01',
          billingCycle: 'monthly',
          monthlyFee: 19800,
          createdAt: '2023-04-20',
          lastActivityAt: '2024-02-15 09:00',
        },
        {
          id: 'COMP008',
          name: '教育機関テスト大学',
          code: 'EDUTEST1',
          email: 'admin@edu-test.ac.jp',
          plan: 'PREMIUM',
          status: 'active',
          totalUsers: 156,
          maxUsers: 200,
          activeUsers: 134,
          totalDiagnoses: 3456,
          completedDiagnoses: 3234,
          totalCreditsUsed: 345600,
          admins: [
            { id: 'ADM013', name: '教務課長 松本', email: 'matsumoto@edu-test.ac.jp', role: 'ADMIN' },
            { id: 'ADM014', name: 'キャリアセンター 井上', email: 'inoue@edu-test.ac.jp', role: 'USER_ADMIN' },
          ],
          industry: '教育機関',
          employeeCount: '100-500名',
          contractStartDate: '2023-04-01',
          contractEndDate: '2025-03-31',
          billingCycle: 'yearly',
          monthlyFee: 39800,
          createdAt: '2023-03-01',
          lastActivityAt: '2024-03-20 15:45',
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
      company.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.email.toLowerCase().includes(searchQuery.toLowerCase());
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
    enterprise: companies.filter((c) => c.plan === 'ENTERPRISE').length,
    totalUsers: companies.reduce((acc, c) => acc + c.totalUsers, 0),
    totalRevenue: companies.reduce((acc, c) => acc + c.monthlyFee, 0),
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
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          新規企業登録
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-gray-500">総企業数</p>
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
                <p className="text-xs text-gray-500">有効企業</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.enterprise}</p>
                <p className="text-xs text-gray-500">エンタープライズ</p>
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
                <p className="text-xs text-gray-500">総ユーザー</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">¥{(stats.totalRevenue / 1000).toFixed(0)}k</p>
                <p className="text-xs text-gray-500">月額収益</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{(stats.totalCredits / 1000).toFixed(0)}k</p>
                <p className="text-xs text-gray-500">総クレジット</p>
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
                placeholder="企業名、企業コード、メールで検索..."
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
              <option value="trial">トライアル</option>
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
                <div className="h-48 bg-gray-100 rounded" />
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
                      <div className="w-14 h-14 bg-deep-navy rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        {company.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{company.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">{company.code}</span>
                          {company.industry && (
                            <span className="text-xs text-gray-500">{company.industry}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge className={cn('flex items-center gap-1', planConfig[company.plan].color)}>
                        {planConfig[company.plan].icon}
                        {planConfig[company.plan].label}
                      </Badge>
                      <Badge className={statusConfig[company.status].color}>
                        {statusConfig[company.status].label}
                      </Badge>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span className="text-xs">{company.email}</span>
                    </div>
                    {company.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span className="text-xs">{company.phone}</span>
                      </div>
                    )}
                    {company.website && (
                      <div className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        <a href={company.website} className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                          Web
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                        <Users className="w-3 h-3" />
                        ユーザー
                      </div>
                      <p className="font-semibold text-sm">
                        {company.activeUsers} / {company.totalUsers}
                        <span className="text-gray-400 font-normal"> (上限 {company.maxUsers})</span>
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                        <div
                          className={cn(
                            'h-1 rounded-full',
                            company.totalUsers / company.maxUsers > 0.9 ? 'bg-red-500' : 'bg-deep-navy'
                          )}
                          style={{ width: `${(company.totalUsers / company.maxUsers) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                        <FileText className="w-3 h-3" />
                        診断
                      </div>
                      <p className="font-semibold text-sm">
                        {company.completedDiagnoses.toLocaleString()}
                        <span className="text-gray-400 font-normal"> / {company.totalDiagnoses.toLocaleString()}</span>
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                        <CreditCard className="w-3 h-3" />
                        月額
                      </div>
                      <p className="font-semibold text-sm">
                        ¥{company.monthlyFee.toLocaleString()}
                        <span className="text-gray-400 font-normal text-xs"> /{company.billingCycle === 'yearly' ? '年' : '月'}</span>
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                        <TrendingUp className="w-3 h-3" />
                        クレジット使用
                      </div>
                      <p className="font-semibold text-sm">{company.totalCreditsUsed.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Admins */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">管理者 ({company.admins.length}名)</p>
                    <div className="flex flex-wrap gap-2">
                      {company.admins.slice(0, 3).map((admin) => (
                        <div key={admin.id} className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1">
                          <div className="w-5 h-5 bg-deep-navy rounded-full flex items-center justify-center text-white text-xs">
                            {admin.name.charAt(0)}
                          </div>
                          <span className="text-xs">{admin.name}</span>
                        </div>
                      ))}
                      {company.admins.length > 3 && (
                        <span className="text-xs text-gray-500 self-center">+{company.admins.length - 3}名</span>
                      )}
                    </div>
                  </div>

                  {/* Contract Info */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      契約開始: {company.contractStartDate}
                    </div>
                    {company.contractEndDate && (
                      <div className="flex items-center gap-1">
                        契約終了: {company.contractEndDate}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400">最終活動: {company.lastActivityAt}</span>
                    <div className="flex items-center gap-1">
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="詳細">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="編集">
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="管理者追加">
                        <UserPlus className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="APIキー">
                        <Key className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="設定">
                        <Settings className="w-4 h-4 text-gray-600" />
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

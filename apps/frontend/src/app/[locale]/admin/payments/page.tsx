'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import {
  Search,
  Download,
  CreditCard,
  Wallet,
  TrendingUp,
  RefreshCcw,
  Eye,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Building2,
  Users,
  Gift,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Payment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  companyName?: string;
  type: 'CREDIT_PURCHASE' | 'DIAGNOSIS_PURCHASE' | 'SUBSCRIPTION' | 'ENTERPRISE_PLAN' | 'AI_REPORT';
  amount: number;
  creditAmount?: number;
  bonusCredits?: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
  provider: 'STRIPE' | 'BYPAY' | 'BANK_TRANSFER' | 'INVOICE';
  cardLast4?: string;
  receiptUrl?: string;
  createdAt: string;
}

interface CreditTransaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: 'PURCHASE' | 'DIAGNOSIS_USE' | 'AI_REPORT_USE' | 'BONUS' | 'REFUND' | 'ADMIN_ADJUSTMENT' | 'AFFILIATE_REWARD' | 'EXPIRY';
  amount: number;
  balanceAfter: number;
  description: string;
  relatedId?: string;
  createdAt: string;
}

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  bonusCredits: number;
  price: number;
  isPopular: boolean;
  salesCount: number;
}

export default function PaymentsManagementPage() {
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<'payments' | 'credits' | 'packages'>('payments');
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [creditTransactions, setCreditTransactions] = useState<CreditTransaction[]>([]);
  const [creditPackages, setCreditPackages] = useState<CreditPackage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('month');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setPayments([
        {
          id: 'PAY-20240320-001',
          userId: 'USR001',
          userName: '山田太郎',
          userEmail: 'yamada@example.com',
          type: 'CREDIT_PURCHASE',
          amount: 5500,
          creditAmount: 5000,
          bonusCredits: 500,
          status: 'COMPLETED',
          provider: 'STRIPE',
          cardLast4: '4242',
          createdAt: '2024-03-20 14:30:25',
        },
        {
          id: 'PAY-20240320-002',
          userId: 'USR002',
          userName: '株式会社テクノロジー',
          userEmail: 'admin@tech.co.jp',
          companyName: '株式会社テクノロジー',
          type: 'ENTERPRISE_PLAN',
          amount: 298000,
          status: 'COMPLETED',
          provider: 'INVOICE',
          createdAt: '2024-03-20 12:15:00',
        },
        {
          id: 'PAY-20240320-003',
          userId: 'USR003',
          userName: '佐藤花子',
          userEmail: 'sato@example.com',
          type: 'CREDIT_PURCHASE',
          amount: 11000,
          creditAmount: 10000,
          bonusCredits: 2000,
          status: 'COMPLETED',
          provider: 'STRIPE',
          cardLast4: '1234',
          createdAt: '2024-03-20 10:45:18',
        },
        {
          id: 'PAY-20240320-004',
          userId: 'USR004',
          userName: '田中一郎',
          userEmail: 'tanaka@example.com',
          type: 'SUBSCRIPTION',
          amount: 2980,
          status: 'COMPLETED',
          provider: 'STRIPE',
          cardLast4: '5678',
          createdAt: '2024-03-20 09:30:00',
        },
        {
          id: 'PAY-20240320-005',
          userId: 'USR005',
          userName: '鈴木美咲',
          userEmail: 'suzuki@example.com',
          type: 'AI_REPORT',
          amount: 1500,
          status: 'COMPLETED',
          provider: 'BYPAY',
          createdAt: '2024-03-20 08:22:45',
        },
        {
          id: 'PAY-20240319-001',
          userId: 'USR006',
          userName: '高橋健太',
          userEmail: 'takahashi@example.com',
          type: 'CREDIT_PURCHASE',
          amount: 33000,
          creditAmount: 30000,
          bonusCredits: 6000,
          status: 'COMPLETED',
          provider: 'STRIPE',
          cardLast4: '9876',
          createdAt: '2024-03-19 18:20:30',
        },
        {
          id: 'PAY-20240319-002',
          userId: 'USR007',
          userName: '伊藤さくら',
          userEmail: 'ito@example.com',
          type: 'CREDIT_PURCHASE',
          amount: 5500,
          creditAmount: 5000,
          bonusCredits: 500,
          status: 'REFUNDED',
          provider: 'STRIPE',
          cardLast4: '4321',
          createdAt: '2024-03-19 15:45:00',
        },
        {
          id: 'PAY-20240319-003',
          userId: 'USR008',
          userName: '渡辺大輔',
          userEmail: 'watanabe@example.com',
          type: 'SUBSCRIPTION',
          amount: 2980,
          status: 'FAILED',
          provider: 'STRIPE',
          cardLast4: '0000',
          createdAt: '2024-03-19 12:00:00',
        },
        {
          id: 'PAY-20240319-004',
          userId: 'USR009',
          userName: '株式会社イノベーション',
          userEmail: 'billing@innov.co.jp',
          companyName: '株式会社イノベーション',
          type: 'ENTERPRISE_PLAN',
          amount: 49800,
          status: 'PENDING',
          provider: 'BANK_TRANSFER',
          createdAt: '2024-03-19 10:30:00',
        },
        {
          id: 'PAY-20240318-001',
          userId: 'USR010',
          userName: '小林真理',
          userEmail: 'kobayashi@example.com',
          type: 'CREDIT_PURCHASE',
          amount: 2200,
          creditAmount: 2000,
          bonusCredits: 0,
          status: 'COMPLETED',
          provider: 'BYPAY',
          createdAt: '2024-03-18 16:40:12',
        },
        {
          id: 'PAY-20240318-002',
          userId: 'USR011',
          userName: '中村優子',
          userEmail: 'nakamura@example.com',
          type: 'AI_REPORT',
          amount: 1000,
          status: 'COMPLETED',
          provider: 'STRIPE',
          cardLast4: '7890',
          createdAt: '2024-03-18 14:22:00',
        },
        {
          id: 'PAY-20240318-003',
          userId: 'USR012',
          userName: '加藤裕也',
          userEmail: 'kato@company.co.jp',
          companyName: '株式会社テクノロジー',
          type: 'CREDIT_PURCHASE',
          amount: 11000,
          creditAmount: 10000,
          bonusCredits: 2000,
          status: 'COMPLETED',
          provider: 'STRIPE',
          cardLast4: '1111',
          createdAt: '2024-03-18 11:15:30',
        },
      ]);

      setCreditTransactions([
        {
          id: 'CTX-001',
          userId: 'USR001',
          userName: '山田太郎',
          userEmail: 'yamada@example.com',
          type: 'PURCHASE',
          amount: 5500,
          balanceAfter: 8200,
          description: 'クレジット購入（5,000pt + 500ptボーナス）',
          relatedId: 'PAY-20240320-001',
          createdAt: '2024-03-20 14:30:25',
        },
        {
          id: 'CTX-002',
          userId: 'USR001',
          userName: '山田太郎',
          userEmail: 'yamada@example.com',
          type: 'AI_REPORT_USE',
          amount: -1000,
          balanceAfter: 7200,
          description: 'AIレポート生成（キャリア適性診断Pro）',
          relatedId: 'RPT-001',
          createdAt: '2024-03-20 15:45:00',
        },
        {
          id: 'CTX-003',
          userId: 'USR003',
          userName: '佐藤花子',
          userEmail: 'sato@example.com',
          type: 'PURCHASE',
          amount: 12000,
          balanceAfter: 15500,
          description: 'クレジット購入（10,000pt + 2,000ptボーナス）',
          relatedId: 'PAY-20240320-003',
          createdAt: '2024-03-20 10:45:18',
        },
        {
          id: 'CTX-004',
          userId: 'USR003',
          userName: '佐藤花子',
          userEmail: 'sato@example.com',
          type: 'DIAGNOSIS_USE',
          amount: -500,
          balanceAfter: 15000,
          description: '診断利用（恋愛傾向診断）',
          relatedId: 'DIAG-005',
          createdAt: '2024-03-20 11:30:00',
        },
        {
          id: 'CTX-005',
          userId: 'USR013',
          userName: '松本彩香',
          userEmail: 'matsumoto@example.com',
          type: 'AFFILIATE_REWARD',
          amount: 500,
          balanceAfter: 8300,
          description: 'アフィリエイト報酬（紹介ユーザー: 井上大樹）',
          relatedId: 'AFF-001',
          createdAt: '2024-03-20 09:00:00',
        },
        {
          id: 'CTX-006',
          userId: 'USR006',
          userName: '高橋健太',
          userEmail: 'takahashi@example.com',
          type: 'PURCHASE',
          amount: 36000,
          balanceAfter: 42500,
          description: 'クレジット購入（30,000pt + 6,000ptボーナス）',
          relatedId: 'PAY-20240319-001',
          createdAt: '2024-03-19 18:20:30',
        },
        {
          id: 'CTX-007',
          userId: 'USR007',
          userName: '伊藤さくら',
          userEmail: 'ito@example.com',
          type: 'REFUND',
          amount: -5500,
          balanceAfter: 0,
          description: '返金処理（決済キャンセル）',
          relatedId: 'PAY-20240319-002',
          createdAt: '2024-03-19 16:00:00',
        },
        {
          id: 'CTX-008',
          userId: 'USR014',
          userName: '井上大樹',
          userEmail: 'inoue@example.com',
          type: 'BONUS',
          amount: 300,
          balanceAfter: 1250,
          description: '新規登録ボーナス',
          createdAt: '2024-03-19 14:30:00',
        },
        {
          id: 'CTX-009',
          userId: 'USR010',
          userName: '小林真理',
          userEmail: 'kobayashi@example.com',
          type: 'ADMIN_ADJUSTMENT',
          amount: 500,
          balanceAfter: 2700,
          description: '管理者による付与（カスタマーサポート対応）',
          createdAt: '2024-03-19 11:00:00',
        },
        {
          id: 'CTX-010',
          userId: 'USR015',
          userName: '清水拓也',
          userEmail: 'shimizu@example.com',
          type: 'EXPIRY',
          amount: -1000,
          balanceAfter: 3100,
          description: 'クレジット有効期限切れ',
          createdAt: '2024-03-18 00:00:00',
        },
      ]);

      setCreditPackages([
        {
          id: 'PKG-001',
          name: 'スタータープラン',
          credits: 1000,
          bonusCredits: 0,
          price: 1100,
          isPopular: false,
          salesCount: 2345,
        },
        {
          id: 'PKG-002',
          name: 'ライトプラン',
          credits: 3000,
          bonusCredits: 300,
          price: 3300,
          isPopular: false,
          salesCount: 4567,
        },
        {
          id: 'PKG-003',
          name: 'スタンダードプラン',
          credits: 5000,
          bonusCredits: 500,
          price: 5500,
          isPopular: true,
          salesCount: 8901,
        },
        {
          id: 'PKG-004',
          name: 'プレミアムプラン',
          credits: 10000,
          bonusCredits: 2000,
          price: 11000,
          isPopular: false,
          salesCount: 3456,
        },
        {
          id: 'PKG-005',
          name: 'プロフェッショナルプラン',
          credits: 30000,
          bonusCredits: 6000,
          price: 33000,
          isPopular: false,
          salesCount: 1234,
        },
        {
          id: 'PKG-006',
          name: 'エンタープライズプラン',
          credits: 100000,
          bonusCredits: 25000,
          price: 99000,
          isPopular: false,
          salesCount: 456,
        },
      ]);

      setIsLoading(false);
    };

    loadData();
  }, []);

  const getStatusBadge = (status: Payment['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="success">完了</Badge>;
      case 'PENDING':
        return <Badge variant="warning">処理中</Badge>;
      case 'FAILED':
        return <Badge variant="error">失敗</Badge>;
      case 'REFUNDED':
        return <Badge variant="default">返金済</Badge>;
      case 'CANCELLED':
        return <Badge variant="default">キャンセル</Badge>;
    }
  };

  const getTypeBadge = (type: Payment['type']) => {
    switch (type) {
      case 'CREDIT_PURCHASE':
        return <Badge variant="info">クレジット購入</Badge>;
      case 'DIAGNOSIS_PURCHASE':
        return <Badge variant="default">診断購入</Badge>;
      case 'SUBSCRIPTION':
        return <Badge variant="warning">サブスク</Badge>;
      case 'ENTERPRISE_PLAN':
        return <Badge variant="success">エンタープライズ</Badge>;
      case 'AI_REPORT':
        return <Badge variant="default" className="bg-purple-100 text-purple-700">AIレポート</Badge>;
    }
  };

  const getTransactionTypeBadge = (type: CreditTransaction['type']) => {
    switch (type) {
      case 'PURCHASE':
        return <Badge variant="success">購入</Badge>;
      case 'DIAGNOSIS_USE':
        return <Badge variant="info">診断使用</Badge>;
      case 'AI_REPORT_USE':
        return <Badge variant="default" className="bg-purple-100 text-purple-700">AI使用</Badge>;
      case 'BONUS':
        return <Badge variant="warning">ボーナス</Badge>;
      case 'REFUND':
        return <Badge variant="error">返金</Badge>;
      case 'ADMIN_ADJUSTMENT':
        return <Badge variant="default">管理者調整</Badge>;
      case 'AFFILIATE_REWARD':
        return <Badge variant="success" className="bg-green-100 text-green-700">アフィリエイト</Badge>;
      case 'EXPIRY':
        return <Badge variant="error" className="bg-red-100 text-red-700">期限切れ</Badge>;
    }
  };

  const getProviderIcon = (provider: Payment['provider']) => {
    switch (provider) {
      case 'STRIPE':
        return <span className="text-xs bg-indigo-500 text-white px-1.5 py-0.5 rounded">Stripe</span>;
      case 'BYPAY':
        return <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded">ByPay</span>;
      case 'BANK_TRANSFER':
        return <span className="text-xs bg-gray-500 text-white px-1.5 py-0.5 rounded">銀行振込</span>;
      case 'INVOICE':
        return <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded">請求書</span>;
    }
  };

  const filteredPayments = payments.filter((p) => {
    const matchesSearch = 
      p.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesType = typeFilter === 'all' || p.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    monthlyRevenue: 4827650,
    monthlyTransactions: 1456,
    refundAmount: 45600,
    totalCredits: 2847500,
    pendingPayments: 3,
    failedPayments: 2,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">決済・クレジット管理</h1>
          <p className="text-gray-500 mt-1">決済履歴とクレジット取引の管理</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<Calendar className="w-4 h-4" />}>
            期間指定
          </Button>
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            レポート出力
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">今月の売上</p>
                <p className="text-2xl font-bold mt-1">¥{stats.monthlyRevenue.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-1">{stats.monthlyTransactions.toLocaleString()}件の取引</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center text-green-600 text-sm">
                  <ArrowUpRight className="w-4 h-4" />
                  18.4%
                </div>
                <DollarSign className="w-8 h-8 text-green-200 mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">返金額</p>
                <p className="text-2xl font-bold mt-1">¥{stats.refundAmount.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-1">返金率 0.94%</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center text-red-600 text-sm">
                  <ArrowDownRight className="w-4 h-4" />
                  2.1%
                </div>
                <RotateCcw className="w-8 h-8 text-red-200 mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">総クレジット残高</p>
                <p className="text-2xl font-bold mt-1">{stats.totalCredits.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-1">全ユーザー合計</p>
              </div>
              <Wallet className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">要対応</p>
                <p className="text-2xl font-bold mt-1">{stats.pendingPayments + stats.failedPayments}</p>
                <p className="text-xs text-gray-400 mt-1">
                  処理中 {stats.pendingPayments} / 失敗 {stats.failedPayments}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('payments')}
            className={cn(
              'py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === 'payments'
                ? 'border-deep-navy text-deep-navy'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            <CreditCard className="w-4 h-4 inline-block mr-2" />
            決済履歴
          </button>
          <button
            onClick={() => setActiveTab('credits')}
            className={cn(
              'py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === 'credits'
                ? 'border-deep-navy text-deep-navy'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            <Wallet className="w-4 h-4 inline-block mr-2" />
            クレジット取引
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={cn(
              'py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === 'packages'
                ? 'border-deep-navy text-deep-navy'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            <Gift className="w-4 h-4 inline-block mr-2" />
            パッケージ管理
          </button>
        </nav>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="ユーザー名、メール、取引IDで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-navy/20 focus:border-deep-navy"
              />
            </div>
            {activeTab === 'payments' && (
              <>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-navy/20 focus:border-deep-navy"
                >
                  <option value="all">すべてのステータス</option>
                  <option value="COMPLETED">完了</option>
                  <option value="PENDING">処理中</option>
                  <option value="FAILED">失敗</option>
                  <option value="REFUNDED">返金済</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-navy/20 focus:border-deep-navy"
                >
                  <option value="all">すべての種類</option>
                  <option value="CREDIT_PURCHASE">クレジット購入</option>
                  <option value="SUBSCRIPTION">サブスク</option>
                  <option value="ENTERPRISE_PLAN">エンタープライズ</option>
                  <option value="AI_REPORT">AIレポート</option>
                </select>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {activeTab === 'payments' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">取引ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ユーザー</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">種類</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">金額</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">クレジット</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">決済方法</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ステータス</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">日時</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-4 py-4" colSpan={9}>
                          <div className="h-12 bg-gray-100 rounded" />
                        </td>
                      </tr>
                    ))
                  ) : (
                    filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-xs font-mono text-gray-500">
                          {payment.id}
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{payment.userName}</p>
                            <p className="text-xs text-gray-500">{payment.userEmail}</p>
                            {payment.companyName && (
                              <div className="flex items-center gap-1 mt-1">
                                <Building2 className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500">{payment.companyName}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">{getTypeBadge(payment.type)}</td>
                        <td className="px-4 py-4 text-right font-semibold">
                          ¥{payment.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-4">
                          {payment.creditAmount ? (
                            <div className="text-sm">
                              <span className="font-medium">{payment.creditAmount.toLocaleString()}</span>
                              {payment.bonusCredits && payment.bonusCredits > 0 && (
                                <span className="text-green-600 ml-1">+{payment.bonusCredits.toLocaleString()}</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            {getProviderIcon(payment.provider)}
                            {payment.cardLast4 && (
                              <span className="text-xs text-gray-500">****{payment.cardLast4}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">{getStatusBadge(payment.status)}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">{payment.createdAt}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-2 hover:bg-gray-100 rounded-lg" title="詳細">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                            {payment.status === 'COMPLETED' && (
                              <button className="p-2 hover:bg-gray-100 rounded-lg" title="返金">
                                <RotateCcw className="w-4 h-4 text-orange-600" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'credits' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">取引ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ユーザー</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">種類</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">変動</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">残高</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">説明</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">日時</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-4 py-4" colSpan={7}>
                          <div className="h-12 bg-gray-100 rounded" />
                        </td>
                      </tr>
                    ))
                  ) : (
                    creditTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-xs font-mono text-gray-500">{tx.id}</td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{tx.userName}</p>
                            <p className="text-xs text-gray-500">{tx.userEmail}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">{getTransactionTypeBadge(tx.type)}</td>
                        <td className="px-4 py-4 text-right">
                          <span
                            className={cn(
                              'font-semibold',
                              tx.amount >= 0 ? 'text-green-600' : 'text-red-600'
                            )}
                          >
                            {tx.amount >= 0 ? '+' : ''}
                            {tx.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right font-medium">{tx.balanceAfter.toLocaleString()}</td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-sm text-gray-600">{tx.description}</p>
                            {tx.relatedId && (
                              <p className="text-xs text-gray-400 font-mono">{tx.relatedId}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">{tx.createdAt}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'packages' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {creditPackages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={cn(pkg.isPopular && 'ring-2 ring-deep-navy')}>
                <CardContent className="p-6">
                  {pkg.isPopular && (
                    <Badge variant="warning" className="mb-3">人気No.1</Badge>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900">{pkg.name}</h3>
                  <p className="text-xs text-gray-400 mb-4">{pkg.id}</p>
                  
                  <div className="mb-4">
                    <span className="text-3xl font-bold">¥{pkg.price.toLocaleString()}</span>
                    <span className="text-gray-500 ml-1">（税込）</span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">基本クレジット</span>
                      <span className="font-medium">{pkg.credits.toLocaleString()}pt</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">ボーナス</span>
                      <span className="font-medium text-green-600">+{pkg.bonusCredits.toLocaleString()}pt</span>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-2 border-t">
                      <span className="text-gray-900 font-medium">合計</span>
                      <span className="font-bold text-lg">{(pkg.credits + pkg.bonusCredits).toLocaleString()}pt</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t text-sm">
                    <span className="text-gray-500">販売数</span>
                    <span className="font-medium">{pkg.salesCount.toLocaleString()}件</span>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">編集</Button>
                    <Button variant="ghost" size="sm">統計</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

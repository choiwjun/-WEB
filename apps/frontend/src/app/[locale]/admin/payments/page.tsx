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
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Payment {
  id: string;
  userId: string;
  userName: string;
  type: 'CREDIT_PURCHASE' | 'DIAGNOSIS_PURCHASE' | 'SUBSCRIPTION';
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED';
  provider: 'STRIPE' | 'BYPAY';
  createdAt: string;
}

interface CreditTransaction {
  id: string;
  userId: string;
  userName: string;
  type: 'PURCHASE' | 'DIAGNOSIS_USE' | 'BONUS' | 'REFUND' | 'ADMIN_ADJUSTMENT';
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
}

export default function PaymentsManagementPage() {
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<'payments' | 'credits'>('payments');
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [creditTransactions, setCreditTransactions] = useState<CreditTransaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setPayments([
        {
          id: '1',
          userId: 'u1',
          userName: '山田太郎',
          type: 'CREDIT_PURCHASE',
          amount: 3000,
          status: 'COMPLETED',
          provider: 'STRIPE',
          createdAt: '2024-03-20 14:30',
        },
        {
          id: '2',
          userId: 'u2',
          userName: '佐藤花子',
          type: 'CREDIT_PURCHASE',
          amount: 5000,
          status: 'COMPLETED',
          provider: 'STRIPE',
          createdAt: '2024-03-20 12:15',
        },
        {
          id: '3',
          userId: 'u3',
          userName: '田中一郎',
          type: 'DIAGNOSIS_PURCHASE',
          amount: 1000,
          status: 'PENDING',
          provider: 'BYPAY',
          createdAt: '2024-03-20 10:45',
        },
        {
          id: '4',
          userId: 'u4',
          userName: '鈴木美咲',
          type: 'CREDIT_PURCHASE',
          amount: 10000,
          status: 'REFUNDED',
          provider: 'STRIPE',
          createdAt: '2024-03-19 18:20',
        },
        {
          id: '5',
          userId: 'u5',
          userName: '高橋健太',
          type: 'SUBSCRIPTION',
          amount: 2980,
          status: 'COMPLETED',
          provider: 'STRIPE',
          createdAt: '2024-03-19 15:00',
        },
      ]);

      setCreditTransactions([
        {
          id: '1',
          userId: 'u1',
          userName: '山田太郎',
          type: 'PURCHASE',
          amount: 3500,
          balanceAfter: 4200,
          description: 'クレジット購入（3000円 + 500ボーナス）',
          createdAt: '2024-03-20 14:30',
        },
        {
          id: '2',
          userId: 'u1',
          userName: '山田太郎',
          type: 'DIAGNOSIS_USE',
          amount: -500,
          balanceAfter: 3700,
          description: 'キャリア診断の利用',
          createdAt: '2024-03-20 15:00',
        },
        {
          id: '3',
          userId: 'u2',
          userName: '佐藤花子',
          type: 'PURCHASE',
          amount: 6000,
          balanceAfter: 6000,
          description: 'クレジット購入（5000円 + 1000ボーナス）',
          createdAt: '2024-03-20 12:15',
        },
        {
          id: '4',
          userId: 'u3',
          userName: '田中一郎',
          type: 'ADMIN_ADJUSTMENT',
          amount: 100,
          balanceAfter: 100,
          description: '管理者による付与（テスト用）',
          createdAt: '2024-03-20 10:00',
        },
        {
          id: '5',
          userId: 'u4',
          userName: '鈴木美咲',
          type: 'REFUND',
          amount: -10000,
          balanceAfter: 0,
          description: '返金処理',
          createdAt: '2024-03-19 18:30',
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
    }
  };

  const getTransactionTypeBadge = (type: CreditTransaction['type']) => {
    switch (type) {
      case 'PURCHASE':
        return <Badge variant="success">購入</Badge>;
      case 'DIAGNOSIS_USE':
        return <Badge variant="info">使用</Badge>;
      case 'BONUS':
        return <Badge variant="warning">ボーナス</Badge>;
      case 'REFUND':
        return <Badge variant="error">返金</Badge>;
      case 'ADMIN_ADJUSTMENT':
        return <Badge variant="default">管理者調整</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">決済・クレジット管理</h1>
          <p className="text-gray-500 mt-1">決済履歴とクレジット取引の管理</p>
        </div>
        <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
          レポート出力
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">今月の売上</p>
                <p className="text-2xl font-bold mt-1">¥1,234,567</p>
              </div>
              <div className="flex items-center text-green-600 text-sm">
                <ArrowUpRight className="w-4 h-4" />
                12.5%
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">今月の取引数</p>
                <p className="text-2xl font-bold mt-1">456</p>
              </div>
              <div className="flex items-center text-green-600 text-sm">
                <ArrowUpRight className="w-4 h-4" />
                8.2%
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">返金額</p>
                <p className="text-2xl font-bold mt-1">¥23,400</p>
              </div>
              <div className="flex items-center text-red-600 text-sm">
                <ArrowDownRight className="w-4 h-4" />
                2.1%
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">総クレジット残高</p>
                <p className="text-2xl font-bold mt-1">234,500</p>
              </div>
              <Wallet className="w-8 h-8 text-gray-300" />
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
        </nav>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="ユーザー名で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-navy/20 focus:border-deep-navy"
            />
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {activeTab === 'payments' ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">取引ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ユーザー</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">種類</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">金額</th>
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
                        <td className="px-4 py-4" colSpan={8}>
                          <div className="h-10 bg-gray-100 rounded" />
                        </td>
                      </tr>
                    ))
                  ) : (
                    payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm font-mono text-gray-500">
                          #{payment.id}
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-medium text-gray-900">{payment.userName}</p>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {payment.type === 'CREDIT_PURCHASE' && 'クレジット購入'}
                          {payment.type === 'DIAGNOSIS_PURCHASE' && '診断購入'}
                          {payment.type === 'SUBSCRIPTION' && 'サブスク'}
                        </td>
                        <td className="px-4 py-4 font-semibold">
                          ¥{payment.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant="default">{payment.provider}</Badge>
                        </td>
                        <td className="px-4 py-4">{getStatusBadge(payment.status)}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">{payment.createdAt}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
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
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">取引ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ユーザー</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">種類</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">変動</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">残高</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">説明</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">日時</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-4 py-4" colSpan={7}>
                          <div className="h-10 bg-gray-100 rounded" />
                        </td>
                      </tr>
                    ))
                  ) : (
                    creditTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm font-mono text-gray-500">#{tx.id}</td>
                        <td className="px-4 py-4">
                          <p className="font-medium text-gray-900">{tx.userName}</p>
                        </td>
                        <td className="px-4 py-4">{getTransactionTypeBadge(tx.type)}</td>
                        <td className="px-4 py-4">
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
                        <td className="px-4 py-4 font-medium">{tx.balanceAfter.toLocaleString()}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">{tx.description}</td>
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
    </div>
  );
}

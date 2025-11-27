'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import {
  Users,
  FileText,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  UserPlus,
  FileBarChart,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { cn } from '@/lib/utils';

interface StatCard {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  color: string;
}

interface RecentActivity {
  id: string;
  type: 'user_signup' | 'diagnosis_completed' | 'payment' | 'report_generated';
  description: string;
  timestamp: string;
}

export default function AdminDashboardPage() {
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  useEffect(() => {
    // Simulated data loading
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setStats([
        {
          title: '総ユーザー数',
          value: '1,234',
          change: 12.5,
          changeLabel: '先月比',
          icon: Users,
          color: 'bg-blue-500',
        },
        {
          title: '今月の診断数',
          value: '856',
          change: 8.2,
          changeLabel: '先月比',
          icon: FileText,
          color: 'bg-green-500',
        },
        {
          title: '今月の売上',
          value: '¥1,234,567',
          change: -3.1,
          changeLabel: '先月比',
          icon: DollarSign,
          color: 'bg-purple-500',
        },
        {
          title: 'アクティブユーザー',
          value: '342',
          change: 15.3,
          changeLabel: '先週比',
          icon: Activity,
          color: 'bg-orange-500',
        },
      ]);

      setRecentActivities([
        {
          id: '1',
          type: 'user_signup',
          description: '新規ユーザー「山田太郎」が登録しました',
          timestamp: '5分前',
        },
        {
          id: '2',
          type: 'diagnosis_completed',
          description: '「性格診断テスト」が完了しました',
          timestamp: '12分前',
        },
        {
          id: '3',
          type: 'payment',
          description: 'クレジット購入 ¥3,000',
          timestamp: '25分前',
        },
        {
          id: '4',
          type: 'report_generated',
          description: 'AIレポートが生成されました',
          timestamp: '1時間前',
        },
        {
          id: '5',
          type: 'user_signup',
          description: '新規ユーザー「佐藤花子」が登録しました',
          timestamp: '2時間前',
        },
      ]);

      setIsLoading(false);
    };

    loadData();
  }, []);

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'user_signup':
        return <UserPlus className="w-4 h-4 text-blue-500" />;
      case 'diagnosis_completed':
        return <FileText className="w-4 h-4 text-green-500" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-purple-500" />;
      case 'report_generated':
        return <FileBarChart className="w-4 h-4 text-orange-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-gray-500 mt-1">サービスの概要を確認できます</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.change >= 0;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-lg flex items-center justify-center',
                        stat.color
                      )}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div
                      className={cn(
                        'flex items-center gap-1 text-sm font-medium',
                        isPositive ? 'text-green-600' : 'text-red-600'
                      )}
                    >
                      {isPositive ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      {Math.abs(stat.change)}%
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Placeholder */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>売上推移</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>グラフはここに表示されます</p>
                <p className="text-sm">(Chart.js または Recharts で実装)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>最近のアクティビティ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Diagnosis Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">診断別統計</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: '性格診断', count: 234, percentage: 35 },
                { name: 'ストレス診断', count: 189, percentage: 28 },
                { name: 'キャリア診断', count: 156, percentage: 23 },
                { name: 'メンタルヘルス', count: 94, percentage: 14 },
              ].map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{item.name}</span>
                    <span className="font-medium">{item.count}件</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-deep-navy rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Registration Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">新規登録推移</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { day: '今日', count: 12 },
                { day: '昨日', count: 18 },
                { day: '2日前', count: 15 },
                { day: '3日前', count: 22 },
                { day: '4日前', count: 9 },
              ].map((item) => (
                <div key={item.day} className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 w-16">{item.day}</span>
                  <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded flex items-center justify-end pr-2"
                      style={{ width: `${(item.count / 25) * 100}%` }}
                    >
                      <span className="text-xs text-white font-medium">{item.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">決済サマリー</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-600">今日の売上</span>
                <span className="text-lg font-bold text-gray-900">¥45,600</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-600">今週の売上</span>
                <span className="text-lg font-bold text-gray-900">¥312,400</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-600">今月の売上</span>
                <span className="text-lg font-bold text-gray-900">¥1,234,567</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">返金処理</span>
                <span className="text-lg font-bold text-red-600">-¥12,000</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

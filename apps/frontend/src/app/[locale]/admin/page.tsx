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
  MessageCircle,
  Brain,
  Building2,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Calendar,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface StatCard {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  color: string;
  subValue?: string;
}

interface RecentActivity {
  id: string;
  type: 'user_signup' | 'diagnosis_completed' | 'payment' | 'report_generated' | 'chat_started' | 'company_registered';
  description: string;
  timestamp: string;
  user?: string;
  amount?: string;
}

interface TopDiagnosis {
  id: string;
  name: string;
  completions: number;
  revenue: number;
  trend: number;
  category: string;
}

interface ActiveCounselor {
  id: string;
  name: string;
  status: 'online' | 'busy' | 'away';
  activeChats: number;
  rating: number;
  responseTime: string;
}

interface PendingTask {
  id: string;
  type: 'report' | 'payout' | 'support' | 'verification';
  title: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
}

export default function AdminDashboardPage() {
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [topDiagnoses, setTopDiagnoses] = useState<TopDiagnosis[]>([]);
  const [activeCounselors, setActiveCounselors] = useState<ActiveCounselor[]>([]);
  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');

  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setStats([
        {
          title: '総ユーザー数',
          value: '12,847',
          change: 12.5,
          changeLabel: '先月比',
          icon: Users,
          color: 'bg-blue-500',
          subValue: '本日 +47',
        },
        {
          title: '今月の診断数',
          value: '8,562',
          change: 23.8,
          changeLabel: '先月比',
          icon: FileText,
          color: 'bg-green-500',
          subValue: '完了率 94.2%',
        },
        {
          title: '今月の売上',
          value: '¥4,827,650',
          change: 18.4,
          changeLabel: '先月比',
          icon: DollarSign,
          color: 'bg-purple-500',
          subValue: 'MRR ¥3.2M',
        },
        {
          title: 'アクティブ相談',
          value: '156',
          change: -5.2,
          changeLabel: '先週比',
          icon: MessageCircle,
          color: 'bg-orange-500',
          subValue: '待機中 23',
        },
      ]);

      setRecentActivities([
        {
          id: '1',
          type: 'payment',
          description: 'エンタープライズプラン契約',
          timestamp: '2分前',
          user: '株式会社テクノロジー',
          amount: '¥298,000',
        },
        {
          id: '2',
          type: 'user_signup',
          description: '新規ユーザー登録（LINE連携）',
          timestamp: '5分前',
          user: '田中美咲',
        },
        {
          id: '3',
          type: 'diagnosis_completed',
          description: 'キャリア適性診断 完了',
          timestamp: '8分前',
          user: '山田太郎',
        },
        {
          id: '4',
          type: 'report_generated',
          description: 'AIレポート生成完了（GPT-4）',
          timestamp: '12分前',
          user: '佐藤花子',
        },
        {
          id: '5',
          type: 'chat_started',
          description: '相談セッション開始',
          timestamp: '15分前',
          user: '鈴木一郎 → 山本カウンセラー',
        },
        {
          id: '6',
          type: 'company_registered',
          description: '新規企業登録（プレミアムプラン）',
          timestamp: '23分前',
          user: '株式会社イノベーション',
          amount: '¥49,800/月',
        },
        {
          id: '7',
          type: 'payment',
          description: 'クレジット購入 5,000pt',
          timestamp: '28分前',
          user: '高橋健太',
          amount: '¥5,500',
        },
        {
          id: '8',
          type: 'diagnosis_completed',
          description: 'メンタルヘルスチェック 完了',
          timestamp: '35分前',
          user: '伊藤さくら',
        },
        {
          id: '9',
          type: 'report_generated',
          description: 'AIレポート生成完了（GPT-4）',
          timestamp: '42分前',
          user: '渡辺大輔',
        },
        {
          id: '10',
          type: 'user_signup',
          description: '新規ユーザー登録（Google連携）',
          timestamp: '48分前',
          user: '小林真理',
        },
      ]);

      setTopDiagnoses([
        {
          id: '1',
          name: '16タイプ性格診断',
          completions: 3245,
          revenue: 0,
          trend: 15.2,
          category: '性格',
        },
        {
          id: '2',
          name: 'キャリア適性診断Pro',
          completions: 1876,
          revenue: 1875600,
          trend: 28.4,
          category: 'キャリア',
        },
        {
          id: '3',
          name: 'ストレス総合チェック',
          completions: 1654,
          revenue: 826800,
          trend: 8.7,
          category: 'メンタル',
        },
        {
          id: '4',
          name: '深層心理分析',
          completions: 987,
          revenue: 986100,
          trend: 42.1,
          category: '心理',
        },
        {
          id: '5',
          name: '恋愛傾向診断',
          completions: 856,
          revenue: 341600,
          trend: -3.2,
          category: '恋愛',
        },
      ]);

      setActiveCounselors([
        {
          id: '1',
          name: '山本カウンセラー',
          status: 'online',
          activeChats: 3,
          rating: 4.9,
          responseTime: '2分',
        },
        {
          id: '2',
          name: '佐々木カウンセラー',
          status: 'busy',
          activeChats: 5,
          rating: 4.8,
          responseTime: '5分',
        },
        {
          id: '3',
          name: '中村カウンセラー',
          status: 'online',
          activeChats: 2,
          rating: 4.7,
          responseTime: '3分',
        },
        {
          id: '4',
          name: '加藤カウンセラー',
          status: 'away',
          activeChats: 0,
          rating: 4.6,
          responseTime: '-',
        },
      ]);

      setPendingTasks([
        {
          id: '1',
          type: 'payout',
          title: 'アフィリエイト報酬支払い承認（5件）',
          priority: 'high',
          dueDate: '本日',
        },
        {
          id: '2',
          type: 'report',
          title: '失敗レポート再生成依頼（3件）',
          priority: 'high',
          dueDate: '本日',
        },
        {
          id: '3',
          type: 'support',
          title: 'カスタマーサポート対応待ち（12件）',
          priority: 'medium',
          dueDate: '今日中',
        },
        {
          id: '4',
          type: 'verification',
          title: '企業アカウント審査（2件）',
          priority: 'medium',
          dueDate: '明日まで',
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
        return <Brain className="w-4 h-4 text-orange-500" />;
      case 'chat_started':
        return <MessageCircle className="w-4 h-4 text-teal-500" />;
      case 'company_registered':
        return <Building2 className="w-4 h-4 text-indigo-500" />;
    }
  };

  const getStatusColor = (status: ActiveCounselor['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'away':
        return 'bg-gray-400';
    }
  };

  const getPriorityBadge = (priority: PendingTask['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge variant="error">緊急</Badge>;
      case 'medium':
        return <Badge variant="warning">中</Badge>;
      case 'low':
        return <Badge variant="default">低</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-24 bg-gray-200 rounded" />
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
          <p className="text-gray-500 mt-1">サービスの概要と主要指標を確認できます</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          {(['today', 'week', 'month', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                selectedPeriod === period
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              {period === 'today' && '今日'}
              {period === 'week' && '今週'}
              {period === 'month' && '今月'}
              {period === 'year' && '今年'}
            </button>
          ))}
        </div>
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
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-500">{stat.title}</p>
                      {stat.subValue && (
                        <p className="text-xs text-gray-400">{stat.subValue}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>売上推移</CardTitle>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-deep-navy" />
                <span className="text-gray-600">売上</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-gray-600">利益</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Simulated Chart */}
            <div className="h-64 flex items-end gap-2 px-4">
              {[65, 78, 52, 89, 95, 72, 85, 92, 78, 105, 98, 115].map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col gap-1">
                    <div
                      className="w-full bg-deep-navy rounded-t"
                      style={{ height: `${value * 1.8}px` }}
                    />
                    <div
                      className="w-full bg-green-500 rounded-t"
                      style={{ height: `${value * 0.6}px` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">
                    {['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'][index]}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-500">年間売上</p>
                <p className="text-xl font-bold text-gray-900">¥48,276,500</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">年間利益</p>
                <p className="text-xl font-bold text-green-600">¥16,096,830</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">利益率</p>
                <p className="text-xl font-bold text-gray-900">33.4%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>最近のアクティビティ</CardTitle>
            <Button variant="ghost" size="sm">すべて見る</Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[400px] overflow-y-auto">
              {recentActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className={cn(
                    'flex items-start gap-3 px-6 py-3 hover:bg-gray-50',
                    index !== recentActivities.length - 1 && 'border-b border-gray-100'
                  )}
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-500">{activity.user}</p>
                      {activity.amount && (
                        <Badge variant="success" className="text-xs">{activity.amount}</Badge>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{activity.timestamp}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Diagnoses */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>人気診断ランキング</CardTitle>
            <Button variant="ghost" size="sm">詳細を見る</Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b">
                    <th className="pb-3 font-medium">順位</th>
                    <th className="pb-3 font-medium">診断名</th>
                    <th className="pb-3 font-medium">カテゴリ</th>
                    <th className="pb-3 font-medium text-right">完了数</th>
                    <th className="pb-3 font-medium text-right">売上</th>
                    <th className="pb-3 font-medium text-right">前月比</th>
                  </tr>
                </thead>
                <tbody>
                  {topDiagnoses.map((diagnosis, index) => (
                    <tr key={diagnosis.id} className="border-b last:border-0">
                      <td className="py-3">
                        <div className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                          index === 0 ? 'bg-yellow-100 text-yellow-700' :
                          index === 1 ? 'bg-gray-100 text-gray-600' :
                          index === 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-50 text-gray-500'
                        )}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-3 font-medium text-gray-900">{diagnosis.name}</td>
                      <td className="py-3">
                        <Badge variant="default">{diagnosis.category}</Badge>
                      </td>
                      <td className="py-3 text-right text-gray-600">{diagnosis.completions.toLocaleString()}</td>
                      <td className="py-3 text-right text-gray-900 font-medium">
                        {diagnosis.revenue > 0 ? `¥${diagnosis.revenue.toLocaleString()}` : '無料'}
                      </td>
                      <td className="py-3 text-right">
                        <span className={cn(
                          'flex items-center justify-end gap-1',
                          diagnosis.trend >= 0 ? 'text-green-600' : 'text-red-600'
                        )}>
                          {diagnosis.trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {Math.abs(diagnosis.trend)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>対応が必要なタスク</CardTitle>
            <Badge variant="error">{pendingTasks.length}件</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <div className="mt-0.5">
                    {task.type === 'payout' && <DollarSign className="w-4 h-4 text-green-500" />}
                    {task.type === 'report' && <FileBarChart className="w-4 h-4 text-orange-500" />}
                    {task.type === 'support' && <MessageCircle className="w-4 h-4 text-blue-500" />}
                    {task.type === 'verification' && <CheckCircle className="w-4 h-4 text-purple-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getPriorityBadge(task.priority)}
                      <span className="text-xs text-gray-500">期限: {task.dueDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Counselors */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>オンライン相談員</CardTitle>
            <Button variant="ghost" size="sm">管理画面へ</Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {activeCounselors.map((counselor) => (
                <div key={counselor.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="relative">
                    <div className="w-10 h-10 bg-deep-navy rounded-full flex items-center justify-center text-white font-medium">
                      {counselor.name.charAt(0)}
                    </div>
                    <div className={cn(
                      'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white',
                      getStatusColor(counselor.status)
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{counselor.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {counselor.activeChats}
                      </span>
                      <span className="flex items-center gap-1">
                        ⭐ {counselor.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {counselor.responseTime}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Registration Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">新規登録推移（7日間）</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { day: '今日', count: 47, target: 50 },
                { day: '昨日', count: 52, target: 50 },
                { day: '2日前', count: 38, target: 50 },
                { day: '3日前', count: 61, target: 50 },
                { day: '4日前', count: 43, target: 50 },
                { day: '5日前', count: 55, target: 50 },
                { day: '6日前', count: 49, target: 50 },
              ].map((item) => (
                <div key={item.day} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-12">{item.day}</span>
                  <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden relative">
                    <div
                      className={cn(
                        'h-full rounded flex items-center justify-end pr-2',
                        item.count >= item.target ? 'bg-green-500' : 'bg-blue-500'
                      )}
                      style={{ width: `${Math.min((item.count / 70) * 100, 100)}%` }}
                    >
                      <span className="text-xs text-white font-medium">{item.count}</span>
                    </div>
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-red-400"
                      style={{ left: `${(item.target / 70) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t text-sm">
              <span className="text-gray-500">週間合計</span>
              <span className="font-bold text-gray-900">345名</span>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">システム状況</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'APIサーバー', status: 'operational', latency: '23ms' },
                { name: 'データベース', status: 'operational', latency: '8ms' },
                { name: 'AI生成サービス', status: 'operational', latency: '1.2s' },
                { name: '決済ゲートウェイ', status: 'operational', latency: '156ms' },
                { name: 'メール配信', status: 'degraded', latency: '遅延中' },
              ].map((service) => (
                <div key={service.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'w-2 h-2 rounded-full',
                      service.status === 'operational' ? 'bg-green-500' :
                      service.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                    )} />
                    <span className="text-sm text-gray-700">{service.name}</span>
                  </div>
                  <span className={cn(
                    'text-xs',
                    service.status === 'operational' ? 'text-gray-500' : 'text-yellow-600 font-medium'
                  )}>
                    {service.latency}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">稼働率（30日）</span>
                <span className="font-bold text-green-600">99.97%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

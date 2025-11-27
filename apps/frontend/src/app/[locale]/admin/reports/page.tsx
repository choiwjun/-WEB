'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import {
  Search,
  RefreshCw,
  Eye,
  Download,
  Filter,
  FileText,
  Brain,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Zap,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  User,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Report {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  diagnosisId: string;
  diagnosisTitle: string;
  diagnosisCategory: string;
  status: 'pending' | 'generating' | 'completed' | 'failed' | 'cancelled';
  generatedAt?: string;
  requestedAt: string;
  creditCost: number;
  aiModel: 'GPT-4' | 'GPT-4-Turbo' | 'GPT-3.5-Turbo' | 'Claude-3';
  tokensUsed?: number;
  generationTime?: number; // seconds
  errorMessage?: string;
  retryCount: number;
  pageCount?: number;
  wordCount?: number;
}

const statusConfig: Record<Report['status'], { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: '待機中', color: 'bg-gray-100 text-gray-700', icon: <Clock className="w-4 h-4" /> },
  generating: { label: '生成中', color: 'bg-blue-100 text-blue-700', icon: <RefreshCw className="w-4 h-4 animate-spin" /> },
  completed: { label: '完了', color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-4 h-4" /> },
  failed: { label: '失敗', color: 'bg-red-100 text-red-700', icon: <AlertCircle className="w-4 h-4" /> },
  cancelled: { label: 'キャンセル', color: 'bg-gray-100 text-gray-700', icon: <AlertTriangle className="w-4 h-4" /> },
};

const modelConfig: Record<Report['aiModel'], { color: string; speed: string }> = {
  'GPT-4': { color: 'bg-purple-500', speed: '高品質' },
  'GPT-4-Turbo': { color: 'bg-indigo-500', speed: '高速' },
  'GPT-3.5-Turbo': { color: 'bg-blue-500', speed: '標準' },
  'Claude-3': { color: 'bg-orange-500', speed: '高品質' },
};

export default function ReportsManagementPage() {
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modelFilter, setModelFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const loadReports = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockReports: Report[] = [
        {
          id: 'RPT-20240320-001',
          userId: 'USR001',
          userName: '山田太郎',
          userEmail: 'yamada@example.com',
          diagnosisId: 'DIAG002',
          diagnosisTitle: 'キャリア適性診断Pro',
          diagnosisCategory: 'CAREER',
          status: 'completed',
          generatedAt: '2024-03-20 14:35:42',
          requestedAt: '2024-03-20 14:30:15',
          creditCost: 1000,
          aiModel: 'GPT-4',
          tokensUsed: 12456,
          generationTime: 327,
          retryCount: 0,
          pageCount: 8,
          wordCount: 3245,
        },
        {
          id: 'RPT-20240320-002',
          userId: 'USR003',
          userName: '佐藤花子',
          userEmail: 'sato@example.com',
          diagnosisId: 'DIAG004',
          diagnosisTitle: '深層心理分析',
          diagnosisCategory: 'PSYCHOLOGY',
          status: 'generating',
          requestedAt: '2024-03-20 15:45:00',
          creditCost: 1500,
          aiModel: 'GPT-4-Turbo',
          retryCount: 0,
        },
        {
          id: 'RPT-20240320-003',
          userId: 'USR005',
          userName: '田中一郎',
          userEmail: 'tanaka@example.com',
          diagnosisId: 'DIAG005',
          diagnosisTitle: '恋愛傾向診断',
          diagnosisCategory: 'RELATIONSHIP',
          status: 'completed',
          generatedAt: '2024-03-20 13:22:18',
          requestedAt: '2024-03-20 13:15:00',
          creditCost: 500,
          aiModel: 'GPT-3.5-Turbo',
          tokensUsed: 6789,
          generationTime: 145,
          retryCount: 0,
          pageCount: 5,
          wordCount: 1876,
        },
        {
          id: 'RPT-20240320-004',
          userId: 'USR007',
          userName: '鈴木美咲',
          userEmail: 'suzuki@example.com',
          diagnosisId: 'DIAG006',
          diagnosisTitle: 'メンタルヘルスチェック',
          diagnosisCategory: 'MENTAL_HEALTH',
          status: 'failed',
          requestedAt: '2024-03-20 11:30:00',
          creditCost: 800,
          aiModel: 'GPT-4',
          errorMessage: 'API rate limit exceeded. Please retry later.',
          retryCount: 3,
        },
        {
          id: 'RPT-20240320-005',
          userId: 'USR009',
          userName: '高橋健太',
          userEmail: 'takahashi@example.com',
          diagnosisId: 'DIAG008',
          diagnosisTitle: 'リーダーシップ適性診断',
          diagnosisCategory: 'CAREER',
          status: 'pending',
          requestedAt: '2024-03-20 16:00:00',
          creditCost: 1200,
          aiModel: 'Claude-3',
          retryCount: 0,
        },
        {
          id: 'RPT-20240319-001',
          userId: 'USR002',
          userName: '伊藤さくら',
          userEmail: 'ito@example.com',
          diagnosisId: 'DIAG002',
          diagnosisTitle: 'キャリア適性診断Pro',
          diagnosisCategory: 'CAREER',
          status: 'completed',
          generatedAt: '2024-03-19 18:45:30',
          requestedAt: '2024-03-19 18:38:00',
          creditCost: 1000,
          aiModel: 'GPT-4',
          tokensUsed: 11234,
          generationTime: 450,
          retryCount: 1,
          pageCount: 7,
          wordCount: 2987,
        },
        {
          id: 'RPT-20240319-002',
          userId: 'USR004',
          userName: '渡辺大輔',
          userEmail: 'watanabe@example.com',
          diagnosisId: 'DIAG004',
          diagnosisTitle: '深層心理分析',
          diagnosisCategory: 'PSYCHOLOGY',
          status: 'completed',
          generatedAt: '2024-03-19 15:12:45',
          requestedAt: '2024-03-19 15:02:20',
          creditCost: 1500,
          aiModel: 'GPT-4-Turbo',
          tokensUsed: 15678,
          generationTime: 265,
          retryCount: 0,
          pageCount: 10,
          wordCount: 4123,
        },
        {
          id: 'RPT-20240319-003',
          userId: 'USR006',
          userName: '小林真理',
          userEmail: 'kobayashi@example.com',
          diagnosisId: 'DIAG001',
          diagnosisTitle: '16タイプ性格診断',
          diagnosisCategory: 'PERSONALITY',
          status: 'completed',
          generatedAt: '2024-03-19 12:30:00',
          requestedAt: '2024-03-19 12:22:15',
          creditCost: 500,
          aiModel: 'GPT-3.5-Turbo',
          tokensUsed: 5432,
          generationTime: 98,
          retryCount: 0,
          pageCount: 4,
          wordCount: 1543,
        },
        {
          id: 'RPT-20240319-004',
          userId: 'USR008',
          userName: '中村優子',
          userEmail: 'nakamura@example.com',
          diagnosisId: 'DIAG005',
          diagnosisTitle: '恋愛傾向診断',
          diagnosisCategory: 'RELATIONSHIP',
          status: 'cancelled',
          requestedAt: '2024-03-19 10:00:00',
          creditCost: 500,
          aiModel: 'GPT-4',
          errorMessage: 'User cancelled the request',
          retryCount: 0,
        },
        {
          id: 'RPT-20240318-001',
          userId: 'USR010',
          userName: '加藤裕也',
          userEmail: 'kato@example.com',
          diagnosisId: 'DIAG004',
          diagnosisTitle: '深層心理分析',
          diagnosisCategory: 'PSYCHOLOGY',
          status: 'completed',
          generatedAt: '2024-03-18 16:45:20',
          requestedAt: '2024-03-18 16:35:00',
          creditCost: 1500,
          aiModel: 'Claude-3',
          tokensUsed: 14567,
          generationTime: 312,
          retryCount: 0,
          pageCount: 9,
          wordCount: 3876,
        },
        {
          id: 'RPT-20240318-002',
          userId: 'USR012',
          userName: '松本彩香',
          userEmail: 'matsumoto@example.com',
          diagnosisId: 'DIAG002',
          diagnosisTitle: 'キャリア適性診断Pro',
          diagnosisCategory: 'CAREER',
          status: 'completed',
          generatedAt: '2024-03-18 14:22:10',
          requestedAt: '2024-03-18 14:15:30',
          creditCost: 1000,
          aiModel: 'GPT-4-Turbo',
          tokensUsed: 10987,
          generationTime: 198,
          retryCount: 0,
          pageCount: 7,
          wordCount: 2765,
        },
        {
          id: 'RPT-20240318-003',
          userId: 'USR014',
          userName: '井上大樹',
          userEmail: 'inoue@example.com',
          diagnosisId: 'DIAG006',
          diagnosisTitle: 'メンタルヘルスチェック',
          diagnosisCategory: 'MENTAL_HEALTH',
          status: 'failed',
          requestedAt: '2024-03-18 11:00:00',
          creditCost: 800,
          aiModel: 'GPT-4',
          errorMessage: 'Internal server error. Content generation failed.',
          retryCount: 2,
        },
      ];

      setReports(mockReports);
      setIsLoading(false);
    };

    loadReports();
  }, []);

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.diagnosisTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesModel = modelFilter === 'all' || report.aiModel === modelFilter;
    return matchesSearch && matchesStatus && matchesModel;
  });

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: reports.length,
    completed: reports.filter((r) => r.status === 'completed').length,
    generating: reports.filter((r) => r.status === 'generating').length,
    pending: reports.filter((r) => r.status === 'pending').length,
    failed: reports.filter((r) => r.status === 'failed').length,
    totalTokens: reports.reduce((acc, r) => acc + (r.tokensUsed || 0), 0),
    avgGenerationTime: Math.round(
      reports.filter((r) => r.generationTime).reduce((acc, r) => acc + (r.generationTime || 0), 0) /
      reports.filter((r) => r.generationTime).length
    ),
    totalCreditsUsed: reports.filter((r) => r.status === 'completed').reduce((acc, r) => acc + r.creditCost, 0),
  };

  const handleRegenerateReport = (reportId: string) => {
    setReports(
      reports.map((r) =>
        r.id === reportId ? { ...r, status: 'generating' as const, retryCount: r.retryCount + 1 } : r
      )
    );
    // Simulate regeneration
    setTimeout(() => {
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? { 
                ...r, 
                status: 'completed' as const, 
                generatedAt: new Date().toLocaleString('ja-JP'),
                tokensUsed: Math.floor(Math.random() * 10000) + 5000,
                generationTime: Math.floor(Math.random() * 300) + 100,
                pageCount: Math.floor(Math.random() * 8) + 3,
                wordCount: Math.floor(Math.random() * 3000) + 1500,
              }
            : r
        )
      );
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AIレポート管理</h1>
          <p className="text-gray-500 mt-1">AI生成レポートの監視と管理</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            レポートエクスポート
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-gray-500">総レポート</p>
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
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-xs text-gray-500">完了</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.generating + stats.pending}</p>
                <p className="text-xs text-gray-500">処理中</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.failed}</p>
                <p className="text-xs text-gray-500">失敗</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{(stats.totalTokens / 1000).toFixed(0)}k</p>
                <p className="text-xs text-gray-500">総トークン</p>
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
                <p className="text-2xl font-bold">{stats.avgGenerationTime}s</p>
                <p className="text-xs text-gray-500">平均時間</p>
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
                placeholder="ユーザー名、メール、診断名、レポートIDで検索..."
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
              <option value="pending">待機中</option>
              <option value="generating">生成中</option>
              <option value="completed">完了</option>
              <option value="failed">失敗</option>
              <option value="cancelled">キャンセル</option>
            </select>
            <select
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-navy/20 focus:border-deep-navy"
            >
              <option value="all">すべてのモデル</option>
              <option value="GPT-4">GPT-4</option>
              <option value="GPT-4-Turbo">GPT-4-Turbo</option>
              <option value="GPT-3.5-Turbo">GPT-3.5-Turbo</option>
              <option value="Claude-3">Claude-3</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">レポートID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ユーザー</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">診断</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ステータス</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">AIモデル</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">トークン</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">時間</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">クレジット</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">リクエスト日時</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-4" colSpan={10}>
                        <div className="h-12 bg-gray-100 rounded" />
                      </td>
                    </tr>
                  ))
                ) : paginatedReports.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center text-gray-500">
                      レポートが見つかりませんでした
                    </td>
                  </tr>
                ) : (
                  paginatedReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <span className="font-mono text-xs">{report.id}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{report.userName}</p>
                          <p className="text-xs text-gray-500">{report.userEmail}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{report.diagnosisTitle}</p>
                          <p className="text-xs text-gray-500">{report.diagnosisCategory}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge className={cn('flex items-center gap-1 w-fit', statusConfig[report.status].color)}>
                          {statusConfig[report.status].icon}
                          {statusConfig[report.status].label}
                        </Badge>
                        {report.retryCount > 0 && (
                          <p className="text-xs text-orange-600 mt-1">再試行: {report.retryCount}回</p>
                        )}
                        {report.errorMessage && (
                          <p className="text-xs text-red-500 mt-1 truncate max-w-[150px]" title={report.errorMessage}>
                            {report.errorMessage}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className={cn('w-2 h-2 rounded-full', modelConfig[report.aiModel].color)} />
                          <span className="text-sm">{report.aiModel}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right text-sm">
                        {report.tokensUsed ? report.tokensUsed.toLocaleString() : '-'}
                      </td>
                      <td className="px-4 py-4 text-right text-sm">
                        {report.generationTime ? `${report.generationTime}s` : '-'}
                      </td>
                      <td className="px-4 py-4 text-right text-sm font-medium">
                        {report.creditCost.toLocaleString()}pt
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        <div>
                          <p>{report.requestedAt}</p>
                          {report.generatedAt && (
                            <p className="text-xs text-green-600">完了: {report.generatedAt}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {report.status === 'completed' && (
                            <>
                              <button className="p-2 hover:bg-gray-100 rounded-lg" title="閲覧">
                                <Eye className="w-4 h-4 text-gray-600" />
                              </button>
                              <button className="p-2 hover:bg-gray-100 rounded-lg" title="ダウンロード">
                                <Download className="w-4 h-4 text-gray-600" />
                              </button>
                            </>
                          )}
                          {(report.status === 'failed' || report.status === 'completed') && (
                            <button
                              onClick={() => handleRegenerateReport(report.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg"
                              title="再生成"
                            >
                              <RefreshCw className="w-4 h-4 text-blue-600" />
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {filteredReports.length}件中 {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, filteredReports.length)}件を表示
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Details Section */}
      {stats.completed > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>レポート品質サマリー</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-gray-900">
                  {Math.round(reports.filter((r) => r.pageCount).reduce((acc, r) => acc + (r.pageCount || 0), 0) / reports.filter((r) => r.pageCount).length)}
                </p>
                <p className="text-sm text-gray-500 mt-1">平均ページ数</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-gray-900">
                  {Math.round(reports.filter((r) => r.wordCount).reduce((acc, r) => acc + (r.wordCount || 0), 0) / reports.filter((r) => r.wordCount).length).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">平均文字数</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">
                  {((stats.completed / (stats.total - stats.pending - stats.generating)) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500 mt-1">成功率</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-gray-900">
                  ¥{Math.round(stats.totalTokens * 0.003).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">推定API費用</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

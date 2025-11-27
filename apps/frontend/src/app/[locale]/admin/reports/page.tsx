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
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Report {
  id: string;
  userId: string;
  userName: string;
  diagnosisTitle: string;
  diagnosisCategory: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  generatedAt?: string;
  requestedAt: string;
  creditCost: number;
  aiModel: string;
}

const statusConfig: Record<Report['status'], { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: '待機中', color: 'bg-gray-100 text-gray-700', icon: <Clock className="w-4 h-4" /> },
  generating: { label: '生成中', color: 'bg-blue-100 text-blue-700', icon: <RefreshCw className="w-4 h-4 animate-spin" /> },
  completed: { label: '完了', color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-4 h-4" /> },
  failed: { label: '失敗', color: 'bg-red-100 text-red-700', icon: <AlertCircle className="w-4 h-4" /> },
};

export default function ReportsManagementPage() {
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadReports = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockReports: Report[] = [
        {
          id: 'RPT001',
          userId: 'USR001',
          userName: '山田太郎',
          diagnosisTitle: '性格診断テスト',
          diagnosisCategory: 'PERSONALITY',
          status: 'completed',
          generatedAt: '2024-03-20 14:30',
          requestedAt: '2024-03-20 14:25',
          creditCost: 500,
          aiModel: 'GPT-4',
        },
        {
          id: 'RPT002',
          userId: 'USR002',
          userName: '佐藤花子',
          diagnosisTitle: 'キャリア適性診断',
          diagnosisCategory: 'CAREER',
          status: 'generating',
          requestedAt: '2024-03-20 15:00',
          creditCost: 800,
          aiModel: 'GPT-4',
        },
        {
          id: 'RPT003',
          userId: 'USR003',
          userName: '田中一郎',
          diagnosisTitle: 'ストレスチェック',
          diagnosisCategory: 'STRESS',
          status: 'completed',
          generatedAt: '2024-03-19 10:15',
          requestedAt: '2024-03-19 10:10',
          creditCost: 300,
          aiModel: 'GPT-3.5',
        },
        {
          id: 'RPT004',
          userId: 'USR004',
          userName: '鈴木美咲',
          diagnosisTitle: 'メンタルヘルスチェック',
          diagnosisCategory: 'MENTAL_HEALTH',
          status: 'failed',
          requestedAt: '2024-03-19 16:30',
          creditCost: 1000,
          aiModel: 'GPT-4',
        },
        {
          id: 'RPT005',
          userId: 'USR005',
          userName: '高橋健太',
          diagnosisTitle: '深層心理診断',
          diagnosisCategory: 'PSYCHOLOGY',
          status: 'pending',
          requestedAt: '2024-03-20 16:00',
          creditCost: 1000,
          aiModel: 'GPT-4',
        },
        {
          id: 'RPT006',
          userId: 'USR001',
          userName: '山田太郎',
          diagnosisTitle: '恋愛傾向診断',
          diagnosisCategory: 'RELATIONSHIP',
          status: 'completed',
          generatedAt: '2024-03-18 09:45',
          requestedAt: '2024-03-18 09:40',
          creditCost: 500,
          aiModel: 'GPT-4',
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
      report.diagnosisTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
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
    failed: reports.filter((r) => r.status === 'failed').length,
  };

  const handleRegenerateReport = (reportId: string) => {
    setReports(
      reports.map((r) =>
        r.id === reportId ? { ...r, status: 'generating' as const } : r
      )
    );
    // Simulate regeneration
    setTimeout(() => {
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? { ...r, status: 'completed' as const, generatedAt: new Date().toLocaleString('ja-JP') }
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-500">総レポート数</p>
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
                <p className="text-sm text-gray-500">完了</p>
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
                <p className="text-2xl font-bold">{stats.generating}</p>
                <p className="text-sm text-gray-500">生成中</p>
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
                <p className="text-sm text-gray-500">失敗</p>
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
                placeholder="ユーザー名、診断名、レポートIDで検索..."
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
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">クレジット</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">リクエスト日時</th>
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
                ) : paginatedReports.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                      レポートが見つかりませんでした
                    </td>
                  </tr>
                ) : (
                  paginatedReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <span className="font-mono text-sm">{report.id}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{report.userName}</p>
                          <p className="text-xs text-gray-500">{report.userId}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{report.diagnosisTitle}</p>
                          <p className="text-xs text-gray-500">{report.diagnosisCategory}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge className={cn('flex items-center gap-1 w-fit', statusConfig[report.status].color)}>
                          {statusConfig[report.status].icon}
                          {statusConfig[report.status].label}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Brain className="w-4 h-4 text-purple-500" />
                          <span className="text-sm">{report.aiModel}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm">{report.creditCost.toLocaleString()}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        <div>
                          <p>{report.requestedAt}</p>
                          {report.generatedAt && (
                            <p className="text-xs text-green-600">完了: {report.generatedAt}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {report.status === 'completed' && (
                            <button className="p-2 hover:bg-gray-100 rounded-lg" title="閲覧">
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
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
                          {report.status === 'completed' && (
                            <button className="p-2 hover:bg-gray-100 rounded-lg" title="ダウンロード">
                              <Download className="w-4 h-4 text-gray-600" />
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
    </div>
  );
}

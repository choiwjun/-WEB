'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  MoreHorizontal,
  FileText,
  HelpCircle,
  Clock,
  ToggleLeft,
  ToggleRight,
  Star,
  TrendingUp,
  DollarSign,
  Users,
  BarChart3,
  Globe,
  Languages,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Diagnosis {
  id: string;
  title: string;
  titleKo?: string;
  titleEn?: string;
  description: string;
  category: 'PERSONALITY' | 'PSYCHOLOGY' | 'CAREER' | 'RELATIONSHIP' | 'STRESS' | 'MENTAL_HEALTH';
  type: 'FREE' | 'PAID';
  creditCost: number;
  estimatedMinutes: number;
  totalQuestions: number;
  completionCount: number;
  averageRating: number;
  totalReviews: number;
  revenue: number;
  conversionRate: number;
  isActive: boolean;
  isFeatured: boolean;
  hasAIReport: boolean;
  supportedLanguages: ('ja' | 'ko' | 'en')[];
  createdAt: string;
  updatedAt: string;
}

const categoryLabels: Record<Diagnosis['category'], string> = {
  PERSONALITY: '性格',
  PSYCHOLOGY: '心理',
  CAREER: 'キャリア',
  RELATIONSHIP: '人間関係',
  STRESS: 'ストレス',
  MENTAL_HEALTH: 'メンタルヘルス',
};

const categoryColors: Record<Diagnosis['category'], string> = {
  PERSONALITY: 'bg-blue-100 text-blue-700',
  PSYCHOLOGY: 'bg-purple-100 text-purple-700',
  CAREER: 'bg-green-100 text-green-700',
  RELATIONSHIP: 'bg-pink-100 text-pink-700',
  STRESS: 'bg-orange-100 text-orange-700',
  MENTAL_HEALTH: 'bg-teal-100 text-teal-700',
};

export default function DiagnosisManagementPage() {
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(true);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const loadDiagnoses = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockDiagnoses: Diagnosis[] = [
        {
          id: 'DIAG001',
          title: '16タイプ性格診断',
          titleKo: '16가지 성격 유형 진단',
          titleEn: '16 Personality Types Test',
          description: 'MBTI理論に基づいた16種類の性格タイプからあなたのタイプを診断します。自己理解を深め、人間関係や仕事に活かせます。',
          category: 'PERSONALITY',
          type: 'FREE',
          creditCost: 0,
          estimatedMinutes: 15,
          totalQuestions: 60,
          completionCount: 45678,
          averageRating: 4.8,
          totalReviews: 2341,
          revenue: 0,
          conversionRate: 45.2,
          isActive: true,
          isFeatured: true,
          hasAIReport: true,
          supportedLanguages: ['ja', 'ko', 'en'],
          createdAt: '2023-06-15',
          updatedAt: '2024-03-15',
        },
        {
          id: 'DIAG002',
          title: 'キャリア適性診断Pro',
          titleKo: '커리어 적성 진단 Pro',
          titleEn: 'Career Aptitude Pro',
          description: 'あなたの強み・価値観・興味から最適なキャリアパスを提案。AIが詳細な分析レポートを生成します。',
          category: 'CAREER',
          type: 'PAID',
          creditCost: 1000,
          estimatedMinutes: 25,
          totalQuestions: 80,
          completionCount: 12456,
          averageRating: 4.9,
          totalReviews: 1876,
          revenue: 12456000,
          conversionRate: 68.5,
          isActive: true,
          isFeatured: true,
          hasAIReport: true,
          supportedLanguages: ['ja', 'ko', 'en'],
          createdAt: '2023-08-01',
          updatedAt: '2024-03-18',
        },
        {
          id: 'DIAG003',
          title: 'ストレス総合チェック',
          titleKo: '스트레스 종합 체크',
          titleEn: 'Comprehensive Stress Check',
          description: '現在のストレスレベルを多角的に測定し、具体的な対処法を提案します。',
          category: 'STRESS',
          type: 'FREE',
          creditCost: 0,
          estimatedMinutes: 10,
          totalQuestions: 30,
          completionCount: 28934,
          averageRating: 4.6,
          totalReviews: 1234,
          revenue: 0,
          conversionRate: 52.8,
          isActive: true,
          isFeatured: false,
          hasAIReport: false,
          supportedLanguages: ['ja', 'ko'],
          createdAt: '2023-07-20',
          updatedAt: '2024-02-10',
        },
        {
          id: 'DIAG004',
          title: '深層心理分析',
          titleKo: '심층 심리 분석',
          titleEn: 'Deep Psychology Analysis',
          description: '潜在意識にある本当の欲求・恐れ・可能性を探ります。GPT-4による詳細な心理分析レポート付き。',
          category: 'PSYCHOLOGY',
          type: 'PAID',
          creditCost: 1500,
          estimatedMinutes: 35,
          totalQuestions: 100,
          completionCount: 8765,
          averageRating: 4.7,
          totalReviews: 987,
          revenue: 13147500,
          conversionRate: 72.3,
          isActive: true,
          isFeatured: true,
          hasAIReport: true,
          supportedLanguages: ['ja'],
          createdAt: '2023-10-15',
          updatedAt: '2024-03-20',
        },
        {
          id: 'DIAG005',
          title: '恋愛傾向診断',
          titleKo: '연애 성향 진단',
          titleEn: 'Love Tendency Test',
          description: 'あなたの恋愛パターン、相性の良いタイプ、恋愛における強み・課題を診断します。',
          category: 'RELATIONSHIP',
          type: 'PAID',
          creditCost: 500,
          estimatedMinutes: 15,
          totalQuestions: 45,
          completionCount: 15678,
          averageRating: 4.5,
          totalReviews: 2134,
          revenue: 7839000,
          conversionRate: 58.9,
          isActive: true,
          isFeatured: false,
          hasAIReport: true,
          supportedLanguages: ['ja', 'ko', 'en'],
          createdAt: '2023-09-01',
          updatedAt: '2024-01-25',
        },
        {
          id: 'DIAG006',
          title: 'メンタルヘルスチェック',
          titleKo: '정신건강 체크',
          titleEn: 'Mental Health Check',
          description: '心の健康状態を総合的にチェック。専門家監修の信頼性の高い診断です。',
          category: 'MENTAL_HEALTH',
          type: 'PAID',
          creditCost: 800,
          estimatedMinutes: 20,
          totalQuestions: 55,
          completionCount: 6543,
          averageRating: 4.8,
          totalReviews: 567,
          revenue: 5234400,
          conversionRate: 65.4,
          isActive: true,
          isFeatured: false,
          hasAIReport: true,
          supportedLanguages: ['ja', 'en'],
          createdAt: '2023-11-10',
          updatedAt: '2024-03-01',
        },
        {
          id: 'DIAG007',
          title: 'コミュニケーション力診断',
          titleKo: '커뮤니케이션 능력 진단',
          titleEn: 'Communication Skills Test',
          description: '対人関係のスタイルとコミュニケーション能力を診断。改善ポイントを明確に。',
          category: 'RELATIONSHIP',
          type: 'FREE',
          creditCost: 0,
          estimatedMinutes: 12,
          totalQuestions: 35,
          completionCount: 19876,
          averageRating: 4.4,
          totalReviews: 1543,
          revenue: 0,
          conversionRate: 48.7,
          isActive: true,
          isFeatured: false,
          hasAIReport: false,
          supportedLanguages: ['ja', 'ko'],
          createdAt: '2023-12-01',
          updatedAt: '2024-02-15',
        },
        {
          id: 'DIAG008',
          title: 'リーダーシップ適性診断',
          titleKo: '리더십 적성 진단',
          titleEn: 'Leadership Aptitude Test',
          description: 'あなたのリーダーシップスタイルと強み・弱みを分析。チームマネジメントに活かせます。',
          category: 'CAREER',
          type: 'PAID',
          creditCost: 1200,
          estimatedMinutes: 30,
          totalQuestions: 70,
          completionCount: 4321,
          averageRating: 4.6,
          totalReviews: 432,
          revenue: 5185200,
          conversionRate: 61.2,
          isActive: true,
          isFeatured: false,
          hasAIReport: true,
          supportedLanguages: ['ja', 'en'],
          createdAt: '2024-01-05',
          updatedAt: '2024-03-10',
        },
        {
          id: 'DIAG009',
          title: 'バーンアウト危険度チェック',
          titleKo: '번아웃 위험도 체크',
          titleEn: 'Burnout Risk Assessment',
          description: '燃え尽き症候群のリスクを早期発見。予防のためのアドバイス付き。',
          category: 'STRESS',
          type: 'FREE',
          creditCost: 0,
          estimatedMinutes: 8,
          totalQuestions: 25,
          completionCount: 32145,
          averageRating: 4.7,
          totalReviews: 2876,
          revenue: 0,
          conversionRate: 55.3,
          isActive: true,
          isFeatured: true,
          hasAIReport: false,
          supportedLanguages: ['ja', 'ko', 'en'],
          createdAt: '2023-08-15',
          updatedAt: '2024-02-28',
        },
        {
          id: 'DIAG010',
          title: '自己肯定感診断',
          titleKo: '자존감 진단',
          titleEn: 'Self-Esteem Assessment',
          description: '自己肯定感のレベルと、それを高めるための具体的な方法を提案します。',
          category: 'PSYCHOLOGY',
          type: 'PAID',
          creditCost: 600,
          estimatedMinutes: 15,
          totalQuestions: 40,
          completionCount: 11234,
          averageRating: 4.5,
          totalReviews: 876,
          revenue: 6740400,
          conversionRate: 54.8,
          isActive: false,
          isFeatured: false,
          hasAIReport: true,
          supportedLanguages: ['ja'],
          createdAt: '2023-09-20',
          updatedAt: '2024-01-10',
        },
      ];

      setDiagnoses(mockDiagnoses);
      setIsLoading(false);
    };

    loadDiagnoses();
  }, []);

  const filteredDiagnoses = diagnoses.filter((diagnosis) => {
    const matchesSearch = diagnosis.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || diagnosis.category === categoryFilter;
    const matchesType = typeFilter === 'all' || diagnosis.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && diagnosis.isActive) ||
      (statusFilter === 'inactive' && !diagnosis.isActive);
    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  const handleToggleActive = (id: string) => {
    setDiagnoses(
      diagnoses.map((d) => (d.id === id ? { ...d, isActive: !d.isActive } : d))
    );
  };

  const handleToggleFeatured = (id: string) => {
    setDiagnoses(
      diagnoses.map((d) => (d.id === id ? { ...d, isFeatured: !d.isFeatured } : d))
    );
  };

  const stats = {
    total: diagnoses.length,
    active: diagnoses.filter((d) => d.isActive).length,
    totalCompletions: diagnoses.reduce((acc, d) => acc + d.completionCount, 0),
    totalRevenue: diagnoses.reduce((acc, d) => acc + d.revenue, 0),
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">診断管理</h1>
          <p className="text-gray-500 mt-1">診断テストの作成・編集・管理</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>新規診断作成</Button>
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
                <p className="text-sm text-gray-500">総診断数</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ToggleRight className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-sm text-gray-500">有効な診断</p>
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
                <p className="text-2xl font-bold">{stats.totalCompletions.toLocaleString()}</p>
                <p className="text-sm text-gray-500">総回答数</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">¥{(stats.totalRevenue / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-gray-500">総売上</p>
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
                placeholder="診断名で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-navy/20 focus:border-deep-navy"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-navy/20 focus:border-deep-navy"
            >
              <option value="all">すべてのカテゴリ</option>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-navy/20 focus:border-deep-navy"
            >
              <option value="all">すべてのタイプ</option>
              <option value="FREE">無料</option>
              <option value="PAID">有料</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-deep-navy/20 focus:border-deep-navy"
            >
              <option value="all">すべてのステータス</option>
              <option value="active">有効</option>
              <option value="inactive">無効</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Diagnosis List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-48 bg-gray-100 rounded" />
              </CardContent>
            </Card>
          ))
        ) : filteredDiagnoses.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-gray-500">
            診断が見つかりませんでした
          </div>
        ) : (
          filteredDiagnoses.map((diagnosis, index) => (
            <motion.div
              key={diagnosis.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={cn(!diagnosis.isActive && 'opacity-60')}>
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={categoryColors[diagnosis.category]}>
                        {categoryLabels[diagnosis.category]}
                      </Badge>
                      <Badge variant={diagnosis.type === 'FREE' ? 'success' : 'info'}>
                        {diagnosis.type === 'FREE' ? '無料' : `${diagnosis.creditCost.toLocaleString()}pt`}
                      </Badge>
                      {diagnosis.isFeatured && (
                        <Badge variant="warning" className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          おすすめ
                        </Badge>
                      )}
                      {diagnosis.hasAIReport && (
                        <Badge variant="default" className="bg-purple-100 text-purple-700">
                          AI分析
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleFeatured(diagnosis.id)}
                        className={cn(
                          'p-1.5 rounded-lg transition-colors',
                          diagnosis.isFeatured ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:bg-gray-100'
                        )}
                        title="おすすめに設定"
                      >
                        <Star className={cn('w-4 h-4', diagnosis.isFeatured && 'fill-current')} />
                      </button>
                      <button
                        onClick={() => handleToggleActive(diagnosis.id)}
                        className="text-gray-400 hover:text-gray-600"
                        title={diagnosis.isActive ? '無効化' : '有効化'}
                      >
                        {diagnosis.isActive ? (
                          <ToggleRight className="w-6 h-6 text-green-500" />
                        ) : (
                          <ToggleLeft className="w-6 h-6" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{diagnosis.title}</h3>
                  <p className="text-xs text-gray-400 mb-2">{diagnosis.id}</p>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{diagnosis.description}</p>

                  {/* Supported Languages */}
                  <div className="flex items-center gap-2 mb-4">
                    <Languages className="w-4 h-4 text-gray-400" />
                    <div className="flex gap-1">
                      {diagnosis.supportedLanguages.map((lang) => (
                        <span key={lang} className="text-sm">
                          {lang === 'ja' && '🇯🇵'}
                          {lang === 'ko' && '🇰🇷'}
                          {lang === 'en' && '🇺🇸'}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                        <HelpCircle className="w-3 h-3" />
                      </div>
                      <p className="text-sm font-semibold">{diagnosis.totalQuestions}</p>
                      <p className="text-xs text-gray-500">問</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                        <Clock className="w-3 h-3" />
                      </div>
                      <p className="text-sm font-semibold">{diagnosis.estimatedMinutes}</p>
                      <p className="text-xs text-gray-500">分</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                        <Users className="w-3 h-3" />
                      </div>
                      <p className="text-sm font-semibold">{(diagnosis.completionCount / 1000).toFixed(1)}k</p>
                      <p className="text-xs text-gray-500">回答</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                        <Star className="w-3 h-3 fill-current" />
                      </div>
                      <p className="text-sm font-semibold">{diagnosis.averageRating}</p>
                      <p className="text-xs text-gray-500">({diagnosis.totalReviews})</p>
                    </div>
                  </div>

                  {/* Revenue & Conversion */}
                  {diagnosis.type === 'PAID' && (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg mb-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">
                          売上: ¥{diagnosis.revenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">
                          CVR: {diagnosis.conversionRate}%
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-400">
                      <p>作成: {diagnosis.createdAt}</p>
                      <p>更新: {diagnosis.updatedAt}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="プレビュー">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="編集">
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="統計">
                        <BarChart3 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="複製">
                        <Copy className="w-4 h-4 text-gray-600" />
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
    </div>
  );
}

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
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Diagnosis {
  id: string;
  title: string;
  description: string;
  category: 'PERSONALITY' | 'PSYCHOLOGY' | 'CAREER' | 'RELATIONSHIP' | 'STRESS' | 'MENTAL_HEALTH';
  type: 'FREE' | 'PAID';
  creditCost: number;
  estimatedMinutes: number;
  totalQuestions: number;
  completionCount: number;
  isActive: boolean;
  createdAt: string;
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

  useEffect(() => {
    const loadDiagnoses = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockDiagnoses: Diagnosis[] = [
        {
          id: '1',
          title: '性格診断テスト',
          description: 'あなたの性格タイプを16種類から診断します',
          category: 'PERSONALITY',
          type: 'FREE',
          creditCost: 0,
          estimatedMinutes: 15,
          totalQuestions: 60,
          completionCount: 1234,
          isActive: true,
          createdAt: '2024-01-15',
        },
        {
          id: '2',
          title: 'ストレスチェック診断',
          description: '現在のストレスレベルを測定し、対策を提案します',
          category: 'STRESS',
          type: 'FREE',
          creditCost: 0,
          estimatedMinutes: 10,
          totalQuestions: 30,
          completionCount: 856,
          isActive: true,
          createdAt: '2024-01-20',
        },
        {
          id: '3',
          title: 'キャリア適性診断',
          description: 'あなたに向いている職業や働き方を診断します',
          category: 'CAREER',
          type: 'PAID',
          creditCost: 500,
          estimatedMinutes: 20,
          totalQuestions: 50,
          completionCount: 432,
          isActive: true,
          createdAt: '2024-02-01',
        },
        {
          id: '4',
          title: '恋愛傾向診断',
          description: 'あなたの恋愛パターンと相性の良いタイプを診断',
          category: 'RELATIONSHIP',
          type: 'PAID',
          creditCost: 300,
          estimatedMinutes: 15,
          totalQuestions: 40,
          completionCount: 678,
          isActive: true,
          createdAt: '2024-02-10',
        },
        {
          id: '5',
          title: 'メンタルヘルスチェック',
          description: '心の健康状態を総合的にチェックします',
          category: 'MENTAL_HEALTH',
          type: 'PAID',
          creditCost: 800,
          estimatedMinutes: 25,
          totalQuestions: 70,
          completionCount: 234,
          isActive: false,
          createdAt: '2024-02-15',
        },
        {
          id: '6',
          title: '深層心理診断',
          description: '潜在意識にあるあなたの本当の欲求を探ります',
          category: 'PSYCHOLOGY',
          type: 'PAID',
          creditCost: 1000,
          estimatedMinutes: 30,
          totalQuestions: 80,
          completionCount: 156,
          isActive: true,
          createdAt: '2024-03-01',
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
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleToggleActive = (id: string) => {
    setDiagnoses(
      diagnoses.map((d) => (d.id === id ? { ...d, isActive: !d.isActive } : d))
    );
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
                <p className="text-2xl font-bold">{diagnoses.length}</p>
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
                <p className="text-2xl font-bold">{diagnoses.filter((d) => d.isActive).length}</p>
                <p className="text-sm text-gray-500">有効な診断</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {diagnoses.reduce((acc, d) => acc + d.totalQuestions, 0)}
                </p>
                <p className="text-sm text-gray-500">総設問数</p>
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
                <p className="text-2xl font-bold">
                  {diagnoses.reduce((acc, d) => acc + d.completionCount, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">総回答数</p>
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
          </div>
        </CardContent>
      </Card>

      {/* Diagnosis List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-gray-100 rounded" />
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
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Badge className={categoryColors[diagnosis.category]}>
                        {categoryLabels[diagnosis.category]}
                      </Badge>
                      <Badge variant={diagnosis.type === 'FREE' ? 'success' : 'info'}>
                        {diagnosis.type === 'FREE' ? '無料' : `${diagnosis.creditCost}クレジット`}
                      </Badge>
                    </div>
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

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{diagnosis.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{diagnosis.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <HelpCircle className="w-4 h-4" />
                      {diagnosis.totalQuestions}問
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      約{diagnosis.estimatedMinutes}分
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {diagnosis.completionCount.toLocaleString()}回答
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400">作成日: {diagnosis.createdAt}</span>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="プレビュー">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="編集">
                        <Edit className="w-4 h-4 text-gray-600" />
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

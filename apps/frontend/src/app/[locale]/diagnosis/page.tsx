'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Clock, HelpCircle, Sparkles, Star, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, Badge, Button } from '@/components/ui';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Diagnosis {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'FREE' | 'PAID';
  creditCost: number;
  estimatedMinutes: number;
  totalQuestions: number;
  thumbnailUrl?: string;
  completionCount?: number;
  rating?: number;
}

// Mock data for demonstration
const mockDiagnoses: Diagnosis[] = [
  {
    id: 'diag-001',
    title: '16タイプ性格診断',
    description: 'MBTI理論に基づいた16種類の性格タイプからあなたのタイプを診断します。自己理解を深め、人間関係や仕事に活かせます。',
    category: 'PERSONALITY',
    type: 'FREE',
    creditCost: 0,
    estimatedMinutes: 15,
    totalQuestions: 60,
    completionCount: 45678,
    rating: 4.8,
  },
  {
    id: 'diag-002',
    title: 'キャリア適性診断Pro',
    description: 'あなたの強み・価値観・興味から最適なキャリアパスを提案。転職や就活に役立つ詳細なAIレポート付き。',
    category: 'CAREER',
    type: 'PAID',
    creditCost: 500,
    estimatedMinutes: 25,
    totalQuestions: 80,
    completionCount: 12340,
    rating: 4.9,
  },
  {
    id: 'diag-003',
    title: 'ストレスチェック診断',
    description: '現在のストレスレベルを測定し、その原因と対処法を分析。メンタルヘルスケアの第一歩に最適です。',
    category: 'STRESS',
    type: 'FREE',
    creditCost: 0,
    estimatedMinutes: 10,
    totalQuestions: 30,
    completionCount: 34521,
    rating: 4.7,
  },
  {
    id: 'diag-004',
    title: '対人関係スタイル診断',
    description: 'あなたのコミュニケーションパターンを分析し、人間関係を改善するためのアドバイスを提供します。',
    category: 'RELATIONSHIP',
    type: 'PAID',
    creditCost: 300,
    estimatedMinutes: 20,
    totalQuestions: 50,
    completionCount: 8765,
    rating: 4.6,
  },
  {
    id: 'diag-005',
    title: '心理的安全性チェック',
    description: 'チームや職場の心理的安全性を測定。組織改善のための具体的な提案を含む詳細レポート。',
    category: 'PSYCHOLOGY',
    type: 'PAID',
    creditCost: 400,
    estimatedMinutes: 15,
    totalQuestions: 45,
    completionCount: 5432,
    rating: 4.8,
  },
  {
    id: 'diag-006',
    title: 'メンタルウェルネス診断',
    description: '心の健康状態を包括的にチェック。うつ・不安傾向の早期発見と専門家への相談タイミングを提案。',
    category: 'MENTAL_HEALTH',
    type: 'FREE',
    creditCost: 0,
    estimatedMinutes: 12,
    totalQuestions: 40,
    completionCount: 23456,
    rating: 4.9,
  },
  {
    id: 'diag-007',
    title: 'エニアグラム性格診断',
    description: '9つの性格タイプであなたの本質を探る。自己成長と人間関係の改善に役立つ深い洞察を提供。',
    category: 'PERSONALITY',
    type: 'PAID',
    creditCost: 350,
    estimatedMinutes: 20,
    totalQuestions: 55,
    completionCount: 15678,
    rating: 4.7,
  },
  {
    id: 'diag-008',
    title: 'ワークライフバランス診断',
    description: '仕事と生活のバランスを数値化。燃え尽き症候群の予防と生活改善のためのアドバイス付き。',
    category: 'STRESS',
    type: 'FREE',
    creditCost: 0,
    estimatedMinutes: 8,
    totalQuestions: 25,
    completionCount: 19876,
    rating: 4.5,
  },
  {
    id: 'diag-009',
    title: 'リーダーシップスタイル診断',
    description: 'あなたのリーダーシップタイプを分析。チームマネジメントに活かせる具体的なアドバイスを提供。',
    category: 'CAREER',
    type: 'PAID',
    creditCost: 450,
    estimatedMinutes: 18,
    totalQuestions: 50,
    completionCount: 7654,
    rating: 4.8,
  },
  {
    id: 'diag-010',
    title: '恋愛傾向診断',
    description: 'あなたの恋愛パターンと相性の良いタイプを分析。より良い関係構築のヒントを提供します。',
    category: 'RELATIONSHIP',
    type: 'FREE',
    creditCost: 0,
    estimatedMinutes: 12,
    totalQuestions: 35,
    completionCount: 28901,
    rating: 4.6,
  },
  {
    id: 'diag-011',
    title: '認知バイアス診断',
    description: 'あなたの思考パターンに潜むバイアスを発見。より客観的な判断力を身につけるためのガイド付き。',
    category: 'PSYCHOLOGY',
    type: 'PAID',
    creditCost: 380,
    estimatedMinutes: 15,
    totalQuestions: 42,
    completionCount: 4321,
    rating: 4.7,
  },
  {
    id: 'diag-012',
    title: '睡眠の質チェック',
    description: '睡眠習慣と質を評価。より良い睡眠のための具体的な改善策を提案します。',
    category: 'MENTAL_HEALTH',
    type: 'FREE',
    creditCost: 0,
    estimatedMinutes: 7,
    totalQuestions: 20,
    completionCount: 31245,
    rating: 4.4,
  },
];

const categoryColors: Record<string, string> = {
  PERSONALITY: 'bg-info/10 text-info',
  PSYCHOLOGY: 'bg-success/10 text-success',
  CAREER: 'bg-warning/10 text-warning',
  RELATIONSHIP: 'bg-error/10 text-error',
  STRESS: 'bg-sand-brown/20 text-sand-brown',
  MENTAL_HEALTH: 'bg-deep-navy/10 text-deep-navy',
};

export default function DiagnosisListPage() {
  const t = useTranslations('diagnosis');
  const locale = useLocale();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const data = await api.getDiagnoses({
          category: selectedCategory || undefined,
          type: selectedType || undefined,
          language: locale.toUpperCase(),
        });
        if (data && data.length > 0) {
          setDiagnoses(data);
        } else {
          // Use mock data if API returns empty
          let filteredData = [...mockDiagnoses];
          if (selectedCategory) {
            filteredData = filteredData.filter((d) => d.category === selectedCategory);
          }
          if (selectedType) {
            filteredData = filteredData.filter((d) => d.type === selectedType);
          }
          setDiagnoses(filteredData);
        }
      } catch (error) {
        console.error('Failed to fetch diagnoses, using mock data:', error);
        // Use mock data on API failure
        let filteredData = [...mockDiagnoses];
        if (selectedCategory) {
          filteredData = filteredData.filter((d) => d.category === selectedCategory);
        }
        if (selectedType) {
          filteredData = filteredData.filter((d) => d.type === selectedType);
        }
        setDiagnoses(filteredData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiagnoses();
  }, [selectedCategory, selectedType, locale]);

  const categories = [
    { key: 'PERSONALITY', label: t('categories.personality') },
    { key: 'PSYCHOLOGY', label: t('categories.psychology') },
    { key: 'CAREER', label: t('categories.career') },
    { key: 'RELATIONSHIP', label: t('categories.relationship') },
    { key: 'STRESS', label: t('categories.stress') },
    { key: 'MENTAL_HEALTH', label: t('categories.mental_health') },
  ];

  return (
    <div className="min-h-screen bg-calm-beige">
      {/* Hero Section */}
      <section className="bg-deep-navy text-soft-white py-16">
        <div className="container-wide text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-h1 mb-4"
          >
            {t('list.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-warm-gray max-w-2xl mx-auto"
          >
            専門家監修の診断で、あなたの可能性を発見しましょう
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-soft-white border-b border-sand-brown/20">
        <div className="container-wide">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                すべて
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.key}
                  variant={selectedCategory === category.key ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.key)}
                >
                  {category.label}
                </Button>
              ))}
            </div>

            {/* Type Filter */}
            <div className="flex gap-2">
              <Button
                variant={selectedType === null ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedType(null)}
              >
                すべて
              </Button>
              <Button
                variant={selectedType === 'FREE' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedType('FREE')}
              >
                {t('list.free')}
              </Button>
              <Button
                variant={selectedType === 'PAID' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedType('PAID')}
              >
                {t('list.paid')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Diagnosis Grid */}
      <section className="section">
        <div className="container-wide">
          {isLoading ? (
            <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-sand-brown/20 rounded-t-card" />
                  <CardContent>
                    <div className="h-4 bg-sand-brown/20 rounded w-1/4 mb-2" />
                    <div className="h-6 bg-sand-brown/20 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-sand-brown/20 rounded w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : diagnoses.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-warm-gray text-lg">診断が見つかりませんでした</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-6">
              {diagnoses.map((diagnosis, index) => (
                <motion.div
                  key={diagnosis.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/${locale}/diagnosis/${diagnosis.id}`}>
                    <Card variant="hover" className="h-full overflow-hidden group">
                      {/* Thumbnail */}
                      <div className="relative h-48 bg-gradient-to-br from-calm-beige to-sand-brown/30 flex items-center justify-center">
                        {diagnosis.thumbnailUrl ? (
                          <img
                            src={diagnosis.thumbnailUrl}
                            alt={diagnosis.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Sparkles className="w-16 h-16 text-sand-brown/50 group-hover:scale-110 transition-transform" />
                        )}
                        {/* Type Badge */}
                        <div className="absolute top-4 right-4">
                          <Badge variant={diagnosis.type === 'FREE' ? 'success' : 'info'}>
                            {diagnosis.type === 'FREE'
                              ? t('list.free')
                              : t('list.credits', { credits: diagnosis.creditCost })}
                          </Badge>
                        </div>
                      </div>

                      <CardContent>
                        {/* Category */}
                        <Badge
                          className={cn('mb-2', categoryColors[diagnosis.category] || 'bg-gray-100')}
                        >
                          {t(`categories.${diagnosis.category.toLowerCase()}`)}
                        </Badge>

                        {/* Title */}
                        <h3 className="text-h3 text-deep-navy mb-2 group-hover:text-sand-brown transition-colors">
                          {diagnosis.title}
                        </h3>

                        {/* Description */}
                        <p className="text-warm-gray text-sm mb-3 line-clamp-2">
                          {diagnosis.description}
                        </p>

                        {/* Rating & Completion Count */}
                        {(diagnosis.rating || diagnosis.completionCount) && (
                          <div className="flex items-center gap-3 mb-3 text-sm">
                            {diagnosis.rating && (
                              <span className="flex items-center gap-1 text-yellow-500">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="font-medium">{diagnosis.rating}</span>
                              </span>
                            )}
                            {diagnosis.completionCount && (
                              <span className="flex items-center gap-1 text-warm-gray">
                                <Users className="w-4 h-4" />
                                <span>{diagnosis.completionCount.toLocaleString()}人が受診</span>
                              </span>
                            )}
                          </div>
                        )}

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-sm text-warm-gray">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {t('list.time', { minutes: diagnosis.estimatedMinutes })}
                          </span>
                          <span className="flex items-center gap-1">
                            <HelpCircle className="w-4 h-4" />
                            {t('list.questions', { count: diagnosis.totalQuestions })}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

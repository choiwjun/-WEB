'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Clock, HelpCircle, Sparkles } from 'lucide-react';
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
}

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
        setDiagnoses(data);
      } catch (error) {
        console.error('Failed to fetch diagnoses:', error);
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
                        <p className="text-warm-gray text-sm mb-4 line-clamp-2">
                          {diagnosis.description}
                        </p>

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

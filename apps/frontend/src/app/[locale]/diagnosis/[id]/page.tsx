'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Clock, HelpCircle, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, Badge, Button } from '@/components/ui';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { cn } from '@/lib/utils';

interface DiagnosisDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'FREE' | 'PAID';
  creditCost: number;
  estimatedMinutes: number;
  totalQuestions: number;
  questions: Question[];
}

interface Question {
  id: string;
  questionText: string;
  questionType: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'SCALE' | 'TEXT';
  order: number;
  isRequired: boolean;
  options: Option[];
}

interface Option {
  id: string;
  text: string;
  order: number;
}

export default function DiagnosisDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('diagnosis');
  const { isAuthenticated } = useAuthStore();

  const [diagnosis, setDiagnosis] = useState<DiagnosisDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        const data = await api.getDiagnosis(params.id as string, locale.toUpperCase());
        setDiagnosis(data);
      } catch (error) {
        console.error('Failed to fetch diagnosis:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiagnosis();
  }, [params.id, locale]);

  const startDiagnosis = async () => {
    if (!isAuthenticated) {
      router.push(`/${locale}/auth/login?redirect=/diagnosis/${params.id}`);
      return;
    }

    try {
      const session = await api.startDiagnosisSession(params.id as string);
      setSessionId(session.id);
      setCurrentQuestionIndex(0);
    } catch (error) {
      console.error('Failed to start diagnosis:', error);
    }
  };

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const submitAnswer = async () => {
    if (!sessionId || !diagnosis) return;

    const currentQuestion = diagnosis.questions[currentQuestionIndex];
    const answer = answers[currentQuestion.id];

    if (currentQuestion.isRequired && !answer) {
      return;
    }

    try {
      setIsSubmitting(true);
      await api.submitAnswer(sessionId, {
        questionId: currentQuestion.id,
        selectedOptionIds: Array.isArray(answer) ? answer : answer ? [answer] : undefined,
      });

      if (currentQuestionIndex < diagnosis.questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        // Complete diagnosis
        const result = await api.completeDiagnosis(sessionId);
        router.push(`/${locale}/diagnosis/result/${result.id}`);
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-navy" />
      </div>
    );
  }

  if (!diagnosis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-warm-gray">診断が見つかりませんでした</p>
      </div>
    );
  }

  // Show diagnosis info before starting
  if (!sessionId) {
    return (
      <div className="min-h-screen bg-calm-beige py-12">
        <div className="container-narrow">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            戻る
          </Button>

          <Card className="overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-deep-navy to-sand-brown flex items-center justify-center">
              <h1 className="text-h1 text-soft-white text-center px-4">{diagnosis.title}</h1>
            </div>
            <CardContent className="p-8">
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant={diagnosis.type === 'FREE' ? 'success' : 'info'}>
                  {diagnosis.type === 'FREE'
                    ? t('list.free')
                    : t('list.credits', { credits: diagnosis.creditCost })}
                </Badge>
                <Badge className="bg-sand-brown/20 text-sand-brown">
                  {t(`categories.${diagnosis.category.toLowerCase()}`)}
                </Badge>
              </div>

              <p className="text-deep-navy mb-8 leading-relaxed">{diagnosis.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-calm-beige rounded-card p-4 text-center">
                  <Clock className="w-6 h-6 text-sand-brown mx-auto mb-2" />
                  <p className="text-sm text-warm-gray">所要時間</p>
                  <p className="font-semibold text-deep-navy">約{diagnosis.estimatedMinutes}分</p>
                </div>
                <div className="bg-calm-beige rounded-card p-4 text-center">
                  <HelpCircle className="w-6 h-6 text-sand-brown mx-auto mb-2" />
                  <p className="text-sm text-warm-gray">設問数</p>
                  <p className="font-semibold text-deep-navy">{diagnosis.totalQuestions}問</p>
                </div>
              </div>

              <Button onClick={startDiagnosis} className="w-full" size="lg">
                {t('detail.startButton')}
              </Button>

              {!isAuthenticated && (
                <p className="text-sm text-warm-gray text-center mt-4">
                  ※ 診断を受けるには{' '}
                  <button
                    onClick={() => router.push(`/${locale}/auth/login`)}
                    className="text-deep-navy underline"
                  >
                    ログイン
                  </button>
                  が必要です
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show questions
  const currentQuestion = diagnosis.questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion.id];
  const progress = ((currentQuestionIndex + 1) / diagnosis.questions.length) * 100;

  return (
    <div className="min-h-screen bg-calm-beige py-12">
      <div className="container-narrow">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-warm-gray mb-2">
            <span>{t('session.progress', { current: currentQuestionIndex + 1, total: diagnosis.questions.length })}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-sand-brown/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-deep-navy"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="flex items-center gap-2 text-sm text-warm-gray mb-4">
                  <span>{t('session.question', { number: currentQuestionIndex + 1 })}</span>
                  {currentQuestion.isRequired && (
                    <Badge variant="error" size="sm">{t('session.required')}</Badge>
                  )}
                </div>

                <h2 className="text-h2 text-deep-navy mb-8">{currentQuestion.questionText}</h2>

                {/* Options */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => {
                    const isSelected = currentQuestion.questionType === 'MULTIPLE_CHOICE'
                      ? currentAnswer?.includes(option.id)
                      : currentAnswer === option.id;

                    return (
                      <button
                        key={option.id}
                        onClick={() => {
                          if (currentQuestion.questionType === 'MULTIPLE_CHOICE') {
                            const newAnswer = currentAnswer?.includes(option.id)
                              ? currentAnswer.filter((id: string) => id !== option.id)
                              : [...(currentAnswer || []), option.id];
                            handleAnswer(currentQuestion.id, newAnswer);
                          } else {
                            handleAnswer(currentQuestion.id, option.id);
                          }
                        }}
                        className={cn(
                          'w-full text-left p-4 rounded-card border-2 transition-all',
                          isSelected
                            ? 'border-deep-navy bg-deep-navy/5'
                            : 'border-sand-brown/30 hover:border-sand-brown'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
                              isSelected
                                ? 'border-deep-navy bg-deep-navy'
                                : 'border-sand-brown'
                            )}
                          >
                            {isSelected && <Check className="w-4 h-4 text-white" />}
                          </div>
                          <span className={cn(isSelected ? 'text-deep-navy font-medium' : 'text-warm-gray')}>
                            {option.text}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            {t('session.previousQuestion')}
          </Button>
          <Button
            onClick={submitAnswer}
            isLoading={isSubmitting}
            disabled={currentQuestion.isRequired && !currentAnswer}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {currentQuestionIndex < diagnosis.questions.length - 1
              ? t('session.nextQuestion')
              : t('session.submitDiagnosis')}
          </Button>
        </div>
      </div>
    </div>
  );
}

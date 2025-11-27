'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';

export function CTASection() {
  const t = useTranslations('landing.cta');
  const locale = useLocale();

  return (
    <section className="section bg-deep-navy relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #C5B9A3 1px, transparent 1px),
                             radial-gradient(circle at 75% 75%, #C5B9A3 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-h1 text-soft-white mb-4">{t('title')}</h2>
          <p className="text-warm-gray text-lg mb-8">{t('description')}</p>
          <Link href={`/${locale}/diagnosis/free`}>
            <Button
              variant="secondary"
              size="lg"
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="bg-calm-beige text-deep-navy hover:bg-soft-white"
            >
              {t('button')}
            </Button>
          </Link>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-12 flex flex-wrap justify-center gap-6 text-warm-gray text-sm"
          >
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              登録無料
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              クレジットカード不要
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              5分で診断完了
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

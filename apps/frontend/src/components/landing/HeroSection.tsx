'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui';
import { motion } from 'framer-motion';

export function HeroSection() {
  const t = useTranslations('landing.hero');
  const locale = useLocale();

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-calm-beige via-soft-white to-calm-beige opacity-50" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231D1F24' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container-wide relative z-10">
        <div className="grid grid-cols-1 desktop:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center desktop:text-left"
          >
            <h1 className="text-4xl tablet:text-5xl desktop:text-6xl font-bold text-deep-navy leading-tight mb-6">
              {t('title')}
            </h1>
            <p className="text-lg tablet:text-xl text-warm-gray mb-8 max-w-xl mx-auto desktop:mx-0">
              {t('subtitle')}
            </p>
            <div className="flex flex-col tablet:flex-row gap-4 justify-center desktop:justify-start">
              <Link href={`/${locale}/diagnosis/free`}>
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  className="w-full tablet:w-auto"
                >
                  {t('cta')}
                </Button>
              </Link>
              <Link href={`/${locale}/diagnosis`}>
                <Button variant="outline" size="lg" className="w-full tablet:w-auto">
                  {t('secondaryCta')}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-12 grid grid-cols-3 gap-8 max-w-lg mx-auto desktop:mx-0"
            >
              <div className="text-center desktop:text-left">
                <p className="text-2xl tablet:text-3xl font-bold text-deep-navy">10万+</p>
                <p className="text-sm text-warm-gray">診断実績</p>
              </div>
              <div className="text-center desktop:text-left">
                <p className="text-2xl tablet:text-3xl font-bold text-deep-navy">98%</p>
                <p className="text-sm text-warm-gray">満足度</p>
              </div>
              <div className="text-center desktop:text-left">
                <p className="text-2xl tablet:text-3xl font-bold text-deep-navy">15+</p>
                <p className="text-sm text-warm-gray">診断種類</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative hidden desktop:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Abstract illustration placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-sand-brown/20 to-calm-beige rounded-[3rem] transform rotate-3" />
              <div className="absolute inset-0 bg-gradient-to-br from-deep-navy/5 to-sand-brown/10 rounded-[3rem] transform -rotate-3" />
              <div className="absolute inset-8 bg-soft-white rounded-[2rem] shadow-card flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 bg-calm-beige rounded-full mx-auto mb-6 flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-deep-navy"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                      />
                    </svg>
                  </div>
                  <p className="text-deep-navy font-semibold">専門家監修</p>
                  <p className="text-warm-gray text-sm mt-1">信頼性の高い診断</p>
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 right-12 bg-success text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
              >
                ✓ 無料診断あり
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-4 left-12 bg-deep-navy text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
              >
                AIレポート生成
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

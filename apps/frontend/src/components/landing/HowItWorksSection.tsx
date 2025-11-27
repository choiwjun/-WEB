'use client';

import { useTranslations } from 'next-intl';
import { ClipboardList, MessageSquare, BarChart3, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    key: 'step1',
    icon: ClipboardList,
    number: '01',
  },
  {
    key: 'step2',
    icon: MessageSquare,
    number: '02',
  },
  {
    key: 'step3',
    icon: BarChart3,
    number: '03',
  },
  {
    key: 'step4',
    icon: Sparkles,
    number: '04',
  },
];

export function HowItWorksSection() {
  const t = useTranslations('landing.howItWorks');

  return (
    <section className="section bg-calm-beige">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-h1 text-deep-navy mb-4">{t('title')}</h2>
          <p className="text-warm-gray max-w-2xl mx-auto">
            簡単4ステップで診断を完了し、あなたに最適化されたレポートを受け取れます。
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden desktop:block absolute top-24 left-0 right-0 h-0.5 bg-sand-brown/30" />

          <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="relative text-center"
                >
                  {/* Number circle */}
                  <div className="relative inline-flex items-center justify-center w-16 h-16 bg-deep-navy text-white rounded-full mb-6 z-10">
                    <span className="text-xl font-bold">{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 mx-auto mb-4 text-sand-brown">
                    <Icon className="w-full h-full" strokeWidth={1.5} />
                  </div>

                  {/* Content */}
                  <h3 className="text-h3 text-deep-navy mb-2">{t(`${step.key}.title`)}</h3>
                  <p className="text-warm-gray text-sm">{t(`${step.key}.description`)}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

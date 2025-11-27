'use client';

import { useTranslations } from 'next-intl';
import { Shield, Target, User, HeadphonesIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui';

const features = [
  {
    key: 'professional',
    icon: Shield,
    color: 'bg-info/10 text-info',
  },
  {
    key: 'accurate',
    icon: Target,
    color: 'bg-success/10 text-success',
  },
  {
    key: 'personalized',
    icon: User,
    color: 'bg-warning/10 text-warning',
  },
  {
    key: 'support',
    icon: HeadphonesIcon,
    color: 'bg-error/10 text-error',
  },
];

export function FeaturesSection() {
  const t = useTranslations('landing.features');

  return (
    <section className="section bg-soft-white">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-h1 text-deep-navy mb-4">{t('title')}</h2>
          <p className="text-warm-gray max-w-2xl mx-auto">
            専門家監修の心理診断で、あなたの可能性を発見し、より良い人生への一歩を踏み出しましょう。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card variant="hover" className="h-full text-center">
                  <CardContent>
                    <div
                      className={`w-16 h-16 rounded-full ${feature.color} mx-auto mb-4 flex items-center justify-center`}
                    >
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-h3 text-deep-navy mb-2">
                      {t(`${feature.key}.title`)}
                    </h3>
                    <p className="text-warm-gray text-sm">
                      {t(`${feature.key}.description`)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

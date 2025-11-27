'use client';

import { useTranslations } from 'next-intl';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui';

const testimonials = [
  {
    id: 1,
    name: '田中 美咲',
    role: '会社員・30代',
    content:
      '性格診断の結果が驚くほど自分に当てはまっていました。AIレポートのアドバイスを実践してから、人間関係が改善されました。',
    rating: 5,
    avatar: 'T',
  },
  {
    id: 2,
    name: '鈴木 健太',
    role: 'フリーランス・40代',
    content:
      'キャリア診断で自分の強みを再発見できました。転職活動の自己PRに役立ち、希望の職に就くことができました。',
    rating: 5,
    avatar: 'S',
  },
  {
    id: 3,
    name: '山田 花子',
    role: '大学生・20代',
    content:
      '無料診断から始めましたが、詳細レポートが欲しくなり有料版も試しました。就活前に自己分析ができて本当に良かったです。',
    rating: 5,
    avatar: 'Y',
  },
];

export function TestimonialsSection() {
  const t = useTranslations('landing.testimonials');

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
            実際に診断を受けた方々からの感想をご紹介します。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 tablet:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card variant="hover" className="h-full">
                <CardContent>
                  {/* Quote icon */}
                  <Quote className="w-8 h-8 text-sand-brown/50 mb-4" />

                  {/* Rating */}
                  <div className="flex space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-deep-navy mb-6 leading-relaxed">
                    {testimonial.content}
                  </p>

                  {/* Author */}
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-sand-brown/20 rounded-full flex items-center justify-center mr-3">
                      <span className="text-deep-navy font-semibold">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-deep-navy">{testimonial.name}</p>
                      <p className="text-sm text-warm-gray">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

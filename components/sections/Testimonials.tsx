'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { staggerContainer, staggerItem, viewportConfig } from '@/lib/animations';
import SectionWrapper from '@/components/ui/SectionWrapper';

const gradients = [
  'from-re-blue to-re-blue/70',
  'from-re-yellow to-re-yellow/70',
  'from-success to-success/70'
];

export default function Testimonials() {
  const t = useTranslations('testimonials');
  const items = t.raw('items') as Array<{
    quote: string;
    name: string;
    role: string;
    initial: string;
  }>;

  return (
    <SectionWrapper>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-4">
          {t('title')}
        </h2>
        <p className="text-lg text-text-secondary">
          {t('subtitle')}
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            variants={staggerItem}
            className="bg-white shadow-sm rounded-xl p-6 border border-border hover:shadow-md transition-all"
          >
            {/* Stars */}
            <div className="flex gap-0.5 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-re-yellow" fill="#f3be1b" />
              ))}
            </div>

            {/* Quote */}
            <p className="text-text-secondary italic leading-relaxed mb-6">
              &ldquo;{item.quote}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradients[idx]} flex items-center justify-center`}>
                <span className="text-white font-bold text-lg">{item.initial}</span>
              </div>
              <div>
                <p className="font-bold text-text-primary">{item.name}</p>
                <p className="text-sm text-text-secondary">{item.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Globe, ThumbsDown, AlertCircle, SearchX, TrendingDown, Clock } from 'lucide-react';
import { staggerContainer, staggerItem, hoverLift, viewportConfig } from '@/lib/animations';
import SectionWrapper from '@/components/ui/SectionWrapper';

const painPoints = [
  { key: 'no_site', icon: Globe },
  { key: 'facebook', icon: ThumbsDown },
  { key: 'tech_fear', icon: AlertCircle },
  { key: 'no_google', icon: SearchX },
  { key: 'losing_clients', icon: TrendingDown },
  { key: 'manual_processes', icon: Clock }
];

export default function Problem() {
  const t = useTranslations('problem');

  return (
    <SectionWrapper background="lighter">
      <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary text-center mb-12">
        {t('title')}
      </h2>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {painPoints.map(({ key, icon: Icon }) => (
          <motion.div
            key={key}
            variants={staggerItem}
            whileHover={hoverLift}
            className="bg-white shadow-sm rounded-xl p-6 border border-border cursor-default hover:shadow-md transition-all"
          >
            <Icon className="w-12 h-12 text-error mb-4" strokeWidth={1.5} />
            <p className="text-lg font-bold text-text-primary">
              {t(`cards.${key}`)}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}

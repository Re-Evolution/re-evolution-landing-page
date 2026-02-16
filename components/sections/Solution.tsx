'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Laptop, Zap, Bot, MapPin, Mail, Headphones, ArrowRight } from 'lucide-react';
import { staggerContainer, staggerItem, viewportConfig } from '@/lib/animations';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { brandify } from '@/lib/brand';

const services = [
  { key: 'landing_pages', icon: Laptop },
  { key: 'automations', icon: Zap },
  { key: 'ai_assistants', icon: Bot },
  { key: 'google_business', icon: MapPin },
  { key: 'email', icon: Mail },
  { key: 'support', icon: Headphones }
];

export default function Solution() {
  const t = useTranslations('solution');

  return (
    <SectionWrapper id="servicos">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-4">
          {brandify(t('title'))}
        </h2>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {services.map(({ key, icon: Icon }) => (
          <motion.div
            key={key}
            variants={staggerItem}
            className="group bg-white shadow-sm rounded-xl p-6 border border-border hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default"
          >
            <div className="w-14 h-14 rounded-xl bg-re-blue/10 flex items-center justify-center mb-4 group-hover:rotate-[360deg] transition-transform duration-700">
              <Icon className="w-7 h-7 text-re-blue" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">
              {t(`services.${key}.title`)}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {t(`services.${key}.description`)}
            </p>
            <div className="mt-4 flex items-center gap-1 text-re-blue text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {t('learn_more')} <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ClipboardList, FileText, Code, Rocket } from 'lucide-react';
import { staggerContainer, staggerItem, viewportConfig } from '@/lib/animations';
import SectionWrapper from '@/components/ui/SectionWrapper';

const steps = [
  { key: 'diagnosis', icon: ClipboardList, color: 'bg-re-blue' },
  { key: 'proposal', icon: FileText, color: 'bg-re-yellow' },
  { key: 'development', icon: Code, color: 'bg-re-blue' },
  { key: 'launch', icon: Rocket, color: 'bg-success' }
];

export default function Process() {
  const t = useTranslations('process');

  return (
    <SectionWrapper id="processo" background="lighter">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-4">
          {t('title')}
        </h2>
        <p className="text-lg text-text-secondary">
          {t('subtitle')}
        </p>
      </div>

      <motion.div
        className="relative"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {/* Horizontal line - desktop only */}
        <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-border" aria-hidden="true" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map(({ key, icon: Icon, color }, index) => (
            <motion.div
              key={key}
              variants={staggerItem}
              className="relative text-center"
            >
              {/* Step number circle */}
              <div className="relative z-10 mx-auto mb-4">
                <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center mx-auto shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-re-dark-blue border-2 border-bg-primary rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {index + 1}
                </span>
              </div>

              {/* Content */}
              <div className="mt-4">
                <h3 className="text-lg font-bold text-text-primary mb-1">
                  {t(`steps.${key}.title`)}
                </h3>
                <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold text-re-blue bg-re-blue/10 rounded-full">
                  {t(`steps.${key}.time`)}
                </span>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {t(`steps.${key}.description`)}
                </p>
              </div>

              {/* Vertical connector for mobile */}
              {index < steps.length - 1 && (
                <div className="lg:hidden w-0.5 h-8 bg-border mx-auto mt-4" aria-hidden="true" />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SectionWrapper>
  );
}

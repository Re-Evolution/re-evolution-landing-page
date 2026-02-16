'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { staggerContainer, staggerItem, viewportConfig } from '@/lib/animations';
import SectionWrapper from '@/components/ui/SectionWrapper';

export default function FAQ() {
  const t = useTranslations('faq');
  const items = t.raw('items') as Array<{ question: string; answer: string }>;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <SectionWrapper background="lighter">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-4">
          {t('title')}
        </h2>
        <p className="text-lg text-text-secondary">
          {t('subtitle')}
        </p>
      </div>

      <motion.div
        className="max-w-3xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            variants={staggerItem}
            className="border-b border-border"
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full flex items-center justify-between py-5 text-left cursor-pointer group"
              aria-expanded={openIndex === idx}
            >
              <span className="text-base font-semibold text-text-primary pr-4 group-hover:text-re-blue transition-colors">
                {item.question}
              </span>
              <motion.span
                animate={{ rotate: openIndex === idx ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0"
              >
                {openIndex === idx ? (
                  <Minus className="w-5 h-5 text-re-blue" />
                ) : (
                  <Plus className="w-5 h-5 text-text-secondary" />
                )}
              </motion.span>
            </button>

            <AnimatePresence>
              {openIndex === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="pb-5 text-text-secondary leading-relaxed">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}

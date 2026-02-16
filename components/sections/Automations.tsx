'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { FileText, Cog, Mail, Sheet, MessageCircle, ArrowDown } from 'lucide-react';
import { staggerContainer, staggerItem, viewportConfig } from '@/lib/animations';

const flowSteps = [
  { key: 'form', icon: FileText, color: 'bg-re-blue' },
  { key: 'make', icon: Cog, color: 'bg-re-yellow' }
];

const outputs = [
  { key: 'email', icon: Mail, color: 'bg-success' },
  { key: 'sheets', icon: Sheet, color: 'bg-re-blue' },
  { key: 'telegram', icon: MessageCircle, color: 'bg-whatsapp' }
];

export default function Automations() {
  const t = useTranslations('automations');

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-re-blue/5 via-re-blue/[0.02] to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          {/* Step 1: Form */}
          <motion.div variants={staggerItem} className="flex justify-center mb-4">
            <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-md border border-border/50">
              <div className="w-10 h-10 bg-re-blue rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-text-primary">{t('flow.form')}</span>
            </div>
          </motion.div>

          {/* Arrow down */}
          <motion.div variants={staggerItem} className="flex justify-center mb-4">
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowDown className="w-6 h-6 text-re-blue" />
            </motion.div>
          </motion.div>

          {/* Step 2: Make.com */}
          <motion.div variants={staggerItem} className="flex justify-center mb-4">
            <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-md border border-re-yellow/30">
              <div className="w-10 h-10 bg-re-yellow rounded-lg flex items-center justify-center">
                <Cog className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-text-primary">{t('flow.make')}</span>
            </div>
          </motion.div>

          {/* Split arrows */}
          <motion.div variants={staggerItem} className="flex justify-center mb-4">
            <svg width="200" height="40" className="text-border" aria-hidden="true">
              <line x1="100" y1="0" x2="30" y2="40" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="100" y1="0" x2="100" y2="40" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="100" y1="0" x2="170" y2="40" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
            </svg>
          </motion.div>

          {/* Outputs */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {outputs.map(({ key, icon: Icon, color }) => (
              <motion.div
                key={key}
                variants={staggerItem}
                className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-md border border-border/50"
              >
                <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-text-primary">{t(`flow.${key}`)}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Highlight text */}
        <motion.p
          variants={staggerItem}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="mt-10 text-center text-lg font-medium text-text-secondary max-w-2xl mx-auto bg-white/60 backdrop-blur-sm rounded-xl px-6 py-4 border border-border/50"
        >
          {t('highlight')}
        </motion.p>
      </div>
    </section>
  );
}

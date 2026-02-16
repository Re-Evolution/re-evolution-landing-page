'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Star, Shield, ChevronDown, MessageCircle } from 'lucide-react';
import { staggerContainer, staggerItem, viewportConfig } from '@/lib/animations';
import { trackCTA } from '@/lib/analytics';
import SectionWrapper from '@/components/ui/SectionWrapper';
import Button from '@/components/ui/Button';

interface ComparisonRow {
  feature: string;
  essential: string;
  managed: string;
}

export default function Pricing() {
  const t = useTranslations('pricing');
  const [expandedEssential, setExpandedEssential] = useState(false);
  const [expandedManaged, setExpandedManaged] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const comparisonRows = t.raw('comparison.rows') as ComparisonRow[];

  return (
    <SectionWrapper id="precos">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-4">
          {t('title')}
        </h2>
        <p className="text-lg text-text-secondary">
          {t('subtitle')}
        </p>
      </div>

      {/* Pricing Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto mb-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {/* Essential Card */}
        <motion.div
          variants={staggerItem}
          className="relative pt-7"
        >
          {/* Tab Badge */}
          <div className="absolute top-0 left-6 z-10">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-success text-white text-xs font-bold rounded-t-lg shadow-sm">
              <Shield className="w-3.5 h-3.5" />
              {t('guarantee_30')}
            </span>
          </div>

          <div className="bg-white shadow-sm rounded-2xl p-8 border-2 border-border transition-all hover:shadow-md">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-text-primary mb-1">
              {t('plans.essential.name')}
            </h3>
            <p className="text-sm text-re-blue font-medium mb-4">
              {t('plans.essential.tagline')}
            </p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-extrabold text-text-primary">
                {t('plans.essential.price')}€
              </span>
            </div>
            <p className="text-sm text-text-secondary mt-1 font-medium">
              {t('one_time')}
            </p>
          </div>

          <p className="text-sm text-text-secondary text-center mb-6">
            {t('plans.essential.description')}
          </p>

          {/* Features (always visible) */}
          <ul className="space-y-3 mb-4">
            {(t.raw('plans.essential.features') as string[]).map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <span className="text-sm text-text-secondary">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Expandable Details */}
          <button
            onClick={() => setExpandedEssential(!expandedEssential)}
            className="w-full flex items-center justify-center gap-1 py-2 text-sm text-re-blue font-medium hover:text-re-dark-blue transition-colors cursor-pointer"
            aria-expanded={expandedEssential}
          >
            {expandedEssential ? t('hide_details') : t('view_all')}
            <motion.span
              animate={{ rotate: expandedEssential ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.span>
          </button>

          <AnimatePresence>
            {expandedEssential && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-3 pb-1 border-t border-border mt-2">
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {t('footnote_domain')}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6">
            <Button
              href="#diagnostico"
              variant="secondary"
              className="w-full"
              onClick={() => trackCTA('Pricing_essential')}
            >
              {t('cta')}
            </Button>
          </div>
          </div>
        </motion.div>

        {/* Managed Card */}
        <motion.div
          variants={staggerItem}
          className="relative pt-7"
        >
          {/* Tab Badge */}
          <div className="absolute top-0 left-6 z-10">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-re-blue text-white text-xs font-bold rounded-t-lg shadow-sm">
              <Star className="w-3.5 h-3.5" fill="currentColor" />
              {t('most_popular')}
            </span>
          </div>

          <div className="bg-white shadow-sm rounded-2xl p-8 border-2 border-re-blue shadow-lg shadow-re-blue/15 transition-all hover:shadow-xl">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-text-primary mb-1">
              {t('plans.managed.name')}
            </h3>
            <p className="text-sm text-re-blue font-medium mb-4">
              {t('plans.managed.tagline')}
            </p>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-text-primary">
                  {t('plans.managed.price_setup')}€
                </span>
                <span className="text-sm text-text-secondary">{t('setup_label')}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-text-primary">
                  + {t('plans.managed.price_monthly')}€
                </span>
                <span className="text-sm text-text-secondary">{t('per_month')}</span>
              </div>
            </div>
            <p className="text-xs text-re-blue font-medium mt-2">
              {t('per_day')} &middot; {t('contract')}
            </p>
          </div>

          <p className="text-sm text-text-secondary text-center mb-4">
            {t('plans.managed.description')}
          </p>

          <p className="text-sm font-semibold text-re-blue mb-3">
            {t('plans.managed.includes')}
          </p>

          {/* Features (always visible) */}
          <ul className="space-y-3 mb-4">
            {(t.raw('plans.managed.features') as string[]).map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <span className="text-sm text-text-secondary">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Expandable Details */}
          <button
            onClick={() => setExpandedManaged(!expandedManaged)}
            className="w-full flex items-center justify-center gap-1 py-2 text-sm text-re-blue font-medium hover:text-re-dark-blue transition-colors cursor-pointer"
            aria-expanded={expandedManaged}
          >
            {expandedManaged ? t('hide_details') : t('view_all')}
            <motion.span
              animate={{ rotate: expandedManaged ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.span>
          </button>

          <AnimatePresence>
            {expandedManaged && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-3 pb-1 border-t border-border mt-2 space-y-2">
                  <p className="text-xs text-re-blue font-medium">
                    {t('addons_note')}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6">
            <Button
              href="#diagnostico"
              variant="primary"
              className="w-full"
              onClick={() => trackCTA('Pricing_managed')}
            >
              {t('cta')}
            </Button>
          </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Compare Packages Accordion */}
      <div className="max-w-4xl mx-auto mb-10">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="w-full flex items-center justify-center gap-2 py-3 text-base font-semibold text-re-blue hover:text-re-dark-blue transition-colors cursor-pointer"
          aria-expanded={showComparison}
        >
          {showComparison ? t('hide_compare') : t('compare')}
          <motion.span
            animate={{ rotate: showComparison ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.span>
        </button>

        <AnimatePresence>
          {showComparison && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-xl border border-border shadow-sm overflow-x-auto mt-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-text-primary w-2/5"></th>
                      <th className="text-center py-3 px-4 font-semibold text-text-primary w-[30%]">
                        {t('plans.essential.name')}
                      </th>
                      <th className="text-center py-3 px-4 font-bold text-re-blue w-[30%] bg-re-blue/5">
                        {t('plans.managed.name')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row, idx) => (
                      <tr
                        key={idx}
                        className={`border-b border-border/50 ${idx % 2 === 0 ? '' : 'bg-bg-primary/30'}`}
                      >
                        <td className="py-3 px-4 text-text-secondary font-medium">
                          {row.feature}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <ComparisonCell value={row.essential} />
                        </td>
                        <td className="py-3 px-4 text-center bg-re-blue/5">
                          <ComparisonCell value={row.managed} highlight />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-text-secondary px-4 py-3 border-t border-border/50">
                  {t('comparison.footnote')}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA Final */}
      <div className="text-center">
        <Button
          href="#diagnostico"
          variant="primary"
          size="lg"
          onClick={() => trackCTA('Pricing_final_cta')}
        >
          <MessageCircle className="w-5 h-5" />
          {t('cta_final')}
        </Button>
      </div>
    </SectionWrapper>
  );
}

function ComparisonCell({ value, highlight = false }: { value: string; highlight?: boolean }) {
  if (value === '✓') {
    return <Check className={`w-5 h-5 mx-auto ${highlight ? 'text-re-blue' : 'text-success'}`} />;
  }
  if (value === '✗') {
    return <X className="w-5 h-5 text-text-secondary/40 mx-auto" />;
  }
  return (
    <span className={`text-sm ${highlight ? 'font-semibold text-text-primary' : 'text-text-secondary'}`}>
      {value}
    </span>
  );
}

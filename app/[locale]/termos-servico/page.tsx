import { useTranslations, useLocale } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import Logo from '@/components/ui/Logo';

export default function TermsPage() {
  const t = useTranslations('terms');
  const locale = useLocale();
  const sections = [
    'acceptance',
    'services',
    'payments',
    'deadlines',
    'warranty',
    'ip',
    'liability',
    'contact_section'
  ] as const;

  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Mini header */}
      <header className="bg-white border-b border-border/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <a href={`/${locale}`} className="flex items-center gap-2">
            <Logo size={28} />
            <div className="flex items-baseline">
              <span className="text-xl font-extrabold text-re-yellow">Re-</span>
              <span className="text-xl font-extrabold text-re-blue">Evolution</span>
            </div>
          </a>
          <a
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-re-blue hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            {locale === 'pt' ? 'Voltar ao site' : 'Back to site'}
          </a>
        </div>
      </header>

      <main className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-border/50 p-8 md:p-12">
            <div className="mb-8 pb-6 border-b border-border/50">
              <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-2">
                {t('title')}
              </h1>
              <p className="text-sm text-text-secondary">{t('last_updated')}</p>
            </div>

            <div className="space-y-8">
              {sections.map((section) => (
                <div key={section}>
                  <h2 className="text-lg font-bold text-text-primary mb-2">
                    {t(`sections.${section}.title`)}
                  </h2>
                  <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                    {t(`sections.${section}.content`)}
                  </p>
                </div>
              ))}
            </div>

            {/* Back link bottom */}
            <div className="mt-12 pt-6 border-t border-border/50 text-center">
              <a
                href={`/${locale}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-re-blue hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                {locale === 'pt' ? 'Voltar à página principal' : 'Back to homepage'}
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Mini footer */}
      <footer className="border-t border-border/50 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
          <p className="text-xs text-text-secondary">
            © 2025{' '}
            <span className="font-bold text-re-yellow">Re-</span>
            <span className="font-bold text-re-blue">Evolution</span>
            , Digital Services
          </p>
        </div>
      </footer>
    </div>
  );
}

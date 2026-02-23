import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';
import { routing } from '@/i18n/routing';
import CookieBanner from '@/components/widgets/CookieBanner';
import Script from 'next/script';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter'
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEN = locale === 'en';
  return {
    title: isEN
      ? 'Re-Evolution - Digital Transformation for Local Businesses | Lisbon'
      : 'Re-Evolution - Transformação Digital para Negócios Locais | Lisboa',
    description: isEN
      ? 'Professional landing pages with intelligent automations. We help restaurants, lawyers and SMEs win clients online. From €300. Lisbon, Portugal.'
      : 'Landing pages profissionais com automações inteligentes. Ajudamos restaurantes, advogados e PMEs a conquistarem clientes online. Desde €300. Lisboa, Portugal.',
    keywords: isEN
      ? 'website, landing page, automation, make, zapier, AI, chatbot, Lisbon, local business'
      : 'website, landing page, automação, make, zapier, AI, chatbot, Lisboa, Oeiras, negócios locais',
    openGraph: {
      title: 'Re-Evolution Digital Services',
      description: isEN ? 'Accessible digital transformation' : 'Transformação digital acessível',
      type: 'website',
      locale: locale === 'en' ? 'en_US' : 'pt_PT'
    },
    icons: {
      icon: '/images/logo.png',
      apple: '/images/logo.png'
    },
    alternates: {
      languages: {
        pt: '/pt',
        en: '/en'
      }
    }
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Re-Evolution, Digital Services',
    image: 'https://re-evolution.pt/logo.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Pct. José Régio nº5, 2º Dto',
      addressLocality: 'Carnaxide',
      addressRegion: 'Oeiras',
      postalCode: '2790-092',
      addressCountry: 'PT'
    },
    telephone: '+351969063633',
    email: 'geral@re-evolution.pt',
    url: 'https://re-evolution.pt',
    priceRange: '€€'
  };

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Consent Mode v2 - must run before GTM */}
        <Script id="consent-mode" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied'
            });
          `}
        </Script>

        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PM93WKDD');
          `}
        </Script>

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased font-sans bg-bg-primary text-text-primary" suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PM93WKDD"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <NextIntlClientProvider messages={messages}>
          {children}
          <CookieBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

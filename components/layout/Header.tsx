'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackCTA, trackLanguageChange } from '@/lib/analytics';
import Logo from '@/components/ui/Logo';

const navItems = [
  { key: 'services', href: '#servicos' },
  { key: 'portfolio', href: '#portfolio' },
  { key: 'process', href: '#processo' },
  { key: 'pricing', href: '#precos' },
  { key: 'contact', href: '#contacto' }
];

export default function Header() {
  const t = useTranslations('header');
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLanguageSwitch = (newLocale: string) => {
    trackLanguageChange(newLocale);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-re-dark-blue/95 backdrop-blur-md shadow-lg shadow-black/20'
          : 'bg-re-dark-blue'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 flex-shrink-0">
            <Logo size={38} />
            <div className="flex flex-col items-start">
              <div className="flex items-baseline">
                <span className="text-2xl font-extrabold text-re-yellow">Re-</span>
                <span className="text-2xl font-extrabold text-re-blue">Evolution</span>
              </div>
              <span className="text-[10px] text-[#39b0e0] tracking-wider -mt-1">
                Digital Services
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="relative text-sm font-medium text-white/70 hover:text-white transition-colors group"
              >
                {t(item.key)}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-re-blue transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 text-sm">
              <Link
                href={pathname}
                locale="pt"
                onClick={() => handleLanguageSwitch('pt')}
                className={`px-2 py-1 rounded transition-colors ${
                  locale === 'pt'
                    ? 'font-bold text-white'
                    : 'text-white/50 hover:text-white'
                }`}
                aria-label="Português"
              >
                PT
              </Link>
              <span className="text-white/30">|</span>
              <Link
                href={pathname}
                locale="en"
                onClick={() => handleLanguageSwitch('en')}
                className={`px-2 py-1 rounded transition-colors ${
                  locale === 'en'
                    ? 'font-bold text-white'
                    : 'text-white/50 hover:text-white'
                }`}
                aria-label="English"
              >
                EN
              </Link>
            </div>

            {/* CTA Button - Desktop */}
            <a
              href="#diagnostico"
              onClick={() => trackCTA('Header')}
              className="hidden md:inline-flex items-center px-5 py-2.5 bg-re-yellow text-re-dark-blue text-sm font-semibold rounded-lg hover:bg-re-yellow/90 transition-colors"
            >
              {t('cta')}
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-white"
              aria-label={t('menu')}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-re-dark-blue border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileOpen(false);
                    const id = item.href.replace('#', '');
                    setTimeout(() => {
                      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                  }}
                  className="block px-4 py-3 text-base font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  {t(item.key)}
                </a>
              ))}
              <a
                href="#diagnostico"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileOpen(false);
                  trackCTA('Header_Mobile');
                  setTimeout(() => {
                    document.getElementById('diagnostico')?.scrollIntoView({ behavior: 'smooth' });
                  }, 300);
                }}
                className="block w-full text-center px-4 py-3 mt-2 bg-re-yellow text-re-dark-blue font-semibold rounded-lg hover:bg-re-yellow/90 transition-colors"
              >
                {t('cta')}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

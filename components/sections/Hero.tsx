'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { trackCTA } from '@/lib/analytics';
import Button from '@/components/ui/Button';
import Logo from '@/components/ui/Logo';

const heroCards = [
  { src: '/images/hero-illustration-1.png', alt: 'AI & automation technology' },
  { src: '/images/hero-illustration-2.png', alt: 'Digital transformation tools' },
  { src: '/images/hero-illustration-3.png', alt: 'Smart business solutions' },
];

const cardPositions = [
  { top: 0, left: '0%', rotate: -4, zIndex: 1, scale: 0.97, opacity: 0.7 },
  { top: 40, left: '14%', rotate: 2, zIndex: 10, scale: 0.985, opacity: 0.85 },
  { top: 80, left: '28%', rotate: 5, zIndex: 20, scale: 1, opacity: 1 },
];

export default function Hero() {
  const t = useTranslations('hero');
  // order[positionIndex] = cardIndex — which card sits at each position
  const [order, setOrder] = useState([0, 1, 2]);
  const [started, setStarted] = useState(false);

  const shuffle = useCallback(() => {
    setOrder(prev => [prev[2], prev[0], prev[1]]);
  }, []);

  // Start the shuffle loop after entrance animations finish
  useEffect(() => {
    const startDelay = setTimeout(() => setStarted(true), 2000);
    return () => clearTimeout(startDelay);
  }, []);

  useEffect(() => {
    if (!started) return;
    const interval = setInterval(shuffle, 3500);
    return () => clearInterval(interval);
  }, [started, shuffle]);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Light gradient overlay for depth - hero bg image comes from global fixed layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-re-blue/[0.08] via-transparent to-re-yellow/[0.05]" aria-hidden="true" />

      {/* Subtle circuit pattern background */}
      <div className="absolute inset-0 opacity-[0.08]" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="#007AFF" />
              <line x1="50" y1="0" x2="50" y2="48" stroke="#007AFF" strokeWidth="0.5" />
              <line x1="52" y1="50" x2="100" y2="50" stroke="#007AFF" strokeWidth="0.5" />
              <circle cx="0" cy="0" r="1.5" fill="#f3be1b" />
              <line x1="0" y1="2" x2="0" y2="50" stroke="#f3be1b" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pt-32 md:pb-20 relative z-10">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Text Column - 60% */}
          <div className="lg:col-span-3">
            <motion.div variants={staggerItem} className="mb-5">
              <Logo size={48} />
            </motion.div>

            <motion.p
              variants={staggerItem}
              className="text-sm font-semibold uppercase tracking-wider text-re-blue mb-4"
            >
              {t('eyebrow')}
            </motion.p>

            <motion.h1
              variants={staggerItem}
              className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.15] text-text-primary"
            >
              <span className="bg-gradient-to-r from-re-dark-blue to-re-blue bg-clip-text text-transparent">
                {t('title')}
              </span>
            </motion.h1>

            <motion.p
              variants={staggerItem}
              className="mt-6 text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl"
            >
              {t('subtitle')}
            </motion.p>

            <motion.div variants={staggerItem} className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button
                href="#diagnostico"
                size="lg"
                onClick={() => trackCTA('Hero')}
              >
                {t('cta_primary')}
              </Button>
              <Button
                href="#processo"
                variant="secondary"
                size="lg"
              >
                {t('cta_secondary')}
              </Button>
            </motion.div>

            <motion.div variants={staggerItem} className="mt-8 flex flex-wrap gap-3">
              {['badge_satisfaction', 'badge_response', 'badge_location'].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm text-text-secondary border border-border shadow-sm"
                >
                  <CheckCircle className="w-4 h-4 text-success" />
                  {t(badge)}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Visual Column - 40%: Stacked hero images */}
          <motion.div
            className="lg:col-span-2 flex justify-center"
            variants={staggerItem}
          >
            <div className="relative w-full max-w-md h-[320px] md:h-[400px]">
              {heroCards.map((card, cardIndex) => {
                const posIndex = order.indexOf(cardIndex);
                const pos = cardPositions[posIndex];
                const entranceDelays = [0.4, 0.6, 0.8];

                return (
                  <motion.div
                    key={cardIndex}
                    className="absolute w-[72%] rounded-2xl overflow-hidden shadow-2xl border border-border cursor-pointer"
                    initial={{
                      opacity: 0,
                      x: cardIndex === 0 ? -30 : cardIndex === 2 ? 30 : 0,
                      y: cardIndex === 1 ? 30 : 0,
                      rotate: cardPositions[cardIndex].rotate,
                    }}
                    animate={{
                      opacity: pos.opacity,
                      x: 0,
                      y: 0,
                      top: pos.top,
                      left: pos.left,
                      rotate: pos.rotate,
                      zIndex: pos.zIndex,
                      scale: pos.scale,
                    }}
                    transition={
                      started
                        ? { duration: 0.7, ease: [0.4, 0, 0.2, 1] }
                        : { delay: entranceDelays[cardIndex], duration: 0.6 }
                    }
                    onClick={shuffle}
                  >
                    <img
                      src={card.src}
                      alt={card.alt}
                      className="w-full h-auto"
                      loading="eager"
                    />
                  </motion.div>
                );
              })}

              {/* Decorative glow behind the images */}
              <div className="absolute inset-0 -z-10" aria-hidden="true">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-re-blue/10 rounded-full blur-3xl" />
                <div className="absolute top-1/3 left-1/3 w-40 h-40 bg-re-yellow/10 rounded-full blur-2xl" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

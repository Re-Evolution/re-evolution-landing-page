'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { staggerContainer, staggerItem, hoverLift, viewportConfig } from '@/lib/animations';
import SectionWrapper from '@/components/ui/SectionWrapper';

/**
 * Portfolio images are loaded automatically by naming convention.
 * Just drop files into /public/images/ with these exact names:
 *
 *   portfolio-restaurant-a.jpg   (or .png, .webp)
 *   portfolio-restaurant-b.jpg
 *   portfolio-lawyer.jpg
 *
 * For a scroll-down animation effect, use one of these instead:
 *
 *   portfolio-restaurant-a.gif   - Animated GIF of site scrolling
 *   portfolio-restaurant-a.mp4   - Video recording of site scrolling
 *
 * The component auto-detects the file type and renders accordingly.
 * If no image exists, a colored placeholder is shown.
 *
 * HOW TO CREATE SCROLL ANIMATION FILES:
 * See SETUP.md section "Portfolio Scroll Animations" for instructions.
 */

type ProjectKey = 'restaurant_a' | 'restaurant_b' | 'lawyer';

const projects: { key: ProjectKey; color: string; slug: string }[] = [
  { key: 'restaurant_a', color: 'bg-re-blue/20', slug: 'restaurant-a' },
  { key: 'restaurant_b', color: 'bg-re-yellow/20', slug: 'restaurant-b' },
  { key: 'lawyer', color: 'bg-success/20', slug: 'lawyer' }
];

const IMAGE_EXTENSIONS = ['mp4', 'gif', 'webp', 'jpg', 'png'];

function PortfolioMedia({ slug, color, alt, placeholder }: {
  slug: string;
  color: string;
  alt: string;
  placeholder: string;
}) {
  const [mediaType, setMediaType] = useState<'loading' | 'image' | 'video' | 'gif' | 'none'>('loading');
  const [mediaSrc, setMediaSrc] = useState('');

  useEffect(() => {
    let cancelled = false;

    const tryNext = (startIdx: number) => {
      if (cancelled) return;
      if (startIdx >= IMAGE_EXTENSIONS.length) {
        setMediaType('none');
        return;
      }

      const ext = IMAGE_EXTENSIONS[startIdx];
      const src = `/images/portfolio-${slug}.${ext}`;

      if (ext === 'mp4') {
        fetch(src, { method: 'HEAD' })
          .then((res) => {
            if (cancelled) return;
            if (res.ok) {
              setMediaSrc(src);
              setMediaType('video');
            } else {
              tryNext(startIdx + 1);
            }
          })
          .catch(() => { if (!cancelled) tryNext(startIdx + 1); });
      } else {
        const img = new window.Image();
        img.onload = () => {
          if (cancelled) return;
          setMediaSrc(src);
          setMediaType(ext === 'gif' ? 'gif' : 'image');
        };
        img.onerror = () => { if (!cancelled) tryNext(startIdx + 1); };
        img.src = src;
      }
    };

    tryNext(0);

    return () => { cancelled = true; };
  }, [slug]);

  // Colored placeholder while loading or if no media found
  if (mediaType === 'loading' || mediaType === 'none') {
    return (
      <div className={`aspect-video ${color} flex items-center justify-center p-6`}>
        <p className="text-sm text-text-secondary text-center font-medium">
          {placeholder}
        </p>
      </div>
    );
  }

  // MP4 video - auto-plays muted in loop (scroll recording)
  if (mediaType === 'video') {
    return (
      <div className="aspect-video overflow-hidden bg-gray-100">
        <video
          src={mediaSrc}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover object-top"
        />
      </div>
    );
  }

  // GIF - same as video but as img tag
  if (mediaType === 'gif') {
    return (
      <div className="aspect-video overflow-hidden bg-gray-100">
        <img
          src={mediaSrc}
          alt={alt}
          className="w-full h-full object-cover object-top"
        />
      </div>
    );
  }

  // Static image - with CSS scroll-on-hover animation for tall screenshots
  return (
    <div className="aspect-video overflow-hidden bg-gray-100 group/img">
      <img
        src={mediaSrc}
        alt={alt}
        className="w-full object-cover object-top transition-[object-position] duration-[3s] ease-in-out group-hover/img:object-bottom"
      />
    </div>
  );
}

export default function Portfolio() {
  const t = useTranslations('portfolio');

  return (
    <SectionWrapper id="portfolio">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-4">
          {t('title')}
        </h2>
        <p className="text-lg text-text-secondary">
          {t('subtitle')}
        </p>
      </div>

      {/* Projects Grid - always show all 3 */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {projects.map(({ key, color, slug }) => (
          <motion.div
            key={key}
            variants={staggerItem}
            whileHover={hoverLift}
            className="bg-white shadow-sm rounded-xl overflow-hidden border border-border"
          >
            <PortfolioMedia
              slug={slug}
              color={color}
              alt={t(`projects.${key}.title`)}
              placeholder={t(`projects.${key}.placeholder`)}
            />

            <div className="p-6">
              <span className="inline-block px-3 py-1 text-xs font-semibold bg-bg-secondary text-text-secondary rounded-full mb-3">
                {t(`projects.${key}.badge`)}
              </span>
              <h3 className="text-lg font-bold text-text-primary mb-3">
                {t(`projects.${key}.title`)}
              </h3>

              <div className="space-y-3">
                <div>
                  <span className="text-xs font-semibold text-error uppercase tracking-wider">
                    {t('problem_label')}
                  </span>
                  <p className="text-sm text-text-secondary mt-0.5">
                    {t(`projects.${key}.problem`)}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-re-blue uppercase tracking-wider">
                    {t('solution_label')}
                  </span>
                  <p className="text-sm text-text-secondary mt-0.5">
                    {t(`projects.${key}.solution`)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 p-3 bg-success/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-success flex-shrink-0" />
                <span className="text-sm font-bold text-success">
                  {t(`projects.${key}.result`)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}

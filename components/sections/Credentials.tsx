'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { staggerContainer, staggerItem, viewportConfig } from '@/lib/animations';
import SectionWrapper from '@/components/ui/SectionWrapper';

/* ------------------------------------------------------------------ */
/* Inline SVG icons for each technology (grayscale by default,        */
/* color on hover via parent group)                                   */
/* ------------------------------------------------------------------ */

function NextjsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="currentColor">
      <path d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64 64-28.7 64-64S99.3 0 64 0zm32.7 76.1c-.5.7-1.4 1.1-2.3 1.1-.5 0-1-.1-1.5-.4L56 54.1V89c0 1.7-1.3 3-3 3s-3-1.3-3-3V39c0-1.3.8-2.4 2-2.8 1.2-.4 2.5 0 3.3.9l37.7 23.3c1.4.9 1.8 2.7.9 4.2l-.2.3v.2z" />
    </svg>
  );
}

function TailwindIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 54 33" fill="currentColor">
      <path d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z" />
    </svg>
  );
}

function VercelIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 116 100" fill="currentColor">
      <path d="M57.5 0L115 100H0L57.5 0z" />
    </svg>
  );
}

function CloudflareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="currentColor">
      <path d="M34.647 34.044l.984-3.39c.108-.375.048-.72-.168-.972-.204-.24-.516-.384-.876-.42l-17.052-.24c-.072 0-.132-.036-.168-.096-.036-.06-.036-.12 0-.18.048-.072.12-.12.204-.132l17.196-.24c1.08-.072 2.244-.948 2.664-2.004l1.056-2.688c.048-.108.06-.228.036-.348C37.247 17.71 32.147 13.2 26.039 13.2c-5.52 0-10.224 3.648-11.796 8.664-.996-.744-2.244-1.14-3.576-1.032-2.352.204-4.248 2.1-4.452 4.452-.048.504-.012.996.084 1.464C3.179 27.012.723 29.62.723 32.784c0 .408.036.804.096 1.2.036.168.18.288.348.288h33.12c.156 0 .3-.096.36-.228z" />
      <path d="M38.915 23.652c-.156 0-.312.012-.468.024-.06 0-.12.036-.156.096l-.744 2.568c-.108.375-.048.72.168.972.204.24.516.384.876.42l3.576.24c.072 0 .132.036.168.096.036.06.036.12 0 .18-.048.072-.12.12-.204.132l-3.72.24c-1.08.072-2.244.948-2.664 2.004l-.3.756c-.036.108.036.216.156.216h10.956c.132 0 .252-.084.288-.216.264-.852.408-1.752.408-2.688 0-2.82-2.292-5.04-5.34-5.04z" />
    </svg>
  );
}

function MakeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="currentColor">
      <path d="M32 4C16.536 4 4 16.536 4 32s12.536 28 28 28 28-12.536 28-28S47.464 4 32 4zm-6 38V22l18 10-18 10z" />
    </svg>
  );
}

function ZapierIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="currentColor">
      <path d="M41.6 22.4H52L32 52 12 22.4h10.4L32 38.4l9.6-16zM32 12l12.8 7.2H19.2L32 12z" />
    </svg>
  );
}

function ClaudeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="currentColor">
      <path d="M32 6C17.64 6 6 17.64 6 32s11.64 26 26 26 26-11.64 26-26S46.36 6 32 6zm0 4c12.15 0 22 9.85 22 22s-9.85 22-22 22-22-9.85-22-22 9.85-22 22-22zm-8 14a3 3 0 100 6 3 3 0 000-6zm16 0a3 3 0 100 6 3 3 0 000-6zm-16.5 11a.75.75 0 00-.65 1.13C25.06 40.65 28.3 43 32 43s6.94-2.35 9.15-5.87a.75.75 0 00-.65-1.13h-17z" />
    </svg>
  );
}

function VSCodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="currentColor">
      <path d="M74.9 98l22.6-10.8V12.8L74.9 2 34.2 35.4 14.3 20.1 2.5 24.5v51l11.8 4.4L34.2 64.6 74.9 98zM71 74.6l-26-20.1L71 34.4v40.2zM14.3 60.1V39.9L27.6 50 14.3 60.1z" />
    </svg>
  );
}

const techItems: { key: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { key: 'nextjs', icon: NextjsIcon, color: 'text-black' },
  { key: 'tailwind', icon: TailwindIcon, color: 'text-[#06B6D4]' },
  { key: 'vercel', icon: VercelIcon, color: 'text-black' },
  { key: 'cloudflare', icon: CloudflareIcon, color: 'text-[#F48120]' },
  { key: 'make', icon: MakeIcon, color: 'text-[#6D00CC]' },
  { key: 'zapier', icon: ZapierIcon, color: 'text-[#FF4A00]' },
  { key: 'claude', icon: ClaudeIcon, color: 'text-[#D97757]' },
  { key: 'vscode', icon: VSCodeIcon, color: 'text-[#007ACC]' },
];

export default function Credentials() {
  const t = useTranslations('credentials');
  const formations = t.raw('formations') as string[];

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

      {/* Formation Badges */}
      <div className="mb-12">
        <h3 className="text-lg font-bold text-text-primary mb-6 text-center">
          {t('formation_title')}
        </h3>
        <motion.div
          className="flex flex-wrap justify-center gap-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {formations.map((formation: string, idx: number) => (
            <motion.span
              key={idx}
              variants={staggerItem}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white shadow-sm rounded-full border border-border text-sm font-medium text-text-primary"
            >
              <GraduationCap className="w-4 h-4 text-re-blue" />
              {formation}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Technologies */}
      <div>
        <h3 className="text-lg font-bold text-text-primary mb-6 text-center">
          {t('tech_title')}
        </h3>
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {techItems.map(({ key, icon: Icon, color }) => (
            <motion.div
              key={key}
              variants={staggerItem}
              className="group flex flex-col items-center gap-2"
              title={t(`technologies.${key}`)}
            >
              <div className={`w-16 h-16 bg-white shadow-sm rounded-xl border border-border flex items-center justify-center ${color} group-hover:grayscale group-hover:opacity-60 transition-all duration-300 p-3`}>
                <Icon className="w-full h-full" />
              </div>
              <span className="text-xs text-text-secondary text-center max-w-[80px]">
                {t(`technologies.${key}`).split(' - ')[0]}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

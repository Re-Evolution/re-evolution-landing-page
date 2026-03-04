'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { staggerContainer, staggerItem, viewportConfig } from '@/lib/animations';
import SectionWrapper from '@/components/ui/SectionWrapper';

/* ─────────────────────────────────────────────────────────────────── */
/* Inline SVG icons (clean vectors — used when no brand file exists)  */
/* ─────────────────────────────────────────────────────────────────── */

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

/* Vercel: official black triangle mark */
function VercelIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 22.525H0l12-21.05 12 21.05z" />
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

function VSCodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* Tech items — type 'svg' uses inline component, 'img' uses the file */
/* ─────────────────────────────────────────────────────────────────── */

type SvgItem  = { key: string; type: 'svg'; icon: React.ComponentType<{ className?: string }>; color: string };
type ImgItem  = { key: string; type: 'img'; src: string; wide?: boolean };
type TechItem = SvgItem | ImgItem;

const techItems: TechItem[] = [
  { key: 'nextjs',     type: 'svg', icon: NextjsIcon,    color: 'text-black'      },
  { key: 'tailwind',   type: 'svg', icon: TailwindIcon,  color: 'text-[#06B6D4]' },
  { key: 'vercel',     type: 'svg', icon: VercelIcon,    color: 'text-[#000000]' },
  { key: 'cloudflare', type: 'svg', icon: CloudflareIcon,color: 'text-[#F48120]' },
  { key: 'make',       type: 'img', src: '/icons/make.svg'                        },
  { key: 'zapier',     type: 'img', src: '/icons/zapier.svg'                      },
  { key: 'claude',     type: 'img', src: '/icons/claude.svg'                      },
  { key: 'vscode',     type: 'svg', icon: VSCodeIcon,    color: 'text-[#007ACC]' },
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
          {techItems.map((item) => (
            <motion.div
              key={item.key}
              variants={staggerItem}
              className="group flex flex-col items-center gap-2"
              title={t(`technologies.${item.key}`)}
            >
              <div
                className={[
                  'bg-white shadow-sm rounded-xl border border-border',
                  'flex items-center justify-center',
                  'group-hover:grayscale group-hover:opacity-60 transition-all duration-300',
                  item.type === 'svg'
                    ? `w-16 h-16 ${item.color} p-3`
                    : item.wide
                      ? 'h-14 w-36 p-3 overflow-hidden'   /* wide wordmark (Make.com) */
                      : 'w-16 h-16 p-1.5 overflow-hidden', /* square icon (Zapier, Claude) */
                ].join(' ')}
              >
                {item.type === 'svg' ? (
                  <item.icon className="w-full h-full" />
                ) : (
                  <img
                    src={item.src}
                    alt={t(`technologies.${item.key}`)}
                    className="w-full h-full object-contain rounded-lg"
                  />
                )}
              </div>
              <span className="text-xs text-text-secondary text-center max-w-[80px]">
                {t(`technologies.${item.key}`).split(' - ')[0]}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

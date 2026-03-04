'use client';

import { useEffect, useState } from 'react';

/**
 * Floating tech logos that drift across the page as the user scrolls.
 *
 * Z-index z-[10]: above semi-transparent section backgrounds (z-[1]),
 * below sticky header (z-50). pointer-events-none = no UI interference.
 *
 * Parallax: yOffset = topStart - scrollY * speed * 15
 * Logo visible ~centred in viewport at scroll S when: topStart ≈ S * speed * 15 + 400
 *
 * Icon sources:
 *  - claude  → /icons/claude.svg  (official Anthropic brand file)
 *  - others  → inline SVG paths   (clean vectors; img files are PNG/JPEG-in-SVG)
 */

type Logo =
  | { id: string; kind: 'svg'; color: string; viewBox: string; path: string }
  | { id: string; kind: 'img'; src: string };

const logos: Logo[] = [
  {
    id: 'nextjs', kind: 'svg', color: '#000000',
    viewBox: '0 0 128 128',
    path: 'M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64 64-28.7 64-64S99.3 0 64 0zm32.7 76.1c-.5.7-1.4 1.1-2.3 1.1-.5 0-1-.1-1.5-.4L56 54.1V89c0 1.7-1.3 3-3 3s-3-1.3-3-3V39c0-1.3.8-2.4 2-2.8 1.2-.4 2.5 0 3.3.9l37.7 23.3c1.4.9 1.8 2.7.9 4.2l-.2.3v.2z',
  },
  {
    id: 'tailwind', kind: 'svg', color: '#06B6D4',
    viewBox: '0 0 54 33',
    path: 'M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z',
  },
  {
    id: 'vercel', kind: 'svg', color: '#000000',
    viewBox: '0 0 24 24',
    path: 'M24 22.525H0l12-21.05 12 21.05z',
  },
  {
    id: 'cloudflare', kind: 'svg', color: '#F48120',
    viewBox: '0 0 48 48',
    path: 'M34.647 34.044l.984-3.39c.108-.375.048-.72-.168-.972-.204-.24-.516-.384-.876-.42l-17.052-.24c-.072 0-.132-.036-.168-.096-.036-.06-.036-.12 0-.18.048-.072.12-.12.204-.132l17.196-.24c1.08-.072 2.244-.948 2.664-2.004l1.056-2.688c.048-.108.06-.228.036-.348C37.247 17.71 32.147 13.2 26.039 13.2c-5.52 0-10.224 3.648-11.796 8.664-.996-.744-2.244-1.14-3.576-1.032-2.352.204-4.248 2.1-4.452 4.452-.048.504-.012.996.084 1.464C3.179 27.012.723 29.62.723 32.784c0 .408.036.804.096 1.2.036.168.18.288.348.288h33.12c.156 0 .3-.096.36-.228z M38.915 23.652c-.156 0-.312.012-.468.024-.06 0-.12.036-.156.096l-.744 2.568c-.108.375-.048.72.168.972.204.24.516.384.876.42l3.576.24c.072 0 .132.036.168.096.036.06.036.12 0 .18-.048.072-.12.12-.204.132l-3.72.24c-1.08.072-2.244.948-2.664 2.004l-.3.756c-.036.108.036.216.156.216h10.956c.132 0 .252-.084.288-.216.264-.852.408-1.752.408-2.688 0-2.82-2.292-5.04-5.34-5.04z',
  },
  {
    /* make.svg = official square icon mark with purple gradients ✅ */
    id: 'make', kind: 'img', src: '/icons/make.svg',
  },
  {
    /* zapier.svg is a full wordmark with text — use the clean Z mark at small sizes */
    id: 'zapier', kind: 'svg', color: '#FF4A00',
    viewBox: '0 0 24 24',
    path: 'M4 4h16v3.4L8 16.6H20V20H4v-3.4L16 7.4H4V4z',
  },
  {
    /* claude.svg = official Anthropic brand vector ✅ */
    id: 'claude', kind: 'img', src: '/icons/claude.svg',
  },
  {
    id: 'vscode', kind: 'svg', color: '#007ACC',
    viewBox: '0 0 24 24',
    path: 'M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z',
  },
];

/** 22 instances distributed across the full page height (two per section). */
const config = [
  // ── Hero ──────────────────────────────────────────────────────────
  { left: '4%',  topStart: 280,  speed: 0.04,  size: 52, opacity: 0.40, drift: 'animate-drift-1', delay: '0s',   logoIdx: 2 }, // vercel
  { left: '91%', topStart: 480,  speed: 0.05,  size: 44, opacity: 0.38, drift: 'animate-drift-2', delay: '-3s',  logoIdx: 0 }, // nextjs
  // ── Problem ───────────────────────────────────────────────────────
  { left: '7%',  topStart: 820,  speed: 0.04,  size: 48, opacity: 0.42, drift: 'animate-drift-3', delay: '-1s',  logoIdx: 1 }, // tailwind
  { left: '87%', topStart: 1050, speed: 0.035, size: 54, opacity: 0.36, drift: 'animate-drift-4', delay: '-5s',  logoIdx: 3 }, // cloudflare
  // ── Solution ──────────────────────────────────────────────────────
  { left: '3%',  topStart: 1350, speed: 0.045, size: 50, opacity: 0.40, drift: 'animate-drift-1', delay: '-7s',  logoIdx: 4 }, // make
  { left: '92%', topStart: 1600, speed: 0.05,  size: 44, opacity: 0.38, drift: 'animate-drift-2', delay: '-2s',  logoIdx: 5 }, // zapier
  // ── Process ───────────────────────────────────────────────────────
  { left: '5%',  topStart: 1900, speed: 0.04,  size: 52, opacity: 0.42, drift: 'animate-drift-3', delay: '-4s',  logoIdx: 6 }, // claude
  { left: '89%', topStart: 2150, speed: 0.05,  size: 46, opacity: 0.36, drift: 'animate-drift-4', delay: '-6s',  logoIdx: 7 }, // vscode
  // ── Portfolio ─────────────────────────────────────────────────────
  { left: '6%',  topStart: 2450, speed: 0.04,  size: 54, opacity: 0.40, drift: 'animate-drift-1', delay: '-2s',  logoIdx: 2 }, // vercel
  { left: '85%', topStart: 2700, speed: 0.045, size: 48, opacity: 0.38, drift: 'animate-drift-2', delay: '-8s',  logoIdx: 0 }, // nextjs
  // ── Pricing ───────────────────────────────────────────────────────
  { left: '4%',  topStart: 3000, speed: 0.04,  size: 50, opacity: 0.42, drift: 'animate-drift-3', delay: '-3s',  logoIdx: 1 }, // tailwind
  { left: '93%', topStart: 3250, speed: 0.05,  size: 44, opacity: 0.36, drift: 'animate-drift-4', delay: '-5s',  logoIdx: 4 }, // make
  // ── Credentials ───────────────────────────────────────────────────
  { left: '8%',  topStart: 3550, speed: 0.035, size: 56, opacity: 0.44, drift: 'animate-drift-1', delay: '-1s',  logoIdx: 5 }, // zapier
  { left: '88%', topStart: 3800, speed: 0.05,  size: 46, opacity: 0.38, drift: 'animate-drift-2', delay: '-7s',  logoIdx: 3 }, // cloudflare
  // ── Testimonials ──────────────────────────────────────────────────
  { left: '3%',  topStart: 4100, speed: 0.04,  size: 52, opacity: 0.40, drift: 'animate-drift-3', delay: '-4s',  logoIdx: 6 }, // claude
  { left: '90%', topStart: 4350, speed: 0.045, size: 48, opacity: 0.36, drift: 'animate-drift-4', delay: '-6s',  logoIdx: 7 }, // vscode
  // ── FAQ / CTAForm ─────────────────────────────────────────────────
  { left: '6%',  topStart: 4650, speed: 0.04,  size: 50, opacity: 0.42, drift: 'animate-drift-1', delay: '-2s',  logoIdx: 2 }, // vercel
  { left: '86%', topStart: 4900, speed: 0.05,  size: 44, opacity: 0.38, drift: 'animate-drift-2', delay: '-3s',  logoIdx: 0 }, // nextjs
  // ── Contact / Footer ──────────────────────────────────────────────
  { left: '5%',  topStart: 5200, speed: 0.035, size: 54, opacity: 0.40, drift: 'animate-drift-3', delay: '-5s',  logoIdx: 1 }, // tailwind
  { left: '91%', topStart: 5450, speed: 0.05,  size: 46, opacity: 0.36, drift: 'animate-drift-4', delay: '-9s',  logoIdx: 4 }, // make
  // ── Extra depth ───────────────────────────────────────────────────
  { left: '4%',  topStart: 5750, speed: 0.04,  size: 52, opacity: 0.38, drift: 'animate-drift-1', delay: '-6s',  logoIdx: 5 }, // zapier
  { left: '90%', topStart: 6000, speed: 0.045, size: 48, opacity: 0.40, drift: 'animate-drift-2', delay: '-4s',  logoIdx: 6 }, // claude
];

export default function FloatingTechLogos() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[10] overflow-hidden"
      aria-hidden="true"
    >
      {config.map((c, idx) => {
        const logo = logos[c.logoIdx];
        const yOffset = c.topStart - scrollY * c.speed * 15;

        return (
          <div
            key={idx}
            className="absolute"
            style={{
              left: c.left,
              top: 0,
              transform: `translateY(${yOffset}px)`,
              opacity: c.opacity,
              willChange: 'transform',
            }}
          >
            <div className={c.drift} style={{ animationDelay: c.delay }}>
              {logo.kind === 'img' ? (
                <img
                  src={logo.src}
                  width={c.size}
                  height={c.size}
                  alt=""
                  style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.20))' }}
                />
              ) : (
                <svg
                  width={c.size}
                  height={c.size}
                  viewBox={logo.viewBox}
                  fill={logo.color}
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
                >
                  <path d={logo.path} />
                </svg>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

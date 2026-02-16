'use client';

import { useEffect, useState } from 'react';

/**
 * Floating transparent tech logos that drift across the page as the user scrolls.
 * Outer div: scroll-based parallax (inline transform).
 * Inner div: CSS keyframe drift animation (continuous movement + rotation).
 */

const logos = [
  { id: 'nextjs', color: '#007AFF', path: 'M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64 64-28.7 64-64S99.3 0 64 0zm32.7 76.1c-.5.7-1.4 1.1-2.3 1.1-.5 0-1-.1-1.5-.4L56 54.1V89c0 1.7-1.3 3-3 3s-3-1.3-3-3V39c0-1.3.8-2.4 2-2.8 1.2-.4 2.5 0 3.3.9l37.7 23.3c1.4.9 1.8 2.7.9 4.2l-.2.3v.2z', viewBox: '0 0 128 128' },
  { id: 'tailwind', color: '#06B6D4', path: 'M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z', viewBox: '0 0 54 33' },
  { id: 'vercel', color: '#082d78', path: 'M57.5 0L115 100H0L57.5 0z', viewBox: '0 0 116 100' },
  { id: 'cloudflare', color: '#F48120', path: 'M34.647 34.044l.984-3.39c.108-.375.048-.72-.168-.972-.204-.24-.516-.384-.876-.42l-17.052-.24c-.072 0-.132-.036-.168-.096-.036-.06-.036-.12 0-.18.048-.072.12-.12.204-.132l17.196-.24c1.08-.072 2.244-.948 2.664-2.004l1.056-2.688c.048-.108.06-.228.036-.348C37.247 17.71 32.147 13.2 26.039 13.2c-5.52 0-10.224 3.648-11.796 8.664-.996-.744-2.244-1.14-3.576-1.032-2.352.204-4.248 2.1-4.452 4.452-.048.504-.012.996.084 1.464C3.179 27.012.723 29.62.723 32.784c0 .408.036.804.096 1.2.036.168.18.288.348.288h33.12c.156 0 .3-.096.36-.228z', viewBox: '0 0 48 48' },
  { id: 'claude', color: '#D97757', path: 'M32 6C17.64 6 6 17.64 6 32s11.64 26 26 26 26-11.64 26-26S46.36 6 32 6zm0 4c12.15 0 22 9.85 22 22s-9.85 22-22 22-22-9.85-22-22 9.85-22 22-22zm-8 14a3 3 0 100 6 3 3 0 000-6zm16 0a3 3 0 100 6 3 3 0 000-6zm-16.5 11a.75.75 0 00-.65 1.13C25.06 40.65 28.3 43 32 43s6.94-2.35 9.15-5.87a.75.75 0 00-.65-1.13h-17z', viewBox: '0 0 64 64' },
  { id: 'vscode', color: '#007ACC', path: 'M74.9 98l22.6-10.8V12.8L74.9 2 34.2 35.4 14.3 20.1 2.5 24.5v51l11.8 4.4L34.2 64.6 74.9 98zM71 74.6l-26-20.1L71 34.4v40.2zM14.3 60.1V39.9L27.6 50 14.3 60.1z', viewBox: '0 0 100 100' },
  { id: 'zapier', color: '#FF4A00', path: 'M41.6 22.4H52L32 52 12 22.4h10.4L32 38.4l9.6-16zM32 12l12.8 7.2H19.2L32 12z', viewBox: '0 0 64 64' },
  { id: 'make', color: '#6D00CC', path: 'M32 4C16.536 4 4 16.536 4 32s12.536 28 28 28 28-12.536 28-28S47.464 4 32 4zm-6 38V22l18 10-18 10z', viewBox: '0 0 64 64' },
];

// Each logo: position, size, opacity, parallax speed, and drift animation variant
const config = [
  { left: '4%',  topStart: 150,  speed: 0.03,  size: 48, opacity: 0.15, drift: 'animate-drift-1', delay: '0s' },
  { left: '14%', topStart: 550,  speed: 0.05,  size: 40, opacity: 0.12, drift: 'animate-drift-2', delay: '-3s' },
  { left: '90%', topStart: 350,  speed: 0.04,  size: 44, opacity: 0.16, drift: 'animate-drift-3', delay: '-1s' },
  { left: '94%', topStart: 850,  speed: 0.055, size: 36, opacity: 0.13, drift: 'animate-drift-4', delay: '-5s' },
  { left: '7%',  topStart: 1200, speed: 0.035, size: 42, opacity: 0.15, drift: 'animate-drift-2', delay: '-7s' },
  { left: '87%', topStart: 1600, speed: 0.045, size: 40, opacity: 0.14, drift: 'animate-drift-1', delay: '-2s' },
  { left: '2%',  topStart: 2000, speed: 0.05,  size: 46, opacity: 0.16, drift: 'animate-drift-4', delay: '-4s' },
  { left: '92%', topStart: 2400, speed: 0.04,  size: 38, opacity: 0.13, drift: 'animate-drift-3', delay: '-6s' },
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
      className="fixed inset-0 pointer-events-none z-[1] overflow-hidden"
      aria-hidden="true"
    >
      {logos.map((logo, idx) => {
        const c = config[idx];
        const yOffset = c.topStart - scrollY * c.speed * 15;

        return (
          /* Outer: scroll parallax positioning */
          <div
            key={logo.id}
            className="absolute"
            style={{
              left: c.left,
              top: 0,
              transform: `translateY(${yOffset}px)`,
              opacity: c.opacity,
              willChange: 'transform',
            }}
          >
            {/* Inner: CSS drift animation (translate + rotate) */}
            <div
              className={c.drift}
              style={{ animationDelay: c.delay }}
            >
              <svg
                width={c.size}
                height={c.size}
                viewBox={logo.viewBox}
                fill={logo.color}
              >
                <path d={logo.path} />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}

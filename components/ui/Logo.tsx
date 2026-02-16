'use client';

/**
 * Brand logo component.
 *
 * Displays /images/logo.png from the public folder.
 * To use your own logo, simply drop "logo.png" into /public/images/.
 * If you want a different filename, change the src below.
 *
 * Falls back to a styled "RE" monogram SVG if the image fails to load.
 */

import { useState } from 'react';

interface LogoProps {
  size?: number; // height in pixels (width auto)
  className?: string;
}

function FallbackSVG({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="8" fill="#082d78" />
      <text x="5" y="28" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="18">
        <tspan fill="#f3be1b">R</tspan>
        <tspan fill="#007AFF">E</tspan>
      </text>
    </svg>
  );
}

export default function Logo({ size = 36, className = '' }: LogoProps) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <span className={className}>
        <FallbackSVG size={size} />
      </span>
    );
  }

  return (
    <img
      src="/images/logo.png"
      alt="Re-Evolution"
      height={size}
      style={{ height: size, width: 'auto' }}
      className={className}
      onError={() => setImgError(true)}
    />
  );
}

import React from 'react';

/**
 * Replaces "Re-Evolution" in a string with colored spans.
 *
 * @param text - The string containing "Re-Evolution"
 * @param variant - 'default' uses yellow + blue; 'onBlue' uses yellow + white for dark/blue backgrounds
 */
export function brandify(text: string, variant: 'default' | 'onBlue' = 'default'): React.ReactNode[] {
  const evolutionClass = variant === 'onBlue'
    ? 'text-white font-extrabold'
    : 'text-re-blue font-extrabold';

  const parts = text.split(/(Re-Evolution)/gi);
  return parts.map((part, i) =>
    /^re-evolution$/i.test(part) ? (
      <span key={i}>
        <span className="text-re-yellow font-extrabold">Re-</span>
        <span className={evolutionClass}>Evolution</span>
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

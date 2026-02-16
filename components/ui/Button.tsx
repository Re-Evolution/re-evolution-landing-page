'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { tapScale } from '@/lib/animations';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'whatsapp';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  href?: string;
  target?: string;
  type?: 'button' | 'submit';
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

const variantStyles = {
  primary: 'bg-re-blue text-white hover:bg-[#0056CC] shadow-md',
  secondary: 'border-2 border-re-blue text-re-blue bg-transparent hover:bg-re-blue/10',
  ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary',
  whatsapp: 'bg-whatsapp text-white hover:bg-[#1DA851] shadow-md'
};

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg'
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  href,
  target,
  type = 'button',
  onClick,
  className = '',
  ariaLabel
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-re-blue cursor-pointer';
  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''} ${className}`;

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className={classes}
        whileHover={!disabled ? { scale: 1.03 } : undefined}
        whileTap={!disabled ? tapScale : undefined}
        aria-label={ariaLabel}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
      whileHover={!disabled && !loading ? { scale: 1.03 } : undefined}
      whileTap={!disabled && !loading ? tapScale : undefined}
      aria-label={ariaLabel}
    >
      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
      {children}
    </motion.button>
  );
}

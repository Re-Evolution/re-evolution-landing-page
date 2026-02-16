'use client';

import { motion } from 'framer-motion';
import { fadeIn, viewportConfig } from '@/lib/animations';

interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  background?: 'default' | 'lighter' | 'darker' | 'accent';
  className?: string;
  noPadding?: boolean;
}

const bgStyles = {
  default: 'bg-[rgba(232,240,254,0.88)]',
  lighter: 'bg-[rgba(212,228,252,0.90)]',
  darker: 'bg-[rgba(6,31,92,0.92)]',
  accent: 'bg-[rgba(232,240,254,0.82)]',
};

export default function SectionWrapper({
  children,
  id,
  background = 'default',
  className = '',
  noPadding = false
}: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      className={`${bgStyles[background]} ${noPadding ? '' : 'py-16 md:py-20'} ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      variants={fadeIn}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </motion.section>
  );
}

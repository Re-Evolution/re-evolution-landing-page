'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { trackContact } from '@/lib/analytics';

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/351969063633"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[998] w-14 h-14 bg-whatsapp rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        scale: [1, 1.05, 1],
      }}
      transition={{
        scale: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      }}
      aria-label="Chat on WhatsApp"
      onClick={() => trackContact('whatsapp')}
    >
      <MessageCircle className="w-7 h-7 text-white" fill="white" />
    </motion.a>
  );
}

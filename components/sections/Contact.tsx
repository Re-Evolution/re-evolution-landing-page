'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { staggerContainer, staggerItem, viewportConfig } from '@/lib/animations';
import { trackContact } from '@/lib/analytics';
import Button from '@/components/ui/Button';

export default function Contact() {
  const t = useTranslations('contact');

  return (
    <section id="contacto" className="relative py-16 md:py-20 overflow-hidden">
      {/* Light overlay - hero bg image shows through from global fixed layer */}
      <div className="absolute inset-0 bg-[rgba(232,240,254,0.82)]" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-4">
          {t('title')}
        </h2>
      </div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-5 gap-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {/* Map - 60% */}
        <motion.div variants={staggerItem} className="lg:col-span-3">
          <div className="rounded-xl overflow-hidden shadow-md border border-border h-[400px]">
            <iframe
              src="https://maps.google.com/maps?q=Praceta+Jos%C3%A9+R%C3%A9gio+5,+2790-092+Carnaxide,+Oeiras,+Portugal&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Re-Evolution Location"
            />
          </div>
        </motion.div>

        {/* Contact Info - 40% */}
        <motion.div variants={staggerItem} className="lg:col-span-2 space-y-6">
          {/* Address */}
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-re-blue/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-re-blue" />
            </div>
            <div>
              <h3 className="font-bold text-text-primary mb-1">{t('address_label')}</h3>
              <p className="text-sm text-text-secondary">{t('address')}</p>
              <p className="text-sm text-text-secondary">{t('address_city')}</p>
              <p className="text-sm text-text-secondary">{t('address_country')}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-re-blue/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-re-blue" />
            </div>
            <div>
              <h3 className="font-bold text-text-primary mb-1">{t('phone_label')}</h3>
              <a href="tel:+351969063633" className="text-sm text-re-blue hover:underline">
                {t('phone')}
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-re-blue/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-re-blue" />
            </div>
            <div>
              <h3 className="font-bold text-text-primary mb-1">{t('email_label')}</h3>
              <a href="mailto:geral@re-evolution.pt" className="text-sm text-re-blue hover:underline block">
                {t('email_main')}
              </a>
              <a href="mailto:suporte@re-evolution.pt" className="text-sm text-re-blue hover:underline block">
                {t('email_support')}
              </a>
            </div>
          </div>

          {/* Hours */}
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-re-blue/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-re-blue" />
            </div>
            <div>
              <h3 className="font-bold text-text-primary mb-1">{t('hours_label')}</h3>
              <p className="text-sm text-text-secondary">{t('hours_weekdays')}</p>
              <p className="text-sm text-text-secondary">{t('hours_saturday')}</p>
              <p className="text-sm text-text-secondary">{t('hours_sunday')}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <Button
              href="tel:+351969063633"
              variant="primary"
              className="justify-center"
              onClick={() => trackContact('phone')}
            >
              <Phone className="w-4 h-4" />
              {t('btn_call')}
            </Button>
            <Button
              href="https://wa.me/351969063633"
              target="_blank"
              variant="whatsapp"
              className="justify-center"
              onClick={() => trackContact('whatsapp')}
            >
              <MessageCircle className="w-4 h-4" />
              {t('btn_whatsapp')}
            </Button>
            <Button
              href="mailto:geral@re-evolution.pt"
              variant="secondary"
              className="justify-center"
              onClick={() => trackContact('email')}
            >
              <Mail className="w-4 h-4" />
              {t('btn_email')}
            </Button>
          </div>
        </motion.div>
      </motion.div>
      </div>
    </section>
  );
}

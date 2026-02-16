'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, MessageCircle } from 'lucide-react';
import { trackChatbot } from '@/lib/analytics';
import { brandify } from '@/lib/brand';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  buttons?: { label: string; action: string }[];
}

export default function Chatbot() {
  const t = useTranslations('chatbot');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [initialized, setInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const openChat = () => {
    setIsOpen(true);
    trackChatbot('open');
    if (!initialized) {
      setMessages([
        {
          id: 1,
          text: t('greeting'),
          sender: 'bot'
        }
      ]);
      setInitialized(true);
    }
  };

  const getBotResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase();
    const responses = t.raw('responses') as Record<string, string>;

    if (lower.includes('preço') || lower.includes('price') || lower.includes('custo') || lower.includes('quanto')) {
      return responses.price;
    }
    if (lower.includes('automação') || lower.includes('automation') || lower.includes('automat')) {
      return responses.automation;
    }
    if (lower.includes('tempo') || lower.includes('time') || lower.includes('demora') || lower.includes('prazo')) {
      return responses.time;
    }
    if (lower.includes('portfolio') || lower.includes('projeto') || lower.includes('project') || lower.includes('exemplo')) {
      return responses.portfolio;
    }

    return responses.default;
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    trackChatbot('message');

    const userMsg: Message = {
      id: Date.now(),
      text: input,
      sender: 'user'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(input);
      const isDefault = botResponse === (t.raw('responses') as Record<string, string>).default;

      const botMsg: Message = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        buttons: isDefault
          ? [
              { label: t('responses.cta_diagnosis'), action: 'diagnosis' },
              { label: t('responses.cta_whatsapp'), action: 'whatsapp' }
            ]
          : undefined
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 800);
  };

  const handleButtonClick = (action: string) => {
    if (action === 'diagnosis') {
      setIsOpen(false);
      document.getElementById('diagnostico')?.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'whatsapp') {
      window.open('https://wa.me/351969063633', '_blank');
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={openChat}
            className="fixed bottom-24 right-6 z-[999] w-14 h-14 bg-re-blue rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            whileHover={{ scale: 1.1 }}
            aria-label="Open chatbot"
          >
            <Bot className="w-7 h-7 text-white" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-white animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-[999] w-[360px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-border/50 flex flex-col overflow-hidden"
            style={{ height: '500px', maxHeight: 'calc(100vh - 10rem)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-re-blue text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{brandify(t('title'), 'onBlue')}</p>
                  <p className="text-xs text-white/70">{t('status')}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors cursor-pointer"
                aria-label="Close chatbot"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-re-blue text-white rounded-br-sm'
                        : 'bg-bg-secondary text-text-primary rounded-bl-sm'
                    }`}
                    style={{ whiteSpace: 'pre-line' }}
                  >
                    {msg.sender === 'bot' ? brandify(msg.text) : msg.text}
                    {msg.buttons && (
                      <div className="flex gap-2 mt-3">
                        {msg.buttons.map((btn) => (
                          <button
                            key={btn.action}
                            onClick={() => handleButtonClick(btn.action)}
                            className="px-3 py-1.5 bg-re-blue text-white text-xs font-semibold rounded-lg hover:bg-[#0056CC] transition-colors cursor-pointer"
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('input_placeholder')}
                  className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-re-blue transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-2 bg-re-blue text-white rounded-lg hover:bg-[#0056CC] transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                  aria-label={t('send')}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

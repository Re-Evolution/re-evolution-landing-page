'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send } from 'lucide-react';
import { trackChatbot } from '@/lib/analytics';
import { brandify } from '@/lib/brand';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  buttons?: { label: string; action: string }[];
}

function generateSessionId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function Chatbot() {
  const t = useTranslations('chatbot');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [initialized, setInitialized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const sessionIdRef = useRef<string>(generateSessionId());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const openChat = () => {
    setIsOpen(true);
    trackChatbot('open');
    if (!initialized) {
      setMessages([{ id: 1, text: t('greeting'), sender: 'bot' }]);
      setInitialized(true);
    }
  };

  const addBotMessage = (text: string, buttons?: { label: string; action: string }[]) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text, sender: 'bot', buttons },
    ]);
  };

  const pollForResponse = async (sessionId: string): Promise<void> => {
    const maxAttempts = 30; // 30 × 1 s = 30 s timeout
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      try {
        const res = await fetch(`/api/chat/response?sessionId=${sessionId}`);
        const data = await res.json();
        if (data.message) {
          addBotMessage(data.message, data.buttons ?? undefined);
          return;
        }
      } catch {
        // network hiccup — keep polling
      }
    }
    addBotMessage(t('responses.default'));
  };

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    trackChatbot('message');

    const messageText = input;
    const userMsg: Message = { id: Date.now(), text: messageText, sender: 'user' };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, sessionId: sessionIdRef.current }),
      });

      if (!res.ok) throw new Error('API error');

      const data = await res.json();

      if (data.message) {
        // Synchronous reply from Make.com
        addBotMessage(data.message, data.buttons ?? undefined);
      } else if (data.pending) {
        // Async mode: poll until Make.com posts the reply
        await pollForResponse(data.sessionId);
      } else {
        throw new Error('Unexpected response');
      }
    } catch {
      addBotMessage(t('responses.default'));
    } finally {
      setIsTyping(false);
    }
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

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-bg-secondary rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

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
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
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

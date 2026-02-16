declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number>
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
}

export function trackCTA(section: string) {
  trackEvent('click', {
    event_category: 'engagement',
    event_label: 'CTA_Button',
    event_value: section
  });
}

export function trackContact(method: 'whatsapp' | 'phone' | 'email') {
  trackEvent('contact', {
    event_category: 'engagement',
    event_label: `${method.charAt(0).toUpperCase() + method.slice(1)}_Click`,
    method
  });
}

export function trackFormSubmit(budget: string) {
  trackEvent('generate_lead', {
    event_category: 'conversion',
    event_label: 'Diagnostico_Gratuito',
    value: budget
  });
}

export function trackChatbot(action: 'open' | 'message') {
  trackEvent(action === 'open' ? 'chatbot_open' : 'chatbot_message', {
    event_category: 'engagement',
    event_label: action === 'open' ? 'Chatbot_Started' : 'Chatbot_Message_Sent'
  });
}

export function trackPortfolio(projectName: string) {
  trackEvent('view_item', {
    event_category: 'engagement',
    event_label: 'Portfolio_View',
    item_name: projectName
  });
}

export function trackLanguageChange(language: string) {
  trackEvent('language_change', {
    event_category: 'engagement',
    event_label: 'Language_Switch',
    language
  });
}

export function trackScroll(percentage: number) {
  trackEvent('scroll', {
    event_category: 'engagement',
    event_label: 'Scroll_Depth',
    value: percentage
  });
}

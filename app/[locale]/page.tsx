import dynamic from 'next/dynamic';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Problem from '@/components/sections/Problem';
import Solution from '@/components/sections/Solution';

const Process = dynamic(() => import('@/components/sections/Process'));
const Portfolio = dynamic(() => import('@/components/sections/Portfolio'));
const Pricing = dynamic(() => import('@/components/sections/Pricing'));
const Credentials = dynamic(() => import('@/components/sections/Credentials'));
const Testimonials = dynamic(() => import('@/components/sections/Testimonials'));
const FAQ = dynamic(() => import('@/components/sections/FAQ'));
const CTAForm = dynamic(() => import('@/components/sections/CTAForm'));
const Contact = dynamic(() => import('@/components/sections/Contact'));
const WhatsAppButton = dynamic(() => import('@/components/widgets/WhatsAppButton'));
const Chatbot = dynamic(() => import('@/components/widgets/Chatbot'));
const ScrollTracker = dynamic(() => import('@/components/widgets/ScrollTracker'));
const FloatingTechLogos = dynamic(() => import('@/components/widgets/FloatingTechLogos'));

export default function HomePage() {
  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      <Header />
      <FloatingTechLogos />
      {/* Global fixed hero background - visible through semi-transparent sections */}
      <div
        className="fixed inset-0 bg-center bg-cover bg-no-repeat opacity-[0.5] pointer-events-none z-0"
        style={{ backgroundImage: 'url(/images/hero-background.png)' }}
        aria-hidden="true"
      />
      <main id="main-content" className="relative z-[1]">
        <Hero />
        <Problem />
        <Solution />
        <Process />
        <Portfolio />
        <Pricing />
        <Credentials />
        <Testimonials />
        <FAQ />
        <CTAForm />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
      <Chatbot />
      <ScrollTracker />
    </>
  );
}

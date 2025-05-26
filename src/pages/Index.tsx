
import React from 'react';
import Header from '@/components/layout/Header';
import HeroSection from '@/components/sections/HeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import FooterSection from '@/components/sections/FooterSection';
import ChatWidget from '@/components/chat/ChatWidget';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
      </main>
      <FooterSection />
      <ChatWidget />
    </div>
  );
};

export default Index;

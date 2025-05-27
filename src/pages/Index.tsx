
import React from 'react';
import Header from '@/components/layout/Header';
import HeroSection from '@/components/sections/HeroSection';
import CruiseDealsSection from '@/components/sections/CruiseDealsSection';
import DestinationCards from '@/components/sections/DestinationCards';
import CruiseLinesSection from '@/components/sections/CruiseLinesSection';
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
        <CruiseDealsSection />
        <DestinationCards />
        <CruiseLinesSection />
        <FeaturesSection />
        <TestimonialsSection />
      </main>
      <FooterSection />
      <ChatWidget />
    </div>
  );
};

export default Index;

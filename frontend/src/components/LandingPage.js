import React from 'react';
import { HeroSection, DemoSection, FeaturesSection, Footer } from './sections';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <HeroSection />
      <DemoSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default LandingPage;

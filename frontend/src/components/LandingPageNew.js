import React from 'react';
import HeroSection from './sections/HeroSection';
import DemoSection from './sections/DemoSection';
import FeaturesSection from './sections/FeaturesSection';
import Footer from './sections/Footer';

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

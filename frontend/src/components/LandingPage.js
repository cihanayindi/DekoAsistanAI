import React from 'react';
import { HeroSection, FeaturesSection, Footer,RoomDesignDemo } from './sections';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <HeroSection />
      {/* <DemoSection /> */}
      <RoomDesignDemo />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default LandingPage;

"use client";

import React from "react";
import { SemayotHeader } from "./semayot-header";
import { SemayotHero } from "./semayot-hero";
import { FeaturedMenuSection } from "./featured-menu-section";
import { HappyServiceSection } from "./happy-service-section";
import { TodayRecommendationSection } from "./today-recommendation-section";
import { LocationCtaSection } from "./location-cta-section";
import { SemayotFooter } from "./semayot-footer";

export const SemayotHomepage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FCF9F2] text-[#4A3728] font-sans antialiased selection:bg-[#FFC2D6] selection:text-[#FF4F79]">
      <SemayotHeader />
      <main>
        <SemayotHero />
        <FeaturedMenuSection />
        <HappyServiceSection />
        <TodayRecommendationSection />
        <LocationCtaSection />
      </main>
      <SemayotFooter />
    </div>
  );
};
export default SemayotHomepage;

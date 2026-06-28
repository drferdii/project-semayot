"use client";

import React from "react";
import Image from "next/image";
import { SemayotHeader } from "./semayot-header";
import { SemayotHero } from "./semayot-hero";
import { AboutSection } from "./about-section";
import { ExperienceSection } from "./experience-section";
import { BengkayangSection } from "./bengkayang-section";
import { SemayotTestimonials } from "./semayot-testimonials";
import { MenuInfoSection } from "./menu-info-section";
import { CtaFinalSection } from "./cta-final-section";
import { LocationSection } from "./location-section";
import { SemayotFooter } from "./semayot-footer";
import { motion } from "framer-motion";

export const SemayotHomepage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FCF9F2] text-[#1C1917] font-sans antialiased selection:bg-[#FFC2D6] selection:text-[#FF4F79] overflow-x-hidden relative grain-overlay">
      <SemayotHeader />
      <main>
        <SemayotHero />
        
        {/* Welcome Banner */}
        <section className="bg-[#FFF0F3] py-12 md:py-16 border-b border-[#FFD4DF]/60 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12"
            >
              <div className="flex gap-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shadow-lg border-2 border-white"
                >
                  <Image src="/semayot/images/menu1.png" alt="Babi Panggang Khas" fill className="object-cover" sizes="96px" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shadow-lg border-2 border-white -mt-4 md:-mt-6"
                >
                  <Image src="/semayot/images/menu2.png" alt="Daging Asap" fill className="object-cover" sizes="96px" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shadow-lg border-2 border-white"
                >
                  <Image src="/semayot/images/menu3.png" alt="Sayuran Tradisional" fill className="object-cover" sizes="96px" />
                </motion.div>
              </div>
              
              <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1C1917] mb-3 font-display tracking-tight">
                  Tradisi rasa, kualitas prima.
                </h2>
                <p className="text-base md:text-lg text-[#57534E] font-medium max-w-md">
                  Setiap hidangan dibuat dengan standar tinggi dan bahan pilihan. 
                  Pengalaman makan yang istimewa.
                </p>
                <p className="text-xs text-[#A8A29E] font-bold mt-3 uppercase tracking-wider">
                  Non-halal · Masakan khas Dayak
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <AboutSection />
        <ExperienceSection />
        <MenuInfoSection />
        <BengkayangSection />
        <SemayotTestimonials />
        <CtaFinalSection />
        <LocationSection />
      </main>
      <SemayotFooter />
    </div>
  );
};
export default SemayotHomepage;

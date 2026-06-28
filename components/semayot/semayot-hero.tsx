"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight, Star } from "lucide-react";
import { SemayotMascot } from "./semayot-mascot";
import { homepageCopy, locationInfo } from "@/lib/semayot/data";

export const SemayotHero: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section
      id="beranda"
      className="relative min-h-screen pt-28 pb-16 flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#FCF9F2] via-[#FAF3E5] to-[#FCF9F2]"
    >
      {/* Background Decorative Blob/Circles */}
      <div className="absolute top-1/4 left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#FFC2D6]/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-10 right-[-5%] w-[35vw] h-[35vw] rounded-full bg-[#E8D2B5]/20 blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline and Actions */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            {/* Non-Halal Specialty Label */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF0F3] border border-[#FFD4DF] text-xs font-bold text-[#FF4F79] mb-6 tracking-wide uppercase shadow-[0_2px_8px_rgba(255,79,121,0.06)]"
            >
              <Star className="w-3.5 h-3.5 fill-[#FF4F79]" />
              <span>{homepageCopy.specialtyLabel}</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#4A3728] leading-[1.1] mb-6"
            >
              {homepageCopy.headline}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg lg:text-xl text-[#6B5A4B] leading-relaxed max-w-2xl mb-8 font-medium"
            >
              {homepageCopy.subheadline}
            </motion.p>

            {/* CTA Actions */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                href="#menu"
                className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#FF4F79] hover:bg-[#E03D63] text-white text-base font-bold px-8 py-4 rounded-full shadow-[0_6px_20px_rgba(255,79,121,0.3)] transition-all duration-200"
              >
                <span>{homepageCopy.menuCtaText}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.03, backgroundColor: "#EFE5D3" }}
                whileTap={{ scale: 0.98 }}
                href={locationInfo.whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full sm:w-auto bg-white border-2 border-[#EFE5D3] hover:border-[#D0C0A5] text-[#5C4636] text-base font-bold px-8 py-4 rounded-full shadow-[0_4px_12px_rgba(139,94,60,0.05)] transition-all duration-200"
              >
                <MessageCircle className="w-5 h-5 fill-[#5C4636] stroke-none" />
                <span>{homepageCopy.whatsappCtaText}</span>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Column: Mascot & Appetizer Composition */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            {/* Soft backdrop blob for mascot */}
            <div className="absolute w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] rounded-full bg-[#FFE5EC] border-4 border-dashed border-[#FFC2D6] opacity-60 animate-[spin_40s_linear_infinite] pointer-events-none z-0" />

            <div className="relative z-10 flex flex-col items-center">
              {/* Mascot component */}
              <SemayotMascot variant="welcome" size={260} className="sm:w-[320px] sm:h-[320px]" />

              {/* Float badge overlay: Happy Service */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-4 left-[-20px] sm:left-[-10px] bg-white border border-[#EFE5D3] px-4 py-2.5 rounded-2xl shadow-[0_8px_20px_rgba(139,94,60,0.06)] flex items-center gap-2"
              >
                <span className="text-xl">🐷</span>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-[#4A3728]">Hai! Saya Semayot</span>
                  <span className="text-[10px] text-[#8A7560] font-semibold">Siap menyajikan kebahagiaan!</span>
                </div>
              </motion.div>

              {/* Float badge overlay: Food Preview */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-6 right-[-20px] sm:right-[-10px] bg-white border border-[#EFE5D3] px-4 py-2.5 rounded-2xl shadow-[0_8px_20px_rgba(139,94,60,0.06)] flex items-center gap-2"
              >
                <span className="text-xl">🔥</span>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-[#4A3728]">Kulit Krispi Juara!</span>
                  <span className="text-[10px] text-[#8A7560] font-semibold">Dipanggang segar setiap hari</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

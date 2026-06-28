"use client";

import React from "react";
import { motion } from "framer-motion";
import { SemayotMascot } from "./semayot-mascot";
import { featuredMenu, locationInfo, homepageCopy } from "@/lib/semayot/data";
import { MessageCircle, Award, Sparkles } from "lucide-react";

export const TodayRecommendationSection: React.FC = () => {
  // Ambil menu rekomendasi pertama (Babi Panggang Semayot)
  const recommendedItem = featuredMenu[0];

  // WhatsApp link dengan pesan khusus menu rekomendasi hari ini
  const encodedMessage = encodeURIComponent(
    `Halo Rumah Makan Semayot, saya tertarik memesan Menu Rekomendasi Hari Ini: *${recommendedItem.name}* (${recommendedItem.price}). Apakah siap diantarkan/dipesan sekarang?`
  );
  const waUrl = `https://wa.me/${locationInfo.whatsAppNumber.replace(/\+/g, "")}?text=${encodedMessage}`;

  return (
    <section id="rekomendasi" className="py-20 bg-[#FCF9F2] overflow-hidden relative">
      {/* Decorative Blob */}
      <div className="absolute top-1/2 left-[80%] w-[30vw] h-[30vw] rounded-full bg-[#FFC2D6]/8 blur-[70px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-[#FAF3E5] border border-[#EFE5D3] rounded-[40px] p-8 sm:p-12 lg:p-16 shadow-[0_12px_40px_rgba(139,94,60,0.06)] relative overflow-hidden">
          {/* Inner Decorative Circle */}
          <div className="absolute top-[-50px] right-[-50px] w-48 h-48 rounded-full bg-white opacity-20" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Mascot in recommendation pose */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              <SemayotMascot variant="recommendation" size={240} className="sm:w-[280px] sm:h-[280px]" />
              
              {/* Talking Bubble from Mascot */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                viewport={{ once: true }}
                className="absolute top-[-20px] bg-white border border-[#EFE5D3] px-5 py-3 rounded-2xl shadow-[0_8px_20px_rgba(139,94,60,0.08)] text-center max-w-[200px]"
              >
                <p className="text-xs font-bold text-[#4A3728]">
                  Ini menu favorit saya! Kamu wajib coba hari ini! 🤤
                </p>
                {/* Gelembung Arah Bawah */}
                <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-[#EFE5D3] rotate-45" />
              </motion.div>
            </div>

            {/* Right Column: Menu details and CTA */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF0F3] border border-[#FFD4DF] text-xs font-extrabold text-[#FF4F79] mb-6 uppercase tracking-wider">
                <Award className="w-4 h-4 fill-[#FF4F79] stroke-none" />
                <span>Rekomendasi Hari Ini</span>
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#4A3728] mb-4">
                {homepageCopy.recommendationTitle}
              </h2>
              
              <p className="text-base text-[#6B5A4B] font-medium leading-relaxed mb-8 max-w-xl">
                {homepageCopy.recommendationSubtitle}
              </p>

              {/* Special Menu Highlight Card */}
              <div className="w-full bg-white border border-[#EFE5D3] rounded-3xl p-6 sm:p-8 mb-8 text-left shadow-[0_4px_16px_rgba(139,94,60,0.02)] flex flex-col sm:flex-row gap-6 items-center">
                {/* Highlight Icon */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FFF0F3] to-[#FAF3E5] flex items-center justify-center text-4xl shrink-0 shadow-[0_4px_12px_rgba(255,79,121,0.1)]">
                  🍖
                </div>
                
                {/* Details */}
                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-[#4A3728]">
                      {recommendedItem.name}
                    </h3>
                    <span className="text-lg font-extrabold text-[#FF4F79]">
                      {recommendedItem.price}
                    </span>
                  </div>
                  <p className="text-sm text-[#6B5A4B] font-semibold leading-relaxed">
                    {recommendedItem.description}
                  </p>
                </div>
              </div>

              {/* Order Action Button */}
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#FF4F79] hover:bg-[#E03D63] text-white text-base font-bold px-8 py-4 rounded-full shadow-[0_6px_20px_rgba(255,79,121,0.25)] transition-all duration-200"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Pesan Rekomendasi Sekarang</span>
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Utensils, Heart, Sparkles, MessageSquare } from "lucide-react";
import { homepageCopy } from "@/lib/semayot/homepage-copy";

const iconMap = {
  utensils: Utensils,
  heart: Heart,
  sparkles: Sparkles,
  "message-square": MessageSquare,
};

export const HappyServiceSection: React.FC = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <section id="keunggulan" className="py-20 bg-[#FAF3E5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF4F79] bg-[#FFF0F3] px-3.5 py-1.5 rounded-full border border-[#FFD4DF]">
            {homepageCopy.service.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#4A3728] mt-4 mb-4">
            {homepageCopy.service.title}
          </h2>
          <p className="text-base text-[#6B5A4B] font-semibold leading-relaxed">
            {homepageCopy.service.subtitle}
          </p>
        </div>

        {/* Pillars Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {homepageCopy.service.pillars.map((pillar, index) => {
            const IconComponent = iconMap[pillar.icon] || Utensils;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white border border-[#EFE5D3] p-8 rounded-3xl shadow-[0_4px_16px_rgba(74,53,40,0.02)] hover:shadow-[0_8px_24px_rgba(74,53,40,0.05)] hover:border-[#D8C2A0] transition-all duration-300 flex flex-col items-center lg:items-start text-center lg:text-left"
              >
                {/* Icon Container */}
                <div className="w-12 h-12 rounded-2xl bg-[#FFF0F3] flex items-center justify-center text-[#FF4F79] mb-6 shadow-[0_4px_10px_rgba(255,79,121,0.1)]">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#4A3728] mb-3">
                  {pillar.title}
                </h3>
                <p className="text-sm text-[#6B5A4B] leading-relaxed font-semibold">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

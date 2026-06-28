"use client";

import React from "react";
import { motion } from "framer-motion";
import { featuredMenu, menuDisclaimer } from "@/lib/semayot/menu-data";
import { MenuCard } from "./menu-card";
import { LiquidBlobs } from "./liquid-blobs";
import { AlertCircle } from "lucide-react";

export const FeaturedMenuSection: React.FC = () => {
  return (
    <section id="menu" className="relative py-24 overflow-hidden">
      <LiquidBlobs variant="menu" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with text reveal */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-block text-xs font-bold uppercase tracking-widest text-[#D97706] bg-[#FFFBEB]/80 backdrop-blur-sm px-4 py-2 rounded-full border border-[#FDE68A]"
          >
            Menu Pilihan
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1C1917] mt-5 mb-5 font-display tracking-tight"
          >
            Rasa Otentik Khas Semayot
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base text-[#57534E] font-medium leading-relaxed mb-6"
          >
            Dibuat segar setiap hari dengan rempah-rempah otentik pedalaman Kalimantan Barat.
          </motion.p>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="inline-flex items-center justify-center gap-2 text-xs font-bold text-[#A8A29E] bg-white/70 backdrop-blur-sm border border-[#E7E5E4] px-4 py-3 rounded-2xl max-w-2xl mx-auto"
          >
            <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0" />
            <span className="text-left leading-relaxed">{menuDisclaimer}</span>
          </motion.div>
        </div>

        {/* Cards grid with stagger */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredMenu.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.12,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <MenuCard item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

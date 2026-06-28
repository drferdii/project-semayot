"use client";

import React from "react";
import { motion } from "framer-motion";
import { featuredMenu } from "@/lib/semayot/data";
import { MenuCard } from "./menu-card";

export const FeaturedMenuSection: React.FC = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <section id="menu" className="py-20 bg-[#FCF9F2] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF4F79] bg-[#FFF0F3] px-3.5 py-1.5 rounded-full border border-[#FFD4DF]">
            Menu Pilihan
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#4A3728] mt-4 mb-4">
            Rasa Otentik Khas Semayot
          </h2>
          <p className="text-base text-[#6B5A4B] font-medium leading-relaxed">
            Dibuat segar setiap hari dengan bahan-bahan premium dan cita rasa lokal pilihan yang pasti membuat lidah Anda bergoyang.
          </p>
        </div>

        {/* Menu Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {featuredMenu.map((item) => (
            <motion.div key={item.id} variants={cardVariants}>
              <MenuCard item={item} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

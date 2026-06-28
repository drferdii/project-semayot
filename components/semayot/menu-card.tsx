"use client";

import React from "react";
import { motion } from "framer-motion";
import { MenuItem, locationInfo } from "@/lib/semayot/data";
import { ShoppingBag } from "lucide-react";

interface MenuCardProps {
  item: MenuItem;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  // Generate WhatsApp text khusus untuk menu ini
  const encodedMessage = encodeURIComponent(
    `Halo Rumah Makan Semayot, saya ingin memesan menu *${item.name}* (${item.price}). Apakah tersedia untuk saat ini?`
  );
  const waOrderUrl = `https://wa.me/${locationInfo.whatsAppNumber.replace(/\+/g, "")}?text=${encodedMessage}`;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white border border-[#EFE5D3] rounded-3xl overflow-hidden shadow-[0_4px_16px_rgba(139,94,60,0.04)] hover:shadow-[0_12px_30px_rgba(139,94,60,0.1)] transition-all duration-300 flex flex-col h-full"
    >
      {/* Food Image / Premium Placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-[#FFF0F3] to-[#FAF3E5] flex items-center justify-center overflow-hidden border-b border-[#EFE5D3]">
        {/* Soft geometric/organic shapes for appetite visual */}
        <div className="absolute w-32 h-32 rounded-full bg-[#FFC2D6]/20 blur-xl top-4 left-4" />
        <div className="absolute w-24 h-24 rounded-full bg-[#E8D2B5]/30 blur-xl bottom-4 right-4" />

        {/* Dynamic Pig Emoji or Icon representing pork specialty */}
        <div className="relative text-center z-10 flex flex-col items-center">
          <span className="text-5xl mb-2 drop-shadow-[0_4px_12px_rgba(255,79,121,0.2)]">
            {item.id.includes("sate") ? "🍢" : item.id.includes("rica") ? "🌶️" : "🍖"}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#A08875]">
            Specialty Pork
          </span>
        </div>

        {/* Badge */}
        {item.badge && (
          <div className="absolute top-4 left-4 bg-[#FF4F79] text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-[0_2px_8px_rgba(255,79,121,0.25)]">
            {item.badge}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="text-lg font-bold text-[#4A3728] leading-snug">
            {item.name}
          </h3>
          <span className="text-base font-extrabold text-[#FF4F79] whitespace-nowrap">
            {item.price}
          </span>
        </div>

        <p className="text-sm text-[#6B5A4B] leading-relaxed mb-6 flex-grow font-medium">
          {item.description}
        </p>

        {/* Actions */}
        <div className="mt-auto">
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={waOrderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#FAF3E5] hover:bg-[#FF4F79] text-[#5C4636] hover:text-white border border-[#EFE5D3] hover:border-[#FF4F79] text-sm font-bold py-3 px-4 rounded-2xl transition-all duration-300 shadow-[0_2px_8px_rgba(139,94,60,0.02)]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Pesan Sekarang</span>
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

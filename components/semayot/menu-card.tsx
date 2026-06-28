"use client";

import React from "react";
import { motion } from "framer-motion";
import { MenuItem } from "@/lib/semayot/menu-data";
import { semayotBusinessInfo } from "@/lib/semayot/business-info";
import { Phone, AlertCircle } from "lucide-react";

interface MenuCardProps {
  item: MenuItem;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  const formattedPhone = semayotBusinessInfo.phone.replace(/[^0-9]/g, "");
  
  // WhatsApp link dengan pesan khusus menu representatif ini
  const encodedMessage = encodeURIComponent(
    `Halo Rumah Makan Semayot, saya tertarik memesan atau menanyakan ketersediaan menu: *${item.name}*. Apakah menu khas ini siap disajikan hari ini?`
  );
  const orderUrl = `https://wa.me/62${formattedPhone.substring(1)}?text=${encodedMessage}`;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white border border-[#EFE5D3] rounded-3xl overflow-hidden shadow-[0_4px_16px_rgba(74,53,40,0.03)] hover:shadow-[0_12px_30px_rgba(74,53,40,0.08)] transition-all duration-300 flex flex-col h-full relative"
    >
      {/* Food Image / Premium Placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-[#FFF0F3] to-[#FAF3E5] flex items-center justify-center overflow-hidden border-b border-[#EFE5D3]">
        <div className="absolute w-32 h-32 rounded-full bg-[#FFC2D6]/20 blur-xl top-4 left-4" />
        <div className="absolute w-24 h-24 rounded-full bg-[#E8D2B5]/30 blur-xl bottom-4 right-4" />

        {/* Dynamic Pig Emoji or Icon representing pork specialty */}
        <div className="relative text-center z-10 flex flex-col items-center">
          <span className="text-5xl mb-2 drop-shadow-[0_4px_12px_rgba(255,79,121,0.2)]">
            {item.category === "dayak" ? "🍃" : item.category === "smoked" ? "🔥" : "🌶️"}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#A08875]">
            {item.category === "dayak" ? "Dayak Specialty" : item.category === "smoked" ? "Smoked Pork" : "Spicy Delicacy"}
          </span>
        </div>

        {/* Badge */}
        {item.badge && (
          <div className="absolute top-4 left-4 bg-[#FF4F79] text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-[0_2px_8px_rgba(255,79,121,0.2)]">
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
          <span className="text-sm font-extrabold text-[#FF4F79] whitespace-nowrap bg-[#FFF0F3] px-2.5 py-1 rounded-lg border border-[#FFD4DF]">
            {item.price}
          </span>
        </div>

        <p className="text-sm text-[#6B5A4B] leading-relaxed mb-6 flex-grow font-semibold">
          {item.description}
        </p>

        {/* Needs Owner Confirmation Warning */}
        {item.needsOwnerConfirmation && (
          <div className="flex items-center gap-1.5 text-[10px] text-[#A08875] font-bold bg-[#FAF3E5]/60 border border-[#EFE5D3]/60 px-2.5 py-1.5 rounded-xl mb-4">
            <AlertCircle className="w-3.5 h-3.5 text-[#FF4F79] shrink-0" />
            <span>Khas Ulasan Pelanggan (Perlu Konfirmasi)</span>
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto">
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#FAF3E5] hover:bg-[#FF4F79] text-[#5C4636] hover:text-white border border-[#EFE5D3] hover:border-[#FF4F79] text-xs font-bold py-3 px-4 rounded-2xl transition-all duration-300 shadow-[0_2px_8px_rgba(139,94,60,0.02)]"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Tanya Ketersediaan</span>
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

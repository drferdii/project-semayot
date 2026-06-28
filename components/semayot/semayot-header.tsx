"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { semayotBusinessInfo } from "@/lib/semayot/business-info";
import { homepageCopy } from "@/lib/semayot/homepage-copy";

export const SemayotHeader: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Beranda", href: "#beranda" },
    { label: "Menu Pilihan", href: "#menu" },
    { label: "Keunggulan", href: "#keunggulan" },
    { label: "Rekomendasi", href: "#rekomendasi" },
    { label: "Lokasi & Kontak", href: "#lokasi" },
  ];

  const formattedPhone = semayotBusinessInfo.phone.replace(/[^0-9]/g, "");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#FCF9F2]/90 backdrop-blur-md shadow-[0_4px_20px_rgba(74,53,40,0.06)] py-3 border-b border-[#EFE5D3]/60"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Brand Name */}
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#4A3728] flex items-center gap-2">
              <span className="inline-block w-3.5 h-3.5 rounded-full bg-[#FF4F79]" />
              Semayot
            </span>
            <span className="text-[9px] sm:text-[10px] text-[#8A7560] font-bold uppercase tracking-widest hidden sm:inline">
              Khas Dayak & Asap Lokal
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-bold text-[#5C4636] hover:text-[#FF4F79] transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden md:block">
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href={`tel:${formattedPhone}`}
              className="inline-flex items-center gap-2 bg-[#FF4F79] hover:bg-[#E03D63] text-white text-sm font-extrabold px-5 py-2.5 rounded-full shadow-[0_4px_14px_rgba(255,79,121,0.2)] transition-all duration-200"
            >
              <Phone className="w-4 h-4" />
              <span>Hubungi Kami</span>
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-[#5C4636] hover:bg-[#EFE5D3] focus:outline-none transition-colors duration-200"
              aria-label="Toggle navigation"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#FCF9F2] border-b border-[#EFE5D3] overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-3 sm:px-6">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-base font-bold text-[#5C4636] hover:text-[#FF4F79] py-2 px-3 rounded-xl hover:bg-[#EFE5D3] transition-all duration-200"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 border-t border-[#EFE5D3]">
                <a
                  href={`tel:${formattedPhone}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-[#FF4F79] text-white font-extrabold py-3 px-4 rounded-full shadow-[0_4px_14px_rgba(255,79,121,0.2)]"
                >
                  <Phone className="w-5 h-5" />
                  <span>Hubungi Kami</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

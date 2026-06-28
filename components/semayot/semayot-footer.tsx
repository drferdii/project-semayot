"use client";

import React from "react";
import { MessageCircle, MapPin, Mail, Instagram, Star } from "lucide-react";
import { locationInfo, homepageCopy } from "@/lib/semayot/data";

export const SemayotFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#4A3728] text-[#FCF9F2] pt-16 pb-8 border-t border-[#3D2C1F] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          
          {/* Brand Summary */}
          <div className="md:col-span-5 flex flex-col items-start">
            <span className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 mb-4">
              <span className="inline-block w-3.5 h-3.5 rounded-full bg-[#FF4F79]" />
              Semayot
            </span>
            <p className="text-sm text-[#D5C2B1] font-semibold leading-relaxed mb-6 max-w-sm">
              Rumah makan keluarga dengan menu babi specialty pilihan khas nusantara. Disajikan hangat dengan senyuman dan pelayanan penuh kebahagiaan.
            </p>
            
            {/* Non-Halal tag in footer */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#3D2C1F] border border-[#5A4535] rounded-full text-[10px] font-bold text-[#FF85A1] uppercase tracking-wider mb-6">
              <Star className="w-3 h-3 fill-[#FF85A1] stroke-none" />
              <span>{homepageCopy.specialtyLabel}</span>
            </span>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 flex flex-col">
            <h4 className="text-sm font-extrabold uppercase tracking-widest text-[#FF85A1] mb-6">
              Navigasi Cepat
            </h4>
            <ul className="space-y-3 font-semibold">
              <li>
                <a href="#beranda" className="text-[#D5C2B1] hover:text-white transition-colors duration-150">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#menu" className="text-[#D5C2B1] hover:text-white transition-colors duration-150">
                  Menu Pilihan
                </a>
              </li>
              <li>
                <a href="#keunggulan" className="text-[#D5C2B1] hover:text-white transition-colors duration-150">
                  Keunggulan
                </a>
              </li>
              <li>
                <a href="#rekomendasi" className="text-[#D5C2B1] hover:text-white transition-colors duration-150">
                  Rekomendasi
                </a>
              </li>
              <li>
                <a href="#lokasi" className="text-[#D5C2B1] hover:text-white transition-colors duration-150">
                  Lokasi & Kontak
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 flex flex-col">
            <h4 className="text-sm font-extrabold uppercase tracking-widest text-[#FF85A1] mb-6">
              Hubungi Kami
            </h4>
            <ul className="space-y-4 font-semibold text-sm text-[#D5C2B1]">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#FF85A1] shrink-0" />
                <span>{locationInfo.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-[#FF85A1] shrink-0" />
                <a
                  href={locationInfo.whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp: {locationInfo.whatsAppNumber}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#FF85A1] shrink-0" />
                <a href="mailto:info@semayot.com" className="hover:text-white transition-colors">
                  info@semayot.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Instagram className="w-5 h-5 text-[#FF85A1] shrink-0" />
                <a href="https://instagram.com" className="hover:text-white transition-colors">
                  @rm.semayot
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-[#3D2C1F] text-center text-xs text-[#A38D7C] font-bold">
          <p>© {currentYear} Rumah Makan Semayot. Hak Cipta Dilindungi. Made with ❤️ for Chief.</p>
        </div>
      </div>
    </footer>
  );
};

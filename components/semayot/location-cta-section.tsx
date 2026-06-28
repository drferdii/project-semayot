"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Navigation, Phone, Compass } from "lucide-react";
import { locationInfo, homepageCopy } from "@/lib/semayot/data";

export const LocationCtaSection: React.FC = () => {
  return (
    <section id="lokasi" className="py-20 bg-[#FAF3E5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Map Placeholder / Landmark */}
          <div className="lg:col-span-6 flex flex-col h-full">
            <div className="bg-white border border-[#EFE5D3] rounded-3xl p-8 shadow-[0_4px_16px_rgba(139,94,60,0.02)] flex-grow flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#FF4F79] bg-[#FFF0F3] px-3.5 py-1.5 rounded-full border border-[#FFD4DF]">
                  Kunjungi Kami
                </span>
                <h3 className="text-2xl font-bold text-[#4A3728] mt-6 mb-4">
                  Rumah Makan Semayot Kelapa Gading
                </h3>
                
                {/* Landmark Info */}
                <div className="flex items-start gap-3 bg-[#FCF9F2] border border-[#EFE5D3] p-4 rounded-2xl mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#EFE5D3] flex items-center justify-center text-[#FF4F79] shrink-0">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#4A3728] mb-0.5">Petunjuk Lokasi (Landmark):</h4>
                    <p className="text-xs text-[#6B5A4B] font-semibold leading-relaxed">
                      {locationInfo.landmark}
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Graphic / Interactive Button */}
              <motion.a
                whileHover={{ y: -4 }}
                href={locationInfo.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-60 bg-gradient-to-br from-[#FFF0F3] to-[#FAF3E5] border border-[#EFE5D3] rounded-2xl flex flex-col items-center justify-center overflow-hidden shadow-[0_2px_8px_rgba(139,94,60,0.02)] group cursor-pointer"
              >
                {/* Abstract grid lines simulating map */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#5c4033_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
                
                {/* Map Pin bounce animation */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="z-10 bg-[#FF4F79] text-white p-4 rounded-full shadow-[0_4px_16px_rgba(255,79,121,0.3)] mb-4"
                >
                  <MapPin className="w-8 h-8 fill-white stroke-[#FF4F79]" />
                </motion.div>

                <span className="z-10 text-sm font-bold text-[#5C4636] group-hover:text-[#FF4F79] transition-colors duration-200">
                  Klik untuk Membuka di Google Maps
                </span>
                
                {/* Backdrop overlay on hover */}
                <div className="absolute inset-0 bg-[#FF4F79]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.a>
            </div>
          </div>

          {/* Right Column: Address and Operational Hours */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div className="bg-white border border-[#EFE5D3] rounded-3xl p-8 shadow-[0_4px_16px_rgba(139,94,60,0.02)] h-full flex flex-col justify-between">
              <div className="space-y-8">
                {/* Address Item */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF0F3] flex items-center justify-center text-[#FF4F79] shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#4A3728] mb-1">Alamat Utama</h4>
                    <p className="text-sm text-[#6B5A4B] leading-relaxed font-semibold">
                      {locationInfo.address}
                    </p>
                  </div>
                </div>

                {/* Clock Item */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF0F3] flex items-center justify-center text-[#FF4F79] shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#4A3728] mb-1">Jam Operasional</h4>
                    <p className="text-sm text-[#6B5A4B] leading-relaxed font-semibold">
                      {locationInfo.openingHours}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={locationInfo.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#FF4F79] hover:bg-[#E03D63] text-white text-base font-bold px-6 py-4 rounded-2xl shadow-[0_4px_14px_rgba(255,79,121,0.2)] transition-colors duration-200"
                >
                  <Navigation className="w-5 h-5 fill-white stroke-none" />
                  <span>{homepageCopy.mapsCtaText}</span>
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.02, backgroundColor: "#EFE5D3" }}
                  whileTap={{ scale: 0.98 }}
                  href={locationInfo.whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-white border border-[#EFE5D3] text-[#5C4636] text-base font-bold px-6 py-4 rounded-2xl shadow-[0_2px_8px_rgba(139,94,60,0.02)] transition-colors duration-200"
                >
                  <Phone className="w-5 h-5" />
                  <span>Hubungi Kami</span>
                </motion.a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

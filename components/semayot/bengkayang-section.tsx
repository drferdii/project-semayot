"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MapPin, Mountain, Home, Globe, PartyPopper, TreePalm, BookOpen } from "lucide-react";

const bengkayangContent = [
  {
    id: 1,
    icon: Mountain,
    title: "Bumi 1000 Riam",
    subtitle: "Julukan Kabupaten Bengkayang",
    body: "Kabupaten Bengkayang terkenal dengan julukan Bumi 1000 Riam karena memiliki ratusan hingga ribuan air terjun (riam) eksotis. Salah satu yang paling ikonik adalah Riam Merasap di Desa Sahan, yang sering dijuluki sebagai \"Niagara Kecil\" Kalimantan Barat karena kemegahan alirannya.",
    accent: "#15803D",
  },
  {
    id: 2,
    icon: Home,
    title: "Rumah Baruk",
    subtitle: "Arsitektur Bundar yang Unik",
    body: "Berbeda dengan suku Dayak pada umumnya yang tinggal di Rumah Betang berbentuk memanjang, suku Dayak Bidayuh di Bengkayang memiliki arsitektur khas bernama Rumah Baruk. Rumah adat ini berbentuk bundar/melingkar dan menjulang tinggi, yang secara historis berfungsi sebagai tempat pertahanan sekaligus pusat ritual adat.",
    accent: "#B45309",
  },
  {
    id: 3,
    icon: Globe,
    title: "Gerbang Batas Negara",
    subtitle: "Perbatasan & Lumbung Jagung",
    body: "Bengkayang berbatasan darat langsung dengan wilayah Sarawak, Malaysia, khususnya di Kecamatan Jagoi Babang. Kawasan perbatasan ini sangat strategis. Melalui program ketahanan pangan nasional, pemerintah daerah aktif mendorong wilayah perbatasan menjadi salah satu sentra penghasil jagung terbesar untuk swasembada pangan nasional.",
    accent: "#DC2626",
  },
  {
    id: 4,
    icon: PartyPopper,
    title: "Cap Go Meh Bengkayang",
    subtitle: "Perayaan Terbesar Kedua di Kalbar",
    body: "Budaya di Bengkayang sangat harmonis dengan perpaduan etnis Dayak, Melayu, dan Tionghoa. Setiap tahunnya, perayaan Cap Go Meh yang berpusat di Vihara Ariamarama menjadi daya tarik wisata luar biasa dan diklaim sebagai perayaan terbesar kedua di Kalimantan Barat setelah Kota Singkawang.",
    accent: "#E11D48",
  },
  {
    id: 5,
    icon: TreePalm,
    title: "Dataran Tinggi & Pesisir",
    subtitle: "Keindahan Alam Bengkayang",
    body: "Kondisi geografis Bengkayang sangat unik karena mencakup pegunungan hingga pantai. Sepadang Hill & Bukit Jamur menawarkan sensasi negeri di atas awan. Sementara itu, pantai berpasir putih seperti Pantai Samudera Indah dan Pantai Kura-Kura menjadi destinasi favorit wisatawan.",
    accent: "#0891B2",
  },
  {
    id: 6,
    icon: BookOpen,
    title: "Pemekaran dari Sambas",
    subtitle: "Sejarah Berdirinya Bengkayang",
    body: "Secara historis, Kabupaten Bengkayang resmi berdiri pada tanggal 20 April 1999 setelah dimekarkan dari Kabupaten Sambas berdasarkan Undang-Undang Nomor 10 Tahun 1999. Saat ini, pusat pemerintahannya mengelola 17 kecamatan.",
    accent: "#7C3AED",
  },
];

export const BengkayangSection: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(1);

  return (
    <section className="relative bg-[#FAF6F0] pt-16 md:pt-24 lg:pt-28 pb-20 md:pb-28 lg:pb-36 overflow-hidden border-b border-[#E7E5E4]">
      {/* Newspaper texture background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 24px, #1C1917 24px, #1C1917 25px), repeating-linear-gradient(90deg, transparent, transparent 24px, #1C1917 24px, #1C1917 25px)`,
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        {/* Newspaper Header */}
        <div className="text-center mb-16 md:mb-20 border-b-4 border-[#1C1917] pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-4 mb-4"
          >
            <div className="h-px flex-1 bg-[#1C1917]/20" />
            <span className="text-[10px] font-bold text-[#A8A29E] uppercase tracking-[0.3em]">
              Edisi Khusus
            </span>
            <div className="h-px flex-1 bg-[#1C1917]/20" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-7xl font-black text-[#1C1917] font-display tracking-tight leading-[0.95] mb-4"
          >
            Bengkayang
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm md:text-base text-[#78716C] font-medium tracking-wide"
          >
            Kalimantan Barat &mdash; Tanah Air Terjun, Budaya, &amp; Keindahan Alam
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center gap-6 mt-6 text-[10px] text-[#A8A29E] uppercase tracking-[0.2em] font-bold"
          >
            <span>Vol. XXVI</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4F79]" />
            <span>No. 7</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4F79]" />
            <span>Hari Ini</span>
          </motion.div>
        </div>

        {/* Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column - Main Story */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-px bg-[#FF4F79]" />
                <span className="text-[10px] font-bold text-[#FF4F79] uppercase tracking-[0.15em]">
                  Featured Story
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-black text-[#1C1917] font-display tracking-tight leading-tight mb-4">
                Bengkayang: Permata Tersembunyi di Ujung Barat Kalimantan
              </h3>

              <p className="text-base text-[#57534E] leading-relaxed font-medium">
                Terletak di perbatasan Indonesia-Malaysia, Kabupaten Bengkayang menyimpan kekayaan alam dan budaya yang luar biasa. Dari ribuan air terjun hingga arsitektur tradisional unik, setiap sudutnya bercerita.
              </p>
            </motion.div>

            {/* Accordion Items */}
            <div className="space-y-0 border-t border-[#1C1917]/10">
              {bengkayangContent.map((item, idx) => {
                const Icon = item.icon;
                const isExpanded = expandedId === item.id;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className="border-b border-[#1C1917]/10"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="w-full flex items-center gap-4 py-5 text-left group hover:bg-[#1C1917]/[0.02] transition-colors px-2 -mx-2"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300"
                        style={{
                          backgroundColor: isExpanded ? item.accent : "#F5F0E8",
                          color: isExpanded ? "white" : item.accent,
                        }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm md:text-base font-bold text-[#1C1917] group-hover:text-[#FF4F79] transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-[#A8A29E] font-medium">
                          {item.subtitle}
                        </p>
                      </div>

                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="shrink-0"
                      >
                        <ChevronDown className="w-4 h-4 text-[#A8A29E]" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pb-5 pl-14 pr-4">
                            <p className="text-sm text-[#57534E] leading-relaxed">
                              {item.body}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-8 space-y-8">
              {/* Quick Facts Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-[#1C1917] text-white rounded-2xl p-6 md:p-8"
              >
                <h4 className="text-xs font-bold text-[#FFC2D6] uppercase tracking-[0.2em] mb-6">
                  Fakta Singkat
                </h4>
                <div className="space-y-4">
                  {[
                    { label: "Ibu Kota", value: "Bengkayang" },
                    { label: "Provinsi", value: "Kalimantan Barat" },
                    { label: "Kecamatan", value: "17 kecamatan" },
                    { label: "Berdiri", value: "20 April 1999" },
                    { label: "Julukan", value: "Bumi 1000 Riam" },
                    { label: "Perbatasan", value: "Sarawak, Malaysia" },
                  ].map((fact) => (
                    <div key={fact.label} className="flex justify-between items-baseline pb-3 border-b border-white/10 last:border-b-0 last:pb-0">
                      <span className="text-xs text-stone-400 uppercase tracking-wider font-bold">{fact.label}</span>
                      <span className="text-sm font-bold text-white">{fact.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Quote Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="border-l-4 border-[#FF4F79] pl-6 py-4"
              >
                <p className="text-lg md:text-xl font-display text-[#1C1917] italic leading-relaxed">
                  &ldquo;Dari air terjun hingga pantai, dari tradisi hingga modernitas, Bengkayang adalah rumah bagi kami.&rdquo;
                </p>
                <p className="text-xs text-[#A8A29E] font-bold mt-3 uppercase tracking-wider">
                  &mdash; Rumah Makan Semayot
                </p>
              </motion.div>

              {/* Location Badge */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-[#FFF0F3] border border-[#FFD4DF]"
              >
                <MapPin className="w-5 h-5 text-[#FF4F79] shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#A8A29E] uppercase tracking-wider">Kami Berada Di</p>
                  <p className="text-sm font-bold text-[#1C1917]">Bumi Amas, Bengkayang</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default BengkayangSection;

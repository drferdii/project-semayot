"use client";

import React from "react";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

const testimonials = [
  {
    id: 1,
    name: "Andi Wijaya",
    role: "Pelanggan Setia",
    company: "Bengkayang",
    content:
      "Daging asapnya benar-benar juara! Rasa smoky-nya pas dan bumbu meresap sampai ke dalam. Setiap kali ke Bengkayang, mampir ke Semayot adalah wajib.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Andi&backgroundColor=b6e3f4",
  },
  {
    id: 2,
    name: "Siti Rahayu",
    role: "Wisatawan",
    company: "Pontianak",
    content:
      "Suasana rumah makannya sangat nyaman dan autentik. Pelayanannya cepat dan ramah. Babi panggangnya wajib dicoba — kulitnya garing, dagingnya lembut!",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti&backgroundColor=ffdfbf",
  },
  {
    id: 3,
    name: "Budi Santoso",
    role: "Pengusaha",
    company: "Singkawang",
    content:
      "Sering bawa tamu bisnis ke sini. Makanan khas Dayak-nya selalu jadi pembicaraan. Tempat yang pas untuk santap siang setelah perjalanan jauh.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi&backgroundColor=c0aede",
  },
  {
    id: 4,
    name: "Maria Kusuma",
    role: "Pelanggan",
    company: "Bengkayang",
    content:
      "Sayur daun singkong tumisnya enak banget, tidak pahit. Kombinasi lauk dan sayur tradisionalnya bikin nostalgia masakan rumah. Harga juga terjangkau!",
    rating: 4,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria&backgroundColor=ffdfbf",
  },
  {
    id: 5,
    name: "Joko Prasetyo",
    role: "Traveler",
    company: "Jakarta",
    content:
      "Kuliner terbaik yang saya temui di Kalimantan Barat. Daging asap dengan sambal khas Dayak-nya luar biasa. Recommended banget buat wisatawan!",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joko&backgroundColor=b6e3f4",
  },
];

export const SemayotTestimonials: React.FC = () => {
  return (
    <AnimatedTestimonials
      title="Ulasan Pelanggan"
      subtitle="Apa kata mereka yang sudah mencicipi masakan tradisional Dayak kami."
      badgeText="⭐ 4.9 dari 9 ulasan"
      testimonials={testimonials}
      autoRotateInterval={5000}
      className="bg-[#1B6B93]"
      isDark={true}
    />
  );
};
export default SemayotTestimonials;

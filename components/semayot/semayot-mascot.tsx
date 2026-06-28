"use client";

import React from "react";
import { motion } from "framer-motion";

export type MascotVariant = "welcome" | "menu" | "recommendation" | "thankyou" | "loading";

interface MascotProps {
  variant?: MascotVariant;
  className?: string;
  size?: number;
}

export const SemayotMascot: React.FC<MascotProps> = ({
  variant = "welcome",
  className = "",
  size = 200,
}) => {
  // Variasi animasi dasar
  const floatTransition = {
    y: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut" as const,
    },
  };

  // Varian animasi mata berkedip
  const blinkVariants = {
    open: { scaleY: 1 },
    blink: {
      scaleY: 0.1,
      transition: { duration: 0.15, times: [0, 0.5, 1] },
    },
  };

  const [blinkState, setBlinkState] = React.useState("open");

  React.useEffect(() => {
    const interval = setInterval(() => {
      setBlinkState("blink");
      setTimeout(() => setBlinkState("open"), 150);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className={`relative select-none flex items-center justify-center ${className}`}
      animate={{ y: [0, -10, 0] }}
      transition={floatTransition}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_8px_24px_rgba(251,146,198,0.15)]"
      >
        {/* Shadow di bawah maskot */}
        <ellipse cx="100" cy="185" rx="55" ry="8" fill="#F3EAD8" opacity="0.8" />

        {/* TELINGA BERSAMA ANIMASI */}
        {/* Telinga Kiri */}
        <motion.path
          d="M 50 65 C 25 35, 45 15, 65 35 C 75 45, 60 55, 50 65 Z"
          fill="#FFAEC9"
          stroke="#F898B6"
          strokeWidth="3"
          animate={variant === "loading" ? { rotate: [0, -10, 0] } : { rotate: [0, 5, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: "60px", originY: "45px" }}
        />
        {/* Telinga Kanan */}
        <motion.path
          d="M 150 65 C 175 35, 155 15, 135 35 C 125 45, 140 55, 150 65 Z"
          fill="#FFAEC9"
          stroke="#F898B6"
          strokeWidth="3"
          animate={variant === "loading" ? { rotate: [0, 10, 0] } : { rotate: [0, -5, 3, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: "140px", originY: "45px" }}
        />

        {/* BADAN UTAMA */}
        <circle cx="100" cy="115" r="65" fill="#FFC2D6" stroke="#F898B6" strokeWidth="4" />

        {/* PIPI MERAH SEGAR */}
        <circle cx="55" cy="120" r="10" fill="#FF85A1" opacity="0.65" />
        <circle cx="145" cy="120" r="10" fill="#FF85A1" opacity="0.65" />

        {/* MATA */}
        {variant === "thankyou" ? (
          // Mata Senang ^ ^
          <>
            <path
              d="M 50 102 Q 60 92 70 102"
              stroke="#5C4033"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <path
              d="M 130 102 Q 140 92 150 102"
              stroke="#5C4033"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
          </>
        ) : (
          // Mata Bulat dengan Kedip
          <>
            {/* Kiri */}
            <motion.g
              variants={blinkVariants}
              animate={blinkState}
              style={{ originX: "60px", originY: "100px" }}
            >
              <circle cx="60" cy="100" r="8" fill="#5C4033" />
              <circle cx="58" cy="97" r="2.5" fill="white" />
            </motion.g>
            {/* Kanan */}
            <motion.g
              variants={blinkVariants}
              animate={blinkState}
              style={{ originX: "140px", originY: "100px" }}
            >
              <circle cx="140" cy="100" r="8" fill="#5C4033" />
              <circle cx="138" cy="97" r="2.5" fill="white" />
            </motion.g>
          </>
        )}

        {/* MONCONG / HIDUNG PIGGY */}
        <g>
          <rect
            x="76"
            y="110"
            width="48"
            height="32"
            rx="16"
            fill="#FFAEC9"
            stroke="#F898B6"
            strokeWidth="3.5"
          />
          {/* Lubang Hidung */}
          <circle cx="90" cy="126" r="4.5" fill="#D75C7E" />
          <circle cx="110" cy="126" r="4.5" fill="#D75C7E" />
        </g>

        {/* MULUT SENYUM */}
        <path
          d="M 92 146 Q 100 154 108 146"
          stroke="#5C4033"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* AKSESORIS - CELEMEK / SCARF */}
        <path
          d="M 62 163 C 70 178, 130 178, 138 163"
          stroke="#FF4F79"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
        {/* Simpul Scarf */}
        <circle cx="100" cy="172" r="7" fill="#FF1A53" />

        {/* ELEMEN INTERAKTIF BERDASARKAN VARIAN */}
        {variant === "welcome" && (
          // Tangan Melambai
          <motion.g
            animate={{ rotate: [0, -20, 0, -20, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ originX: "155px", originY: "135px" }}
          >
            {/* Tangan Kanan */}
            <circle cx="160" cy="135" r="14" fill="#FFC2D6" stroke="#F898B6" strokeWidth="3" />
            {/* Lambaian Kilauan Kecil */}
            <path d="M 175 120 L 180 115" stroke="#FFAEC9" strokeWidth="2" strokeLinecap="round" />
            <path d="M 183 128 L 190 128" stroke="#FFAEC9" strokeWidth="2" strokeLinecap="round" />
          </motion.g>
        )}

        {variant === "menu" && (
          // Memegang Papan Menu
          <g>
            {/* Tangan Kiri dan Kanan memeluk papan */}
            <circle cx="45" cy="140" r="12" fill="#FFC2D6" stroke="#F898B6" strokeWidth="3" />
            <circle cx="155" cy="140" r="12" fill="#FFC2D6" stroke="#F898B6" strokeWidth="3" />
            {/* Papan Menu Kayu Hangat */}
            <rect
              x="50"
              y="142"
              width="100"
              height="35"
              rx="6"
              fill="#DDB892"
              stroke="#7F5539"
              strokeWidth="3.5"
            />
            {/* Garis-garis Menu */}
            <line x1="60" y1="152" x2="140" y2="152" stroke="#7F5539" strokeWidth="2.5" />
            <line x1="60" y1="160" x2="115" y2="160" stroke="#7F5539" strokeWidth="2.5" />
            <line x1="60" y1="168" x2="130" y2="168" stroke="#7F5539" strokeWidth="2.5" />
          </g>
        )}

        {variant === "recommendation" && (
          // Menunjuk Bintang Rekomendasi
          <g>
            {/* Tangan Kanan menunjuk ke atas */}
            <motion.g
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <circle cx="160" cy="120" r="12" fill="#FFC2D6" stroke="#F898B6" strokeWidth="3" />
              {/* Bintang Emas Berkilau */}
              <path
                d="M 175 90 L 178 96 L 184 97 L 179 101 L 181 107 L 175 104 L 169 107 L 171 101 L 166 97 L 172 96 Z"
                fill="#FFD700"
                stroke="#FF8C00"
                strokeWidth="1.5"
              />
            </motion.g>
          </g>
        )}

        {variant === "thankyou" && (
          // Tanda Hati Cinta (Love)
          <motion.g
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ originX: "100px", originY: "35px" }}
          >
            <path
              d="M 100 35 C 95 20, 80 20, 80 35 C 80 50, 100 65, 100 65 C 100 65, 120 50, 120 35 C 120 20, 105 20, 100 35 Z"
              fill="#FF4B72"
            />
          </motion.g>
        )}

        {variant === "loading" && (
          // Putaran kecil di belakang kepala
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{ originX: "100px", originY: "115px" }}
          >
            <circle
              cx="100"
              cy="115"
              r="76"
              stroke="#FF85A1"
              strokeWidth="2"
              strokeDasharray="10 15"
              opacity="0.5"
            />
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
};

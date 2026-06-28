"use client";

import React, { useRef, useCallback } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export type MascotVariant = "welcome" | "menu" | "recommendation" | "thankyou" | "loading";

interface MascotProps {
  variant?: MascotVariant;
  className?: string;
  size?: number;
  useImage?: boolean;
  imageSrc?: string;
}

export const SemayotMascot: React.FC<MascotProps> = ({
  variant = "welcome",
  className = "",
  size = 200,
  useImage = false,
  imageSrc = "/semayot/images/sema2.png",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Eye-tracking motion values
  const rawEyeX = useMotionValue(0);
  const rawEyeY = useMotionValue(0);
  const eyeX = useSpring(rawEyeX, { stiffness: 150, damping: 20 });
  const eyeY = useSpring(rawEyeY, { stiffness: 150, damping: 20 });

  // Ear wiggle intensity based on proximity
  const earWiggle = useMotionValue(0);
  const earSpring = useSpring(earWiggle, { stiffness: 100, damping: 15 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxMove = 6;
      const angle = Math.atan2(dy, dx);
      const clampedDist = Math.min(distance, 200);
      const ratio = clampedDist / 200;

      rawEyeX.set(Math.cos(angle) * maxMove * ratio);
      rawEyeY.set(Math.sin(angle) * maxMove * ratio);

      // Ear wiggle proportional to proximity (closer = more wiggle)
      const proximity = Math.max(0, 1 - distance / 300);
      earWiggle.set(proximity * 12);
    },
    [rawEyeX, rawEyeY, earWiggle]
  );

  const handleMouseLeave = useCallback(() => {
    rawEyeX.set(0);
    rawEyeY.set(0);
    earWiggle.set(0);
  }, [rawEyeX, rawEyeY, earWiggle]);

  // Blink animation
  const blinkVariants = {
    open: { scaleY: 1 },
    blink: {
      scaleY: 0.1,
      transition: { duration: 0.15 },
    },
  };

  const [blinkState, setBlinkState] = React.useState("open");
  const isReduced = useReducedMotion();

  React.useEffect(() => {
    if (isReduced) return;
    const interval = setInterval(() => {
      setBlinkState("blink");
      setTimeout(() => setBlinkState("open"), 150);
    }, 3500 + Math.random() * 1500);
    return () => clearInterval(interval);
  }, [isReduced]);

  // Float animation
  const floatTransition = {
    y: {
      duration: 3.5,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut" as const,
    },
  };

  // If using actual image, render image with animation
  if (useImage) {
    return (
      <motion.div
        ref={containerRef}
        className={`relative select-none flex items-center justify-center ${className}`}
        animate={isReduced ? {} : { y: [0, -14, 0] }}
        transition={isReduced ? {} : floatTransition}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ width: size, height: size }}
      >
        <div className="relative w-full h-full drop-shadow-[0_12px_32px_rgba(255,194,214,0.4)]">
          <Image
            src={imageSrc}
            alt="Maskot Semayot - Babi Lucu"
            fill
            className="object-contain"
            sizes={`${size}px`}
          />
        </div>
      </motion.div>
    );
  }

  // SVG Mascot with full animation
  return (
    <motion.div
      ref={containerRef}
      className={`relative select-none flex items-center justify-center ${className}`}
      animate={isReduced ? {} : { y: [0, -14, 0] }}
      transition={isReduced ? {} : floatTransition}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_12px_32px_rgba(251,146,198,0.25)]"
        role="img"
        aria-label="Maskot Semayot"
      >
        <title>Maskot Semayot - Babi Lucu</title>
        {/* Shadow under mascot */}
        <ellipse cx="100" cy="188" rx="50" ry="7" fill="#EDE5D8" opacity="0.7" />

        {/* Left Ear — animated wiggle */}
        <motion.path
          d="M 50 65 C 25 35, 45 15, 65 35 C 75 45, 60 55, 50 65 Z"
          fill="#FFAEC9"
          stroke="#F898B6"
          strokeWidth="3"
          animate={isReduced ? {} : (variant === "loading" ? { rotate: [0, -10, 0] } : { rotate: [0, 5, -3, 0] })}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            originX: "60px",
            originY: "45px",
            rotate: earSpring,
          }}
        />
        {/* Right Ear */}
        <motion.path
          d="M 150 65 C 175 35, 155 15, 135 35 C 125 45, 140 55, 150 65 Z"
          fill="#FFAEC9"
          stroke="#F898B6"
          strokeWidth="3"
          animate={isReduced ? {} : (variant === "loading" ? { rotate: [0, 10, 0] } : { rotate: [0, -5, 3, 0] })}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: "140px", originY: "45px" }}
        />

        {/* Main body */}
        <circle cx="100" cy="115" r="65" fill="#FFC2D6" stroke="#F898B6" strokeWidth="4" />

        {/* Rosy cheeks */}
        <circle cx="55" cy="120" r="11" fill="#FF85A1" opacity="0.55" />
        <circle cx="145" cy="120" r="11" fill="#FF85A1" opacity="0.55" />

        {/* Eyes with tracking */}
        {variant === "thankyou" ? (
          <>
            <path d="M 50 102 Q 60 92 70 102" stroke="#1C1917" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 130 102 Q 140 92 150 102" stroke="#1C1917" strokeWidth="4.5" strokeLinecap="round" />
          </>
        ) : (
          <>
            {/* Left eye */}
            <motion.g
              variants={blinkVariants}
              animate={blinkState}
              style={{ originX: "60px", originY: "100px" }}
            >
              <circle cx="60" cy="100" r="9" fill="#1C1917" />
              {/* Pupil — tracks mouse */}
              <motion.circle
                cx="60"
                cy="100"
                r="9"
                fill="#1C1917"
                style={{ x: eyeX, y: eyeY }}
              />
              {/* Highlight */}
              <motion.circle
                cx="57"
                cy="97"
                r="3"
                fill="white"
                style={{ x: eyeX, y: eyeY }}
              />
            </motion.g>
            {/* Right eye */}
            <motion.g
              variants={blinkVariants}
              animate={blinkState}
              style={{ originX: "140px", originY: "100px" }}
            >
              <circle cx="140" cy="100" r="9" fill="#1C1917" />
              <motion.circle
                cx="140"
                cy="100"
                r="9"
                fill="#1C1917"
                style={{ x: eyeX, y: eyeY }}
              />
              <motion.circle
                cx="137"
                cy="97"
                r="3"
                fill="white"
                style={{ x: eyeX, y: eyeY }}
              />
            </motion.g>
          </>
        )}

        {/* Snout */}
        <g>
          <rect x="76" y="110" width="48" height="32" rx="16" fill="#FFAEC9" stroke="#F898B6" strokeWidth="3.5" />
          <circle cx="90" cy="126" r="4.5" fill="#D75C7E" />
          <circle cx="110" cy="126" r="4.5" fill="#D75C7E" />
        </g>

        {/* Smile */}
        <path d="M 92 146 Q 100 155 108 146" stroke="#1C1917" strokeWidth="3" strokeLinecap="round" />

        {/* Scarf / Apron */}
        <path
          d="M 62 163 C 70 178, 130 178, 138 163"
          stroke="#FF4F79"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="100" cy="172" r="7" fill="#FF1A53" />

        {/* Variant-specific elements */}
        {variant === "welcome" && (
          <motion.g
            animate={isReduced ? {} : { rotate: [0, -20, 0, -20, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ originX: "155px", originY: "135px" }}
          >
            <circle cx="160" cy="135" r="14" fill="#FFC2D6" stroke="#F898B6" strokeWidth="3" />
            <path d="M 175 120 L 180 115" stroke="#FFAEC9" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 183 128 L 190 128" stroke="#FFAEC9" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 178 134 L 185 138" stroke="#FFAEC9" strokeWidth="2.5" strokeLinecap="round" />
          </motion.g>
        )}

        {variant === "menu" && (
          <g>
            <circle cx="45" cy="140" r="12" fill="#FFC2D6" stroke="#F898B6" strokeWidth="3" />
            <circle cx="155" cy="140" r="12" fill="#FFC2D6" stroke="#F898B6" strokeWidth="3" />
            <rect x="50" y="142" width="100" height="35" rx="6" fill="#DDB892" stroke="#7F5539" strokeWidth="3.5" />
            <line x1="60" y1="152" x2="140" y2="152" stroke="#7F5539" strokeWidth="2.5" />
            <line x1="60" y1="160" x2="115" y2="160" stroke="#7F5539" strokeWidth="2.5" />
            <line x1="60" y1="168" x2="130" y2="168" stroke="#7F5539" strokeWidth="2.5" />
          </g>
        )}

        {variant === "recommendation" && (
          <g>
            <motion.g
              animate={isReduced ? {} : { y: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <circle cx="160" cy="120" r="12" fill="#FFC2D6" stroke="#F898B6" strokeWidth="3" />
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
          <motion.g
            initial={isReduced ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0.5 }}
            animate={isReduced ? {} : { scale: [0.8, 1.15, 0.8], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ originX: "100px", originY: "35px" }}
          >
            <path
              d="M 100 35 C 95 20, 80 20, 80 35 C 80 50, 100 65, 100 65 C 100 65, 120 50, 120 35 C 120 20, 105 20, 100 35 Z"
              fill="#FF4B72"
            />
          </motion.g>
        )}

        {variant === "loading" && (
          <motion.g
            animate={isReduced ? {} : { rotate: 360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            style={{ originX: "100px", originY: "115px" }}
          >
            <circle
              cx="100"
              cy="115"
              r="76"
              stroke="#FF85A1"
              strokeWidth="2.5"
              strokeDasharray="12 18"
              opacity="0.5"
            />
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
};

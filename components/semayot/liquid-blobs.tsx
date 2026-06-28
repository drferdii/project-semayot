"use client";

import React from "react";

type BlobVariant = "hero" | "menu" | "service" | "recommendation" | "location";

interface LiquidBlobsProps {
  variant?: BlobVariant;
  className?: string;
}

const variantColors: Record<BlobVariant, string[]> = {
  hero: ["rgba(255,194,214,0.18)", "rgba(217,119,6,0.10)", "rgba(255,79,121,0.08)"],
  menu: ["rgba(217,119,6,0.12)", "rgba(255,194,214,0.14)", "rgba(21,128,61,0.06)"],
  service: ["rgba(21,128,61,0.10)", "rgba(255,194,214,0.12)", "rgba(217,119,6,0.08)"],
  recommendation: ["rgba(217,119,6,0.15)", "rgba(255,79,121,0.10)", "rgba(255,194,214,0.12)"],
  location: ["rgba(21,128,61,0.12)", "rgba(217,119,6,0.10)", "rgba(255,194,214,0.08)"],
};

export const LiquidBlobs: React.FC<LiquidBlobsProps> = ({
  variant = "hero",
  className = "",
}) => {
  const colors = variantColors[variant];

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Blob 1 — large, slow drift */}
      <div
        className="absolute w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] opacity-100 blur-[60px]"
        style={{
          background: colors[0],
          top: "10%",
          left: "-10%",
          animation: "blob-morph-1 22s ease-in-out infinite",
          willChange: "border-radius, transform",
        }}
      />

      {/* Blob 2 — medium, counter-drift */}
      <div
        className="absolute w-[40vw] h-[40vw] max-w-[480px] max-h-[480px] opacity-100 blur-[50px]"
        style={{
          background: colors[1],
          top: "40%",
          right: "-8%",
          animation: "blob-morph-2 26s ease-in-out infinite",
          willChange: "border-radius, transform",
        }}
      />

      {/* Blob 3 — small accent, faster */}
      <div
        className="absolute w-[30vw] h-[30vw] max-w-[360px] max-h-[360px] opacity-100 blur-[40px]"
        style={{
          background: colors[2],
          bottom: "5%",
          left: "20%",
          animation: "blob-morph-3 18s ease-in-out infinite",
          willChange: "border-radius, transform",
        }}
      />
    </div>
  );
};

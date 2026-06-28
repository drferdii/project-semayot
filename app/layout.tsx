import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Rumah Makan Semayot | Cita Rasa Khas Dayak Bengkayang",
  description:
    "Nikmati kehangatan hidangan tradisional Dayak dan olahan daging asap otentik di Rumah Makan Semayot, Bumi Amas, Bengkayang, Kalimantan Barat. Rating 4.9/5 Google Maps.",
};

import { ChatWidget } from "@/components/semayot/chat-widget";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}

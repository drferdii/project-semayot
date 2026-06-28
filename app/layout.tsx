import type { Metadata } from "next";
import { Outfit, Fraunces } from "next/font/google";
import { ChatWidget } from "@/components/semayot/chat-widget";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Rumah Makan Semayot | Cita Rasa Khas Dayak Bengkayang",
  description:
    "Nikmati kehangatan hidangan tradisional Dayak dan olahan daging asap otentik di Rumah Makan Semayot, Bumi Amas, Bengkayang, Kalimantan Barat. Rating 4.9/5 Google Maps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${outfit.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}

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
  metadataBase: new URL("https://rumah-makan-semayot.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Rumah Makan Semayot | Cita Rasa Khas Dayak Bengkayang",
    description:
      "Nikmati kehangatan hidangan tradisional Dayak dan olahan daging asap otentik di Rumah Makan Semayot, Bumi Amas, Bengkayang, Kalimantan Barat.",
    url: "/",
    siteName: "Rumah Makan Semayot",
    images: [
      {
        url: "/semayot/images/logo.webp",
        width: 800,
        height: 800,
        alt: "Logo Rumah Makan Semayot",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rumah Makan Semayot | Cita Rasa Khas Dayak Bengkayang",
    description:
      "Nikmati kehangatan hidangan tradisional Dayak dan olahan daging asap otentik di Rumah Makan Semayot, Bumi Amas, Bengkayang, Kalimantan Barat.",
    images: ["/semayot/images/logo.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Rumah Makan Semayot",
  "image": "https://rumah-makan-semayot.com/semayot/images/rumah-makan.webp",
  "logo": "https://rumah-makan-semayot.com/semayot/images/logo.webp",
  "url": "https://rumah-makan-semayot.com",
  "telephone": "+6281649470780",
  "priceRange": "$$",
  "servesCuisine": "Dayak, Indonesian",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Bumi Amas, depan Kantor Camat Bengkayang",
    "addressLocality": "Bengkayang",
    "addressRegion": "Kalimantan Barat",
    "postalCode": "79211",
    "addressCountry": "ID"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 0.8312772,
    "longitude": 109.4858797
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "08:00",
      "closes": "21:00"
    }
  ],
  "sameAs": [
    "https://www.google.com/maps/place/Rumah+Makan+Semayot/@0.8312772,109.4858797,17z/data=!4m8!3m7!1s0x31e335c4a9c2c4cb:0xfc8a3aa13021ead2!8m2!3d0.8312772!4d109.4858797!9m1!1b1!16s%2Fg%2F11fqll5pxj?entry=ttu"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${outfit.variable} ${fraunces.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}

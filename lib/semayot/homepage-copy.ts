import { semayotBusinessInfo } from "./business-info";

export interface HomepageCopy {
  hero: {
    badge: string;
    headline: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    nonHalalWarning: string;
  };
  service: {
    badge: string;
    title: string;
    subtitle: string;
    pillars: Array<{
      title: string;
      description: string;
      icon: 'utensils' | 'heart' | 'sparkles' | 'message-square';
    }>;
  };
  recommendation: {
    badge: string;
    title: string;
    subtitle: string;
    mascotBubble: string;
  };
  location: {
    badge: string;
    title: string;
    directionsLabel: string;
    operationalHoursLabel: string;
    paymentNote: string;
    ctaMaps: string;
    ctaCall: string;
  };
  footer: {
    desc: string;
    copyright: string;
  };
}

export const homepageCopy: HomepageCopy = {
  hero: {
    badge: `📍 Bengkayang, Kalimantan Barat`,
    headline: "Rasa Favorit yang Bikin Pulang Lagi.",
    subheadline: `Nikmati kehangatan hidangan lokal tradisional khas Dayak dan olahan daging asap otentik di ${semayotBusinessInfo.name}. Datang lapar, pulang senang!`,
    ctaPrimary: "Buka Google Maps",
    ctaSecondary: "Hubungi Rumah Makan",
    nonHalalWarning: "Specialty pork / Non-Halal / Sajian Khas Dayak",
  },
  service: {
    badge: "Kehangatan Lokal",
    title: "Makan Enak, Dilayani dengan Senang",
    subtitle: "Kami percaya bahwa masakan yang dimasak sepenuh hati terasa jauh lebih nikmat saat disajikan dengan kehangatan senyuman keluarga.",
    pillars: [
      {
        title: "Cita Rasa Otentik",
        description: "Bumbu rempah pedas pas dan olahan tradisional Dayak yang dirindukan pelanggan.",
        icon: "utensils"
      },
      {
        title: "Pelayanan Ramah & Cepat",
        description: "Makan lezat tak perlu menunggu lama. Kami siap melayani Chief sekeluarga dengan senyuman terbaik.",
        icon: "heart"
      },
      {
        title: "Suasana Nyaman",
        description: "Rumah makan yang bersih dan nyaman di kawasan Bumi Amas, tempat pas untuk santap santai.",
        icon: "sparkles"
      },
      {
        title: "Akses Lokasi Mudah",
        description: "Terletak strategis di tepi jalan raya utama Bengkayang, sangat mudah dijangkau oleh kendaraan.",
        icon: "message-square"
      }
    ]
  },
  recommendation: {
    badge: "Pilihan Maskot",
    title: "Rekomendasi Khas Hari Ini",
    subtitle: "Setiap hari kami menghadirkan hidangan tradisional Dayak dan sajian asap beraroma wangi kayu bakar. Tanya menu spesial hari ini langsung kepada kami!",
    mascotBubble: "Menu asap ini harum sekali aromanya, wajib dicoba, Chief! 🐷🔥"
  },
  location: {
    badge: "Lokasi Kami",
    title: "Santap Langsung di Bengkayang",
    directionsLabel: "Panduan Lokasi (Landmark):",
    operationalHoursLabel: "Jam Operasional & Metode Bayar:",
    paymentNote: "Metode Pembayaran: Hanya Tunai (Cash Only)",
    ctaMaps: "Navigasi Google Maps",
    ctaCall: "Hubungi via Telepon"
  },
  footer: {
    desc: `Rumah makan lokal di Bumi Amas, Bengkayang, menyajikan masakan tradisional Dayak dan menu babi/daging asap khas dengan suasana hangat keluarga.`,
    copyright: `© ${new Date().getFullYear()} Rumah Makan Semayot. Hak Cipta Dilindungi.`
  }
};

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  badge?: string;
  image?: string;
  available: boolean;
}

export interface ServicePillar {
  title: string;
  description: string;
  icon: 'utensils' | 'heart' | 'sparkles' | 'message-square';
}

export interface LocationInfo {
  address: string;
  openingHours: string;
  landmark: string;
  googleMapsUrl: string;
  whatsAppNumber: string;
  whatsAppUrl: string;
}

export interface HomepageCopy {
  brandName: string;
  tagline: string;
  headline: string;
  subheadline: string;
  specialtyLabel: string;
  whatsappCtaText: string;
  menuCtaText: string;
  mapsCtaText: string;
  recommendationTitle: string;
  recommendationSubtitle: string;
}

export const homepageCopy: HomepageCopy = {
  brandName: "Rumah Makan Semayot",
  tagline: "Rasa Hangat, Pelayanan Bahagia",
  headline: "Rasa Favorit yang Bikin Pulang Lagi.",
  subheadline: "Nikmati menu khas Semayot dengan rasa hangat, pelayanan ramah, dan suasana makan yang menyenangkan.",
  specialtyLabel: "Specialty pork menu / non-halal",
  whatsappCtaText: "Order via WhatsApp",
  menuCtaText: "Lihat Menu",
  mapsCtaText: "Buka Lokasi",
  recommendationTitle: "Rekomendasi Semayot Hari Ini",
  recommendationSubtitle: "Dipilih langsung oleh maskot kami untuk memuaskan rasa laparmu hari ini!"
};

export const featuredMenu: MenuItem[] = [
  {
    id: "babi-panggang-semayot",
    name: "Babi Panggang Semayot",
    description: "Daging babi pilihan dipanggang dengan kulit super krispi dan bumbu rempah tradisional khas Semayot.",
    price: "Rp 65.000",
    badge: "Favorit",
    available: true,
  },
  {
    id: "babi-rica-semayot",
    name: "Babi Rica Manado",
    description: "Daging babi empuk dengan bumbu rica pedas melimpah, daun jeruk segar, dan aroma wangi menggugah selera.",
    price: "Rp 58.000",
    badge: "Terlaris",
    available: true,
  },
  {
    id: "sate-babi-manis",
    name: "Sate Babi Manis Semayot",
    description: "Sate babi panggang kecap dengan marinade rempah meresap sampai ke dalam, disajikan dengan sambal spesial.",
    price: "Rp 45.000",
    badge: "Rekomendasi",
    available: true,
  },
  {
    id: "samcan-goreng-garing",
    name: "Samcan Goreng Garing",
    description: "Samcan babi goreng potongan pas dengan taburan bawang putih garing dan sambal matah segar.",
    price: "Rp 60.000",
    badge: "Menu Baru",
    available: true,
  }
];

export const servicePillars: ServicePillar[] = [
  {
    title: "Rasa Khas yang Dirindukan",
    description: "Setiap hidangan dimasak dengan resep turun-temurun dan rempah lokal berkualitas tinggi.",
    icon: "utensils"
  },
  {
    title: "Pelayanan Ramah & Bahagia",
    description: "Bagi kami, makanan lezat terasa lebih lengkap jika disajikan dengan senyum hangat dan pelayanan terbaik.",
    icon: "heart"
  },
  {
    title: "Tempat Bersih & Nyaman",
    description: "Menjaga kebersihan dan higienitas area makan demi kenyamanan dan keamanan santap Anda sekeluarga.",
    icon: "sparkles"
  },
  {
    title: "Order Mudah",
    description: "Pemesanan praktis lewat WhatsApp atau nikmati layanan dine-in langsung di lokasi strategis kami.",
    icon: "message-square"
  }
];

export const locationInfo: LocationInfo = {
  address: "Jl. Boulevard Raya Blok RM No. 27, Kelapa Gading, Jakarta Utara",
  openingHours: "Setiap Hari (Senin - Minggu): 10:00 - 22:00 WIB",
  landmark: "Sebelah Kiri Apotek Sentra Sehat, seberang Bank Central",
  googleMapsUrl: "https://maps.google.com/?q=Rumah+Makan+Semayot",
  whatsAppNumber: "+628123456789",
  whatsAppUrl: "https://wa.me/628123456789?text=Halo%20Rumah%20Makan%20Semayot%2C%20saya%20ingin%20memesan%20menu..."
};

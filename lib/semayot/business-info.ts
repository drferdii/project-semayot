export interface SemayotBusinessInfo {
  name: string;
  category: string;
  address: string;
  area: string;
  province: string;
  landmark: string;
  phone: string;
  whatsapp: string | null;
  googleMapsUrl: string;
  openingHoursStatus: string;
  closingTime: string;
  weeklyOpeningHours: string | null;
  rating: number;
  reviewCount: number;
  ratingDistribution: {
    fiveStar: number;
    fourStar: number;
    threeStar: number;
    twoStar: number;
    oneStar: number;
  };
  services: {
    dineIn: boolean;
    takeaway: boolean;
    payment: string;
  };
  reviewHighlights: string[];
  menuSignals: string[];
  popularTimes: string;
  verificationNotes: string[];
  missingInfo: string[];
}

export const semayotBusinessInfo: SemayotBusinessInfo = {
  name: "Rumah Makan Semayot",
  category: "Restaurant (Masakan Khas Dayak & Menu Lokal)",
  address: "Bumi Amas, Bengkayang, Kabupaten Bengkayang, Kalimantan Barat",
  area: "Bengkayang",
  province: "Kalimantan Barat",
  landmark: "Depan Kantor Camat Bengkayang",
  phone: "0816-4947-0780",
  whatsapp: null, // Tidak tercantum resmi di Google Maps listing
  googleMapsUrl: "https://www.google.com/maps/place/Rumah+Makan+Semayot/@0.8312772,109.4858797,17z/data=!4m7!3m6!1s0x31e335c4a9c2c4cb:0xfc8a3aa13021ead2!8m2!3d0.8312772!4d109.4858797!10e1!16s%2Fg%2F11fqll5pxj?entry=ttu",
  openingHoursStatus: "Open (Buka)",
  closingTime: "9:00 PM (21.00 WIB)",
  weeklyOpeningHours: null, // Tidak terbuka lengkap di Google Maps listing
  rating: 4.9,
  reviewCount: 9,
  ratingDistribution: {
    fiveStar: 8,
    fourStar: 1,
    threeStar: 0,
    twoStar: 0,
    oneStar: 0
  },
  services: {
    dineIn: true,
    takeaway: true,
    payment: "Cash Only (Hanya Tunai)"
  },
  reviewHighlights: [
    "Selain hidangan tradisional Dayak, kami juga menawarkan daging asap khas...",
    "Rasa pedasnya pas sekali di lidah",
    "Makanannya enak, tempatnya nyaman, pelayanannya cepat"
  ],
  menuSignals: [
    "Masakan tradisional Dayak",
    "Menu olahan daging khas/asap (smoked meat)"
  ],
  popularTimes: "Paling ramai sekitar sore hingga malam hari, terutama pukul 19.00 WIB",
  verificationNotes: [
    "Alamat, nomor telepon, rating (4.9/5 dari 9 ulasan), dan jam tutup 21.00 WIB bersumber langsung dari Google Maps Profile resmi Semayot.",
    "Landmark 'Depan Kantor Camat Bengkayang' merupakan petunjuk publik (seed info) yang diverifikasi di area lokal Bengkayang.",
    "WhatsApp resmi tidak tercantum di Google Maps; tombol kontak akan diarahkan menggunakan nomor telepon seluler 0816-4947-0780."
  ],
  missingInfo: [
    "WhatsApp resmi (menggunakan fallback nomor telepon Maps 0816-4947-0780 untuk chat WA manual)",
    "Daftar menu makanan resmi beserta harga lengkap (tidak tersedia di Maps, menggunakan menu representatif Dayak khas dengan lencana konfirmasi)",
    "Jadwal jam buka detail harian secara lengkap (hanya diketahui jam tutup pukul 21.00 WIB)"
  ],
};

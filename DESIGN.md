# Design System: The Artisan Tavern (2026 Restaurant Blueprint)
**Target Project:** Premium Restaurant Website (Rumah Makan Berkarakter)
**Design Code:** `rustic-human-mascot-2026`

---

## 1. Visual Theme & Atmosphere
Estetika yang menonjolkan **sentuhan manusia (human art style)** untuk melawan kebosanan stok foto AI yang generik. Karakter visualnya terasa organik, hangat, dan otentik — seperti sketsa tangan pada kertas bertekstur kasar. 

Atmosfernya menggabungkan nuansa kedai artisan klasik (warm lighting, brick and wood) dengan interaksi digital modern yang halus. Desain ini menghindari struktur kaku boks kartu simetris, dan lebih memilih garis pembatas organik (sketsa tinta kasar) dan tata letak asimetris.

---

## 2. Mascot Integration (The Pig Mascot Direction)
Maskot babi kustom yang digambar tangan (*hand-drawn pig mascot*) diintegrasikan sebagai jangkar visual dan identitas merek di seluruh halaman:
*   **The Nav Welcomer:** Ilustrasi garis babi kecil yang mengintip dari pojok logo saat menu diklik/di-hover.
*   **The Scroll Companion:** Animasi babi kecil berlari santai/berjalan di atas garis pembatas bagian (*section divider*) seiring pengguna melakukan scroll halaman.
*   **The Menu Stamp:** Cap bergambar babi dengan gaya cetak lilin/tinta stempel klasik pada ubin menu rekomendasi chef.
*   **The Loading Shimmer:** Ilustrasi outline babi yang digambar secara bertahap (*SVG stroke animation*) saat halaman sedang dimuat.

---

## 3. Color Palette & Roles (Warm Culinary Craft)
Palet warna menggunakan nada-nada hangat yang membangkitkan selera makan, terinspirasi dari bahan alami dan dapur kayu tradisional:

*   **Warm Paper Canvas** (#FAF6F0) - Latar belakang utama. Tekstur kertas hangat, menghindari putih klinis.
*   **Coal & Iron** (#1C1917) - Warna teks utama, judul, dan garis luar maskot (Stone-900).
*   **Roasted Amber** (#D97706) - Warna aksen utama untuk CTA, tombol, cap maskot, dan penanda harga.
*   **Sage Garden** (#15803D) - Warna sekunder alami untuk menonjolkan bahan-bahan organik, jam operasional, atau status buka.
*   **Ink Sketched Border** (rgba(28, 25, 23, 0.12)) - Garis pembatas 1px setebal goresan pensil halus.

---

## 4. Typography Rules (Editorial Storytelling)
*   **Display/Headlines:** `Fraunces` atau `Gambarino` (Editorial Serif). Digunakan untuk nama hidangan utama, cerita restoran, dan kutipan filosofi. Menonjolkan lekukan artistik yang hangat (`tracking-tight leading-tight`).
*   **Body Text:** `Satoshi` atau `Outfit` (Clean Sans-Serif). Ukuran `text-base` (16px), spasi baris `leading-relaxed` (1.7) untuk kenyamanan membaca kisah menu. Max width `60ch`.
*   **Menu Pricing/Numbers:** `Geist Mono` atau `JetBrains Mono`. Angka harga wajib berukuran seragam agar mudah dipindai mata secara vertikal.

---

## 5. Storytelling Layouts (Food, Service, Location)
Hindari menampilkan menu makanan seperti katalog e-commerce biasa. Gunakan pendekatan narasi bergulir (*scrolltelling*):

*   **The Dish Origin (Food Story):** Layar terbagi dua (*asymmetric split-screen*). Bagian kiri menampilkan sketsa tangan bahan baku utama hidangan, bagian kanan menceritakan resep warisan keluarga yang diwariskan tiga generasi.
*   **The Fire & Craft (Service Story):** Ilustrasi animasi yang menunjukkan proses memanggang lambat (*slow roasting*) di dapur terbuka.
*   **The Stone & Oak (Location Story):** Peta ilustrasi tangan yang interaktif yang menunjukkan lokasi restoran, lengkap dengan ikon maskot babi kecil yang menandai tempat parkir dan pintu masuk tersembunyi yang ditumbuhi tanaman ivy.

---

## 6. Mobile Polish (Touch-Optimized Experience)
Pengalaman seluler dirancang secara mendalam, bukan sekadar penyesuaian responsive standar:

*   **Floating Navigation Dock:** Menu navigasi utama di mobile diletakkan di bagian bawah layar berupa dock mengapung berbentuk kapsul melengkung (`rounded-full`), memberikan kemudahan jangkauan ibu jari (thumb-zone optimized).
*   **Swipeable Menu Sheets:** Di perangkat seluler, kategori menu makanan (Starter, Main, Dessert) dapat digeser secara horizontal menggunakan gestur *swipe* intuitif dengan indikator visual stempel kaki babi kecil.
*   **Zero Horizontal Overflow:** Pembatasan ketat pada semua elemen dengan `w-full overflow-hidden`. Sketsa/ilustrasi yang menjorok keluar layar dipotong rapi menggunakan kliping CSS.
*   **Direct Interaction Feedback:** Tombol pesan meja (*reserve table*) memberikan getaran mikro visual (`scale-95 translate-y-[1px]`) dengan spring physics saat disentuh.

---

## 7. Code & Assets Implementation Reference
Contoh implementasi elemen visual bertema maskot dan cerita di Tailwind & React:

```jsx
// Komponen Kartu Hidangan Rekomendasi dengan Maskot Cap Babi
export function ChefRecommendationCard({ dishName, description, price, imageUrl }) {
  return (
    <div className="relative border border-stone-200 bg-[#FAF6F0] p-6 rounded-2xl shadow-[4px_4px_0px_#1c1917] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#1c1917]">
      {/* Pig Mascot Stamp / Badge */}
      <div className="absolute -top-3 -right-3 w-12 h-12 bg-[#D97706] rounded-full flex items-center justify-center border-2 border-[#1C1917] rotate-12 shadow-sm">
        {/* SVG Cap Maskot Babi */}
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-[#FAF6F0] stroke-[1.5]">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
          {/* Ilustrasi kepala babi minimalis */}
          <circle cx="12" cy="12" r="6" stroke="#FAF6F0" />
          <ellipse cx="12" cy="13" rx="2" ry="1.2" stroke="#FAF6F0" />
          <circle cx="10" cy="10" r="0.8" fill="#FAF6F0" />
          <circle cx="14" cy="10" r="0.8" fill="#FAF6F0" />
        </svg>
      </div>

      <div className="space-y-4">
        <h3 className="font-serif text-2xl text-[#1C1917] font-bold leading-tight">{dishName}</h3>
        <p className="font-sans text-sm text-stone-600 leading-relaxed">{description}</p>
        <div className="flex justify-between items-center pt-2">
          <span className="font-mono text-lg font-bold text-[#D97706]">{price}</span>
          <button className="border border-[#1C1917] bg-[#1C1917] text-[#FAF6F0] px-4 py-2 text-xs uppercase tracking-wider rounded-lg hover:bg-transparent hover:text-[#1C1917] transition-colors">
            Pesan Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
```

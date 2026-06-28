# SEMAYOT BRAND MASCOT + HOMEPAGE PRD v1

## 1. Product Scope

Project ini membangun tahap awal public-facing brand experience untuk Rumah Makan Semayot.

Fokus utama:

1. Brand mascot babi lucu, bersih, gemes, dan ramah.
2. Homepage publik dengan animasi/motion ringan.
3. Visual identity awal yang bisa berkembang ke menu page, admin system, packaging, dan social media.
4. Struktur frontend yang siap dikembangkan menjadi full website + admin system.

Tahap ini belum membangun full POS/admin accounting system. Tahap ini adalah fondasi visual dan homepage direction.

## 2. Product Vision

Semayot harus terasa seperti rumah makan lokal yang modern, ceria, bersih, dan mudah diingat.

Website bukan hanya informasi menu. Website harus menjadi pengalaman visual yang membuat pengunjung merasa:

* Disambut
* Lapar
* Senang
* Percaya
* Mudah order
* Ingat maskot Semayot

## 3. Core Brand Idea

Semayot adalah rumah makan dengan specialty menu babi/non-halal yang membawa rasa favorit lokal dengan pelayanan hangat dan bahagia.

Brand theme:

“Happy service, tasty food, friendly pork mascot.”

## 4. Visual Direction

### Desired Impression

Homepage harus terasa:

* Cheerful
* Clean
* Warm
* Appetizing
* Friendly
* Slightly playful
* Local but polished
* Modern but not corporate

### Avoid

Homepage tidak boleh terasa:

* Murahan
* Terlalu ramai
* Terlalu childish
* Terlalu gelap
* Terlalu corporate
* Terlalu seperti template restoran generik
* Terlalu berat animasinya
* Maskot lebih dominan daripada makanan

## 5. Mascot PRD

### Mascot Character

Maskot utama adalah babi lucu yang bersih, ramah, gemes, dan punya ekspresi pelayanan.

Personality maskot:

* Friendly host
* Happy helper
* Food recommender
* Service ambassador
* Local favorite companion

### Mascot Visual Traits

Maskot harus memiliki:

* Rounded shape
* Soft pink tone
* Clean surface
* Big friendly eyes
* Warm smile
* Slight blush
* Short body proportion
* Cute but not babyish
* Simple vector style
* Easy to animate

### Mascot Costume

Recommended:

* Small apron
* Optional tiny chef hat
* Optional red/coral scarf
* Optional tray/menu board

Avoid:

* Dirty/kitchen-mess look
* Butcher-like appearance
* Aggressive expression
* Overly detailed fur/texture
* Too many accessories
* Dark horror/cartoon style
* Slapstick exaggeration

### Required Mascot Poses for MVP

Create or prepare placeholder support for these states:

1. Welcome pose
   Mascot waves at homepage hero.

2. Menu pose
   Mascot holds or points to menu.

3. Recommendation pose
   Mascot highlights “menu favorit hari ini.”

4. Service pose
   Mascot carries tray/plate.

5. Thank you pose
   Mascot thanks visitor after CTA/order action.

6. Loading/empty state pose
   Small mascot icon for loading or empty state.

### Mascot Motion Requirements

Homepage MVP must support at least:

* Gentle floating motion
* Wave animation
* Eye blink
* Small bounce on CTA interaction
* Entrance animation on hero load

Motion should be implemented using CSS or Framer Motion. Avoid heavy animation libraries unless necessary.

## 6. Homepage PRD

### Homepage Objective

Within 5 seconds, user must understand:

1. This is Rumah Makan Semayot.
2. Semayot has pork/non-halal specialty menu.
3. The food looks appetizing.
4. The service feels friendly and happy.
5. User can view menu or order/contact quickly.

## 7. Homepage Sections

### Section 1 — Header

Content:

* Logo/name: Rumah Makan Semayot
* Navigation: Beranda, Menu, Lokasi, Tentang
* CTA button: Order via WhatsApp

Behavior:

* Sticky or semi-sticky on desktop
* Clean mobile menu
* CTA visible on mobile

Visual:

* Warm white/cream background
* Coral/red-orange CTA
* Minimal nav animation

### Section 2 — Hero

Purpose:

Create immediate emotional connection.

Required elements:

* Big headline
* Short subheadline
* Animated mascot
* Food hero visual or food card preview
* Primary CTA: Lihat Menu
* Secondary CTA: Order via WhatsApp / Buka Maps
* Specialty/non-halal clarity text

Suggested headline:

“Rasa Favorit yang Bikin Pulang Lagi.”

Suggested subheadline:

“Nikmati menu khas Semayot dengan rasa hangat, pelayanan ramah, dan suasana makan yang menyenangkan.”

Small clarity label:

“Specialty pork menu / non-halal.”

Motion:

* Mascot enters with soft upward fade
* Mascot waves gently
* Food cards float subtly
* CTA hover bounce very small

### Section 3 — Featured Menu

Purpose:

Show appetite first.

Required elements:

* 3–6 featured menu cards
* Food image placeholder
* Menu name
* Short description
* Price placeholder
* Badge: Favorit / Rekomendasi
* CTA: Lihat Detail / Order

Visual:

* Food photo must be dominant
* Mascot may appear as small recommender, not as main focus
* Cards should have warm shadow and rounded corners

### Section 4 — Happy Service

Purpose:

Explain emotional differentiator.

Content pillars:

1. Rasa khas yang dirindukan
2. Pelayanan ramah
3. Tempat bersih dan nyaman
4. Order mudah

Visual:

* Small illustrated icons
* Light motion on scroll
* Copy short and friendly

### Section 5 — Today Recommendation / Promo

Purpose:

Give dynamic feeling.

Content:

* “Rekomendasi Semayot Hari Ini”
* One highlighted dish
* Mascot pointing to menu
* CTA to WhatsApp

This section can later connect to admin product recommendation.

### Section 6 — Location

Purpose:

Make customer action easy.

Required:

* Address placeholder
* Google Maps button
* Opening hours placeholder
* WhatsApp button
* Landmark note placeholder

### Section 7 — Footer

Required:

* Brand name
* Short tagline
* Contact
* Location
* Social placeholder
* Non-halal clarity if appropriate

## 8. Copywriting Direction

Tone:

* Friendly
* Clear
* Warm
* Slightly playful
* Not too slang
* Not too corporate

Use short copy.

Avoid long paragraphs.

### Suggested Copy Bank

Hero headline options:

1. “Rasa Favorit yang Bikin Pulang Lagi.”
2. “Makan Enak, Dilayani dengan Senang.”
3. “Semayot, Rasa Hangat untuk Hari yang Lapar.”

CTA options:

* Lihat Menu
* Order via WhatsApp
* Buka Lokasi
* Cek Rekomendasi Hari Ini

Badge options:

* Favorit
* Rekomendasi
* Paling Dicari
* Menu Andalan

Service copy:

* “Kami percaya makanan enak terasa lebih lengkap saat disajikan dengan ramah.”
* “Datang lapar, pulang senang.”
* “Menu favorit, pelayanan hangat, dan pengalaman makan yang mudah.”

## 9. Design Tokens

### Color Tokens

Use these semantic tokens:

* `--color-background`: warm cream / ivory
* `--color-surface`: warm white
* `--color-primary`: coral red
* `--color-primary-dark`: deep warm red
* `--color-secondary`: soft orange
* `--color-mascot`: soft pig pink
* `--color-text`: dark brown / charcoal
* `--color-muted`: warm gray
* `--color-border`: soft beige

### Border Radius

* Cards: large rounded
* Buttons: pill or rounded-xl
* Mascot container: organic blob or rounded full

### Shadow

Use soft warm shadows only. Avoid harsh black shadows.

## 10. Acceptance Criteria

Homepage is accepted only if:

1. Website instantly feels cheerful and clean.
2. Mascot appears cute, clean, and friendly.
3. Food remains visually dominant.
4. CTA is visible above the fold.
5. Non-halal/pork specialty is clear enough.
6. Mobile layout works beautifully.
7. Motion is smooth but not distracting.
8. Page does not feel childish or cheap.
9. Lighthouse/performance remains acceptable.
10. Implementation is componentized and ready for menu/admin expansion.

<table>
<tr>
<td width="320" align="center" valign="top">

<img src="https://i.postimg.cc/ydmP2B67/semayot.png" alt="Rumah Makan Semayot" width="290" />

</td>
<td valign="top">

## Rumah Makan Semayot

Single-page marketing website for **Rumah Makan Semayot**, a **Dayak cuisine restaurant** in **Bumi Amas, Bengkayang, Kabupaten Bengkayang, Kalimantan Barat, Indonesia**.  
Google Maps rating: **⭐ 4.9 / 5.0** *(9 reviews)*.

Built as a **production prototype** by **Sentra Mitra Design** for colleague **dr. Alyn (2026)**.

![version](https://img.shields.io/badge/version-0.1.0-f97316)
![status](https://img.shields.io/badge/status-prototype-ef4444)
![next.js](https://img.shields.io/badge/next.js-16.2.9-111827)
![react](https://img.shields.io/badge/react-19.2.4-2563eb)
![typescript](https://img.shields.io/badge/typescript-5.x-1d4ed8)
![tailwind](https://img.shields.io/badge/tailwind-v4-06b6d4)
![pnpm](https://img.shields.io/badge/pnpm-only-eab308)
![google maps](https://img.shields.io/badge/google_maps-%E2%AD%90_4.9_%2F_5.0-22c55e)
![dietary](https://img.shields.io/badge/dietary-non--halal_%2F_pork-dc2626)

![Cuisine](https://img.shields.io/badge/cuisine-Dayak-f59e0b)
![Location](https://img.shields.io/badge/location-Bengkayang-0ea5e9)
![Service](https://img.shields.io/badge/service-Dine--in_%26_Takeaway-10b981)
![Payment](https://img.shields.io/badge/payment-Cash_Only-f59e0b)
![Closing](https://img.shields.io/badge/closing-21:00_WIB-8b5cf6)

</td>
</tr>
</table>

---

## ✨ What this is

`prototype-semayot` is a single-page marketing website for **Rumah Makan Semayot** — a warm, cheerful, food-first restaurant website built for a local **Dayak cuisine** business in **Bumi Amas, Bengkayang, Kalimantan Barat**.

The website is intentionally simple: clear location, clear food identity, clear contact path, and clear dietary notice. It presents Semayot as a local destination with strong flavor, friendly service, and a memorable visual identity.

![Rating](https://img.shields.io/badge/Rating-4.9_%2F_5.0-22c55e)
![Reviews](https://img.shields.io/badge/Reviews-9_total-0ea5e9)
![Five Stars](https://img.shields.io/badge/5--star_reviews-8-f59e0b)
![Four Stars](https://img.shields.io/badge/4--star_reviews-1-a855f7)
![Dietary](https://img.shields.io/badge/Non--Halal-Pork_Specialty-dc2626)

### Snapshot

| Area | Detail |
| --- | --- |
| Restaurant | **Rumah Makan Semayot** |
| Category | **Dayak cuisine restaurant** |
| Location | **Bumi Amas, Bengkayang, Kalimantan Barat** |
| Landmark | **Depan Kantor Camat Bengkayang** |
| Google Maps rating | **⭐ 4.9 / 5.0** |
| Reviews | **9 total** — 8× five stars, 1× four stars |
| Tagline | *"Rasa Favorit yang Bikin Pulang Lagi."* |
| Services | **Dine-in** and **takeaway** |
| Payment | **Cash only** |
| Closing time | **21:00 WIB** |
| Plus Code | **RFJP+G9** |
| Peak hours | Late afternoon to evening, especially around **19:00 WIB** |
| Dietary note | **Non-halal / pork specialty** |

> This is the **first production prototype** delivered by **Sentra Mitra Design**.

The architecture is **component-driven**, **lightweight**, and designed for expansion. The data layer, homepage copy, menu signals, and business information are typed and centralized so the codebase stays clean as it grows into a future **admin system**, **menu management platform**, and **online ordering workflow**.

---

## ⚡ Quick Start

![Node](https://img.shields.io/badge/Node.js-%E2%89%A5_20-339933?logo=node.js&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-9.x-f69220?logo=pnpm&logoColor=white)
![Next](https://img.shields.io/badge/Next.js-App_Router-black?logo=next.js&logoColor=white)

**Requirements:** Node.js ≥ 20, pnpm 9.x

```bash
git clone <repo-url>
cd prototype-semayot

pnpm install
pnpm dev        # http://localhost:3000
```

**Production build:**

```bash
pnpm build
pnpm start
```

**Lint:**

```bash
pnpm lint
```

> Use **pnpm only**. Do not install dependencies with `npm` or `yarn`.

---

## 🧱 Tech Stack

### Core Framework

| Technology | Version | Purpose |
| --- | --- | --- |
| Next.js | 16.2.9 | React framework using App Router |
| React | 19.2.4 | UI library |
| React DOM | 19.2.4 | DOM rendering |
| TypeScript | ^5 | Type safety with strict mode |

### Styling

| Technology | Version | Purpose |
| --- | --- | --- |
| Tailwind CSS | ^4 | Utility-first styling |
| @tailwindcss/postcss | ^4 | PostCSS integration |
| PostCSS | via config | CSS processing |

### Animation & Motion

| Technology | Version | Purpose |
| --- | --- | --- |
| Framer Motion | ^12.42.0 | Page transitions, scroll animations, hover effects, mascot motion |
| @lottiefiles/react-lottie-player | ^3.6.0 | WhatsApp chat Lottie animation |

### UI Components & Utilities

| Technology | Version | Purpose |
| --- | --- | --- |
| @radix-ui/react-avatar | ^1.2.0 | Avatar component for testimonials |
| @radix-ui/react-separator | ^1.1.10 | Separator component |
| lucide-react | ^0.469.0 | Icon library |
| clsx | ^2.1.1 | Conditional classnames |
| tailwind-merge | ^3.6.0 | Tailwind class deduplication |

### Dev Tools

| Technology | Version | Purpose |
| --- | --- | --- |
| ESLint | ^9 | Linting with flat config |
| eslint-config-next | 16.2.9 | Next.js lint rules |
| @types/node | ^20 | Node.js types |
| @types/react | ^19 | React types |
| @types/react-dom | ^19 | React DOM types |

### Package Manager

`pnpm` only — never `npm` or `yarn`.

Workspace configuration is handled by:

- `pnpm-workspace.yaml`
- `.npmrc`

`.npmrc` includes:

```ini
only-built-dependencies[]=sharp
only-built-dependencies[]=unrs-resolver
```

---

## 🔤 Fonts

| Font | Type | Weights | CSS Variable |
| --- | --- | --- | --- |
| Outfit | Sans-serif, Google Fonts | 400, 500, 600, 700, 800 | `--font-sans` |
| Fraunces | Serif, Google Fonts | 400, 600, 700, 800 | `--font-display` |
| Inter | Sans-serif, Google Fonts | 400, 500, 600, 700, 800 | fallback chain |
| JetBrains Mono | Monospace, Google Fonts | — | `--font-mono` |

Tailwind `@theme inline` wires these as:

```css
--font-sans: 'Outfit', 'Inter', system-ui, sans-serif;
--font-display: 'Fraunces', Georgia, serif;
--font-mono: 'JetBrains Mono', monospace;
```

---

## 🎨 Design System & Color Tokens

The visual system is warm, food-first, cheerful, and clean. It should feel friendly and local without becoming childish or visually cheap.

![Warm](https://img.shields.io/badge/tone-warm-f59e0b)
![Clean](https://img.shields.io/badge/layout-clean-0ea5e9)
![Food First](https://img.shields.io/badge/priority-food_first-ef4444)
![Friendly](https://img.shields.io/badge/personality-friendly-22c55e)

### CSS Custom Properties (`globals.css`)

```css
--background: #FCF9F2        /* Warm cream — page background */
--foreground: #1C1917        /* Dark charcoal — primary text */
--card: #FAF6F0              /* Warm white — cards, surfaces */
--card-foreground: #1C1917
--popover: #FAF6F0
--popover-foreground: #1C1917
--primary: #1C1917
--primary-foreground: #FAF6F0
--secondary: #FFF0F3         /* Soft pink — menu section bg */
--secondary-foreground: #1C1917
--muted: #F5F5F5
--muted-foreground: #737373
--accent: #FF4F79            /* Coral/pink — primary CTAs */
--accent-foreground: #FAF6F0
--destructive: #DC2626
--destructive-foreground: #FFFFFF
--border: rgba(28, 25, 23, 0.12)
--input: #F5F5F5
--ring: #1C1917
--radius: 1rem
```

### Additional Brand Colors

| Color Name | Hex | Usage |
| --- | --- | --- |
| Warm cream bg | `#FCF9F2` | Page background |
| Warm white | `#FAF6F0` | Cards, surfaces |
| Coral / Pink | `#FF4F79` | Primary accent, CTAs |
| Soft pink | `#FFC2D6` | Mascot color, decorative accents |
| Deep pink | `#FF85A1` | Mascot cheeks |
| Dark brown | `#1C1917` | Text, dark elements |
| Warm gray | `#57534E` | Body text |
| Muted gray | `#A8A29E` | Labels, captions |
| Amber / Gold | `#D97706` | Badges, highlights |
| Green | `#15803D` | Location and nature elements |
| WhatsApp Green | `#25D366` | Chat widget |
| Footer Yellow | `#E8F95C` | Footer background |
| Experience bg | `#f7e4de` | Warm pink section |
| Menu bg | `#FFF0F3` | Soft pink section |
| Testimonials bg | `#1B6B93` | Dark blue section |
| Dark bg | `#2A1810` | Hero video overlay |

---

## 🗂️ Project Structure

```text
prototype-semayot/
├── app/
│   ├── layout.tsx                        # Root layout: Outfit font, metadata, lang="id"
│   ├── page.tsx                          # Homepage → renders SemayotHomepage
│   ├── globals.css                       # Global styles, CSS variables, custom animations
│   └── favicon.ico
├── components/
│   ├── semayot/
│   │   ├── semayot-homepage.tsx          # Main homepage composer: 11 sections
│   │   ├── semayot-header.tsx            # Sticky header with mobile menu
│   │   ├── semayot-hero.tsx              # Hero section with video bg + WhatsApp chat
│   │   ├── semayot-mascot.tsx            # Interactive SVG pig mascot
│   │   ├── semayot-footer.tsx            # Footer with giant brand name
│   │   ├── whatsapp-chat.tsx             # WhatsApp chat simulation: iPhone mockup
│   │   ├── chatbot-widget.tsx            # External chatbot iframe widget
│   │   ├── about-section.tsx             # Business info section
│   │   ├── experience-section.tsx        # Numbered feature blocks
│   │   ├── menu-info-section.tsx         # Menu gallery with food photos
│   │   ├── bengkayang-section.tsx        # Local culture editorial section
│   │   ├── semayot-testimonials.tsx      # Customer testimonials wrapper
│   │   ├── cta-final-section.tsx         # Dark CTA section
│   │   ├── location-section.tsx          # Google Maps embed + contact
│   │   ├── featured-menu-section.tsx     # Featured menu cards: 3-column
│   │   ├── happy-service-section.tsx     # Service pillars grid
│   │   ├── today-recommendation-section.tsx  # Daily recommendation
│   │   ├── location-cta-section.tsx      # Location CTA alternative
│   │   ├── menu-card.tsx                 # Individual menu card with 3D tilt
│   │   └── liquid-blobs.tsx              # Decorative background blobs
│   └── ui/
│       ├── animated-testimonials.tsx     # Reusable animated testimonial carousel
│       ├── avatar.tsx                    # Radix UI avatar
│       ├── separator.tsx                 # Radix UI separator
│       └── design-testimonial.tsx        # Design testimonial variant
├── lib/
│   ├── utils.ts                          # cn() utility: clsx + twMerge
│   └── semayot/
│       ├── business-info.ts              # Typed SemayotBusinessInfo — SSOT
│       ├── menu-data.ts                  # Typed MenuItem — featured menu data
│       ├── homepage-copy.ts              # Centralized homepage copy
│       └── data.ts                       # Deprecated — migrated to files above
├── public/
│   ├── semayot/
│   │   ├── images/
│   │   │   ├── semarendang.mp4           # Hero video background
│   │   │   ├── semayot.mp4               # About section video
│   │   │   ├── semayot.png               # Mascot image
│   │   │   ├── sema.png                  # Mascot variant
│   │   │   ├── sema2.png                 # Mascot variant
│   │   │   ├── sema2.webp                # Mascot variant
│   │   │   ├── rumah-makan.png           # Restaurant photo
│   │   │   ├── han.jpg                   # CTA background image
│   │   │   └── menu1.png – menu6.png     # Food photos: 6 images
│   │   └── noupe-widget.html             # External chatbot widget HTML
│   ├── Chat WhatsApp.lottie              # Lottie animation file
│   └── *.svg                             # Default Next.js SVGs
├── rumah-makan-semayot/                  # V0 prototype — excluded from tsconfig
├── docs/
│   ├── Semayot Brand Direction Board.pdf
│   ├── Semayot Creative Brief.pdf
│   └── Semayot Website + Admin System PRD v1.pdf
├── scratch/
│   ├── compress_image.py
│   └── view_image.html
├── prd.md                                # Product Requirements Document
├── spec.md                               # Frontend Implementation Spec
├── prompt.md                             # Agent Execution Prompt
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── .npmrc
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── eslint.config.mjs
```

---

## 🧭 Homepage Sections

The homepage is composed of **11 intentional sections**. Do not reorder sections without a Chief decision.

![Sections](https://img.shields.io/badge/homepage-11_sections-f97316)
![Architecture](https://img.shields.io/badge/architecture-component_driven-2563eb)
![Rule](https://img.shields.io/badge/rule-do_not_reorder-dc2626)

### Section 1 — Header (`semayot-header.tsx`)

Fixed/sticky header with scroll-based background opacity transition using `useScroll` and `useTransform` from Framer Motion.

- Logo: **SEMAYOT** with icon square
- Navigation: **Menu**, **Tentang**, **Lokasi**
- CTA: **Hubungi** button with phone link
- Mobile: hamburger menu with animated overlay

### Section 2 — Hero (`semayot-hero.tsx`)

Full-viewport dark section with video background `semarendang.mp4` and dark-to-transparent gradient overlays.

- Left column: WhatsApp chat simulation inside an iPhone mockup
- Right column: location badge, headline, subheadline, rotating circular **LIHAT MENU** CTA
- Bottom panel: location, contact, opening context, services
- Headline: *"Kenikmatan autentik dalam setiap sajian."*

### Section 3 — Welcome Banner

Implemented inline in `semayot-homepage.tsx`.

- 3 food thumbnails with staggered animation
- Brand message: *"Tradisi rasa, kualitas prima."*
- Non-halal label displayed prominently

### Section 4 — About Section (`about-section.tsx`)

Section label: **Tentang Kami**.

- Full-bleed cinematic video: `semayot.mp4`
- Video aspect ratio: 21:9 / 3:1 style treatment
- Business story text
- Info cards: location, rating, services, payment, closing time
- Google Maps CTA link

### Section 5 — Experience Section (`experience-section.tsx`)

Title: **Yang dicari dari Semayot.**

Three numbered feature blocks with food images:

1. Rasa lokal yang kuat
2. Nyaman untuk makan di tempat
3. Cepat dan sederhana

Background: warm pink `#f7e4de`.

### Section 6 — Menu Info Section (`menu-info-section.tsx`)

Badge: **Galeri Sajian Terpopuler**.  
Title: **Identitas Masakan Semayot**.

Six menu cards in a 3-column grid using real food photos:

| No. | Menu | Category |
| --- | --- | --- |
| 1 | Tumis Pare Pedas | Sayuran Tradisional |
| 2 | Tumis Rebung | Sayuran Tradisional |
| 3 | Daging Masak Rempah | Daging Masak |
| 4 | Daging Asap Suwir | Daging Asap |
| 5 | Semur Daging Rebung | Daging Masak |
| 6 | Daging Asap Tumis Cabai | Daging Asap |

Disclaimer: **Konfirmasi Menu & Harga via Telepon.**  
Heritage note: recipes are inspired by Dayak Bengkayang food identity.

Background: soft pink `#FFF0F3`.

### Section 7 — Bengkayang Section (`bengkayang-section.tsx`)

Newspaper-style editorial layout.

- Title: **Bengkayang** in giant display font
- Subtitle: **Kalimantan Barat — Tanah Air Terjun, Budaya, & Keindahan Alam**
- Sidebar: quick facts card, pull quote, location badge

Accordion topics:

1. Bumi 1000 Riam — waterfalls
2. Rumah Baruk — traditional architecture
3. Gerbang Batas Negara — border region
4. Cap Go Meh Bengkayang — festival
5. Dataran Tinggi & Pesisir — geography
6. Pemekaran dari Sambas — history

### Section 8 — Testimonials (`semayot-testimonials.tsx`)

Uses the `AnimatedTestimonials` component.

- Badge: **⭐ 4.9 dari 9 ulasan**
- 5 customer testimonials
- Auto-rotate interval: 5 seconds
- Background: dark blue `#1B6B93`

### Section 9 — CTA Final Section (`cta-final-section.tsx`)

Dark CTA section.

- Background: `#1C1917`
- Food image overlay
- Headline: *"Kenikmatan autentik dalam setiap sajian."*
- Primary CTA: **Lokasi Kami**
- Secondary CTA: **Telepon Sekarang**

### Section 10 — Location Section (`location-section.tsx`)

Title: **Temukan Semayot di Bengkayang.**

- Left column: address, Plus Code, phone
- Right column: embedded Google Maps with grayscale filter
- CTA buttons for location and contact
- Map caption includes Plus Code

### Section 11 — Footer (`semayot-footer.tsx`)

Final brand anchor.

- Giant **SEMAYOT** typographic treatment
- Responsive sizing: 14vw → 11vw → 9vw
- Background: yellow `#E8F95C`
- Decorative geometry: 3 vertical bars + 2 rectangles
- Contact: WhatsApp, phone, address
- Email newsletter signup
- Acknowledgement of Dayak cultural heritage
- Credit: **© 2026 Sentra Mitra Design – All Rights Reserved**

---

## 🐷 How the Mascot Works

`semayot-mascot.tsx` is SVG-based, not image-dependent.

```typescript
type MascotVariant = "welcome" | "menu" | "recommendation" | "thankyou" | "loading";
```

### Mascot Variants

| Variant | Behavior |
| --- | --- |
| `welcome` | Waving hand animation |
| `menu` | Holding a menu board |
| `recommendation` | Floating star |
| `thankyou` | Pulsing heart |
| `loading` | Rotating dashed circle |

### Behaviors

- **Eye tracking** — follows mouse cursor with spring physics
- **Blink** — random interval between 3.5s and 5s
- **Ear wiggle** — proximity-based; closer cursor means stronger wiggle
- **Float** — gentle up/down loop at 3.5s
- **Image mode** — can also render the actual mascot image with the same animation layer

### Visual Traits

| Trait | Value |
| --- | --- |
| Body | Soft pink `#FFC2D6` |
| Cheeks | Rosy pink `#FF85A1` |
| Outfit | Scarf / apron |
| Shape | Rounded, friendly, clean |
| Status | Final mascot asset pending |

> Current mascot render is an SVG placeholder. Final mascot asset is still pending.

---

## 🕹️ Key Interactive Features

### WhatsApp Chat Simulation (`whatsapp-chat.tsx`)

The WhatsApp module gives the homepage a warm, conversational feel.

- iPhone mockup frame at 340px width
- Simulated chat conversation with 7 messages
- Auto-plays on a 15s loop
- Typing indicator animation
- Local Lottie file: `Chat WhatsApp.lottie`
- Lottie animation plays above the phone frame

### Menu Card 3D Tilt (`menu-card.tsx`)

Food cards are interactive but still lightweight.

- Mouse-tracking 3D rotation at ±12deg
- Shine overlay follows cursor position
- Spring physics for smooth card return
- Each card includes a WhatsApp order link with pre-filled message

### Chatbot Widget (`chatbot-widget.tsx`)

External iframe widget powered by Noupe.

- Fixed position: bottom-right
- Periodic comic popup: **"Oink! 🐷"**
- Reinforces mascot personality without dominating the page

### Scroll Animations

Used throughout the homepage.

- `whileInView` on all sections
- Staggered children animations
- Viewport-triggered reveals
- `once: true` for performance

---

## 🎞️ Custom CSS Animations

Defined in `globals.css`.

| Keyframe | Duration | Purpose |
| --- | --- | --- |
| `float` | 6s | Gentle vertical floating |
| `grain` | 12s | Subtle film grain overlay |
| `warmPulse` | 2s | Pulsing box-shadow |
| `steamRise` | 2s | Rising steam effect |
| `shimmer` | 2s | Background shimmer |
| `ripple` | 2s | Map pin ripple |
| `mascotBounce` | 3s | Mascot bounce |
| `oinkBounce` | 0.6s | Comic text bounce |

### CSS Utility Classes

| Class | Purpose |
| --- | --- |
| `.animate-float` | Floating animation |
| `.animate-warm-pulse` | Pulsing glow |
| `.animate-steam` | Steam rising |
| `.animate-shimmer` | Shimmer effect |
| `.grain-overlay::before` | Film grain overlay with opacity 0.015 |
| `.text-stroke` | Text stroke effect |
| `.clip-diagonal` | Diagonal clip path |
| `.clip-diagonal-reverse` | Reverse diagonal clip path |
| `.warm-glow::after` | Radial gradient glow |
| `.food-card-hover` | Card hover with pink shadow |
| `.mascot-bounce` | Mascot bounce |
| `.oink-comic` | Comic text effect using Fraunces italic |

---

## 🧩 Data Layer

All content is static, typed, and centralized.

![Static](https://img.shields.io/badge/data-static-64748b)
![Typed](https://img.shields.io/badge/data-typed-2563eb)
![Centralized](https://img.shields.io/badge/copy-centralized-22c55e)
![Backend](https://img.shields.io/badge/backend-none-f97316)
![Auth](https://img.shields.io/badge/auth-none-a855f7)

No backend. No database. No authentication.

### Business Info (`lib/semayot/business-info.ts`)

Typed interface: `SemayotBusinessInfo`.

Fields:

- `name`
- `category`
- `address`
- `area`
- `province`
- `landmark`
- `phone`
- `whatsapp`
- `googleMapsUrl`
- `openingHoursStatus`
- `closingTime`
- `rating`
- `reviewCount`
- `ratingDistribution`
- `services`
- `reviewHighlights`
- `menuSignals`
- `popularTimes`
- `verificationNotes`
- `missingInfo`

### Menu Data (`lib/semayot/menu-data.ts`)

Typed interface: `MenuItem`.

Fields:

- `id`
- `name`
- `description`
- `price`
- `badge`
- `category`: `'dayak' | 'smoked' | 'pedas' | 'minuman'`
- `needsOwnerConfirmation`

Featured items:

1. **Hidangan Tradisional Dayak**
2. **Daging Asap Khas Semayot**
3. **Tumisan Pedas Rempah Dayak**

All featured menu items carry a disclaimer because they are derived from customer reviews and must be confirmed by the owner before launch.

### Homepage Copy (`lib/semayot/homepage-copy.ts`)

Typed interface: `HomepageCopy`.

Covered sections:

- hero
- service pillars
- recommendation
- location
- footer

All visible text on the page is centralized here. Do not hardcode copy directly in components.

> `lib/semayot/data.ts` is deprecated. It has been migrated into the three canonical files above. Do not write new code that imports from it.

---

## 🔌 External Integrations

| Integration | Type | Purpose |
| --- | --- | --- |
| Google Maps Embed | `<iframe>` | Location map with grayscale filter |
| Google Maps Link | External URL | Navigation CTA |
| Noupe Chatbot | External script + iframe | AI chatbot widget at bottom-right |
| Lottie Files | Local `.lottie` file | WhatsApp animation above phone mockup |
| DiceBear API | Avatar URLs | Testimonial avatar generation |
| Google Fonts CDN | CSS import | Outfit, Fraunces, Inter fonts |
| `tel:` link | Protocol | Phone call CTA |
| `wa.me` URL | WhatsApp deep link | Pre-filled order message |

---

## 🔎 Metadata & SEO

```typescript
export const metadata: Metadata = {
  title: "Rumah Makan Semayot | Cita Rasa Khas Dayak Bengkayang",
  description:
    "Nikmati kehangatan hidangan tradisional Dayak dan olahan daging asap otentik di Rumah Makan Semayot, Bumi Amas, Bengkayang, Kalimantan Barat. Rating 4.9/5 Google Maps.",
};
```

### SEO Notes

| Area | Setting |
| --- | --- |
| Language | `lang="id"` |
| Font rendering | `antialiased` |
| Scroll behavior | `scroll-behavior: smooth` |
| Metadata focus | Dayak cuisine, Bengkayang, local restaurant, Google Maps rating |

---

## ⚙️ Config Highlights

### `next.config.ts`

Local images only. No external image domains are configured.

```typescript
const nextConfig: NextConfig = {
  images: {
    // Using local images only — no external patterns needed
  },
};
```

### `tsconfig.json`

| Setting | Value |
| --- | --- |
| Target | ES2017 |
| Module | ESNext with bundler resolution |
| Type mode | Strict mode enabled |
| JSX | `react-jsx` |
| Path alias | `@/*` → `./*` |
| Excludes | `node_modules`, `rumah-makan-semayot` |

### `eslint.config.mjs`

Flat config.

Extends:

- `eslint-config-next/core-web-vitals`
- `eslint-config-next/typescript`

Ignores:

- `.next/`
- `out/`
- `build/`
- `next-env.d.ts`

---

## 🧪 Subproject: `rumah-makan-semayot/`

`rumah-makan-semayot/` is a separate V0-generated design prototype.

It contains a heavier dependency tree and earlier design iteration assets.

### Includes

- shadcn/ui, new-york style
- full Radix UI suite
- accordion, dialog, dropdown, tabs, toast
- Recharts
- Embla Carousel
- React Hook Form
- Zod
- Vercel Analytics
- next-themes
- class-variance-authority
- cmdk
- vaul
- sonner
- 20+ design screenshots in PNG format
- separate `components.json` for shadcn/ui config

> This folder is excluded from `tsconfig`. Do not import from it.

---

## ✍️ Copywriting Direction

Tone: **friendly**, **clear**, **warm**, and **slightly playful**. The copy should not feel too slang, too corporate, too childish, or too premium-for-premium’s-sake.

Short copy wins. Food should remain visually and emotionally dominant.

### Key Headlines

- *"Kenikmatan autentik dalam setiap sajian."*
- *"Rasa Favorit yang Bikin Pulang Lagi."*
- *"Makan Enak, Dilayani dengan Senang."*
- *"Tradisi rasa, kualitas prima."*

### CTA Options

- **Lihat Menu**
- **Order via WhatsApp**
- **Buka Lokasi**
- **Hubungi Kami**
- **Telepon Sekarang**

### Badge Options

- **Favorit**
- **Rekomendasi**
- **Paling Dicari**
- **Menu Andalan**
- **Khas Dayak**
- **Pedas Pas**

### Service Copy

- *"Kami percaya makanan enak terasa lebih lengkap saat disajikan dengan ramah."*
- *"Datang lapar, pulang senang."*
- *"Resep turun-temurun, rasa yang dirindukan."*

---

## ✅ Acceptance Criteria

Verify all criteria before launch.

| No. | Criteria | Status |
| --- | --- | --- |
| 1 | Website instantly feels cheerful and clean | Required |
| 2 | Mascot appears cute, clean, and friendly | Required |
| 3 | Mascot never feels cheap or childish | Required |
| 4 | Food remains visually dominant throughout | Required |
| 5 | CTA is visible above the fold | Required |
| 6 | Non-halal / pork specialty is unmistakably clear | Required |
| 7 | Mobile layout works beautifully | Required |
| 8 | Motion is smooth but not distracting | Required |
| 9 | Page does not feel childish or cheap | Required |
| 10 | Lighthouse / performance score remains acceptable | Required |
| 11 | Implementation is componentized and ready for expansion | Required |

---

## ⚠️ Known Limitations

Resolve these before launch, not after.

| Limitation | Detail | Action |
| --- | --- | --- |
| Menu not confirmed | Items in `menu-data.ts` are derived from Google Maps reviews, not directly from the owner | Verify all names and prices with owner |
| WhatsApp number missing | No official WhatsApp listed on Google Maps | Confirm official number with owner |
| Opening hours incomplete | Only closing time, 21:00 WIB, is confirmed | Confirm full daily schedule |
| Mascot asset pending | Current SVG is a placeholder | Replace with final mascot asset |
| Cash only | No digital payment integration exists in this phase | Keep copy accurate and avoid payment promises |

---

## 📚 Documentation

| File | Contents |
| --- | --- |
| `docs/Semayot Brand Direction Board.pdf` | Visual brand guidelines |
| `docs/Semayot Creative Brief.pdf` | Creative direction document |
| `docs/Semayot Website + Admin System PRD v1.pdf` | Full PRD — website + future admin |
| `prd.md` | Product requirements |
| `spec.md` | Frontend implementation spec |
| `prompt.md` | Agent execution prompt |

---

## 🛣️ Roadmap

Pending Chief approval per phase. These are outside the scope of the current prototype.

| Phase | Scope |
| --- | --- |
| 1 | Full menu page with categories |
| 2 | Admin system for menu management |
| 3 | Online ordering system |
| 4 | Payment gateway integration |
| 5 | Social media integration |
| 6 | Packaging design |
| 7 | POS system |

---

## 🤝 Let's Connect

[![Website](https://img.shields.io/badge/Website-ferdiiskandar.com-black?style=flat-square&logo=google-chrome&logoColor=white)](https://ferdiiskandar.com)
[![Discord](https://img.shields.io/badge/Discord-%237289DA.svg?logo=discord&logoColor=white)](https://discord.gg/1511829076313374745)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://linkedin.com/in/dr-ferdi-iskandar-1b620a3b5)
[![Medium](https://img.shields.io/badge/Medium-12100E?logo=medium&logoColor=white)](https://medium.com/@codieverse)
[![Quora](https://img.shields.io/badge/Quora-%23B92B27.svg?logo=Quora&logoColor=white)](https://quora.com/profile/drferdiiskadar@gmail.com)
[![Reddit](https://img.shields.io/badge/Reddit-%23FF4500.svg?logo=Reddit&logoColor=white)](https://reddit.com/user/SixCupaCoffee)
[![TikTok](https://img.shields.io/badge/TikTok-%23000000.svg?logo=TikTok&logoColor=white)](https://tiktok.com/@drferdii)
[![X](https://img.shields.io/badge/X-black.svg?logo=X&logoColor=white)](https://x.com/ClaudesyI81047)
[![email](https://img.shields.io/badge/Email-D14836?logo=gmail&logoColor=white)](mailto:drferdiiskadar@gmail.com)

---

## 🧰 Station Stacks

![PowerShell](https://img.shields.io/badge/PowerShell-%235391FE.svg?style=for-the-badge&logo=powershell&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-%23FF6F00.svg?style=for-the-badge&logo=TensorFlow&logoColor=white)
![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white)
![Terraform](https://img.shields.io/badge/terraform-%235835CC.svg?style=for-the-badge&logo=terraform&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

---

## 🏁 Credits

**Design & Development:** Sentra Mitra Design  
**Collaboration:** dr. Alyn (2026)  
**Status:** Production prototype  
**Rights:** © 2026 Sentra Mitra Design — All Rights Reserved

---

<div align="center">

_Semayot — datang lapar, pulang senang._

</div>

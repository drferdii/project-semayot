# SEMAYOT FRONTEND IMPLEMENTATION SPEC v1

## 1. Recommended Stack

Use:

* Next.js App Router
* TypeScript
* Tailwind CSS
* shadcn/ui if already available
* Framer Motion for controlled animation
* lucide-react for icons
* next/image for optimized image handling

Do not add unnecessary heavy libraries.

## 2. Target Deliverable

Build a polished public homepage prototype for Semayot with:

* Animated hero
* Cute pig mascot placeholder/component
* Featured menu section
* Happy service section
* Recommendation/promo section
* Location CTA
* Footer
* Fully responsive mobile-first layout
* Reusable components

## 3. Suggested File Structure

Create or adjust:

```txt
app/
  page.tsx
  globals.css

components/
  semayot/
    semayot-homepage.tsx
    semayot-header.tsx
    semayot-hero.tsx
    semayot-mascot.tsx
    featured-menu-section.tsx
    happy-service-section.tsx
    today-recommendation-section.tsx
    location-cta-section.tsx
    semayot-footer.tsx
    menu-card.tsx
    service-card.tsx

lib/
  semayot/
    data.ts
    copy.ts
    constants.ts

public/
  semayot/
    mascot/
      README.md
    menu/
      README.md
```

If project already has a different structure, adapt surgically without breaking existing app conventions.

## 4. Component Responsibilities

### `semayot-homepage.tsx`

Composes the full homepage.

Should include:

* Header
* Hero
* Featured menu
* Happy service
* Recommendation
* Location
* Footer

No heavy business logic.

### `semayot-header.tsx`

Responsibilities:

* Brand name/logo text
* Navigation
* WhatsApp CTA
* Mobile responsive menu

Acceptance:

* Clean on desktop
* Easy on mobile
* CTA visible

### `semayot-hero.tsx`

Responsibilities:

* Main headline
* Subheadline
* Specialty clarity label
* CTA buttons
* Mascot visual
* Food preview cards

Acceptance:

* Above the fold is strong
* Mascot and food composition looks balanced
* CTA visible without scrolling on common mobile sizes

### `semayot-mascot.tsx`

Responsibilities:

* Render mascot placeholder in clean SVG/CSS or image wrapper
* Support variants:

  * `welcome`
  * `menu`
  * `recommendation`
  * `thankyou`
  * `loading`

MVP may use a custom SVG-style placeholder if final mascot asset is not ready.

Important:

* Do not use random external mascot images.
* Do not use copyrighted cartoon characters.
* Do not generate visual assets inside code unless simple original SVG.
* Use placeholder cleanly until final asset is provided.

### `featured-menu-section.tsx`

Responsibilities:

* Render 3–6 featured products from static data
* Each card shows:

  * image placeholder
  * name
  * description
  * price
  * badge
  * CTA

Acceptance:

* Food card looks appetizing
* Layout works on mobile
* Cards are reusable for future menu page

### `happy-service-section.tsx`

Responsibilities:

* Show 4 service pillars:

  * Rasa khas
  * Pelayanan ramah
  * Bersih & nyaman
  * Order mudah

Acceptance:

* Copy short
* Icons consistent
* Motion subtle

### `today-recommendation-section.tsx`

Responsibilities:

* Highlight one recommendation
* Use mascot in pointing/recommendation state
* CTA to WhatsApp/order

Acceptance:

* Feels dynamic
* Ready to later connect to backend/admin

### `location-cta-section.tsx`

Responsibilities:

* Address placeholder
* Opening hours placeholder
* Map CTA
* WhatsApp CTA

Acceptance:

* User can easily click contact/location
* Copy can be changed later from config/data

### `semayot-footer.tsx`

Responsibilities:

* Brand summary
* Contact placeholders
* Navigation
* Non-halal clarity if needed

## 5. Data Layer for MVP

Create static data first.

Example shape:

```ts
export const featuredMenu = [
  {
    id: "babi-panggang",
    name: "Babi Panggang Semayot",
    description: "Menu andalan dengan rasa gurih khas Semayot.",
    price: "Rp --",
    badge: "Favorit",
    image: "/semayot/menu/placeholder-food.jpg",
    available: true,
  },
]
```

Also create:

```ts
export const servicePillars = [
  {
    title: "Rasa Khas",
    description: "Menu favorit dengan cita rasa yang dirindukan.",
    icon: "utensils",
  },
]
```

Keep data centralized in `lib/semayot/data.ts`.

## 6. Motion Spec

Use Framer Motion carefully.

### Hero Motion

* Mascot: fade in + y upward + gentle floating loop
* Headline: fade in stagger
* CTA: fade in
* Food cards: small stagger entrance

### Hover Motion

* Buttons: scale 1.02 max
* Cards: y -4px max
* Promo badge: very light pulse only if tasteful

### Scroll Motion

* Section entrance: fade in/up
* No aggressive parallax
* No infinite distracting motion except mascot micro-motion

## 7. Responsive Spec

Mobile-first.

Breakpoints:

* Mobile: single column
* Tablet: two column hero if enough width
* Desktop: hero split layout

Hero mobile order:

1. Brand label
2. Headline
3. Subheadline
4. CTA
5. Mascot/food visual

Hero desktop order:

* Left: copy + CTA
* Right: mascot + food cards

## 8. Visual Style Rules

### Background

Use warm cream with soft decorative blobs.

Avoid pure flat white everywhere.

### Cards

Use warm white surfaces, rounded corners, soft shadow.

### Buttons

Primary:

* Coral/red-orange background
* White text
* Rounded/pill
* Strong but friendly

Secondary:

* Warm white background
* Brown/coral text
* Border soft beige

### Text

Heading:

* Big, rounded, friendly
* Strong hierarchy

Body:

* Readable
* Warm dark brown/charcoal

## 9. Accessibility

Must ensure:

* Buttons are semantic links/buttons
* Alt text exists for images
* Contrast acceptable
* Focus states visible
* Motion does not block interaction
* Avoid tiny text on mobile

## 10. Performance

Must ensure:

* No massive image imports
* Use optimized image sizes
* Avoid unnecessary client components
* Only components needing animation use `"use client"`
* Keep static sections server-renderable where possible
* Avoid large runtime dependencies

## 11. Implementation Order

### Step 1 — Inspect Existing Project

Agent must first inspect:

* package.json
* app/page.tsx or pages/index.tsx
* existing Tailwind config
* existing component structure
* existing design system
* current route structure

Do not modify before inspection.

### Step 2 — Create Semayot Data/Copy

Add static copy and menu mock data under `lib/semayot`.

### Step 3 — Build Components

Build components in this order:

1. `semayot-mascot.tsx`
2. `semayot-header.tsx`
3. `semayot-hero.tsx`
4. `menu-card.tsx`
5. `featured-menu-section.tsx`
6. `happy-service-section.tsx`
7. `today-recommendation-section.tsx`
8. `location-cta-section.tsx`
9. `semayot-footer.tsx`
10. `semayot-homepage.tsx`

### Step 4 — Wire Homepage

Update homepage route to render `SemayotHomepage`.

### Step 5 — Style Polish

Apply:

* Color tokens
* Responsive spacing
* Typography hierarchy
* Motion
* CTA consistency

### Step 6 — Validate

Run:

* lint
* typecheck
* build
* browser preview
* mobile viewport check
* visual review

## 12. Do Not Do

Agent must not:

* Build full admin system yet
* Add database yet unless asked
* Add auth yet unless asked
* Add payment gateway
* Add external scraper
* Use copyrighted mascot/image
* Replace project architecture
* Mass delete files
* Rewrite unrelated files
* Install unnecessary UI kits
* Make design too childish
* Hide the pork/non-halal positioning

## 13. Completion Checklist

Implementation is complete when:

* Homepage renders without error
* Mobile layout is polished
* Mascot placeholder appears clean and cute
* Hero has motion
* Featured menu cards render
* Happy service section renders
* Recommendation section renders
* Location CTA renders
* No TypeScript errors
* Build passes
* No unrelated files changed
* Agent provides screenshots or browser verification notes

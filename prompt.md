# ANTIGRAVITY / AGENT EXECUTION PROMPT — SEMAYOT MASCOT + HOMEPAGE v1

You are the implementation agent for the Semayot public website MVP.

Your mission is to build the first polished version of the Semayot brand mascot + animated homepage direction.

This is not a generic restaurant website. Semayot must feel cheerful, clean, warm, friendly, appetizing, and memorable. The public website should communicate “happy service” through motion, a cute clean pig mascot, strong food-first layout, and clear CTAs.

## Primary Objective

Build a responsive, animated Semayot homepage with:

1. Cute clean pig mascot component or placeholder
2. Warm cheerful hero section
3. Featured menu section
4. Happy service section
5. Today recommendation/promo section
6. Location/contact CTA section
7. Footer
8. Mobile-first polish
9. Controlled lightweight motion
10. Clean componentized implementation

## Important Brand Direction

Semayot is a pork/non-halal specialty restaurant. The design must be clear, confident, warm, and respectful. Do not hide the positioning.

Visual tone:

* cheerful
* clean
* warm
* appetizing
* friendly
* slightly playful
* modern local restaurant
* cute but not childish

Avoid:

* cheap cartoon look
* random stock mascot
* overly childish UI
* excessive animation
* dark/heavy visual
* generic template restaurant look
* mascot overpowering food
* unclear pork/non-halal positioning

## Critical Safety & Execution Rules

Before making changes:

1. Inspect the project structure.
2. Read package.json.
3. Identify framework, routing style, styling system, and existing conventions.
4. Produce a short implementation plan.
5. Then implement surgically.

You must not:

* Delete large folders
* Run destructive cleanup
* Rewrite architecture
* Refactor unrelated code
* Modify unrelated apps/packages
* Install unnecessary dependencies
* Add backend/admin/payment features in this phase
* Use copyrighted images or cartoon characters
* Scrape external sites
* Invent final brand assets if not provided

If assets are missing, create original lightweight placeholder components and clearly mark them as placeholders.

## Expected Tech Direction

Prefer:

* Next.js
* TypeScript
* Tailwind CSS
* Framer Motion only if already available or acceptable to add
* Simple SVG/CSS mascot placeholder
* Centralized static data
* Componentized sections

If Framer Motion is not available, either:

1. Use CSS animation, or
2. Ask/flag before installing dependency.

## Suggested Implementation Structure

Create or adapt:

```txt
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

Adapt this to the existing project if needed.

## Homepage Requirements

### Header

Must include:

* Rumah Makan Semayot brand text/logo placeholder
* Navigation links
* Primary CTA: Order via WhatsApp
* Mobile responsive behavior

### Hero

Must include:

* Brand label
* Strong headline
* Short subheadline
* Specialty/non-halal clarity label
* Primary CTA: Lihat Menu
* Secondary CTA: Order via WhatsApp or Buka Lokasi
* Cute animated pig mascot
* Food/menu preview visual

Suggested headline:

“Rasa Favorit yang Bikin Pulang Lagi.”

Suggested subheadline:

“Nikmati menu khas Semayot dengan rasa hangat, pelayanan ramah, dan suasana makan yang menyenangkan.”

Add small clarity label:

“Specialty pork menu / non-halal.”

### Featured Menu

Must include 3–6 menu cards using static data.

Each card:

* menu name
* description
* price placeholder
* badge
* food image placeholder or visual placeholder
* CTA

### Happy Service

Must include 4 pillars:

1. Rasa khas
2. Pelayanan ramah
3. Bersih & nyaman
4. Order mudah

### Today Recommendation

Must include:

* Highlighted menu recommendation
* Mascot in recommendation/pointing mode
* CTA to order/check menu

### Location CTA

Must include:

* address placeholder
* opening hours placeholder
* Google Maps CTA
* WhatsApp CTA

### Footer

Must include:

* brand summary
* nav links
* contact placeholder
* non-halal clarity if needed

## Mascot Requirements

Create a `SemayotMascot` component.

It should support variants:

```ts
type MascotVariant =
  | "welcome"
  | "menu"
  | "recommendation"
  | "thankyou"
  | "loading";
```

MVP mascot can be an original SVG/CSS illustration placeholder:

* soft pink pig
* rounded body
* friendly eyes
* smile
* blush
* apron/scarf optional
* clean, cute, not childish

Animate gently:

* floating
* blinking if easy
* wave if easy
* no excessive movement

## Static Data Requirement

Create central data for:

* featured menu
* service pillars
* location/contact placeholders
* homepage copy

Do not hardcode all text deeply inside components if avoidable.

## Styling Requirements

Use warm and appetizing palette:

* warm cream background
* warm white cards
* coral/red-orange CTA
* soft pink mascot
* brown/charcoal text
* soft beige borders

Use:

* generous spacing
* rounded cards
* soft shadows
* mobile-first layout
* clear hierarchy

## Motion Requirements

Motion should be:

* subtle
* smooth
* lightweight
* purposeful

Hero:

* staggered text entrance
* mascot soft entrance
* mascot gentle floating
* food cards slight upward/fade entrance

Cards:

* very small hover lift

Buttons:

* slight scale on hover/tap

Avoid:

* aggressive parallax
* constant distracting animation
* confetti
* heavy 3D
* moving every element

## Validation Required

After implementation, run available checks:

* npm/pnpm/yarn lint if available
* typecheck if available
* build if available

Then run browser preview if available and verify:

* desktop homepage
* mobile homepage
* header
* hero
* mascot
* CTA
* menu cards
* layout spacing
* no horizontal overflow
* no runtime console errors

## Output Required From Agent

After finishing, report:

1. Files changed
2. Components created
3. How to run locally
4. Validation commands run and results
5. Visual verification summary
6. Known limitations
7. Next recommended steps

## Acceptance Criteria

The task is complete only when:

* Homepage renders successfully
* Design feels Semayot-specific, not generic
* Mascot appears cute, clean, and friendly
* Food/menu remains prominent
* Motion exists but is not excessive
* CTA is clear
* Pork/non-halal specialty is clear
* Mobile layout is polished
* No unrelated files are changed
* Build/typecheck/lint pass or failures are clearly explained with evidence

## Final Instruction

Work surgically. Prioritize polish, clarity, and brand identity. Do not overbuild. Do not start admin system yet. Build the public visual foundation first.

# Design Spec: Semayot Chat Widget

## Overview

Custom AI chat widget for Rumah Makan Semayot website. Replaces the third-party Noupe widget with a fully controlled, brand-consistent floating chat. AI-powered via Vercel AI SDK + OpenRouter free tier. Model responds in Indonesian Bahasa about restaurant info, menu, hours, location, and contact.

## Goals

1. 100% brand-consistent — no white/grey backgrounds, no unproportional sizing
2. AI-powered answers — natural Indonesian language, streaming response
3. Free — OpenRouter free tier, no cost per message
4. Simple — no database, no auth, no persistent storage

## Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│  ChatWidget     │ ───────>│  /api/chat      │ ───────>│  OpenRouter     │
│  (React client) │  POST   │  (Next.js route)│  POST   │  (mistral-7b)   │
│  useChat hook   │ <────── │  streamText     │ <────── │  streaming      │
└─────────────────┘  SSE    └─────────────────┘  SSE    └─────────────────┘
```

## Components

### 1. `components/semayot/chat-widget.tsx` (Client)

- **FAB trigger**: Fixed bottom-right, `w-14 h-14 rounded-full`, bg `#FF4F79`, white icon. `z-[9999]`
- **Chat panel**: Expandable drawer, `max-w-[360px] w-full`, bg `#FFF0F3` (pink), rounded-2xl, shadow-2xl
- **Header**: Mascot avatar (32px circle) + "Tanya Semayot" title + close X button
- **Message area**: Scrollable, user messages right-aligned white bubbles, AI left-aligned pink bubbles
- **Input**: Bottom sticky, `rounded-full`, placeholder "Tanya Semayot", send button
- **Loading state**: Typing indicator (3 dots bounce)
- **Error state**: Inline error + retry button
- **Empty state**: Welcome message + suggested questions (3 pills)
- **Animations**: Framer Motion for open/close, message enter (stagger)
- **Accessibility**: `aria-label` on button, keyboard Esc to close, focus trap when open

### 2. `app/api/chat/route.ts` (Server)

- `POST` handler, accepts `{ messages: Message[] }`
- Uses `streamText` from `ai` package
- Provider: `createOpenRouter` from `@openrouter/ai-sdk-provider`
- Model: `mistralai/mistral-7b-instruct` (free tier, fast, good Indonesian)
- System prompt: Loaded from `lib/semayot/chat-system-prompt.ts`
- Temperature: 0.7, maxTokens: 500
- Returns streaming response via `toDataStreamResponse()`
- Error handling: Return JSON error if API key missing or OpenRouter fails

### 3. `lib/semayot/chat-system-prompt.ts`

Contains system prompt with all Semayot knowledge:
- Restaurant name, category (non-halal Dayak cuisine)
- Location: Bumi Amas, Bengkayang, Kalimantan Barat (depan Kantor Camat)
- Phone: 0816-4947-0780
- Hours: Buka, tutup 21:00 WIB
- Payment: Tunai only
- Services: Dine-in, Takeaway
- Menu: Hidangan Tradisional Dayak, Daging Asap Khas Semayot, Tumisan Pedas Rempah Dayak
- Prices: Hubungi kontak (not publicly listed)
- Rating: 4.9/5 Google Maps
- Tone: Ramah, warm, helpful, Indonesian Bahasa, polite but not overly formal

### 4. `app/layout.tsx` (Integration)

- Import `<ChatWidget />` inside `<body>` after `{children}`
- Widget is always mounted but only visible when user clicks FAB

## Style Guide

| Element | Style |
|---------|-------|
| Widget bg | `#FFF0F3` (pink) |
| User message bg | `#FF4F79` (coral) with white text |
| AI message bg | `#FAF6F0` (cream) with `#1C1917` text |
| FAB bg | `#FF4F79` with white icon |
| FAB hover | `#E03D63` |
| Input border | `#FFD4DF` |
| Send button | `#FF4F79` white icon |
| Suggested question pills | `#FF4F79` bg, white text, `rounded-full` |
| Font | `Outfit` (font-sans) |
| Mascot | 32px circle, slight bounce animation on hover |
| Border radius | `1rem` (consistent with site theme) |

## API Contract

```typescript
// POST /api/chat
interface Request {
  messages: { role: "user" | "assistant"; content: string }[];
}

// Response: SSE stream (text/delta from Vercel AI SDK)
// Error: { error: string } with 400/500 status
```

## Dependencies

```bash
npm install @openrouter/ai-sdk-provider ai
```

No additional client deps — `useChat` comes from `ai` package (`ai/react`).

## Environment Variables

```env
OPENROUTER_API_KEY=sk-or-v1-...
```

Free API key from [openrouter.ai](https://openrouter.ai).

## Error Handling

| Scenario | Behavior |
|----------|----------|
| API key missing | Chat shows error: "Layanan chat sedang tidak tersedia." |
| OpenRouter rate limit | Retry after 2s, then show "Terlalu banyak permintaan. Coba lagi nanti." |
| Network error | Show inline error + retry button |
| Empty input | Disable send button |

## No-Go (YAGNI)

- No database / message persistence (chat resets on refresh)
- No auth / user identity
- No file upload / image analysis
- No RAG / vector search (system prompt covers all knowledge)
- No multi-language support (Indonesian only)
- No admin dashboard

## Testing Plan

1. Build passes (`next build`)
2. Widget opens/closes with animation
3. Send message → AI responds with streaming
4. AI answers correctly about Semayot hours, location, menu
5. Error states render correctly (disconnect API key temporarily)

## Files Changed

1. `app/layout.tsx` — add `<ChatWidget />`
2. `app/api/chat/route.ts` — new API route
3. `components/semayot/chat-widget.tsx` — new component
4. `lib/semayot/chat-system-prompt.ts` — new system prompt
5. `package.json` — add `@openrouter/ai-sdk-provider` + `ai`
6. `.env.local` — add `OPENROUTER_API_KEY` (local only, not committed)

## Verification

- [ ] Widget FAB visible in bottom-right corner
- [ ] Click FAB → panel opens with animation
- [ ] Chat panel bg is `#FFF0F3` (pink), no white/grey
- [ ] Type "jam buka berapa" → AI answers "Buka, tutup 21:00 WIB"
- [ ] Type "menu apa" → AI lists 3 menu items
- [ ] Streaming response shows text appearing character by character
- [ ] Close button works, panel slides out
- [ ] Build passes with zero errors

---

*Design approved by Chief on 2026-06-28.*

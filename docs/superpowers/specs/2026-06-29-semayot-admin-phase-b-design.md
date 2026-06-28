# Design Spec: Semayot Admin System (Phase B)

> **Status:** Design approved by Chief on 2026-06-29. Awaiting implementation plan via writing-plans skill.
>
> **Origin:** Brainstorming session 2026-06-29 (visual companion at `http://localhost:50842`, content archived under `.superpowers/brainstorm/session-1/`).
>
> **Predecessor:** Homepage prototype v1 (`prototype-semayot`) — public site 100% untouched by this spec.

---

## 1. Overview

Phase B membangun **internal admin system** untuk Rumah Makan Semayot di route segment `/admin` (Next.js App Router) dengan backend Supabase (Postgres + Auth + Storage + RLS). Fungsinya: owner (dr. Alyn) dan staff mengelola menu, mencatat transaksi POS, melihat pembukuan, menerima ringkasan AI, dan mengakses panel rekomendasi SEO.

**Constraint utama**: public site (`/`, `app/page.tsx`, `lib/semayot/*`, `components/semayot/*`) **tidak boleh disentuh**. Admin dan public site adalah dua runtime surface di repo yang sama dengan data layer terpisah (decoupled by design).

## 2. Scope

### 2.1 In scope (Phase B)

1. **Menu CRUD** — tambah, edit, soft-delete produk (nama, harga, foto, kategori, badge, status).
2. **POS / Transaksi** — catat item + qty + tunai → auto total + kembalian + snapshot nama/harga.
3. **Pembukuan & laporan** — income/expense tracking, laporan harian & bulanan, export CSV/PDF.
4. **AI summary (internal agent)** — ringkasan performa bisnis via OpenRouter + chat tanya analitik.
5. **Multi-role auth** — owner full access + staff POS-only (binary, no granular perms).
6. **SEO recommendation panel** — 10 rekomendasi statis curated, owner apply manual ke public site.
7. **Settings** — bisnis (jam buka, alamat, telepon) + staff manage (invite, nonaktifkan).

### 2.2 Out of scope (deferred)

- Multi-restaurant / multi-tenant.
- Online ordering / customer-facing checkout.
- Payment gateway (cash only by design).
- Customer accounts / loyalty program.
- Email marketing.
- Mobile app native.
- i18n (Bahasa Indonesia only).
- Dark mode admin.
- 2FA / SSO.
- Receipt printer integration.
- Inventory & supplier management.
- Market intel / competitive analysis (eksplisit di-skip).
- Public site structural SEO (eksplisit di-defer; admin hanya generates rekomendasi).

## 3. Architecture

### 3.1 Runtime surface

```
┌────────────────────────────────────────────────────────────────┐
│  prototype-semayot (Next.js 16 App Router, SAME repo)          │
│                                                                │
│  PUBLIC  /                                  FROZEN · 0% touch  │
│  ├─ lib/semayot/*   (static TS data)                           │
│  └─ components/     (21 existing components)                   │
│                                                                │
│  ADMIN   /admin                              NEW · auth-gated  │
│  ├─ login/                                                       │
│  ├─ overview/     dashboard, snapshot hari ini                  │
│  ├─ menu/         CRUD produk                                   │
│  ├─ pos/          catat transaksi                               │
│  ├─ transactions/ list + filter + detail                        │
│  ├─ reports/      harian, bulanan, export CSV/PDF               │
│  ├─ ai/           AI summary + chat (internal agent)             │
│  ├─ seo/          rekomendasi SEO panel                          │
│  └─ settings/     jam buka, kontak, staff manage                │
│                                                                │
│  /api/admin/*    Next.js Route Handlers                         │
│  ├─ auth/ (login, logout, session)                              │
│  ├─ menu/  ├─ pos/  ├─ transactions/  ├─ expenses/              │
│  ├─ reports/  ├─ ai/  ├─ seo/  ├─ settings/  └─ staff/         │
│                                                                │
│  lib/admin/                                                     │
│  ├─ supabase/    client (browser) + server (route handlers)     │
│  ├─ schemas/     zod validators (shared client+server)          │
│  ├─ ai/          prompts + types                                │
│  ├─ format/      money, date Indonesian formatters              │
│  └─ rls/         SQL migration files (numbered)                 │
│                                                                │
│  components/admin/                                              │
│  ├─ AdminShell, Sidebar, Topbar                                 │
│  ├─ StatCard, DataTable, FormField, Modal, Toast                │
│  ├─ ConfirmDialog, EmptyState, ErrorBoundary                    │
│  ├─ DateRangePicker, MoneyDisplay, FileUpload                   │
│  └─ pages/*   (one file per route, thin composition)            │
└────────────────────────────────────────────────────────────────┘
              │                                  ▲
              ▼                                  │
┌──────────────────────────┐    ┌──────────────────────────────┐
│  Supabase                │    │  OpenRouter                  │
│  - Postgres              │    │  - mistral-7b-instruct       │
│  - Auth (email+pass)     │    │  - free tier                 │
│  - Storage (menu photos) │    │  - SSE streaming             │
│  - RLS enabled           │    └──────────────────────────────┘
└──────────────────────────┘
```

### 3.2 Key invariants (HARUS dipatuhi)

1. **Public site TIDAK fetch Supabase** — 100% baca static file. Tidak ada import `@supabase/*` di file di luar `app/admin/`, `app/api/admin/`, `lib/admin/`, `components/admin/`.
2. **Admin TIDAK baca `lib/semayot/*`** — data sendiri di Supabase. Exception: hanya untuk komponen UI yang re-use (mis. button style, font references).
3. **Middleware `/admin/*` wajib check session** — redirect ke `/admin/login` (page) atau 401 (API).
4. **RLS = source of truth permission** — bukan middleware check manual. Defense in depth: UI hide, middleware auth, RLS enforce.
5. **No runtime coupling public ↔ admin** — tidak ada fetch lintas sisi. Decoupled by design.

### 3.3 Tradeoffs yang kita accept

- Menu di public site vs admin bisa out-of-sync (owner update file TS manual).
- Owner maintain 2 sources untuk business info (public `lib/semayot/business-info.ts` + admin DB).
- Initial setup lebih lama (DB + RLS + seed).
- Two deploy surfaces (meskipun same repo, different routes).

## 4. Data Model

### 4.1 Tables

```sql
-- Profiles: extend auth.users
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text not null,
  role text not null check (role in ('owner', 'staff')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Menu items
create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price_cents int not null,         -- integer, bukan float
  category text not null check (category in ('dayak','smoked','pedas','minuman')),
  photo_url text,                    -- Supabase Storage public URL
  badge text,
  is_active boolean not null default true,
  needs_owner_confirmation boolean not null default true,
  created_by uuid references public.profiles,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Transactions (POS header)
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.profiles,
  total_cents int not null,
  paid_cents int not null,
  change_cents int not null generated always as (paid_cents - total_cents) stored,
  payment_method text not null default 'cash' check (payment_method = 'cash'),
  note text,
  created_at timestamptz not null default now()
);

-- Transaction line items
create table public.transaction_items (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references public.transactions on delete cascade,
  menu_item_id uuid not null references public.menu_items,
  name_snapshot text not null,       -- snapshot nama saat transaksi
  price_cents_snapshot int not null, -- snapshot harga saat transaksi
  quantity int not null check (quantity > 0),
  subtotal_cents int not null
);

-- Expenses
create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('bahan','operasional','gaji','lain')),
  amount_cents int not null,
  description text,
  incurred_by uuid references public.profiles,
  incurred_at date not null default current_date,
  created_at timestamptz not null default now()
);

-- AI summary cache
create table public.ai_summaries (
  id uuid primary key default gen_random_uuid(),
  period_start date not null,
  period_end date not null,
  summary_text text not null,
  generated_at timestamptz not null default now(),
  unique (period_start, period_end)
);

-- Indexes
create index idx_tx_created_at on public.transactions(created_at desc);
create index idx_txitems_tx on public.transaction_items(transaction_id);
create index idx_expenses_at on public.expenses(incurred_at desc);
create index idx_menu_cat on public.menu_items(category);
```

### 4.2 RLS Policies

```sql
-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.menu_items enable row level security;
alter table public.transactions enable row level security;
alter table public.transaction_items enable row level security;
alter table public.expenses enable row level security;
alter table public.ai_summaries enable row level security;

-- Helper: check if current user is owner
-- (defined inline in each policy for Supabase compatibility)

-- profiles
create policy "owner_full_profiles" on public.profiles
  for all using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'owner'
  ));
create policy "user_read_own_profile" on public.profiles
  for select using (id = auth.uid());

-- menu_items
create policy "owner_full_menu" on public.menu_items
  for all using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'owner'
  ));
create policy "staff_read_active_menu" on public.menu_items
  for select using (is_active = true and exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'staff'
  ));

-- transactions
create policy "tx_insert" on public.transactions
  for insert with check (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('staff','owner') and p.is_active = true
  ));
create policy "owner_read_all_tx" on public.transactions
  for select using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'owner'
  ));
create policy "staff_read_own_tx" on public.transactions
  for select using (staff_id = auth.uid());

-- transaction_items: SELECT mengikuti parent (transaksi) — enforced di app layer
-- INSERT hanya via API handler yang sama dengan transactions
create policy "txitems_insert" on public.transaction_items
  for insert with check (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('staff','owner') and p.is_active = true
  ));
create policy "txitems_read" on public.transaction_items
  for select using (exists (
    select 1 from public.transactions t
    join public.profiles p on p.id = auth.uid()
    where t.id = transaction_items.transaction_id
      and (p.role = 'owner' or t.staff_id = auth.uid())
  ));

-- expenses: owner only
create policy "owner_full_expenses" on public.expenses
  for all using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'owner'
  ));

-- ai_summaries: owner only
create policy "owner_full_ai_summaries" on public.ai_summaries
  for all using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'owner'
  ));
```

### 4.3 Design decisions

- **`price_cents` int** — hindari floating-point bug di pembukuan.
- **Snapshot `name_snapshot` & `price_cents_snapshot`** di `transaction_items` — history akurat walau menu diedit/dihapus.
- **`change_cents` generated column** — Postgres hitung, mustahil salah.
- **No FK ke `auth.users.role`** — pisah `profiles` table, RLS pakai EXISTS query (Supabase standard).
- **`ai_summaries` cache** — UNIQUE(period_start, period_end) untuk dedup otomatis.
- **Expense category enum terbatas** — `bahan|operasional|gaji|lain`, dropdown cukup, tidak perlu custom.
- **Soft delete menu** via `is_active = false` (bukan DELETE) — preserves history FK integrity.

## 5. Auth & API Surface

### 5.1 Auth flow

1. User GET `/admin/login` → render form (email + password).
2. Submit → POST `/api/admin/auth/login` → `signInWithPassword` via Supabase.
3. Supabase set session cookie (HTTP-only, secure, sameSite=lax).
4. Browser redirect ke `/admin/overview`.
5. Middleware cek session di setiap request ke `/admin/:path*` dan `/api/admin/:path*`.
6. Role check: `app_metadata.role` di-set saat user di-invite ke `profiles` (via Supabase service role, one-time, no runtime query). Middleware baca role dari JWT claims. Backup: handler boleh re-query `profiles.role` via Supabase kalau perlu fresh data.

**Logout**: clear session via Supabase + redirect ke `/admin/login`.

**Password recovery**: link "Lupa password?" → Supabase recovery email flow (built-in).

### 5.2 Middleware

File: `middleware.ts` di repo root.

```ts
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

export async function middleware(request: NextRequest) {
  const supabase = createServerClient(/* ... */);
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    if (request.nextUrl.pathname.startsWith('/api/admin/')) {
      return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Sesi habis. Silakan login ulang.' } }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  // Role check happens in handler, not middleware
  return NextResponse.next();
}
```

### 5.3 Login page (mockup)

- Email input + password input.
- Tombol "Masuk" (loading state saat submit).
- Link "Lupa password?" di bawah.
- Error message Bahasa Indonesia inline.
- Brand: warm cream bg (`#FCF9F2`), coral accent (`#FF4F79`), Outfit font (sama dengan public site).
- Redirect ke `/admin/overview` setelah berhasil.

### 5.4 API endpoints (14 total)

| Method | Path | Purpose | Role |
|---|---|---|---|
| `POST` | `/api/admin/auth/login` | Login (handled by Supabase, OG wrapper) | public |
| `POST` | `/api/admin/auth/logout` | Logout | any authed |
| `GET` | `/api/admin/menu` | List menu items | owner · staff |
| `POST` | `/api/admin/menu` | Create menu item (with photo upload) | owner |
| `PUT` | `/api/admin/menu/[id]` | Update menu item | owner |
| `DELETE` | `/api/admin/menu/[id]` | Soft delete (is_active=false) | owner |
| `POST` | `/api/admin/pos` | Create transaction (POS) | staff · owner |
| `GET` | `/api/admin/transactions` | List transactions (filter date, staff, range) | owner (all) · staff (own) |
| `GET` | `/api/admin/transactions/[id]` | Detail transaction + line items | owner · staff (own) |
| `POST` | `/api/admin/expenses` | Create expense | owner |
| `GET` | `/api/admin/reports/daily?date=YYYY-MM-DD` | Daily report | owner |
| `GET` | `/api/admin/reports/monthly?year=YYYY&month=MM` | Monthly report | owner |
| `GET` | `/api/admin/reports/export?format=csv\|pdf&from=&to=` | Export | owner |
| `GET` | `/api/admin/settings` | Get business settings | owner |
| `PUT` | `/api/admin/settings` | Update business settings | owner |
| `POST` | `/api/admin/staff/invite` | Invite staff (send email via Supabase) | owner |
| `DELETE` | `/api/admin/staff/[id]` | Deactivate staff (is_active=false) | owner |
| `GET` | `/api/admin/ai/summary?period=today\|7d\|30d` | AI summary (cached) | owner |
| `POST` | `/api/admin/ai/summary` | Generate/refresh AI summary | owner |
| `POST` | `/api/admin/ai/chat` | Chat tanya analitik (streaming) | owner |
| `GET` | `/api/admin/seo/recommendations` | List 10 SEO recs + status | owner |
| `PATCH` | `/api/admin/seo/recommendations/[id]` | Update status (applied/skipped) | owner |

Total: **22 endpoints** (correction dari estimasi awal 14). Owner-only: 16. Staff-accessible: 6 (POS + read menu + read own tx + read tx detail own + login + logout).

### 5.5 Standard error envelope

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Nama produk wajib diisi",
    "details": [
      { "path": "name", "issue": "required" }
    ]
  }
}
```

| HTTP | When |
|---|---|
| `200` | OK |
| `201` | Created (resource baru) |
| `400` | Bad Request — Zod validation fail |
| `401` | Unauthorized — no session (middleware) |
| `403` | Forbidden — RLS reject / role check fail |
| `404` | Not Found |
| `409` | Conflict — duplicate / FK in use |
| `500` | Internal Server Error — log + generic message |

### 5.6 Validation (Zod)

`lib/admin/schemas/` — schemas re-use di form (client, via `react-hook-form` + `@hookform/resolvers/zod`) dan API route handler (server, `schema.safeParse()`).

Error `details[]` dari server di-map ke form field errors di client.

## 6. UI Structure

### 6.1 AdminShell (semua halaman kecuali `/admin/login`)

- **Sidebar (240px)**: Logo "🐷 SEMAYOT", nav items, user menu di bawah.
- **Topbar (64px)**: page title (left) + current date (right).
- **Main content area**: warm cream bg, padding 1.5rem.
- **Role-based nav**: staff tidak lihat Laporan, AI, SEO, Settings. Middleware hide items, RLS enforce data.

### 6.2 9 halaman /admin/*

| Path | Role | Purpose |
|---|---|---|
| `/admin/login` | public | Email + password form |
| `/admin/overview` | owner · staff (versi ringkas) | 4 stat cards (pendapatan, transaksi, menu terlaris, pengeluaran) + tabel 5 transaksi terakhir |
| `/admin/menu` | owner | List menu + tambah/edit/hapus. Form: nama, harga, kategori, foto, badge, status |
| `/admin/pos` | staff · owner | Menu grid (kategori) + keranjang + input tunai + tombol catat |
| `/admin/transactions` | owner (all) · staff (own) | List dengan filter (tanggal, staff). Klik row → detail modal |
| `/admin/reports` | owner | Tab Harian / Bulanan. Chart line pendapatan, tabel breakdown, pie expense, export CSV/PDF |
| `/admin/ai` | owner | Tab Ringkasan (cached) + Tanya AI (chat-style streaming) |
| `/admin/seo` | owner | 10 SEO recs + status (terapkan/menunggu) + copy-to-clipboard |
| `/admin/settings` | owner | Tab Bisnis + Staff manage |

### 6.3 12 reusable components (`components/admin/`)

| Component | Purpose |
|---|---|
| `AdminShell` | Layout wrapper (sidebar + topbar + main). Terima `role` prop. |
| `StatCard` | Card statistik. 4 warna: default, success, danger, accent. |
| `DataTable` | Tabel generik dengan sort, filter, pagination, action slot per row. |
| `FormField` | Input wrapper: label, input/textarea/select, error message, hint. |
| `Modal` | Dialog modal dengan backdrop, trigger via context. |
| `Toast` | Notifikasi sukses/error/info, auto-dismiss 3 detik. |
| `ConfirmDialog` | Modal konfirmasi untuk aksi destruktif. |
| `EmptyState` | Empty state dengan mascot variant loading + pesan friendly + CTA. |
| `ErrorBoundary` | React error boundary dengan fallback UI. |
| `DateRangePicker` | Range picker + quick select (hari ini / 7 hari / 30 hari / bulan ini). |
| `MoneyDisplay` | Format cents → "Rp 45.000". Konsisten di seluruh app. |
| `FileUpload` | Upload foto menu. Drag-drop, preview, validasi type/size. |

### 6.4 Tone visual

- Background: `#FCF9F2` (warm cream — sama dengan public site).
- Surface: `#FAF6F0` (warm white).
- Primary action: `#FF4F79` (coral).
- Text: `#1C1917` (charcoal) untuk heading, `#57534E` untuk body.
- Border: `rgba(28, 25, 23, 0.08)` (subtle).
- Font: Outfit (sans) untuk UI, Fraunces (serif) untuk accent/heading besar.
- Reuse semua color tokens dari public site (tidak perlu token baru).

## 7. AI Summary & SEO Panel

### 7.1 AI Summary mechanism

- **Trigger**: on-demand (tombol "Generate ringkasan" / "Refresh"). Tidak real-time per transaksi.
- **Data source**: query `transactions`, `transaction_items`, `expenses`, top menu items dari Supabase. Range: hari ini / 7 hari / 30 hari.
- **Model**: `mistralai/mistral-7b-instruct` via OpenRouter (sama dengan `chat-widget.tsx`).
- **System prompt** (`lib/admin/ai/prompts.ts`): admin-specific, owner-facing, format markdown (Highlight / Concern / Saran).
- **Streaming**: `streamText` + `toDataStreamResponse()`. Pattern reuse dari `app/api/chat/route.ts`.
- **Cache**: hasil disimpan di `ai_summaries` table per periode. UNIQUE constraint pada `(period_start, period_end)` = idempotent.

### 7.2 Halaman /admin/ai (panel + chat)

Dua tab:
- **Ringkasan**: pilih periode (Hari ini / 7 hari / 30 hari) + tombol Refresh. Tampilkan ringkasan cached atau generate baru. Tombol "Salin" + "Kirim ke WhatsApp" (deep link).
- **Tanya AI**: chat interface (mirip `chat-widget.tsx` tapi internal, owner-only). Input "Tanya soal penjualan, menu, expense..." dengan suggested questions. **Data sources yang bisa di-query AI** (via function calling atau prompt injection ringkas): revenue by menu, top items by period, expense breakdown, transaction count, average ticket size. AI tidak bisa mutate data — read-only access ke Supabase.

### 7.3 SEO Panel

10 rekomendasi statis curated, ditambah opsi tambah manual oleh owner (untuk konsultan SEO eksternal).

| # | Rekomendasi | Tipe output |
|---|---|---|
| 1 | Meta title & description audit | Kode + saran |
| 2 | JSON-LD Restaurant schema | Kode JSON siap salin |
| 3 | Sitemap.xml | Kode XML siap salin |
| 4 | robots.txt | Kode siap salin |
| 5 | OG image (1200×630) | Panduan dimensi + rekomendasi visual |
| 6 | Heading hierarchy audit | Checklist |
| 7 | Performance budget (LCP/CLS/INP) | Target + tool check |
| 8 | Google Business Profile | Panduan setup |
| 9 | Local keywords | List keyword target |
| 10 | Internal linking suggestions | List link + anchor |

Setiap item:
- Title
- Why it matters (1-2 kalimat)
- Code/values siap salin
- Lokasi apply (file path atau platform)
- Status: `terapkan` / `menunggu` (toggle oleh owner, no auto-verify)

**Future**: AI-generated audit (OG agent fetch public site + analisis HTML) — Phase B+, tidak dibangun sekarang.

## 8. Error Handling

### 8.1 Matrix per layer

| Layer | Failure | Response |
|---|---|---|
| Form (client) | Zod validation fail | Inline error merah, tombol disabled |
| Form (client) | Network offline | Toast: "Tidak ada koneksi. Coba lagi." |
| API route | No session | 401 JSON (middleware) |
| API route | RLS reject (role) | 403: "Akses ditolak. Hubungi owner." |
| API route | Zod validation fail | 400 + details per field |
| API route | DB constraint / duplicate | 409: "Data sudah ada" / "Tidak bisa dihapus, dipakai di tempat lain" |
| API route | Unexpected DB error | 500 + log (console dev / Sentry prod). User: "Terjadi kesalahan. Coba lagi." |
| Supabase Storage | Upload fail | Rollback transaction DB, toast error |
| OpenRouter | Rate limit | Retry 2s, lalu "Terlalu banyak permintaan. Coba lagi nanti." |
| OpenRouter | API key invalid/missing | 503: "Layanan AI sedang tidak tersedia." |

### 8.2 Logging

- **Dev**: `console.error` + `console.log` dengan context.
- **Prod**: Sentry atau Vercel Logs (decision saat deployment, default ke Vercel Logs untuk MVP).
- **No PII / no payment details** di log.

## 9. Testing Strategy

### 9.1 Unit (Vitest)

- Zod schemas: valid + invalid input → expected output.
- Money formatting: cents → "Rp 45.000".
- Date range filter: edge cases (timezone, DST).
- Snapshot logic: transaksi vs menu update.

### 9.2 Integration (Vitest + mock Supabase)

- API routes dengan mocked Supabase client (per-route test).
- Verifikasi: response shape, status code, RLS policy integration, error envelope consistency.

### 9.3 Manual smoke (per slice)

- End-to-end happy path per slice.
- Cross-role testing (owner vs staff).
- RLS negative test (staff coba akses `/admin/reports` → 403).

### 9.4 YAGNI

- No Playwright / Cypress automated E2E untuk MVP.
- Re-evaluate kalau ada 5+ contributor atau 3+ environments.

## 10. Environment Variables

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | public | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | Anon key (RLS via JWT) |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | Bypass RLS — HANYA untuk SQL migration & seed script. JANGAN di request handler runtime. |
| `OPENROUTER_API_KEY` | **server only** | Untuk `/api/admin/ai/*` dan `/api/chat` (existing) |
| `NEXT_PUBLIC_SITE_URL` | public | URL public site (untuk canonical, OG di SEO rec) |

### 10.1 Hard rules

- `SUPABASE_SERVICE_ROLE_KEY` **tidak pernah** dipakai di request handler runtime. Hanya untuk one-time migration via script.
- `.env.local` di-gitignore (sudah).
- Vercel env vars di-set via dashboard, tidak di-commit.
- Anon key aman di-expose karena RLS enforce permission. Service role key bypass RLS = privilege escalation kalau bocor.

## 11. Deployment

### 11.1 Stack

- **Next.js**: Vercel (managed, free tier cukup untuk traffic warung).
- **Database**: Supabase (managed, free tier: 500MB DB, 1GB storage, 50k MAU).
- **AI**: OpenRouter free tier (mistral-7b).
- **Repo**: GitHub existing (`prototype-semayot`).

### 11.2 Steps (eksekusi OG setelah semua slice approved)

1. **Setup Supabase project**
   - Create project di supabase.com.
   - Run SQL migration files (`lib/admin/rls/*.sql`) via SQL Editor — sesuai urutan di §4.
   - Create storage bucket `menu-photos` (public read).
2. **Bootstrap owner pertama**
   - Sign up dr. Alyn via Supabase Auth dashboard.
   - Insert ke `profiles` table: `role='owner'`, `is_active=true`.
3. **Setup Vercel**
   - Connect GitHub repo.
   - Set env vars (lihat §10).
   - **JANGAN** set `SUPABASE_SERVICE_ROLE_KEY` di Vercel.
   - Deploy.
4. **Verifikasi post-deploy**
   - Kunjungi `https://<domain>/admin/login`.
   - Login sebagai dr. Alyn → dapat overview.
   - Invite 1 staff sebagai smoke test.
   - Catat 1 transaksi dummy → cek di `/admin/transactions`.
   - Generate AI summary → cek cached di DB.
   - Buka 1 SEO rec → salin & cek format.
5. **Dokumentasi**
   - README di `/admin` route (per-route instruksi singkat).
   - Runbook: "Owner lupa password" / "Tambah staff baru" / "Backup DB".

## 12. Slicing Order (vertical slice)

| # | Slice | Deliverable | Test |
|---|---|---|---|
| 1 | Auth & Role | Supabase setup, SQL migration (profiles + RLS), `/admin/login`, middleware, AdminShell, role-based nav | Login owner + staff, redirect, role nav hide |
| 2 | Menu CRUD | SQL migration (menu_items + RLS), `/admin/menu` list + form, API, FileUpload, Supabase Storage | Tambah, edit, soft-delete, upload foto, list by staff |
| 3 | POS & Transactions | SQL migration (transactions + items), `/admin/pos`, `/admin/transactions`, API, snapshot logic | Catat 5 transaksi, edit harga menu, history tetap akurat |
| 4 | Reports & Expenses | SQL migration (expenses), `/admin/reports` (harian + bulanan), chart, export CSV/PDF, expenses form | Laporan 7 hari akurat, expense tercatat, export buka di Excel |
| 5 | AI Summary | SQL migration (ai_summaries), `/admin/ai`, `/api/admin/ai/summary`, prompt, streaming, chat | Generate 7 hari, refresh, tanya spesifik, cache hit |
| 6 | SEO Panel + Settings | 10 SEO rec statis, `/admin/seo`, copy-to-clipboard, status toggle, `/admin/settings` (bisnis + staff) | Salin JSON-LD valid, tandai diterapkan, invite staff baru |

## 13. Risks & YAGNI

### 13.1 Risks (flag + mitigasi)

| Risk | Mitigation |
|---|---|
| Data finansial sensitif (revenue, expenses) | RLS, HTTPS only, no PII di log, backup Supabase otomatis |
| Single point of failure (satu owner) | Backup owner account via Supabase, dokumentasi recovery |
| Free tier limit (Supabase 500MB, OpenRouter rate) | Monitor usage bulanan, plan upgrade path jelas |
| Cash reconciliation (sistem vs uang fisik) | Owner rekonsiliasi manual tiap tutup (tidak ada auto-match) |
| Tanpa audit log (delete menu, edit expense) | Trade-off simplicity vs compliance. Owner-only delete lebih aman. |
| Public ↔ admin out-of-sync (menu) | Panel settings ingatkan owner untuk update file TS manual |

### 13.2 YAGNI (jangan dibangun)

- Multi-restaurant / multi-tenant
- Online ordering / customer-facing checkout
- Payment gateway
- Customer accounts / loyalty program
- Email marketing / newsletter blast
- Mobile app native
- i18n (Bahasa Indonesia only)
- Dark mode admin
- 2FA / SSO
- Receipt printer integration
- Inventory management
- Supplier management
- Market intel (eksplisit di-skip)
- Public site structural SEO (eksplisit di-defer; admin hanya generates rekomendasi)
- Granular per-staff permissions (binary owner/staff cukup)

## 14. Acceptance Criteria

| # | Criteria | How to verify |
|---|---|---|
| 1 | Semua 9 halaman `/admin/*` render tanpa error | Manual visit each, check console |
| 2 | POS bisa catat transaksi dalam <30 detik | Manual stopwatch test |
| 3 | Laporan harian generate dalam <2 detik | Manual timer, query 7 hari |
| 4 | AI summary generate dalam <10 detik | Manual timer, OpenRouter streaming |
| 5 | `pnpm build` zero error | CI / local |
| 6 | `pnpm lint` zero warning | CI / local |
| 7 | `tsc --noEmit` zero error | strict mode |
| 8 | Tidak ada secrets di git | `git log -p \| grep -iE "key\|secret"` negative |
| 9 | Public site 100% untouched | `git diff <base>..HEAD -- app/page.tsx lib/semayot/ components/semayot/` kosong |
| 10 | RLS tested | Staff coba `/admin/reports` → 403. Owner hapus menu orang lain → 403. |
| 11 | Backup plan documented | Supabase daily backup di paid plan, atau export mingguan manual |
| 12 | No console error di dev/prod | Manual smoke + Vercel logs check |
| 13 | Mobile responsive (tablet minimum) | Manual viewport test di iPad |
| 14 | All 22 API endpoints tested (happy + 1 error case) | Integration test suite |
| 15 | All Indonesian copy proofread | Chief review |

## 15. Files Changed (initial scaffold — Slice 1)

> List di bawah adalah **delta** dari base branch. Bukan exhaustive per-slice (akan di-update per implementation plan).

### New

```
middleware.ts
app/admin/layout.tsx
app/admin/login/page.tsx
app/admin/overview/page.tsx
app/admin/(authenticated)/layout.tsx
app/admin/(authenticated)/menu/page.tsx
app/admin/(authenticated)/pos/page.tsx
app/admin/(authenticated)/transactions/page.tsx
app/admin/(authenticated)/reports/page.tsx
app/admin/(authenticated)/ai/page.tsx
app/admin/(authenticated)/seo/page.tsx
app/admin/(authenticated)/settings/page.tsx
app/api/admin/auth/login/route.ts
app/api/admin/auth/logout/route.ts
app/api/admin/menu/route.ts
app/api/admin/menu/[id]/route.ts
app/api/admin/pos/route.ts
app/api/admin/transactions/route.ts
app/api/admin/transactions/[id]/route.ts
app/api/admin/expenses/route.ts
app/api/admin/reports/daily/route.ts
app/api/admin/reports/monthly/route.ts
app/api/admin/reports/export/route.ts
app/api/admin/settings/route.ts
app/api/admin/staff/invite/route.ts
app/api/admin/staff/[id]/route.ts
app/api/admin/ai/summary/route.ts
app/api/admin/ai/chat/route.ts
app/api/admin/seo/recommendations/route.ts
app/api/admin/seo/recommendations/[id]/route.ts
lib/admin/supabase/client.ts
lib/admin/supabase/server.ts
lib/admin/schemas/menu.ts
lib/admin/schemas/pos.ts
lib/admin/schemas/expense.ts
lib/admin/schemas/staff.ts
lib/admin/schemas/settings.ts
lib/admin/ai/prompts.ts
lib/admin/ai/format.ts
lib/admin/format/money.ts
lib/admin/format/date.ts
lib/admin/rls/0001_profiles.sql
lib/admin/rls/0002_menu_items.sql
lib/admin/rls/0003_transactions.sql
lib/admin/rls/0004_expenses.sql
lib/admin/rls/0005_ai_summaries.sql
components/admin/AdminShell.tsx
components/admin/Sidebar.tsx
components/admin/Topbar.tsx
components/admin/StatCard.tsx
components/admin/DataTable.tsx
components/admin/FormField.tsx
components/admin/Modal.tsx
components/admin/Toast.tsx
components/admin/ConfirmDialog.tsx
components/admin/EmptyState.tsx
components/admin/ErrorBoundary.tsx
components/admin/DateRangePicker.tsx
components/admin/MoneyDisplay.tsx
components/admin/FileUpload.tsx
tests/admin/money.test.ts
tests/admin/pos-snapshot.test.ts
tests/admin/api-menu.test.ts
```

### Modified (NONE for public site)

- `package.json`: tambah `@supabase/ssr`, `@supabase/supabase-js`, `zod`, `react-hook-form`, `@hookform/resolvers`, `recharts`, `vitest`, `@vitejs/plugin-react` (dev).
- `tsconfig.json`: extend path alias `@/lib/admin/*` (jika perlu).
- `.env.local` (gitignored): tambah Supabase + OpenRouter keys (OpenRouter sudah ada).
- `.gitignore`: tambah `.superpowers/` (sudah untuk visual companion).

### NOT modified (frozen)

- `app/page.tsx`
- `app/layout.tsx`
- `app/globals.css`
- `lib/semayot/*` (semua)
- `components/semayot/*` (semua)
- `public/semayot/*` (semua)
- `components/ui/*` (kecuali mungkin re-use `Separator`, `Avatar` — bukan modify)

## 16. Open Questions / Follow-ups

Sisa keputusan yang masih bisa di-defer ke writing-plans atau bahkan saat eksekusi (tidak blocker):

1. **PDF export**: CSV dulu (priority), PDF opsional. Kalau PDF perlu: `pdfkit` (Node) atau `puppeteer` (heavy). Default: CSV only, tambah PDF kalau owner request.
2. **Cron untuk AI summary auto-harian**: Vercel Cron Jobs (free 1 cron/day). **Default: OFF**. Owner trigger manual via tombol. Auto-cron = Phase B+.
3. **Notification channel untuk AI summary**: WhatsApp deep link (tombol "Kirim ke WhatsApp" di panel, no infra tambahan). Email = Phase B+.
4. **Chart library final**: Recharts. Tambah ke `package.json`. Alternatif: hand-rolled SVG kalau Recharts terlalu berat.

Sudah diputuskan (tidak open question, hanya untuk dokumentasi):

- **Storage folder foto**: flat di bucket `menu-photos`, no nesting.
- **Migration data lama**: ya, 3 item featured dari `lib/semayot/menu-data.ts` di-seed ke `menu_items` table di Slice 2 (`needs_owner_confirmation=true` tetap).
- **Package Supabase**: `@supabase/ssr` (bukan `@supabase/auth-helpers-nextjs`).
- **Form library**: `react-hook-form` + `@hookform/resolvers/zod`.

## 17. Selesai

Spec ini akan digunakan oleh `writing-plans` skill untuk generate implementation plan detail per-slice. Setelah spec ini disetujui Chief, OG lanjut ke fase planning.

---

*Design approved by Chief on 2026-06-29 (brainstorming session 1, 7 questions, 6 visual sections, http://localhost:50842).*

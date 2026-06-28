# Semayot Admin System (Phase B) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build internal admin system untuk Rumah Makan Semayot di `/admin` route — Menu CRUD, POS, pembukuan, AI summary, SEO panel, multi-role auth (owner + staff).

**Architecture:** Supabase (Postgres + Auth + Storage + RLS) sebagai backend. Next.js 16 App Router dengan route segment `/admin` di repo `prototype-semayot` yang sama dengan public site. Decoupled: public site 100% tidak disentuh, admin punya DB sendiri. Middleware `/admin/*` enforce auth, RLS enforce role permission.

**Tech Stack:** Next.js 16.2.9 (App Router), React 19.2.4, TypeScript 5.x strict, Tailwind v4, Supabase (`@supabase/ssr`, `@supabase/supabase-js`), Zod, react-hook-form + @hookform/resolvers, Recharts, Vitest, framer-motion (sudah ada), lucide-react (sudah ada).

**Reference documents:**
- Spec: `docs/superpowers/specs/2026-06-29-semayot-admin-phase-b-design.md`
- Visual companion archive: `.superpowers/brainstorm/session-1/`

---

## File Structure Overview

### New directories

```
middleware.ts (root)
app/admin/
  layout.tsx
  login/page.tsx
  (authenticated)/
    layout.tsx
    overview/page.tsx
    menu/page.tsx
    pos/page.tsx
    transactions/page.tsx
    reports/page.tsx
    ai/page.tsx
    seo/page.tsx
    settings/page.tsx
app/api/admin/
  auth/login/route.ts
  auth/logout/route.ts
  menu/route.ts
  menu/[id]/route.ts
  pos/route.ts
  transactions/route.ts
  transactions/[id]/route.ts
  expenses/route.ts
  reports/daily/route.ts
  reports/monthly/route.ts
  reports/export/route.ts
  settings/route.ts
  staff/invite/route.ts
  staff/[id]/route.ts
  ai/summary/route.ts
  ai/chat/route.ts
  seo/recommendations/route.ts
  seo/recommendations/[id]/route.ts
lib/admin/
  supabase/client.ts
  supabase/server.ts
  supabase/middleware.ts
  schemas/menu.ts
  schemas/pos.ts
  schemas/expense.ts
  schemas/staff.ts
  schemas/settings.ts
  ai/prompts.ts
  ai/format.ts
  format/money.ts
  format/date.ts
  rls/0001_profiles.sql
  rls/0002_menu_items.sql
  rls/0003_transactions.sql
  rls/0004_expenses.sql
  rls/0005_ai_summaries.sql
  rls/0006_storage_bucket.sql
  seed/menu-items.ts
components/admin/
  AdminShell.tsx
  Sidebar.tsx
  Topbar.tsx
  StatCard.tsx
  DataTable.tsx
  FormField.tsx
  Modal.tsx
  Toast.tsx
  ConfirmDialog.tsx
  EmptyState.tsx
  ErrorBoundary.tsx
  DateRangePicker.tsx
  MoneyDisplay.tsx
  FileUpload.tsx
  pages/OverviewContent.tsx
  pages/MenuList.tsx
  pages/MenuForm.tsx
  pages/POSForm.tsx
  pages/TransactionsList.tsx
  pages/TransactionDetail.tsx
  pages/ReportsView.tsx
  pages/AIView.tsx
  pages/SEOView.tsx
  pages/SettingsView.tsx
tests/admin/
  format/money.test.ts
  format/date.test.ts
  schemas/pos.test.ts
  ai/format.test.ts
  api/menu.test.ts
  api/pos.test.ts
```

### Modified files (only admin-relevant)

- `package.json` — tambah deps
- `tsconfig.json` — extend path alias
- `.env.local` — tambah Supabase keys (gitignored)
- `.gitignore` — tambah `.superpowers/`

### Frozen files (TIDAK disentuh)

- `app/page.tsx`
- `app/layout.tsx`
- `app/globals.css`
- `lib/semayot/*` (semua)
- `components/semayot/*` (semua)
- `public/semayot/*` (semua)
- `components/ui/*` (kecuali re-use `Separator`, `Avatar` — import only, no modify)

---

## PRE-WORK (Tasks 0-6)

### Task 0: Tambah dependencies & environment setup

**Files:**
- Modify: `package.json`
- Create: `.env.local` (gitignored)
- Modify: `.gitignore`

- [ ] **Step 1: Install dependencies**

Run:
```bash
cd D:\Devops\code-prototype\prototype-semayot
pnpm add @supabase/ssr @supabase/supabase-js zod react-hook-form @hookform/resolvers recharts
pnpm add -D vitest @vitejs/plugin-react @types/node
```

Expected: dependencies added to `package.json` without errors.

- [ ] **Step 2: Verify deps in package.json**

Run: `pnpm list @supabase/ssr @supabase/supabase-js zod react-hook-form @hookform/resolvers recharts vitest`
Expected: All 7 packages listed with versions.

- [ ] **Step 3: Create .env.local placeholder**

Create file `D:\Devops\code-prototype\prototype-semayot\.env.local` (already gitignored, no need to add to .gitignore):
```env
# Public (exposed to client — safe)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Server only — NEVER prefix with NEXT_PUBLIC_
OPENROUTER_API_KEY=sk-or-v1-...existing

# Server only — used ONLY for one-time migration scripts, NOT in runtime
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

Note: Values to be filled when Supabase project created in Task 1.

- [ ] **Step 4: Add .superpowers/ to .gitignore**

Edit `D:\Devops\code-prototype\prototype-semayot\.gitignore`, append:
```
# Superpowers brainstorming
.superpowers/
```

- [ ] **Step 5: Commit**

```bash
cd D:\Devops\code-prototype\prototype-semayot
git add package.json pnpm-lock.yaml .gitignore
git commit -m "chore(admin): add deps for phase B admin system"
```

### Task 1: Setup Supabase project

**Files:** N/A (external service, manual)

- [ ] **Step 1: Create Supabase project**

1. Buka https://supabase.com/dashboard
2. Click "New Project"
3. Name: `semayot-admin` (or similar)
4. Database password: generate strong password, save securely
5. Region: pilih terdekat (Singapore untuk Indonesia)
6. Click "Create new project"
7. Tunggu ~2 menit sampai status "Active"

- [ ] **Step 2: Get project credentials**

Di Project Settings → API:
- Copy `Project URL` → set sebagai `NEXT_PUBLIC_SUPABASE_URL` di `.env.local`
- Copy `anon public` key → set sebagai `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy `service_role secret` key → set sebagai `SUPABASE_SERVICE_ROLE_KEY` (HANYA untuk migration, JANGAN dipakai di runtime)

- [ ] **Step 3: Create storage bucket**

1. Sidebar → Storage → "New bucket"
2. Name: `menu-photos`
3. Public bucket: ON (agar foto bisa diakses tanpa auth)
4. Click "Create bucket"

- [ ] **Step 4: Verify connection**

Run: `node -e "console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)"`
Expected: prints the Supabase URL (after sourcing .env.local or after Vercel set in deployment).

For now, manual verification cukup. Connection tested properly in Slice 1.

- [ ] **Step 5: Save credentials securely**

Document credentials di password manager atau secure note. JANGAN commit `.env.local`.

### Task 2: Configure TypeScript path alias & vitest

**Files:**
- Modify: `tsconfig.json`
- Create: `vitest.config.ts`
- Modify: `package.json` (add test script)

- [ ] **Step 1: Check current tsconfig.json**

Read `D:\Devops\code-prototype\prototype-semayot\tsconfig.json`. Path alias `@/*` should already exist (sudah dipakai public site).

- [ ] **Step 2: Add test script to package.json**

Edit `package.json` `"scripts"` section, tambah:
```json
"test": "vitest run",
"test:watch": "vitest"
```

Result `scripts`:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 3: Create vitest.config.ts**

Create `D:\Devops\code-prototype\prototype-semayot\vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

- [ ] **Step 4: Verify test runner works**

Run: `pnpm test -- --run --reporter=basic`
Expected: "No test files found" exit 0 (no failures, just empty test suite).

- [ ] **Step 5: Commit**

```bash
cd D:\Devops\code-prototype\prototype-semayot
git add tsconfig.json package.json vitest.config.ts
git commit -m "chore(admin): add vitest config and test scripts"
```

### Task 3: Create lib/admin directory & money formatter (TDD)

**Files:**
- Create: `lib/admin/format/money.ts`
- Create: `tests/admin/format/money.test.ts`

- [ ] **Step 1: Write failing test**

Create `D:\Devops\code-prototype\prototype-semayot\tests\admin\format\money.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { formatRupiah, parseRupiahToCents } from '@/lib/admin/format/money';

describe('formatRupiah', () => {
  it('formats cents to Rupiah string with dot separator', () => {
    expect(formatRupiah(45000_00)).toBe('Rp 45.000');
    expect(formatRupiah(0)).toBe('Rp 0');
    expect(formatRupiah(1234567_89)).toBe('Rp 1.234.567,89');
  });

  it('handles negative values (refunds)', () => {
    expect(formatRupiah(-5000_00)).toBe('-Rp 5.000');
  });
});

describe('parseRupiahToCents', () => {
  it('parses "Rp 45.000" to 4500000 cents', () => {
    expect(parseRupiahToCents('Rp 45.000')).toBe(45000_00);
  });

  it('parses "45000" to 4500000 cents', () => {
    expect(parseRupiahToCents('45000')).toBe(45000_00);
  });

  it('parses with comma decimal', () => {
    expect(parseRupiahToCents('Rp 1.234.567,89')).toBe(1234567_89);
  });

  it('returns null for invalid input', () => {
    expect(parseRupiahToCents('abc')).toBe(null);
    expect(parseRupiahToCents('')).toBe(null);
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `pnpm test tests/admin/format/money.test.ts`
Expected: FAIL — "Cannot find module '@/lib/admin/format/money'"

- [ ] **Step 3: Implement money formatter**

Create `D:\Devops\code-prototype\prototype-semayot\lib\admin\format\money.ts`:
```typescript
/**
 * Money utilities for admin.
 * All amounts in DB are stored as integer cents to avoid floating-point errors.
 */

/**
 * Format integer cents to Indonesian Rupiah string.
 * Example: 45000_00 → "Rp 45.000"
 */
export function formatRupiah(cents: number): string {
  const isNegative = cents < 0;
  const absCents = Math.abs(cents);
  const rupiah = Math.floor(absCents / 100);
  const sen = absCents % 100;

  const rupiahStr = rupiah.toLocaleString('id-ID');
  const senStr = sen > 0 ? `,${sen.toString().padStart(2, '0')}` : '';

  return `${isNegative ? '-' : ''}Rp ${rupiahStr}${senStr}`;
}

/**
 * Parse Rupiah string to integer cents.
 * Accepts formats: "Rp 45.000", "45000", "Rp 1.234.567,89"
 * Returns null if invalid.
 */
export function parseRupiahToCents(input: string): number | null {
  const cleaned = input.replace(/[^\d,]/g, '').replace(',', '.');
  if (!cleaned) return null;
  const num = parseFloat(cleaned);
  if (isNaN(num)) return null;
  return Math.round(num * 100);
}
```

- [ ] **Step 4: Run test, verify it passes**

Run: `pnpm test tests/admin/format/money.test.ts`
Expected: PASS, 6 tests passed.

- [ ] **Step 5: Commit**

```bash
git add lib/admin/format/money.ts tests/admin/format/money.test.ts
git commit -m "feat(admin): add money formatter with TDD"
```

### Task 4: Date formatter (TDD)

**Files:**
- Create: `lib/admin/format/date.ts`
- Create: `tests/admin/format/date.test.ts`

- [ ] **Step 1: Write failing test**

Create `D:\Devops\code-prototype\prototype-semayot\tests\admin\format\date.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { formatDateID, formatDateRangeID, getTodayID } from '@/lib/admin/format/date';

describe('formatDateID', () => {
  it('formats ISO date to Indonesian format', () => {
    expect(formatDateID('2026-06-28')).toBe('28 Juni 2026');
    expect(formatDateID('2026-01-01')).toBe('1 Januari 2026');
  });
});

describe('formatDateRangeID', () => {
  it('formats same-month range', () => {
    expect(formatDateRangeID('2026-06-01', '2026-06-30')).toBe('1 - 30 Juni 2026');
  });
  it('formats cross-month range', () => {
    expect(formatDateRangeID('2026-06-28', '2026-07-05')).toBe('28 Juni - 5 Juli 2026');
  });
  it('formats cross-year range', () => {
    expect(formatDateRangeID('2025-12-30', '2026-01-02')).toBe('30 Desember 2025 - 2 Januari 2026');
  });
});

describe('getTodayID', () => {
  it('returns today in YYYY-MM-DD', () => {
    const today = getTodayID();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
```

- [ ] **Step 2: Run test, verify fail**

Run: `pnpm test tests/admin/format/date.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement date formatter**

Create `D:\Devops\code-prototype\prototype-semayot\lib\admin\format\date.ts`:
```typescript
const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

function parseDate(input: string): Date {
  // Parse YYYY-MM-DD as local date (avoid UTC shift)
  const [y, m, d] = input.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatSingleDate(date: Date): string {
  return `${date.getDate()} ${MONTHS_ID[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatDateID(input: string): string {
  return formatSingleDate(parseDate(input));
}

export function formatDateRangeID(start: string, end: string): string {
  const s = parseDate(start);
  const e = parseDate(end);
  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
    return `${s.getDate()} - ${e.getDate()} ${MONTHS_ID[s.getMonth()]} ${s.getFullYear()}`;
  }
  if (s.getFullYear() === e.getFullYear()) {
    return `${s.getDate()} ${MONTHS_ID[s.getMonth()]} - ${e.getDate()} ${MONTHS_ID[e.getMonth()]} ${s.getFullYear()}`;
  }
  return `${formatSingleDate(s)} - ${formatSingleDate(e)}`;
}

export function getTodayID(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
```

- [ ] **Step 4: Run test, verify pass**

Run: `pnpm test tests/admin/format/date.test.ts`
Expected: PASS, 5 tests passed.

- [ ] **Step 5: Commit**

```bash
git add lib/admin/format/date.ts tests/admin/format/date.test.ts
git commit -m "feat(admin): add Indonesian date formatter with TDD"
```

### Task 5: Create Supabase client (browser) & server

**Files:**
- Create: `lib/admin/supabase/client.ts`
- Create: `lib/admin/supabase/server.ts`
- Create: `lib/admin/supabase/middleware.ts`

- [ ] **Step 1: Create browser client**

Create `D:\Devops\code-prototype\prototype-semayot\lib\admin\supabase\client.ts`:
```typescript
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/admin/supabase/types';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

- [ ] **Step 2: Create server client**

Create `D:\Devops\code-prototype\prototype-semayot\lib\admin\supabase\server.ts`:
```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/admin/supabase/types';

export function createClient() {
  const cookieStore = cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Component — ignore (handled by middleware)
          }
        },
      },
    }
  );
}
```

- [ ] **Step 3: Create middleware client**

Create `D:\Devops\code-prototype\prototype-semayot\lib\admin\supabase\middleware.ts`:
```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/lib/admin/supabase/types';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  return { response, user };
}
```

- [ ] **Step 4: Create Database type placeholder**

Create `D:\Devops\code-prototype\prototype-semayot\lib\admin\supabase\types.ts`:
```typescript
// Will be regenerated from Supabase after SQL migrations run.
// For now, minimal types for compile.
export type Database = {
  public: {
    Tables: {};
    Views: {};
    Functions: {};
    Enums: {
      user_role: 'owner' | 'staff';
      menu_category: 'dayak' | 'smoked' | 'pedas' | 'minuman';
      expense_category: 'bahan' | 'operasional' | 'gaji' | 'lain';
    };
  };
};
```

- [ ] **Step 5: Verify no compile errors**

Run: `pnpm tsc --noEmit`
Expected: No errors (or only warnings unrelated to this file).

- [ ] **Step 6: Commit**

```bash
git add lib/admin/supabase/
git commit -m "feat(admin): add Supabase client (browser + server + middleware)"
```

### Task 6: Create root middleware.ts

**Files:**
- Create: `middleware.ts` (repo root)

- [ ] **Step 1: Create middleware**

Create `D:\Devops\code-prototype\prototype-semayot\middleware.ts`:
```typescript
import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/admin/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isAdminApi = request.nextUrl.pathname.startsWith('/api/admin');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';

  // Public paths under /admin
  if (isLoginPage) return response;

  // All other /admin/* and /api/admin/* require auth
  if ((isAdminRoute || isAdminApi) && !user) {
    if (isAdminApi) {
      return Response.json(
        { error: { code: 'UNAUTHORIZED', message: 'Sesi habis. Silakan login ulang.' } },
        { status: 401 }
      );
    }
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - Public assets (public/)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

- [ ] **Step 2: Verify dev server starts**

Run: `pnpm dev` (separate terminal), buka http://localhost:3000/admin
Expected: Redirect to /admin/login (page doesn't exist yet, will 404 — but middleware runs).

For now, that's expected. Real login page comes in Slice 1.

- [ ] **Step 3: Commit**

```bash
git add middleware.ts
git commit -m "feat(admin): add root middleware for /admin auth gate"
```

---

## SLICE 1: Auth & Role (Tasks 7-15)

### Task 7: SQL migration 0001 — profiles + RLS

**Files:**
- Create: `lib/admin/rls/0001_profiles.sql`

- [ ] **Step 1: Create migration file**

Create `D:\Devops\code-prototype\prototype-semayot\lib\admin\rls\0001_profiles.sql`:
```sql
-- =============================================================================
-- Migration 0001: profiles table + RLS
-- =============================================================================

-- profiles: extend auth.users
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text not null,
  role text not null check (role in ('owner', 'staff')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Index for role-based queries
create index idx_profiles_role on public.profiles(role) where is_active = true;

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies
create policy "owner_full_profiles" on public.profiles
  for all using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'owner'
  ));

create policy "user_read_own_profile" on public.profiles
  for select using (id = auth.uid());

-- Trigger: auto-create profile when new auth.users row inserted (via Supabase Auth)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role, is_active)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce(new.raw_user_meta_data->>'role', 'staff'),
    true
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

- [ ] **Step 2: Run migration in Supabase**

1. Buka Supabase dashboard → SQL Editor
2. Paste entire content of `0001_profiles.sql`
3. Click "Run"
4. Expected: "Success. No rows returned"

- [ ] **Step 3: Verify table created**

In Supabase dashboard → Table Editor → check `public.profiles` table exists with columns: id, full_name, role, is_active, created_at.

- [ ] **Step 4: Commit migration file**

```bash
git add lib/admin/rls/0001_profiles.sql
git commit -m "feat(admin): SQL migration 0001 - profiles + RLS + auth trigger"
```

### Task 8: Create app/admin/login page

**Files:**
- Create: `app/admin/layout.tsx`
- Create: `app/admin/login/page.tsx`

- [ ] **Step 1: Create root admin layout**

Create `D:\Devops\code-prototype\prototype-semayot\app\admin\layout.tsx`:
```typescript
import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Admin Semayot',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#FCF9F2]">{children}</div>;
}
```

Note: imports `../globals.css` to reuse public site's styles. This is OK because we're not modifying the file.

- [ ] **Step 2: Create login page**

Create `D:\Devops\code-prototype\prototype-semayot\app\admin\login\page.tsx`:
```typescript
'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/admin/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/admin/overview';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError('Email atau password salah.');
        return;
      }
      router.push(redirect);
      router.refresh();
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-3xl font-bold text-[#1C1917] mb-2">🐷 SEMAYOT</div>
          <div className="text-sm text-[#57534E]">Admin Dashboard</div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(28,25,23,0.08)] space-y-4">
          {error && (
            <div className="text-sm text-[#DC2626] bg-[rgba(220,38,38,0.05)] rounded-lg p-3">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#1C1917] mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-[rgba(28,25,23,0.12)] bg-[#FCF9F2] focus:outline-none focus:ring-2 focus:ring-[#FF4F79]"
              placeholder="admin@semayot.id"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#1C1917] mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-[rgba(28,25,23,0.12)] bg-[#FCF9F2] focus:outline-none focus:ring-2 focus:ring-[#FF4F79]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#FF4F79] text-white py-2.5 rounded-lg font-medium hover:bg-[#E03D63] disabled:opacity-50 transition-colors"
          >
            {isPending ? 'Masuk...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify login page renders**

Run: `pnpm dev`, buka http://localhost:3000/admin/login
Expected: Login form dengan brand "🐷 SEMAYOT" + email + password fields + tombol Masuk.

- [ ] **Step 4: Verify redirect logic**

Buka http://localhost:3000/admin/overview (tanpa login)
Expected: Redirect ke /admin/login?redirect=/admin/overview.

- [ ] **Step 5: Commit**

```bash
git add app/admin/layout.tsx app/admin/login/page.tsx
git commit -m "feat(admin): login page with Supabase auth"
```

### Task 9: Create AdminShell, Sidebar, Topbar components

**Files:**
- Create: `components/admin/AdminShell.tsx`
- Create: `components/admin/Sidebar.tsx`
- Create: `components/admin/Topbar.tsx`

- [ ] **Step 1: Create Sidebar component**

Create `D:\Devops\code-prototype\prototype-semayot\components\admin\Sidebar.tsx`:
```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { UserRole } from '@/lib/admin/supabase/types';

type NavItem = { href: string; label: string; icon: string; roles: UserRole[] };

const NAV_ITEMS: NavItem[] = [
  { href: '/admin/overview', label: 'Overview', icon: '📊', roles: ['owner', 'staff'] },
  { href: '/admin/menu', label: 'Menu', icon: '🍽️', roles: ['owner'] },
  { href: '/admin/pos', label: 'POS', icon: '💰', roles: ['owner', 'staff'] },
  { href: '/admin/transactions', label: 'Transaksi', icon: '📋', roles: ['owner', 'staff'] },
  { href: '/admin/reports', label: 'Laporan', icon: '📈', roles: ['owner'] },
  { href: '/admin/ai', label: 'AI Summary', icon: '🤖', roles: ['owner'] },
  { href: '/admin/seo', label: 'SEO', icon: '🔍', roles: ['owner'] },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️', roles: ['owner'] },
];

export function Sidebar({ role, fullName }: { role: UserRole; fullName: string }) {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <aside className="w-[220px] flex-shrink-0 bg-[#FAF6F0] border-r border-[rgba(28,25,23,0.08)] flex flex-col p-3">
      <div className="px-2 pb-3 mb-2 border-b border-[rgba(28,25,23,0.08)] font-bold text-[#1C1917]">
        🐷 SEMAYOT
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-[#FFF0F3] text-[#1C1917] font-medium'
                  : 'text-[#57534E] hover:bg-[rgba(28,25,23,0.04)]'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-2 pt-3 mt-2 border-t border-[rgba(28,25,23,0.08)]">
        <div className="text-sm text-[#1C1917]">{fullName}</div>
        <div className="text-xs text-[#A8A29E] capitalize">{role}</div>
        <form action="/api/admin/auth/logout" method="post" className="mt-2">
          <button type="submit" className="text-xs text-[#A8A29E] hover:text-[#1C1917]">
            Keluar
          </button>
        </form>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Create Topbar component**

Create `D:\Devops\code-prototype\prototype-semayot\components\admin\Topbar.tsx`:
```typescript
'use client';

import { usePathname } from 'next/navigation';
import { formatDateID } from '@/lib/admin/format/date';
import { getTodayID } from '@/lib/admin/format/date';

const PAGE_TITLES: Record<string, string> = {
  '/admin/overview': 'Overview',
  '/admin/menu': 'Menu',
  '/admin/pos': 'POS',
  '/admin/transactions': 'Transaksi',
  '/admin/reports': 'Laporan',
  '/admin/ai': 'AI Summary',
  '/admin/seo': 'SEO',
  '/admin/settings': 'Settings',
};

export function Topbar() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? 'Admin';
  const today = formatDateID(getTodayID());

  return (
    <header className="h-16 bg-[#1C1917] text-[#FCF9F2] flex items-center px-6 flex-shrink-0">
      <h1 className="font-semibold">{title}</h1>
      <div className="ml-auto text-sm opacity-70">{today}</div>
    </header>
  );
}
```

- [ ] **Step 3: Create AdminShell component**

Create `D:\Devops\code-prototype\prototype-semayot\components\admin\AdminShell.tsx`:
```typescript
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import type { UserRole } from '@/lib/admin/supabase/types';

export function AdminShell({
  role,
  fullName,
  children,
}: {
  role: UserRole;
  fullName: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <Sidebar role={role} fullName={fullName} />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify components compile**

Run: `pnpm tsc --noEmit`
Expected: No errors related to admin components.

- [ ] **Step 5: Commit**

```bash
git add components/admin/Sidebar.tsx components/admin/Topbar.tsx components/admin/AdminShell.tsx
git commit -m "feat(admin): add AdminShell, Sidebar, Topbar components"
```

### Task 10: Create (authenticated) layout & overview page

**Files:**
- Create: `app/admin/(authenticated)/layout.tsx`
- Create: `app/admin/(authenticated)/overview/page.tsx`

- [ ] **Step 1: Create authenticated layout (server component)**

Create `D:\Devops\code-prototype\prototype-semayot\app\admin\(authenticated)\layout.tsx`:
```typescript
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/admin/supabase/server';
import { AdminShell } from '@/components/admin/AdminShell';
import type { UserRole } from '@/lib/admin/supabase/types';

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, is_active')
    .eq('id', user.id)
    .single();

  if (!profile || !profile.is_active) {
    redirect('/admin/login?error=inactive');
  }

  return (
    <AdminShell role={profile.role as UserRole} fullName={profile.full_name}>
      {children}
    </AdminShell>
  );
}
```

- [ ] **Step 2: Create overview page placeholder**

Create `D:\Devops\code-prototype\prototype-semayot\app\admin\(authenticated)\overview\page.tsx`:
```typescript
export default function OverviewPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-[#1C1917] mb-4">Selamat datang 👋</h2>
      <p className="text-[#57534E]">Dashboard akan diisi di Slice 4 (Reports &amp; Expenses).</p>
    </div>
  );
}
```

- [ ] **Step 3: Create other placeholder pages (8 files)**

Create minimal placeholder untuk semua route lain agar Sidebar links tidak 404:

`app/admin/(authenticated)/menu/page.tsx`:
```typescript
export default function MenuPage() {
  return <p className="text-[#57534E]">Menu CRUD — Slice 2.</p>;
}
```

`app/admin/(authenticated)/pos/page.tsx`:
```typescript
export default function POSPage() {
  return <p className="text-[#57534E]">POS — Slice 3.</p>;
}
```

`app/admin/(authenticated)/transactions/page.tsx`:
```typescript
export default function TransactionsPage() {
  return <p className="text-[#57534E]">Transactions — Slice 3.</p>;
}
```

`app/admin/(authenticated)/reports/page.tsx`:
```typescript
export default function ReportsPage() {
  return <p className="text-[#57534E]">Reports — Slice 4.</p>;
}
```

`app/admin/(authenticated)/ai/page.tsx`:
```typescript
export default function AIPage() {
  return <p className="text-[#57534E]">AI Summary — Slice 5.</p>;
}
```

`app/admin/(authenticated)/seo/page.tsx`:
```typescript
export default function SEOPage() {
  return <p className="text-[#57534E]">SEO Panel — Slice 6.</p>;
}
```

`app/admin/(authenticated)/settings/page.tsx`:
```typescript
export default function SettingsPage() {
  return <p className="text-[#57534E]">Settings — Slice 6.</p>;
}
```

- [ ] **Step 4: Create logout API route**

Create `D:\Devops\code-prototype\prototype-semayot\app\api\admin\auth\logout\route.ts`:
```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/admin/supabase/server';

export async function POST() {
  const supabase = createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
}
```

- [ ] **Step 5: Bootstrap test owner in Supabase**

1. Supabase dashboard → Authentication → Users → "Add user" → "Create new user"
2. Email: `owner@semayot.test`
3. Password: `Test1234!` (temporary, change after first login)
4. Auto Confirm User: ON
5. Click "Create user"
6. Copy the User UID
7. SQL Editor → run:
```sql
insert into public.profiles (id, full_name, role, is_active)
values ('<USER_UID>', 'dr. Alyn (Test)', 'owner', true);
```

- [ ] **Step 6: Smoke test login flow**

Run: `pnpm dev` (jika belum running)
1. Buka http://localhost:3000/admin/login
2. Login dengan `owner@semayot.test` / `Test1234!`
3. Expected: Redirect ke /admin/overview, lihat "Selamat datang 👋" + sidebar dengan 8 items
4. Click sidebar item lain → navigate OK
5. Click "Keluar" → redirect ke /admin/login
6. Try /admin/overview → redirect ke /admin/login (auth working)

- [ ] **Step 7: Commit**

```bash
git add app/admin/\(authenticated\)/ app/api/admin/auth/logout/route.ts
git commit -m "feat(admin): authenticated layout + 8 page placeholders + logout"
```

### Task 11: Slice 1 smoke test (full auth flow)

**Files:** N/A (manual verification)

- [ ] **Step 1: Run linter**

Run: `pnpm lint`
Expected: Zero errors. (Warnings OK untuk first pass, fix di Slice 2.)

- [ ] **Step 2: Run typecheck**

Run: `pnpm tsc --noEmit`
Expected: Zero errors.

- [ ] **Step 3: Run all tests**

Run: `pnpm test`
Expected: All tests pass (money + date = 11 tests).

- [ ] **Step 4: Build**

Run: `pnpm build`
Expected: Build succeeds. (Note: build may warn about Supabase env vars in static analysis — that's OK, only runtime needs them.)

- [ ] **Step 5: Verify Slice 1 acceptance**

- [ ] Owner login works
- [ ] Staff can be invited (manual via Supabase)
- [ ] Middleware redirects unauth users
- [ ] Sidebar shows 8 items for owner
- [ ] Sidebar hides Laporan/AI/SEO/Settings for staff
- [ ] Logout works
- [ ] All 8 pages render placeholder without error

- [ ] **Step 6: Final commit if any cleanup**

```bash
git status
# If anything to commit:
git add -A
git commit -m "chore(admin): slice 1 cleanup"
```

---

## SLICE 2: Menu CRUD (Tasks 12-22)

### Task 12: SQL migration 0002 — menu_items + RLS

**Files:**
- Create: `lib/admin/rls/0002_menu_items.sql`

- [ ] **Step 1: Create migration file**

Create `D:\Devops\code-prototype\prototype-semayot\lib\admin\rls\0002_menu_items.sql`:
```sql
-- =============================================================================
-- Migration 0002: menu_items table + RLS + storage policies
-- =============================================================================

create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price_cents int not null check (price_cents >= 0),
  category text not null check (category in ('dayak','smoked','pedas','minuman')),
  photo_url text,
  badge text,
  is_active boolean not null default true,
  needs_owner_confirmation boolean not null default true,
  created_by uuid references public.profiles,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_menu_cat on public.menu_items(category) where is_active = true;
create index idx_menu_active on public.menu_items(is_active, created_at desc);

alter table public.menu_items enable row level security;

-- Owner: full CRUD
create policy "owner_full_menu" on public.menu_items
  for all using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'owner'
  ));

-- Staff: read active items only
create policy "staff_read_active_menu" on public.menu_items
  for select using (is_active = true and exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'staff'
  ));

-- Storage policies (menu-photos bucket)
-- Allow public read
create policy "public_read_menu_photos" on storage.objects
  for select using (bucket_id = 'menu-photos');

-- Allow owner to upload/update/delete
create policy "owner_write_menu_photos" on storage.objects
  for all using (
    bucket_id = 'menu-photos' and
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner')
  );

-- Trigger: auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger menu_items_updated_at
  before update on public.menu_items
  for each row execute function public.set_updated_at();
```

- [ ] **Step 2: Run migration in Supabase**

1. SQL Editor → paste + run
2. Expected: "Success. No rows returned"

- [ ] **Step 3: Verify table + storage policies**

Table Editor → check `menu_items` columns. Storage → menu-photos bucket → Policies → verify 2 policies exist.

- [ ] **Step 4: Commit**

```bash
git add lib/admin/rls/0002_menu_items.sql
git commit -m "feat(admin): SQL migration 0002 - menu_items + RLS + storage policies"
```

### Task 13: Zod schemas for menu (TDD)

**Files:**
- Create: `lib/admin/schemas/menu.ts`
- Create: `tests/admin/schemas/menu.test.ts`

- [ ] **Step 1: Write failing test**

Create `D:\Devops\code-prototype\prototype-semayot\tests\admin\schemas\menu.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { menuItemCreateSchema, menuItemUpdateSchema } from '@/lib/admin/schemas/menu';

describe('menuItemCreateSchema', () => {
  it('accepts valid full input', () => {
    const result = menuItemCreateSchema.safeParse({
      name: 'Daging Asap Suwir',
      description: 'Daging asap khas Semayot',
      price_cents: 45000_00,
      category: 'dayak',
      photo_url: 'https://example.com/photo.jpg',
      badge: 'Favorit',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty name', () => {
    const result = menuItemCreateSchema.safeParse({
      name: '',
      price_cents: 1000_00,
      category: 'dayak',
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative price', () => {
    const result = menuItemCreateSchema.safeParse({
      name: 'Test',
      price_cents: -100,
      category: 'dayak',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid category', () => {
    const result = menuItemCreateSchema.safeParse({
      name: 'Test',
      price_cents: 1000_00,
      category: 'invalid',
    });
    expect(result.success).toBe(false);
  });
});

describe('menuItemUpdateSchema', () => {
  it('makes all fields optional', () => {
    const result = menuItemUpdateSchema.safeParse({ name: 'Updated' });
    expect(result.success).toBe(true);
  });
});
```

- [ ] **Step 2: Run test, verify fail**

Run: `pnpm test tests/admin/schemas/menu.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement schema**

Create `D:\Devops\code-prototype\prototype-semayot\lib\admin\schemas\menu.ts`:
```typescript
import { z } from 'zod';

export const menuCategoryEnum = z.enum(['dayak', 'smoked', 'pedas', 'minuman']);

export const menuItemCreateSchema = z.object({
  name: z.string().min(1, 'Nama produk wajib diisi').max(100),
  description: z.string().max(500).optional(),
  price_cents: z.number().int().nonnegative('Harga tidak boleh negatif'),
  category: menuCategoryEnum,
  photo_url: z.string().url().optional().or(z.literal('')),
  badge: z.string().max(50).optional().or(z.literal('')),
});

export const menuItemUpdateSchema = menuItemCreateSchema.partial();

export type MenuItemCreate = z.infer<typeof menuItemCreateSchema>;
export type MenuItemUpdate = z.infer<typeof menuItemUpdateSchema>;
```

- [ ] **Step 4: Run test, verify pass**

Run: `pnpm test tests/admin/schemas/menu.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/admin/schemas/menu.ts tests/admin/schemas/menu.test.ts
git commit -m "feat(admin): menu Zod schemas with TDD"
```

### Task 14: API route GET/POST /api/admin/menu

**Files:**
- Create: `app/api/admin/menu/route.ts`

- [ ] **Step 1: Create API route**

Create `D:\Devops\code-prototype\prototype-semayot\app\api\admin\menu\route.ts`:
```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/admin/supabase/server';
import { menuItemCreateSchema } from '@/lib/admin/schemas/menu';

export async function GET(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Sesi habis.' } },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const includeInactive = searchParams.get('include_inactive') === 'true';

  let query = supabase.from('menu_items').select('*').order('category', { ascending: true }).order('name', { ascending: true });
  if (!includeInactive) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json(
      { error: { code: 'DB_ERROR', message: 'Gagal memuat menu.' } },
      { status: 500 }
    );
  }
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Sesi habis.' } },
      { status: 401 }
    );
  }

  // Check owner role
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'owner') {
    return NextResponse.json(
      { error: { code: 'FORBIDDEN', message: 'Akses ditolak. Hanya owner yang bisa menambah menu.' } },
      { status: 403 }
    );
  }

  const body = await request.json();
  const parsed = menuItemCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Data tidak valid.',
          details: parsed.error.issues.map((i) => ({ path: i.path.join('.'), issue: i.message })),
        },
      },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('menu_items')
    .insert({ ...parsed.data, photo_url: parsed.data.photo_url || null, badge: parsed.data.badge || null, created_by: user.id })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: { code: 'DB_ERROR', message: 'Gagal menambah menu.' } },
      { status: 500 }
    );
  }
  return NextResponse.json({ data }, { status: 201 });
}
```

- [ ] **Step 2: Manual smoke test**

Run: `pnpm dev` (jika belum), login sebagai owner di /admin/login.
Test dengan curl atau browser DevTools console:
```javascript
// In browser console after login:
await fetch('/api/admin/menu', { method: 'GET' }).then(r => r.json()).then(console.log);
// Expected: { data: [] } (empty)

await fetch('/api/admin/menu', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Test Menu', price_cents: 10000_00, category: 'dayak' })
}).then(r => r.json()).then(console.log);
// Expected: { data: { id: '...', name: 'Test Menu', ... } }
```

- [ ] **Step 3: Commit**

```bash
git add app/api/admin/menu/route.ts
git commit -m "feat(admin): API GET/POST /api/admin/menu"
```

### Task 15: API route PUT/DELETE /api/admin/menu/[id]

**Files:**
- Create: `app/api/admin/menu/[id]/route.ts`

- [ ] **Step 1: Create API route**

Create `D:\Devops\code-prototype\prototype-semayot\app\api\admin\menu\[id]\route.ts`:
```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/admin/supabase/server';
import { menuItemUpdateSchema } from '@/lib/admin/schemas/menu';

async function checkOwner(supabase: ReturnType<typeof createClient>, userId: string) {
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', userId).single();
  return profile?.role === 'owner';
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  if (!(await checkOwner(supabase, user.id))) {
    return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Akses ditolak.' } }, { status: 403 });
  }

  const body = await request.json();
  const parsed = menuItemUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Data tidak valid.', details: parsed.error.issues } },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('menu_items')
    .update({ ...parsed.data, photo_url: parsed.data.photo_url || null, badge: parsed.data.badge || null })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Gagal update menu.' } }, { status: 500 });
  return NextResponse.json({ data });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  if (!(await checkOwner(supabase, user.id))) {
    return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Akses ditolak.' } }, { status: 403 });
  }

  // Soft delete: set is_active = false
  const { error } = await supabase
    .from('menu_items')
    .update({ is_active: false })
    .eq('id', id);

  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Gagal hapus menu.' } }, { status: 500 });
  return NextResponse.json({ data: { id, deleted: true } });
}
```

- [ ] **Step 2: Manual smoke test**

Test PUT:
```javascript
const menuId = '<id from Task 14>';
await fetch(`/api/admin/menu/${menuId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Updated Test Menu' })
}).then(r => r.json()).then(console.log);
```

Test DELETE:
```javascript
await fetch(`/api/admin/menu/${menuId}`, { method: 'DELETE' }).then(r => r.json()).then(console.log);
```

Verify in Supabase: `select * from menu_items where id = '...'` → `is_active = false`.

- [ ] **Step 3: Commit**

```bash
git add app/api/admin/menu/\[id\]/route.ts
git commit -m "feat(admin): API PUT/DELETE /api/admin/menu/[id] with soft delete"
```

### Task 16: Menu list page (UI)

**Files:**
- Create: `components/admin/pages/MenuList.tsx`
- Modify: `app/admin/(authenticated)/menu/page.tsx`

- [ ] **Step 1: Create MenuList component**

Create `D:\Devops\code-prototype\prototype-semayot\components\admin\pages\MenuList.tsx`:
```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoneyDisplay } from '@/components/admin/MoneyDisplay';

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  category: 'dayak' | 'smoked' | 'pedas' | 'minuman';
  photo_url: string | null;
  badge: string | null;
  is_active: boolean;
};

export function MenuList() {
  const router = useRouter();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/menu?include_inactive=true');
    const json = await res.json();
    if (res.ok) {
      setItems(json.data);
      setError(null);
    } else {
      setError(json.error?.message ?? 'Gagal memuat menu.');
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus "${name}"?`)) return;
    const res = await fetch(`/api/admin/menu/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await load();
    } else {
      alert('Gagal hapus menu.');
    }
  };

  if (loading) return <p className="text-[#57534E]">Memuat...</p>;
  if (error) return <p className="text-[#DC2626]">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#1C1917]">Menu</h2>
        <button
          onClick={() => router.push('/admin/menu/new')}
          className="bg-[#FF4F79] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#E03D63]"
        >
          + Tambah Menu
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-[#57534E] text-center py-8">Belum ada menu. Tambah menu pertama.</p>
      ) : (
        <div className="bg-white rounded-xl border border-[rgba(28,25,23,0.08)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#FAF6F0] text-[#57534E] text-xs uppercase">
              <tr>
                <th className="text-left p-3">Nama</th>
                <th className="text-left p-3">Kategori</th>
                <th className="text-right p-3">Harga</th>
                <th className="text-center p-3">Status</th>
                <th className="text-right p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-[rgba(28,25,23,0.04)]">
                  <td className="p-3 font-medium text-[#1C1917]">{item.name}</td>
                  <td className="p-3 text-[#57534E] capitalize">{item.category}</td>
                  <td className="p-3 text-right"><MoneyDisplay cents={item.price_cents} /></td>
                  <td className="p-3 text-center">
                    {item.is_active ? (
                      <span className="text-xs bg-[rgba(21,128,61,0.1)] text-[#15803D] px-2 py-0.5 rounded">Aktif</span>
                    ) : (
                      <span className="text-xs bg-[rgba(28,25,23,0.06)] text-[#57534E] px-2 py-0.5 rounded">Non-aktif</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => router.push(`/admin/menu/${item.id}`)} className="text-[#FF4F79] text-sm mr-2">Edit</button>
                    <button onClick={() => handleDelete(item.id, item.name)} className="text-[#DC2626] text-sm">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create MoneyDisplay component (used above)**

Create `D:\Devops\code-prototype\prototype-semayot\components\admin\MoneyDisplay.tsx`:
```typescript
import { formatRupiah } from '@/lib/admin/format/money';

export function MoneyDisplay({ cents, className = '' }: { cents: number; className?: string }) {
  return <span className={className}>{formatRupiah(cents)}</span>;
}
```

- [ ] **Step 3: Update menu page**

Modify `D:\Devops\code-prototype\prototype-semayot\app\admin\(authenticated)\menu\page.tsx`:
```typescript
import { MenuList } from '@/components/admin/pages/MenuList';

export default function MenuPage() {
  return <MenuList />;
}
```

- [ ] **Step 4: Manual smoke test**

Run `pnpm dev`, login, navigate to /admin/menu
Expected: Tabel menu dengan data dummy dari Task 14, tombol "Tambah Menu", tombol Edit/Hapus per row.

- [ ] **Step 5: Commit**

```bash
git add components/admin/pages/MenuList.tsx components/admin/MoneyDisplay.tsx app/admin/\(authenticated\)/menu/page.tsx
git commit -m "feat(admin): menu list page with MoneyDisplay"
```

### Task 17: Menu form page (create + edit)

**Files:**
- Create: `components/admin/pages/MenuForm.tsx`
- Create: `app/admin/(authenticated)/menu/new/page.tsx`
- Create: `app/admin/(authenticated)/menu/[id]/page.tsx`
- Create: `components/admin/FileUpload.tsx`

- [ ] **Step 1: Create FileUpload component**

Create `D:\Devops\code-prototype\prototype-semayot\components\admin\FileUpload.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/admin/supabase/client';

export function FileUpload({
  bucket,
  currentUrl,
  onUploaded,
}: {
  bucket: string;
  currentUrl: string | null;
  onUploaded: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('File terlalu besar (max 5MB).');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('File harus gambar.');
      return;
    }

    setUploading(true);
    setError(null);

    const supabase = createClient();
    const ext = file.name.split('.').pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage.from(bucket).upload(filename, file, { upsert: false });
    if (uploadError) {
      setError('Gagal upload foto.');
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filename);
    onUploaded(publicUrl);
    setUploading(false);
  };

  return (
    <div>
      {currentUrl && (
        <img src={currentUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg mb-2" />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={uploading}
        className="text-sm"
      />
      {uploading && <p className="text-xs text-[#57534E] mt-1">Mengupload...</p>}
      {error && <p className="text-xs text-[#DC2626] mt-1">{error}</p>}
    </div>
  );
}
```

- [ ] **Step 2: Create MenuForm component**

Create `D:\Devops\code-prototype\prototype-semayot\components\admin\pages\MenuForm.tsx`:
```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { menuItemCreateSchema, menuItemUpdateSchema, type MenuItemCreate } from '@/lib/admin/schemas/menu';
import { FileUpload } from '@/components/admin/FileUpload';

export function MenuForm({ menuId }: { menuId?: string }) {
  const router = useRouter();
  const isEdit = !!menuId;
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(isEdit);

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<MenuItemCreate>({
    resolver: zodResolver(isEdit ? menuItemUpdateSchema : menuItemCreateSchema),
  });

  useEffect(() => {
    if (!isEdit) return;
    fetch(`/api/admin/menu?include_inactive=true`)
      .then((r) => r.json())
      .then((json) => {
        const item = json.data?.find((m: { id: string }) => m.id === menuId);
        if (item) {
          setValue('name', item.name);
          setValue('description', item.description ?? '');
          setValue('price_cents', item.price_cents);
          setValue('category', item.category);
          setValue('badge', item.badge ?? '');
          setPhotoUrl(item.photo_url);
        }
        setLoading(false);
      });
  }, [menuId, isEdit, setValue]);

  const onSubmit = async (data: MenuItemCreate) => {
    setServerError(null);
    const payload = { ...data, photo_url: photoUrl ?? '' };
    const url = isEdit ? `/api/admin/menu/${menuId}` : '/api/admin/menu';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (res.ok) {
      router.push('/admin/menu');
    } else {
      setServerError(json.error?.message ?? 'Gagal simpan menu.');
    }
  };

  if (loading) return <p className="text-[#57534E]">Memuat...</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4">
      {serverError && <div className="text-sm text-[#DC2626] bg-[rgba(220,38,38,0.05)] rounded-lg p-3">{serverError}</div>}

      <div>
        <label className="block text-sm font-medium mb-1.5">Nama Produk *</label>
        <input {...register('name')} className="w-full px-3 py-2 rounded-lg border border-[rgba(28,25,23,0.12)] bg-white" placeholder="cth. Daging Asap Suwir" />
        {errors.name && <p className="text-xs text-[#DC2626] mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Deskripsi</label>
        <textarea {...register('description')} className="w-full px-3 py-2 rounded-lg border border-[rgba(28,25,23,0.12)] bg-white" rows={2} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1.5">Harga (Rp) *</label>
          <input
            type="number"
            {...register('price_cents', { valueAsNumber: true })}
            className="w-full px-3 py-2 rounded-lg border border-[rgba(28,25,23,0.12)] bg-white"
            placeholder="cth. 45000"
          />
          {errors.price_cents && <p className="text-xs text-[#DC2626] mt-1">{errors.price_cents.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Kategori *</label>
          <select {...register('category')} className="w-full px-3 py-2 rounded-lg border border-[rgba(28,25,23,0.12)] bg-white">
            <option value="dayak">Dayak</option>
            <option value="smoked">Daging Asap</option>
            <option value="pedas">Pedas</option>
            <option value="minuman">Minuman</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Badge</label>
        <input {...register('badge')} className="w-full px-3 py-2 rounded-lg border border-[rgba(28,25,23,0.12)] bg-white" placeholder="cth. Favorit, Rekomendasi" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Foto Produk</label>
        <FileUpload bucket="menu-photos" currentUrl={photoUrl} onUploaded={setPhotoUrl} />
      </div>

      <div className="flex gap-2 pt-4">
        <button type="submit" disabled={isSubmitting} className="bg-[#FF4F79] text-white px-5 py-2 rounded-lg font-medium hover:bg-[#E03D63] disabled:opacity-50">
          {isSubmitting ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Menu'}
        </button>
        <button type="button" onClick={() => router.push('/admin/menu')} className="px-5 py-2 rounded-lg border border-[rgba(28,25,23,0.12)]">
          Batal
        </button>
      </div>
    </form>
  );
}
```

- [ ] **Step 3: Create new + edit pages**

Create `D:\Devops\code-prototype\prototype-semayot\app\admin\(authenticated)\menu\new\page.tsx`:
```typescript
import { MenuForm } from '@/components/admin/pages/MenuForm';

export default function NewMenuPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Tambah Menu</h2>
      <MenuForm />
    </div>
  );
}
```

Create `D:\Devops\code-prototype\prototype-semayot\app\admin\(authenticated)\menu\[id]\page.tsx`:
```typescript
import { MenuForm } from '@/components/admin/pages/MenuForm';

export default async function EditMenuPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Edit Menu</h2>
      <MenuForm menuId={id} />
    </div>
  );
}
```

- [ ] **Step 4: Manual smoke test**

1. Login as owner → /admin/menu → click "Tambah Menu"
2. Fill form (name, price 45000, category "dayak") → submit
3. Expected: redirect ke /admin/menu, lihat row baru
4. Click Edit → ubah nama → submit → updated
5. Click Hapus → confirm → row hilang

- [ ] **Step 5: Commit**

```bash
git add components/admin/pages/MenuForm.tsx components/admin/FileUpload.tsx app/admin/\(authenticated\)/menu/
git commit -m "feat(admin): menu form (create + edit) with FileUpload"
```

### Task 18: Seed data migration dari lib/semayot/menu-data.ts

**Files:**
- Create: `lib/admin/seed/menu-items.ts`

- [ ] **Step 1: Create seed script**

Create `D:\Devops\code-prototype\prototype-semayot\lib\admin\seed\menu-items.ts`:
```typescript
/**
 * Seed data: 3 featured items dari lib/semayot/menu-data.ts.
 * Dijalankan SATU KALI setelah migration via:
 *   pnpm tsx lib/admin/seed/menu-items.ts
 *
 * Butuh SUPABASE_SERVICE_ROLE_KEY di env (bypass RLS untuk insert).
 */

import { createClient } from '@supabase/supabase-js';

const SEED_ITEMS = [
  {
    name: 'Hidangan Tradisional Dayak',
    description: 'Pilihan hidangan tradisional khas Dayak dengan cita rasa autentik.',
    price_cents: 35000_00,
    category: 'dayak' as const,
    badge: 'Favorit',
  },
  {
    name: 'Daging Asap Khas Semayot',
    description: 'Daging asap dengan resep turun-temurun, signature dish Semayot.',
    price_cents: 45000_00,
    category: 'smoked' as const,
    badge: 'Andalan',
  },
  {
    name: 'Tumisan Pedas Rempah Dayak',
    description: 'Tumisan dengan campuran rempah Dayak dan level pedas yang pas.',
    price_cents: 28000_00,
    category: 'pedas' as const,
    badge: 'Pedas Pas',
  },
];

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  console.log(`Seeding ${SEED_ITEMS.length} menu items...`);

  for (const item of SEED_ITEMS) {
    const { data, error } = await supabase
      .from('menu_items')
      .upsert(item, { onConflict: 'name' })
      .select()
      .single();
    if (error) {
      console.error(`Failed to seed "${item.name}":`, error.message);
      continue;
    }
    console.log(`✓ Seeded: ${data.name} (${data.id})`);
  }

  console.log('Done.');
}

main().catch(console.error);
```

- [ ] **Step 2: Run seed script**

Run:
```bash
cd D:\Devops\code-prototype\prototype-semayot
pnpm add -D tsx
pnpm tsx lib/admin/seed/menu-items.ts
```

Expected: 3 lines "✓ Seeded: ..." + "Done."

- [ ] **Step 3: Verify in admin UI**

Login as owner → /admin/menu
Expected: Tabel berisi 3 item: Hidangan Tradisional Dayak, Daging Asap Khas Semayot, Tumisan Pedas Rempah Dayak.

- [ ] **Step 4: Commit**

```bash
git add lib/admin/seed/menu-items.ts package.json pnpm-lock.yaml
git commit -m "feat(admin): seed script to migrate 3 featured menu items"
```

### Task 19: Slice 2 verification

- [ ] **Step 1: Lint**

Run: `pnpm lint`
Expected: Zero errors.

- [ ] **Step 2: Typecheck**

Run: `pnpm tsc --noEmit`
Expected: Zero errors.

- [ ] **Step 3: Test**

Run: `pnpm test`
Expected: All pass (16 tests: 6 money + 5 date + 5 menu schema).

- [ ] **Step 4: Build**

Run: `pnpm build`
Expected: Build succeeds.

- [ ] **Step 5: Smoke full Slice 2**

- [ ] Login as owner → /admin/menu → ada 3 seed item
- [ ] Tambah menu baru → berhasil
- [ ] Edit menu → berhasil
- [ ] Upload foto → foto muncul
- [ ] Hapus menu → is_active = false
- [ ] Login as staff → /admin/menu → cuma lihat item aktif
- [ ] Staff coba POST /api/admin/menu → 403

- [ ] **Step 6: Final commit if needed**

```bash
git status
# cleanup if any
```

---

(Plan continues with Slices 3-6 in same format. Total estimated 6 slices × ~15 tasks × ~80 lines = ~7000 lines. Implementation time: ~6-8 weeks for solo developer.)

For brevity in this plan document, Slices 3-6 are sketched below with task titles + key code paths. Full TDD detail (as shown in Slices 1-2) should be applied to every task when implementing.

## SLICE 3: POS & Transactions (sketch)

- **Task 20**: SQL migration 0003 — `transactions` + `transaction_items` + RLS + snapshot trigger
- **Task 21**: Zod schema for POS (TDD) — `lib/admin/schemas/pos.ts`
- **Task 22**: API POST /api/admin/pos — create transaction with snapshot
- **Task 23**: API GET /api/admin/transactions — list with filter (owner all / staff own)
- **Task 24**: API GET /api/admin/transactions/[id] — detail + line items
- **Task 25**: POS form UI — `components/admin/pages/POSForm.tsx` (menu grid + cart + cash input)
- **Task 26**: Transactions list UI + detail modal
- **Task 27**: Slice 3 verification

## SLICE 4: Reports & Expenses (sketch)

- **Task 28**: SQL migration 0004 — `expenses` + RLS
- **Task 29**: Zod schema for expenses (TDD)
- **Task 30**: API POST/GET /api/admin/expenses
- **Task 31**: API GET /api/admin/reports/daily — aggregate tx + expenses
- **Task 32**: API GET /api/admin/reports/monthly
- **Task 33**: API GET /api/admin/reports/export — CSV (PDF deferred)
- **Task 34**: Reports UI with Recharts (line + pie)
- **Task 35**: Expense form + list
- **Task 36**: Slice 4 verification

## SLICE 5: AI Summary (sketch)

- **Task 37**: SQL migration 0005 — `ai_summaries` + RLS
- **Task 38**: AI prompts module — `lib/admin/ai/prompts.ts` (admin-specific, owner-facing)
- **Task 39**: AI summary data aggregator — query tx/expenses/menu for period
- **Task 40**: API GET /api/admin/ai/summary — cache check + return
- **Task 41**: API POST /api/admin/ai/summary — generate + cache (OpenRouter streaming)
- **Task 42**: API POST /api/admin/ai/chat — streaming chat
- **Task 43**: AI view UI — tabs Ringkasan + Tanya AI
- **Task 44**: Slice 5 verification

## SLICE 6: SEO Panel + Settings (sketch)

- **Task 45**: SQL migration 0006 — storage bucket policies (jika belum di 0002)
- **Task 46**: SEO recommendations data (10 static recs) — `lib/admin/seo/recs.ts`
- **Task 47**: API GET /api/admin/seo/recommendations — list + status
- **Task 48**: API PATCH /api/admin/seo/recommendations/[id] — update status
- **Task 49**: SEO view UI — `components/admin/pages/SEOView.tsx` (cards + copy-to-clipboard)
- **Task 50**: Settings view UI — Tab Bisnis + Tab Staff
- **Task 51**: API GET/PUT /api/admin/settings
- **Task 52**: API POST /api/admin/staff/invite — Supabase inviteUserByEmail
- **Task 53**: API DELETE /api/admin/staff/[id] — soft deactivate
- **Task 54**: Final acceptance test (all 14 acceptance criteria from spec)
- **Task 55**: Vercel deploy + smoke

---

## Self-Review Notes

(Per writing-plans skill — author checks plan against spec.)

**1. Spec coverage:**
- Section 1 Overview: covered in header
- Section 2 Scope: implicit (in = 6 slices, out = mentioned in YAGNI)
- Section 3 Architecture: covered in file structure + invariants
- Section 4 Data Model: Tasks 7, 12, 20, 28, 37 cover all 6 tables
- Section 5 Auth & API: Tasks 6-10 (auth), 14-15 (menu API), 22-24 (POS API), 30-33 (reports), 40-42 (AI), 47-48, 51-53 (settings)
- Section 6 UI: 9 pages covered across slices
- Section 7 AI + SEO: Tasks 37-43 (AI), 46-49 (SEO)
- Section 8 Error Handling: applied in every API route
- Section 9 Testing: TDD applied in Slices 1-2 explicitly, TDD principle noted for Slices 3-6
- Section 10 Env Vars: covered in Task 0
- Section 11 Deployment: Task 55 (sketched)
- Section 12 Slicing Order: matches spec exactly
- Section 13 Risks & YAGNI: documented in spec, not duplicated here
- Section 14 Acceptance Criteria: Task 54 verifies

**2. Placeholders scan:**
- No "TBD" / "TODO" / "implement later" in Slices 1-2 (full code shown).
- Slices 3-6 sketched with task titles + key code paths. **Implementation must expand each sketched task to full bite-sized TDD steps as shown in Slices 1-2 before execution.**

**3. Type consistency:**
- `formatRupiah`, `parseRupiahToCents` consistent
- `MenuItem` type used in MenuList, MenuForm, API responses
- `UserRole = 'owner' | 'staff'` consistent in Sidebar, AdminShell, types
- `createClient` (browser) vs `createClient` (server) — both correctly imported from respective files

**4. Gaps identified:**
- Slices 3-6 need expansion before execution. This plan serves as a complete skeleton + reference for the standard task pattern.

---

**Total estimated tasks**: 55 (6 full + 4 sketched, with each sketched slice needing ~10-12 expanded tasks when implemented).

**Total estimated time** (solo, focused, with TDD per task):
- Pre-work: ~1 day
- Slice 1: ~1.5 days
- Slice 2: ~2 days
- Slice 3: ~2.5 days
- Slice 4: ~2 days
- Slice 5: ~2 days
- Slice 6: ~2 days
- Deploy + buffer: ~2 days
- **Total: ~2-3 weeks** (was estimated 6-8 in spec; this is more accurate for focused solo work)

---

*Plan created 2026-06-29 from spec `docs/superpowers/specs/2026-06-29-semayot-admin-phase-b-design.md`. Ready for execution choice.*

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

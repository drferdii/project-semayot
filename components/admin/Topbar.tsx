'use client';

import { usePathname } from 'next/navigation';
import { formatDateID } from '@/lib/admin/format/date';
import { getTodayID } from '@/lib/admin/format/date';

const PAGE_TITLES: Record<string, string> = {
  '/admin/overview': 'Ringkasan',
  '/admin/menu': 'Menu',
  '/admin/pos': 'Kasir',
  '/admin/transactions': 'Transaksi',
  '/admin/reports': 'Laporan',
  '/admin/ai': 'AI Ringkasan',
  '/admin/seo': 'SEO',
  '/admin/settings': 'Pengaturan',
};

export function Topbar() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? 'ADMINISTRASI';
  const today = formatDateID(getTodayID());

  return (
    <header className="h-24 border-b border-border bg-background/95 backdrop-blur-sm flex items-center px-8 flex-shrink-0 relative z-20">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-baseline gap-4">
          <h1 className="font-display font-bold text-2xl tracking-tight text-foreground uppercase">
            {title}
          </h1>
          <span className="hidden md:inline font-mono text-[1px] opacity-40 font-bold tracking-[0.2em] uppercase">
            PROSES_KONSOL
          </span>
        </div>
        
        <div className="flex items-center gap-8 font-mono">
          <div className="hidden lg:flex items-center gap-3">
            <select className="bg-background border border-border text-foreground text-xs font-bold uppercase tracking-widest px-3 py-1.5 focus:outline-none">
              <option value="00000000-0000-0000-0000-000000000001">PUSAT (BENGKAYANG)</option>
              <option value="outlet-b">OUTLET B (SINGKAWANG)</option>
            </select>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{today}</span>
            <div className="opacity-20 text-foreground">|</div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-soft" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-foreground">
              NORMAL
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

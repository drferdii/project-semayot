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

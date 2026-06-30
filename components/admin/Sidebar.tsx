'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { UserRole } from '@/lib/admin/supabase/types';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Calculator, 
  Receipt, 
  TrendingUp, 
  Bot, 
  Globe, 
  Settings,
  LogOut
} from 'lucide-react';

type NavItem = { 
  href: string; 
  label: string; 
  icon: React.ComponentType<{ className?: string }>; 
  roles: UserRole[] 
};

const NAV_ITEMS: NavItem[] = [
  { href: '/admin/overview', label: 'Ringkasan', icon: LayoutDashboard, roles: ['owner', 'staff'] },
  { href: '/admin/menu', label: 'Menu', icon: UtensilsCrossed, roles: ['owner'] },
  { href: '/admin/pos', label: 'Kasir', icon: Calculator, roles: ['owner', 'staff'] },
  { href: '/admin/transactions', label: 'Transaksi', icon: Receipt, roles: ['owner', 'staff'] },
  { href: '/admin/reports', label: 'Laporan', icon: TrendingUp, roles: ['owner'] },
  { href: '/admin/ai', label: 'AI Ringkasan', icon: Bot, roles: ['owner'] },
  { href: '/admin/seo', label: 'SEO', icon: Globe, roles: ['owner'] },
  { href: '/admin/settings', label: 'Pengaturan', icon: Settings, roles: ['owner'] },
];

export function Sidebar({ role, fullName }: { role: UserRole; fullName: string }) {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <aside className="w-[240px] flex-shrink-0 bg-[#1C1917] text-[#FAF6F0] flex flex-col p-5 relative z-20 shadow-xl border-r border-[#1C1917]/20 select-none">
      {/* Brand Header */}
      <div className="pb-6 mb-6 border-b border-[#FAF6F0]/10">
        <Link href="/admin/overview" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-[#FFC2D6] flex items-center justify-center text-sm shadow-md group-hover:scale-110 transition-transform duration-300">
            🐷
          </div>
          <span className="font-display font-bold text-lg tracking-widest text-[#FAF6F0]">
            SEMAYOT
          </span>
        </Link>
        <span className="font-mono text-[8px] font-bold tracking-[0.2em] text-[#FF4F79] block mt-2 uppercase">
          KONSOL MANAJEMEN INTI
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1.5 flex-1">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative pl-10 pr-3 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-3 border ${
                isActive
                  ? 'bg-[#FCF9F2] text-[#1C1917] border-[#FCF9F2]'
                  : 'text-[#A8A29E] hover:text-[#FAF6F0] hover:bg-[#FAF6F0]/5 border-transparent'
              }`}
            >
              {/* Active Indicator Line */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-[4px] bg-[#FF4F79] transition-transform duration-300 origin-bottom ${
                  isActive ? 'scale-y-100' : 'scale-y-0'
                }`}
              />
              
              <Icon className={`w-4 h-4 flex-shrink-0 transition-colors duration-300 ${
                isActive ? 'text-[#FF4F79]' : 'text-[#A8A29E] group-hover:text-[#FAF6F0]'
              }`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Session Footer */}
      <div className="pt-6 mt-6 border-t border-[#FAF6F0]/10 font-mono">
        <div className="text-[11px] font-bold text-[#FAF6F0] truncate tracking-wide">
          {fullName.toUpperCase()}
        </div>
        <div className="text-[8px] text-[#FF4F79] tracking-[0.15em] uppercase font-black mt-0.5">
          {role === 'owner' ? 'OWNER / DIREKTUR' : 'STAFF OPERASIONAL'}
        </div>
        
        <form action="/api/admin/auth/logout" method="post" className="mt-5">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 border border-[#FAF6F0]/20 hover:border-[#FF4F79] bg-transparent font-mono text-[9px] font-bold py-2.5 uppercase tracking-widest text-[#FAF6F0] hover:bg-[#FF4F79] hover:text-[#FAF6F0] transition-all duration-300 shadow-sm cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>LOG OUT</span>
          </button>
        </form>
      </div>
    </aside>
  );
}

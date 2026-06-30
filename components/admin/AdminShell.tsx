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
    <div className="min-h-screen flex bg-background text-foreground relative overflow-hidden">
      <div className="grid-overlay" />
      <Sidebar role={role} fullName={fullName} />
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Topbar />
        <main className="flex-1 p-8 overflow-y-auto w-full flex flex-col items-center">
          <div className="w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
      
      {/* Teks Vertikal Raksasa di Kanan (Branding Shadow Kanan) */}
      <div className="fixed right-6 top-28 bottom-12 pointer-events-none flex flex-col justify-start items-center opacity-[0.03] select-none z-0 branding-global">
        <div className="font-display text-[18px] font-black uppercase flex flex-col items-center gap-2.5 leading-none">
          {"SEMAYOT PROTOKOL".split("").map((char, i) => (
            <span key={i} className="block leading-none">{char === " " ? "\u00A0" : char}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

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

'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/admin/PageHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { VerticalBranding } from '@/components/admin/VerticalBranding';
import { UserPlus, ShieldAlert, Clock } from 'lucide-react';

type StaffShift = {
  id: string;
  name: string;
  role: string;
  shift: string;
  sales: number;
  voids: number;
  status: 'ONLINE' | 'OFFLINE' | 'SUSPICIOUS';
};

const DUMMY_STAFF: StaffShift[] = [
  { id: 'STF-01', name: 'Josep', role: 'KASIR', shift: 'Pagi (08:00 - 16:00)', sales: 3200000, voids: 0, status: 'ONLINE' },
  { id: 'STF-02', name: 'Novia', role: 'KASIR', shift: 'Malam (16:00 - 22:00)', sales: 4100000, voids: 3, status: 'SUSPICIOUS' },
  { id: 'STF-03', name: 'Bapak Ahong', role: 'DAPUR UTAMA', shift: 'Pagi (07:00 - 15:00)', sales: 0, voids: 0, status: 'OFFLINE' },
  { id: 'STF-04', name: 'Dina', role: 'PELAYAN', shift: 'Malam (15:00 - 22:30)', sales: 0, voids: 0, status: 'ONLINE' },
];

export function StaffView() {
  const [staff] = useState<StaffShift[]>(DUMMY_STAFF);

  return (
    <div className="relative min-h-[80vh] flex flex-col page-staff animate-fade-in">
      <PageHeader
        label="MANAJEMEN KARYAWAN & SHIFT"
        title="Staf & Keamanan"
        action={
          <>
            <button className="flex items-center gap-2 border border-border bg-background px-4 py-2 font-mono text-sm font-bold uppercase tracking-widest hover:bg-muted/10 transition-colors">
              <Clock className="w-4 h-4" /> LOG AKTIVITAS
            </button>
            <button className="flex items-center gap-2 border border-[#1C1917] bg-[#1C1917] text-white px-4 py-2 font-mono text-sm font-bold uppercase tracking-widest hover:bg-transparent hover:text-foreground transition-all duration-300">
              <UserPlus className="w-4 h-4" /> TAMBAH STAF
            </button>
          </>
        }
      />

      <div className="mt-8 flex-1 border border-border bg-card p-1 relative z-10 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="py-4 px-6 font-mono text-sm uppercase tracking-widest text-muted-foreground font-bold">ID Staf</th>
                <th className="py-4 px-6 font-mono text-sm uppercase tracking-widest text-muted-foreground font-bold">Nama / Role</th>
                <th className="py-4 px-6 font-mono text-sm uppercase tracking-widest text-muted-foreground font-bold">Jadwal Shift</th>
                <th className="py-4 px-6 font-mono text-sm uppercase tracking-widest text-muted-foreground font-bold text-right">Penjualan (Kasir)</th>
                <th className="py-4 px-6 font-mono text-sm uppercase tracking-widest text-muted-foreground font-bold text-center">Batal/Void</th>
                <th className="py-4 px-6 font-mono text-sm uppercase tracking-widest text-muted-foreground font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id} className={`border-b border-border/50 group hover:bg-background/50 transition-colors ${s.status === 'SUSPICIOUS' ? 'bg-red-500/5' : ''}`}>
                  <td className="py-4 px-6 font-mono text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                    {s.id}
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-display font-bold text-sm text-foreground uppercase tracking-wider">
                      {s.name}
                    </div>
                    <div className="font-mono text-sm text-muted-foreground font-bold uppercase tracking-wider mt-1">
                      {s.role}
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-sm font-bold text-foreground tracking-wider">
                    {s.shift}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="font-mono text-sm font-bold text-foreground">
                      {s.sales > 0 ? `Rp ${s.sales.toLocaleString('id-ID')}` : '-'}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {s.voids > 0 ? (
                      <div className="inline-flex items-center gap-1.5 font-mono text-sm font-bold text-red-600 border border-red-600/30 bg-red-600/10 px-2 py-0.5 uppercase">
                        <ShieldAlert className="w-3 h-3" />
                        {s.voids} KALI
                      </div>
                    ) : (
                      <span className="font-mono text-sm font-bold text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <StatusBadge 
                      variant={s.status === 'ONLINE' ? 'success' : s.status === 'SUSPICIOUS' ? 'danger' : 'neutral'} 
                    >
                      {s.status}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <VerticalBranding text="SEMAYOT // STAF" className="absolute -right-12 top-0 bottom-0 pointer-events-none" />
    </div>
  );
}

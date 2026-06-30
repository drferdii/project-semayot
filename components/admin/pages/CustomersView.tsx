'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/admin/PageHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { VerticalBranding } from '@/components/admin/VerticalBranding';
import { UserPlus, Download, MessageCircle } from 'lucide-react';

type Customer = {
  id: string;
  name: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  loyaltyTier: 'GOLD' | 'SILVER' | 'BRONZE';
};

const DUMMY_CUSTOMERS: Customer[] = [
  { id: 'CUST-821', name: 'Bapak Budi Santoso', phone: '0812-3456-XXXX', totalOrders: 42, totalSpent: 2850000, lastOrder: '2 hari lalu', loyaltyTier: 'GOLD' },
  { id: 'CUST-822', name: 'Ibu Ratna', phone: '0811-9876-XXXX', totalOrders: 15, totalSpent: 980000, lastOrder: '1 minggu lalu', loyaltyTier: 'SILVER' },
  { id: 'CUST-823', name: 'Ko Aseng', phone: '0852-1111-XXXX', totalOrders: 89, totalSpent: 6200000, lastOrder: 'Hari ini', loyaltyTier: 'GOLD' },
  { id: 'CUST-824', name: 'Chandra', phone: '0813-2222-XXXX', totalOrders: 3, totalSpent: 150000, lastOrder: '1 bulan lalu', loyaltyTier: 'BRONZE' },
  { id: 'CUST-825', name: 'Ibu Sisca', phone: '0878-9999-XXXX', totalOrders: 24, totalSpent: 1450000, lastOrder: '3 hari lalu', loyaltyTier: 'SILVER' },
];

export function CustomersView() {
  const [customers] = useState<Customer[]>(DUMMY_CUSTOMERS);

  return (
    <div className="relative min-h-[80vh] flex flex-col page-customers animate-fade-in">
      <PageHeader
        label="CRM & PROGRAM LOYALITAS"
        title="Pelanggan"
        action={
          <>
            <button className="flex items-center gap-2 border border-border bg-background px-4 py-2 font-mono text-sm font-bold uppercase tracking-widest hover:bg-muted/10 transition-colors">
              <Download className="w-4 h-4" /> EKSPOR DATA
            </button>
            <button className="flex items-center gap-2 border border-[#1C1917] bg-[#1C1917] text-white px-4 py-2 font-mono text-sm font-bold uppercase tracking-widest hover:bg-transparent hover:text-foreground transition-all duration-300">
              <UserPlus className="w-4 h-4" /> MEMBER BARU
            </button>
          </>
        }
      />

      <div className="mt-8 flex-1 border border-border bg-card p-1 relative z-10 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="py-4 px-6 font-mono text-sm uppercase tracking-widest text-muted-foreground font-bold">ID Member</th>
                <th className="py-4 px-6 font-mono text-sm uppercase tracking-widest text-muted-foreground font-bold">Nama Pelanggan</th>
                <th className="py-4 px-6 font-mono text-sm uppercase tracking-widest text-muted-foreground font-bold">Kontak</th>
                <th className="py-4 px-6 font-mono text-sm uppercase tracking-widest text-muted-foreground font-bold text-center">Total Pesanan</th>
                <th className="py-4 px-6 font-mono text-sm uppercase tracking-widest text-muted-foreground font-bold text-right">Total Belanja</th>
                <th className="py-4 px-6 font-mono text-sm uppercase tracking-widest text-muted-foreground font-bold">Tier</th>
                <th className="py-4 px-6 font-mono text-sm uppercase tracking-widest text-muted-foreground font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cust) => (
                <tr key={cust.id} className="border-b border-border/50 group hover:bg-background/50 transition-colors">
                  <td className="py-4 px-6 font-mono text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                    {cust.id}
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-display font-bold text-sm text-foreground uppercase tracking-wider">
                      {cust.name}
                    </div>
                    <div className="font-mono text-sm text-muted-foreground font-bold uppercase tracking-wider mt-1">
                      Terakhir: {cust.lastOrder}
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-sm font-bold text-foreground tracking-wider">
                    {cust.phone}
                  </td>
                  <td className="py-4 px-6 text-center font-mono text-sm font-bold text-foreground">
                    {cust.totalOrders}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="font-mono text-sm font-bold text-foreground">
                      Rp {cust.totalSpent.toLocaleString('id-ID')}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge 
                      variant={cust.loyaltyTier === 'GOLD' ? 'success' : cust.loyaltyTier === 'SILVER' ? 'warning' : 'neutral'} 
                    >
                      {cust.loyaltyTier}
                    </StatusBadge>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button className="font-mono text-sm font-bold px-3 py-1.5 border border-border hover:bg-emerald-600 hover:border-emerald-600 hover:text-white uppercase tracking-widest transition-colors cursor-pointer flex items-center justify-center gap-1.5 mx-auto">
                      <MessageCircle className="w-3 h-3" />
                      PROMO WA
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <VerticalBranding text="SEMAYOT // PELANGGAN" className="absolute -right-12 top-0 bottom-0 pointer-events-none" />
    </div>
  );
}

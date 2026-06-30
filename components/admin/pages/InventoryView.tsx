'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/admin/PageHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { VerticalBranding } from '@/components/admin/VerticalBranding';
import { PackagePlus, RefreshCw, Filter } from 'lucide-react';

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  status: 'AMAN' | 'KRITIS' | 'HABIS';
};

const DUMMY_INVENTORY: InventoryItem[] = [
  { id: 'INV-001', name: 'Daging Babi Segar (Karkas)', category: 'Bahan Baku Utama', stock: 125.5, unit: 'Kg', status: 'AMAN' },
  { id: 'INV-002', name: 'Bumbu Rica-Rica Dasar', category: 'Bumbu', stock: 12.0, unit: 'Kg', status: 'KRITIS' },
  { id: 'INV-003', name: 'Beras Premium', category: 'Bahan Pendukung', stock: 250, unit: 'Kg', status: 'AMAN' },
  { id: 'INV-004', name: 'Kotak Takeaway (Besar)', category: 'Kemasan', stock: 50, unit: 'Pcs', status: 'KRITIS' },
  { id: 'INV-005', name: 'Plastik Vacuum', category: 'Kemasan', stock: 0, unit: 'Roll', status: 'HABIS' },
  { id: 'INV-006', name: 'Daun Singkong', category: 'Sayuran', stock: 15, unit: 'Ikat', status: 'AMAN' },
  { id: 'INV-007', name: 'Arang Kayu Kopi', category: 'Bahan Bakar', stock: 45, unit: 'Karung', status: 'AMAN' },
];

export function InventoryView() {
  const [items] = useState<InventoryItem[]>(DUMMY_INVENTORY);

  return (
    <div className="relative min-h-[80vh] flex flex-col page-inventory animate-fade-in">
      <PageHeader
        label="MANAJEMEN BAHAN BAKU & HPP"
        title="Inventaris"
        action={
          <>
            <button className="flex items-center gap-2 border border-border bg-background px-4 py-2 font-mono text-sm font-bold uppercase tracking-widest hover:bg-muted/10 transition-colors">
              <Filter className="w-4 h-4" /> FILTER
            </button>
            <button className="flex items-center gap-2 border border-border bg-background px-4 py-2 font-mono text-sm font-bold uppercase tracking-widest hover:bg-muted/10 transition-colors">
              <RefreshCw className="w-4 h-4" /> SINKRONISASI STOK
            </button>
            <button className="flex items-center gap-2 border border-[#1C1917] bg-[#1C1917] text-white px-4 py-2 font-mono text-sm font-bold uppercase tracking-widest hover:bg-transparent hover:text-foreground transition-all duration-300">
              <PackagePlus className="w-4 h-4" /> TAMBAH ITEM
            </button>
          </>
        }
      />

      <div className="mt-8 flex-1 border border-border bg-card p-1 relative z-10 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="py-4 px-6 font-mono text-sm uppercase tracking-widest text-muted-foreground font-bold">ID Item</th>
                <th className="py-4 px-6 font-mono text-sm uppercase tracking-widest text-muted-foreground font-bold">Nama Item</th>
                <th className="py-4 px-6 font-mono text-sm uppercase tracking-widest text-muted-foreground font-bold">Kategori</th>
                <th className="py-4 px-6 font-mono text-sm uppercase tracking-widest text-muted-foreground font-bold text-right">Stok Aktual</th>
                <th className="py-4 px-6 font-mono text-sm uppercase tracking-widest text-muted-foreground font-bold text-right">Status</th>
                <th className="py-4 px-6 font-mono text-sm uppercase tracking-widest text-muted-foreground font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border/50 group hover:bg-background/50 transition-colors">
                  <td className="py-4 px-6 font-mono text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                    {item.id}
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-display font-bold text-sm text-foreground uppercase tracking-wider">
                      {item.name}
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-sm text-muted-foreground font-bold uppercase tracking-wider">
                    {item.category}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="font-mono text-sm font-bold text-foreground">
                      {item.stock.toLocaleString('id-ID')} <span className="text-sm text-muted-foreground ml-1 uppercase">{item.unit}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <StatusBadge 
                      variant={item.status === 'AMAN' ? 'success' : item.status === 'KRITIS' ? 'warning' : 'danger'} 
                    >
                      {item.status}
                    </StatusBadge>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button className="font-mono text-sm font-bold px-3 py-1.5 border border-border hover:bg-foreground hover:text-background uppercase tracking-widest transition-colors cursor-pointer">
                      DETAIL
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <VerticalBranding text="SEMAYOT // INVENTARIS" className="absolute -right-12 top-0 bottom-0 pointer-events-none" />
    </div>
  );
}

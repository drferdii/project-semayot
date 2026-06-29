'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MoneyDisplay } from '@/components/admin/MoneyDisplay';
import { TransactionDetail } from './TransactionDetail';

type Transaction = {
  id: string;
  staff_id: string;
  total_cents: number;
  paid_cents: number;
  change_cents: number;
  note: string | null;
  created_at: string;
};

export function TransactionsList() {
  const pathname = usePathname();
  const [items, setItems] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/admin/transactions')
      .then((r) => r.json())
      .then((json) => {
        setItems(json.data ?? []);
        setLoading(false);
      });
  }, [pathname]);

  if (loading) return <p className="text-[#57534E]">Memuat...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold text-[#1C1917] mb-4">Transaksi</h2>

      {items.length === 0 ? (
        <p className="text-[#57534E] text-center py-8">Belum ada transaksi.</p>
      ) : (
        <div className="bg-white rounded-xl border border-[rgba(28,25,23,0.08)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#FAF6F0] text-[#57534E] text-xs uppercase">
              <tr>
                <th className="text-left p-3">Waktu</th>
                <th className="text-right p-3">Total</th>
                <th className="text-right p-3">Tunai</th>
                <th className="text-right p-3">Kembali</th>
                <th className="text-right p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t.id} className="border-t border-[rgba(28,25,23,0.04)]">
                  <td className="p-3 text-[#1C1917]">
                    {new Date(t.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="p-3 text-right font-medium"><MoneyDisplay cents={t.total_cents} /></td>
                  <td className="p-3 text-right text-[#57534E]"><MoneyDisplay cents={t.paid_cents} /></td>
                  <td className="p-3 text-right text-[#57534E]"><MoneyDisplay cents={t.change_cents} /></td>
                  <td className="p-3 text-right">
                    <button onClick={() => setSelected(t.id)} className="text-[#FF4F79] text-sm">Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && <TransactionDetail id={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

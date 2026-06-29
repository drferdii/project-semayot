'use client';

import { useEffect, useState } from 'react';
import { MoneyDisplay } from '@/components/admin/MoneyDisplay';

type TxItem = {
  id: string;
  menu_item_id: string;
  name_snapshot: string;
  price_cents_snapshot: number;
  quantity: number;
  subtotal_cents: number;
};

type Transaction = {
  id: string;
  total_cents: number;
  paid_cents: number;
  change_cents: number;
  note: string | null;
  created_at: string;
  transaction_items: TxItem[];
};

export function TransactionDetail({ id, onClose }: { id: string; onClose: () => void }) {
  const [data, setData] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/transactions/${id}`)
      .then((r) => r.json())
      .then((json) => {
        setData(json.data ?? null);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-[rgba(28,25,23,0.08)] flex justify-between items-center">
          <h3 className="font-semibold text-[#1C1917]">Detail Transaksi</h3>
          <button onClick={onClose} className="text-[#57534E] hover:text-[#1C1917] text-xl leading-none">×</button>
        </div>
        <div className="p-4">
          {loading ? (
            <p className="text-[#57534E]">Memuat...</p>
          ) : !data ? (
            <p className="text-[#DC2626]">Gagal memuat.</p>
          ) : (
            <>
              <div className="text-xs text-[#57534E] mb-3">
                {new Date(data.created_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                <br />
                ID: {data.id.slice(0, 8)}...
              </div>

              <table className="w-full text-sm mb-4">
                <thead className="text-[#57534E] text-xs">
                  <tr>
                    <th className="text-left pb-1">Item</th>
                    <th className="text-right pb-1">Qty</th>
                    <th className="text-right pb-1">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.transaction_items ?? []).map((it) => (
                    <tr key={it.id} className="border-t border-[rgba(28,25,23,0.04)]">
                      <td className="py-1">
                        <div className="font-medium text-[#1C1917]">{it.name_snapshot}</div>
                        <div className="text-xs text-[#57534E]"><MoneyDisplay cents={it.price_cents_snapshot} /> /item</div>
                      </td>
                      <td className="py-1 text-right">{it.quantity}</td>
                      <td className="py-1 text-right font-medium"><MoneyDisplay cents={it.subtotal_cents} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t-2 border-[#1C1917] pt-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#57534E]">Total</span>
                  <span className="font-semibold text-[#1C1917]"><MoneyDisplay cents={data.total_cents} /></span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#57534E]">Tunai</span>
                  <span className="text-[#57534E]"><MoneyDisplay cents={data.paid_cents} /></span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#57534E]">Kembalian</span>
                  <span className="text-[#15803D] font-semibold"><MoneyDisplay cents={data.change_cents} /></span>
                </div>
              </div>

              {data.note && (
                <div className="mt-3 text-xs text-[#57534E]">
                  <strong>Catatan:</strong> {data.note}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

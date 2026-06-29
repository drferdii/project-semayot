'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expenseCreateSchema, type ExpenseCreate } from '@/lib/admin/schemas/expense';
import { MoneyDisplay } from '@/components/admin/MoneyDisplay';

type Expense = {
  id: string;
  category: 'bahan' | 'operasional' | 'gaji' | 'lain';
  amount_cents: number;
  description: string | null;
  incurred_at: string;
  created_at: string;
};

const CATEGORY_LABEL: Record<string, string> = {
  bahan: 'Bahan',
  operasional: 'Operasional',
  gaji: 'Gaji',
  lain: 'Lain',
};

export function ExpensesView() {
  const pathname = usePathname();
  const [items, setItems] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ExpenseCreate>({
    resolver: zodResolver(expenseCreateSchema),
    defaultValues: {
      category: 'bahan',
      amount_cents: 0,
      description: '',
      incurred_at: new Date().toISOString().slice(0, 10),
    },
  });

  const load = async () => {
    setLoading(true);
    const r = await fetch('/api/admin/expenses');
    const j = await r.json();
    if (r.ok) setItems(j.data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [pathname]);

  const onSubmit = async (data: ExpenseCreate) => {
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);
    const r = await fetch('/api/admin/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const j = await r.json();
    if (r.ok) {
      setSuccessMsg('Pengeluaran berhasil dicatat.');
      reset({ category: 'bahan', amount_cents: 0, description: '', incurred_at: new Date().toISOString().slice(0, 10) });
      await load();
    } else {
      setError(j.error?.message ?? 'Gagal menyimpan.');
    }
    setSubmitting(false);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-[#1C1917] mb-4">Pengeluaran</h2>

      {error && <div className="text-sm text-[#DC2626] bg-[rgba(220,38,38,0.05)] rounded-lg p-3 mb-3">{error}</div>}
      {successMsg && <div className="text-sm text-[#15803D] bg-[rgba(21,128,61,0.1)] rounded-lg p-3 mb-3">{successMsg}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-[rgba(28,25,23,0.08)] p-4 space-y-3">
          <h3 className="font-semibold text-[#1C1917] mb-2">Catat Pengeluaran</h3>

          <div>
            <label className="block text-sm font-medium mb-1">Tanggal *</label>
            <input type="date" {...register('incurred_at')} className="w-full px-3 py-2 rounded border border-[rgba(28,25,23,0.12)] text-sm" />
            {errors.incurred_at && <p className="text-xs text-[#DC2626] mt-1">{errors.incurred_at.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Kategori *</label>
            <select {...register('category')} className="w-full px-3 py-2 rounded border border-[rgba(28,25,23,0.12)] text-sm">
              <option value="bahan">Bahan</option>
              <option value="operasional">Operasional</option>
              <option value="gaji">Gaji</option>
              <option value="lain">Lain</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nominal (Rp) *</label>
            <input
              type="number"
              {...register('amount_cents', { valueAsNumber: true })}
              className="w-full px-3 py-2 rounded border border-[rgba(28,25,23,0.12)] text-sm"
              placeholder="cth. 50000"
            />
            {errors.amount_cents && <p className="text-xs text-[#DC2626] mt-1">{errors.amount_cents.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Deskripsi</label>
            <input {...register('description')} className="w-full px-3 py-2 rounded border border-[rgba(28,25,23,0.12)] text-sm" placeholder="cth. Beli daging sapi 5kg" />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#FF4F79] text-white py-2.5 rounded-lg font-medium hover:bg-[#E03D63] disabled:opacity-50"
          >
            {submitting ? 'Menyimpan...' : 'Catat Pengeluaran'}
          </button>
        </form>

        <div className="bg-white rounded-xl border border-[rgba(28,25,23,0.08)] overflow-hidden">
          <h3 className="font-semibold text-[#1C1917] p-4 border-b border-[rgba(28,25,23,0.08)]">Daftar Pengeluaran</h3>
          {loading ? (
            <p className="text-sm text-[#57534E] text-center py-8">Memuat...</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-[#57534E] text-center py-8">Belum ada catatan pengeluaran.</p>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#FAF6F0] text-[#57534E] text-xs sticky top-0">
                  <tr>
                    <th className="text-left p-3">Tanggal</th>
                    <th className="text-left p-3">Kategori</th>
                    <th className="text-left p-3">Deskripsi</th>
                    <th className="text-right p-3">Nominal</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.id} className="border-t border-[rgba(28,25,23,0.04)]">
                      <td className="p-3 text-[#1C1917]">{it.incurred_at}</td>
                      <td className="p-3 text-[#57534E]">{CATEGORY_LABEL[it.category] ?? it.category}</td>
                      <td className="p-3 text-[#57534E]">{it.description ?? '—'}</td>
                      <td className="p-3 text-right font-medium text-[#DC2626]"><MoneyDisplay cents={it.amount_cents} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

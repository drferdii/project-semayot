'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, CartesianGrid } from 'recharts';
import { MoneyDisplay } from '@/components/admin/MoneyDisplay';

type DailyReport = {
  date: string;
  transaction_count: number;
  revenue_cents: number;
  expense_total_cents: number;
  profit_cents: number;
  expenses_by_category: Record<string, number>;
};

type MonthlyReport = {
  year: number;
  month: number;
  transaction_count: number;
  revenue_cents: number;
  expense_total_cents: number;
  profit_cents: number;
  daily_breakdown: Record<string, { revenue_cents: number; expense_cents: number }>;
};

const PIE_COLORS: Record<string, string> = {
  bahan: '#FF4F79',
  operasional: '#1C1917',
  gaji: '#D97706',
  lain: '#0EA5E9',
};

const CATEGORY_LABEL: Record<string, string> = {
  bahan: 'Bahan',
  operasional: 'Operasional',
  gaji: 'Gaji',
  lain: 'Lain',
};

export function ReportsView() {
  const pathname = usePathname();
  const [tab, setTab] = useState<'daily' | 'monthly'>('daily');
  const [daily, setDaily] = useState<DailyReport | null>(null);
  const [monthly, setMonthly] = useState<MonthlyReport | null>(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      if (tab === 'daily') {
        const r = await fetch(`/api/admin/reports/daily?date=${date}`);
        const j = await r.json();
        setDaily(j.data);
      } else {
        const now = new Date();
        const r = await fetch(`/api/admin/reports/monthly?year=${now.getFullYear()}&month=${now.getMonth() + 1}`);
        const j = await r.json();
        setMonthly(j.data);
      }
      setLoading(false);
    };
    fetchData();
  }, [tab, date, pathname]);

  const pieData = daily
    ? Object.entries(daily.expenses_by_category).map(([cat, cents]) => ({
        name: CATEGORY_LABEL[cat] ?? cat,
        value: cents,
        color: PIE_COLORS[cat] ?? '#A8A29E',
      }))
    : [];

  const lineData = monthly
    ? Object.entries(monthly.daily_breakdown)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([day, d]) => ({ day, revenue: d.revenue_cents / 100, expense: d.expense_cents / 100 }))
    : [];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#1C1917]">Laporan</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setTab('daily')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'daily' ? 'bg-[#FF4F79] text-white' : 'bg-[rgba(28,25,23,0.06)] text-[#1C1917]'}`}
          >Harian</button>
          <button
            onClick={() => setTab('monthly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'monthly' ? 'bg-[#FF4F79] text-white' : 'bg-[rgba(28,25,23,0.06)] text-[#1C1917]'}`}
          >Bulanan</button>
          <a
            href="/api/admin/reports/export"
            className="px-4 py-2 rounded-lg text-sm font-medium bg-[#1C1917] text-white hover:bg-[#0F0E0C]"
            download
          >Export CSV</a>
        </div>
      </div>

      {tab === 'daily' && (
        <div>
          <div className="mb-4">
            <label className="text-sm text-[#57534E] mr-2">Tanggal:</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="px-3 py-1.5 rounded border border-[rgba(28,25,23,0.12)] text-sm" />
          </div>

          {loading ? (
            <p className="text-[#57534E]">Memuat...</p>
          ) : !daily ? (
            <p className="text-[#DC2626]">Gagal memuat laporan.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <StatCard label="Transaksi" value={daily.transaction_count.toString()} />
                <StatCard label="Pendapatan" valueCents={daily.revenue_cents} accent="success" />
                <StatCard label="Pengeluaran" valueCents={daily.expense_total_cents} accent="danger" />
                <StatCard label="Profit" valueCents={daily.profit_cents} accent={daily.profit_cents >= 0 ? 'success' : 'danger'} />
              </div>

              <div className="bg-white rounded-xl border border-[rgba(28,25,23,0.08)] p-4">
                <h3 className="text-sm font-semibold text-[#1C1917] mb-2">Pengeluaran per Kategori</h3>
                {pieData.length === 0 ? (
                  <p className="text-sm text-[#57534E] text-center py-8">Belum ada pengeluaran hari ini.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={(e) => `${e.name}: ${formatRupiahShort(e.value)}`}>
                        {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(v) => formatRupiahShort(Number(v) || 0)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'monthly' && (
        <div>
          {loading ? (
            <p className="text-[#57534E]">Memuat...</p>
          ) : !monthly ? (
            <p className="text-[#DC2626]">Gagal memuat laporan.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <StatCard label="Transaksi" value={monthly.transaction_count.toString()} />
                <StatCard label="Pendapatan" valueCents={monthly.revenue_cents} accent="success" />
                <StatCard label="Pengeluaran" valueCents={monthly.expense_total_cents} accent="danger" />
                <StatCard label="Profit" valueCents={monthly.profit_cents} accent={monthly.profit_cents >= 0 ? 'success' : 'danger'} />
              </div>

              <div className="bg-white rounded-xl border border-[rgba(28,25,23,0.08)] p-4">
                <h3 className="text-sm font-semibold text-[#1C1917] mb-2">Harian ({monthly.year}-{String(monthly.month).padStart(2, '0')})</h3>
                {lineData.length === 0 ? (
                  <p className="text-sm text-[#57534E] text-center py-8">Belum ada aktivitas bulan ini.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={lineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(28,25,23,0.08)" />
                      <XAxis dataKey="day" />
                      <YAxis tickFormatter={(v) => v.toLocaleString('id-ID')} />
                      <Tooltip formatter={(v) => `Rp ${Number(v).toLocaleString('id-ID')}`} />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#15803D" strokeWidth={2} name="Pendapatan" />
                      <Line type="monotone" dataKey="expense" stroke="#DC2626" strokeWidth={2} name="Pengeluaran" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, valueCents, accent }: { label: string; value?: string; valueCents?: number; accent?: 'success' | 'danger' }) {
  const color = accent === 'success' ? 'text-[#15803D]' : accent === 'danger' ? 'text-[#DC2626]' : 'text-[#1C1917]';
  return (
    <div className="bg-white rounded-xl border border-[rgba(28,25,23,0.08)] p-4">
      <div className="text-xs uppercase tracking-wide text-[#57534E]">{label}</div>
      <div className={`text-xl font-semibold mt-1 ${color}`}>
        {value ?? (valueCents !== undefined ? <MoneyDisplay cents={valueCents} /> : '—')}
      </div>
    </div>
  );
}

function formatRupiahShort(cents: number): string {
  if (cents >= 1_000_000_00) return `${(cents / 1_000_000_00).toFixed(1)}jt`;
  if (cents >= 1_000_00) return `${(cents / 1_000_00).toFixed(0)}rb`;
  return `Rp ${cents / 100}`;
}

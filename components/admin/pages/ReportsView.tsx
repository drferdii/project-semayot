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

// ACARS Palette Colors
const PIE_COLORS: Record<string, string> = {
  bahan: 'oklch(35% 0.02 160)',        // Deep Forest Green
  operasional: 'oklch(65% 0.01 160)',  // Muted Teal
  gaji: 'oklch(78% 0.02 130)',         // Light Sage Accent
  lain: 'oklch(55% 0.06 85)',          // Ochre Sand Accent
};

const CATEGORY_LABEL: Record<string, string> = {
  bahan: 'BAHAN BAKU',
  operasional: 'OPERASIONAL',
  gaji: 'GAJI KARYAWAN',
  lain: 'LAIN-LAIN',
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
      try {
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
      } catch {
        console.error('Fetch report error');
      }
      setLoading(false);
    };
    fetchData();
  }, [tab, date, pathname]);

  const pieData = daily
    ? Object.entries(daily.expenses_by_category).map(([cat, cents]) => ({
        name: CATEGORY_LABEL[cat] ?? cat.toUpperCase(),
        value: cents,
        color: PIE_COLORS[cat] ?? 'oklch(65% 0.01 160)',
      }))
    : [];

  const lineData = monthly
    ? Object.entries(monthly.daily_breakdown)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([day, d]) => ({ 
          day: day.slice(8, 10), 
          revenue: d.revenue_cents / 100, 
          expense: d.expense_cents / 100 
        }))
    : [];

  return (
    <div className="animate-fade-in max-w-5xl relative">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-11 space-y-8">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border pb-4">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted block mb-1 font-bold">
            Konsol Pelaporan Keuangan
          </span>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground uppercase">
            Analisis Penjualan & Biaya
          </h2>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex border border-border p-1 bg-card font-mono text-[10px] font-bold">
            <button
              onClick={() => setTab('daily')}
              className={`px-4 py-2 uppercase tracking-wider transition-all duration-200 ${
                tab === 'daily' 
                  ? 'bg-foreground text-background' 
                  : 'text-muted hover:text-foreground'
              }`}
            >
              Harian
            </button>
            <button
              onClick={() => setTab('monthly')}
              className={`px-4 py-2 uppercase tracking-wider transition-all duration-200 ${
                tab === 'monthly' 
                  ? 'bg-foreground text-background' 
                  : 'text-muted hover:text-foreground'
              }`}
            >
              Bulanan
            </button>
          </div>
          
          <a
            href="/api/admin/reports/export"
            className="border border-foreground bg-foreground text-background font-mono text-[10px] font-bold px-5 py-3 uppercase tracking-widest hover:bg-transparent hover:text-foreground transition-all duration-300"
            download
          >
            Ekspor CSV
          </a>
        </div>
      </div>

      {tab === 'daily' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-muted font-bold uppercase tracking-wider">
              Pilih Tanggal:
            </span>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              className="px-4 py-2 border border-border bg-card font-mono text-xs font-bold text-foreground focus:outline-none focus:border-foreground" 
            />
          </div>

          {loading ? (
            <div className="font-mono text-[10px] text-muted font-bold uppercase tracking-widest py-12 animate-pulse">
              Memproses kalkulasi neraca harian...
            </div>
          ) : !daily ? (
            <div className="font-mono text-xs text-red-600 border border-red-600/20 bg-red-600/5 p-4 uppercase tracking-wider">
              PROCESS_ERROR: Gagal memuat data neraca harian.
            </div>
          ) : (
            <div className="space-y-6">
              {/* KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Jumlah Transaksi" value={daily.transaction_count.toString()} />
                <StatCard label="Total Pendapatan" valueCents={daily.revenue_cents} accent="success" />
                <StatCard label="Total Pengeluaran" valueCents={daily.expense_total_cents} accent="danger" />
                <StatCard label="Margin Profit" valueCents={daily.profit_cents} accent={daily.profit_cents >= 0 ? 'success' : 'danger'} />
              </div>

              {/* Chart */}
              <div className="border border-border bg-card p-6">
                <h3 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider mb-6">
                  Distribusi Kategori Pengeluaran
                </h3>
                {pieData.length === 0 ? (
                  <p className="font-mono text-xs text-muted uppercase tracking-wider text-center py-12">
                    Tidak terdeteksi adanya pengeluaran pada tanggal ini.
                  </p>
                ) : (
                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={pieData} 
                          dataKey="value" 
                          nameKey="name" 
                          cx="50%" 
                          cy="50%" 
                          outerRadius={90} 
                          label={(e) => `${e.name}: ${formatRupiahShort(e.value)}`}
                          className="font-mono text-[10px] font-bold fill-foreground"
                        >
                          {pieData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v) => formatRupiahShort(Number(v) || 0)} contentStyle={{ backgroundColor: 'oklch(98% 0.005 85)', border: '1px solid oklch(88% 0.01 130)', fontFamily: 'JetBrains Mono', fontSize: '11px' }} />
                        <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: '9px', fontWeight: 'bold' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'monthly' && (
        <div className="space-y-6">
          {loading ? (
            <div className="font-mono text-[10px] text-muted font-bold uppercase tracking-widest py-12 animate-pulse">
              Mengumpulkan riwayat transaksi bulanan...
            </div>
          ) : !monthly ? (
            <div className="font-mono text-xs text-red-600 border border-red-600/20 bg-red-600/5 p-4 uppercase tracking-wider">
              PROCESS_ERROR: Gagal memuat data neraca bulanan.
            </div>
          ) : (
            <div className="space-y-6">
              {/* KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Jumlah Transaksi" value={monthly.transaction_count.toString()} />
                <StatCard label="Total Pendapatan" valueCents={monthly.revenue_cents} accent="success" />
                <StatCard label="Total Pengeluaran" valueCents={monthly.expense_total_cents} accent="danger" />
                <StatCard label="Margin Profit" valueCents={monthly.profit_cents} accent={monthly.profit_cents >= 0 ? 'success' : 'danger'} />
              </div>

              {/* Line Chart */}
              <div className="border border-border bg-card p-6">
                <h3 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider mb-6">
                  Tren Keuangan Harian ({monthly.year}-{String(monthly.month).padStart(2, '0')})
                </h3>
                {lineData.length === 0 ? (
                  <p className="font-mono text-xs text-muted uppercase tracking-wider text-center py-12">
                    Belum terdeteksi adanya aktivitas transaksi pada bulan ini.
                  </p>
                ) : (
                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lineData} margin={{ top: 10, right: 10, bottom: 5, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(88% 0.01 130)" strokeWidth={0.5} />
                        <XAxis dataKey="day" tick={{ fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 'bold' }} stroke="oklch(65% 0.01 160)" />
                        <YAxis tickFormatter={(v) => `Rp ${v.toLocaleString('id-ID')}`} tick={{ fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 'bold' }} stroke="oklch(65% 0.01 160)" />
                        <Tooltip formatter={(v) => `Rp ${Number(v).toLocaleString('id-ID')}`} contentStyle={{ backgroundColor: 'oklch(98% 0.005 85)', border: '1px solid oklch(88% 0.01 130)', fontFamily: 'JetBrains Mono', fontSize: '11px' }} />
                        <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: '9px', fontWeight: 'bold' }} />
                        <Line type="monotone" dataKey="revenue" stroke="oklch(35% 0.02 160)" strokeWidth={2.5} dot={{ r: 2 }} activeDot={{ r: 4 }} name="Pendapatan" />
                        <Line type="monotone" dataKey="expense" stroke="#DC2626" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 1 }} name="Pengeluaran" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
        </div>
        {/* Vertical Branding */}
        <div className="hidden md:flex md:col-span-1 justify-center pt-16 select-none opacity-20 hover:opacity-40 transition-opacity duration-300">
          <div className="font-mono text-[9px] font-black uppercase tracking-[0.3em] branding-vertical text-center whitespace-nowrap">
            LAPORAN KEUANGAN SEMAYOT
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, valueCents, accent }: { label: string; value?: string; valueCents?: number; accent?: 'success' | 'danger' }) {
  const color = accent === 'success' ? 'text-emerald-700' : accent === 'danger' ? 'text-red-700' : 'text-foreground';
  return (
    <div 
      className="border border-border border-top-[3px] p-6 bg-card hover:bg-background transition-colors duration-300"
      style={{ borderTopWidth: '3px' }}
    >
      <div className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-muted mb-2">{label}</div>
      <div className={`font-display text-2xl font-semibold tracking-tight tabular-nums ${color}`}>
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

'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { semayotBusinessInfo } from '@/lib/semayot/business-info';
import { ExpensesView } from './ExpensesView';

type Tab = 'bisnis' | 'staff' | 'pengeluaran';

type Staff = {
  id: string;
  full_name: string;
  role: 'owner' | 'staff';
  is_active: boolean;
  created_at: string;
};

export function SettingsView() {
  const pathname = usePathname();
  const [tab, setTab] = useState<Tab>('bisnis');
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviting, setInviting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const biz = semayotBusinessInfo;

  const loadStaff = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch('/api/admin/staff');
      const j = await r.json();
      if (r.ok) setStaff(j.data ?? []);
      else setError(j.error?.message ?? 'Gagal memuat staff.');
    } catch {
      setError('Koneksi terputus.');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (tab === 'staff') loadStaff();
  }, [tab, pathname]);

  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const r = await fetch('/api/admin/staff/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, full_name: inviteName }),
      });
      const j = await r.json();
      if (r.ok) {
        setSuccessMsg(`Undangan terkirim ke ${inviteEmail}.`);
        setInviteEmail('');
        setInviteName('');
        await loadStaff();
      } else {
        setError(j.error?.message ?? 'Gagal mengundang.');
      }
    } catch {
      setError('Koneksi gagal.');
    }
    setInviting(false);
  };

  const deactivate = async (id: string, name: string) => {
    if (!confirm(`Nonaktifkan staff "${name}"?`)) return;
    const r = await fetch(`/api/admin/staff/${id}`, { method: 'DELETE' });
    if (r.ok) await loadStaff();
    else setError('Gagal menonaktifkan.');
  };

  return (
    <div className="animate-fade-in max-w-4xl relative">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-11 space-y-8">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-border">
        <div className="flex border-b border-transparent">
          {(['bisnis', 'staff', 'pengeluaran'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 font-mono text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 -mb-[2px] ${
                tab === t 
                  ? 'border-foreground text-foreground' 
                  : 'border-transparent text-muted hover:text-foreground'
              }`}
            >
              {t === 'bisnis' ? 'Info Bisnis' : t === 'staff' ? 'Staf/Pengguna' : 'Pengeluaran'}
            </button>
          ))}
        </div>
        <span className="font-mono text-[8px] font-bold text-muted uppercase tracking-widest pb-3 hidden sm:inline">
          KODE_MODUL: SETTINGS
        </span>
      </div>

      {error && (
        <div className="font-mono text-xs text-red-600 border border-red-600/20 bg-red-600/5 p-4 uppercase tracking-wider">
          SYSTEM_ERROR: {error}
        </div>
      )}
      {successMsg && (
        <div className="font-mono text-xs text-emerald-700 border border-emerald-600/20 bg-emerald-600/5 p-4 uppercase tracking-wider">
          INVITE_OK: {successMsg}
        </div>
      )}

      {tab === 'bisnis' && (
        <div className="border border-border bg-card p-6 space-y-6">
          <div className="border-b border-border pb-4">
            <h3 className="font-display text-base font-semibold text-foreground uppercase tracking-wider">
              Informasi Operasional Bisnis
            </h3>
            <p className="font-mono text-[9px] text-muted font-bold uppercase tracking-wider mt-1">
              Sumber: <code>lib/semayot/business-info.ts</code> (Read-Only)
            </p>
          </div>
          
          <div className="divide-y divide-border/60">
            <Field label="Nama Restoran" value={biz.name} />
            <Field label="Kategori Kuliner" value={biz.category} />
            <Field label="Alamat Fisik" value={biz.address} />
            <Field label="Area / Distrik" value={biz.area} />
            <Field label="Provinsi" value={biz.province} />
            <Field label="Landmark Lokasi" value={biz.landmark} />
            <Field label="Nomor Telepon" value={biz.phone} />
            <Field label="WhatsApp Bisnis" value={biz.whatsapp} />
            <Field label="Google Maps Link" value={biz.googleMapsUrl} mono />
            <Field label="Jadwal Buka" value={biz.openingHoursStatus} />
            <Field label="Waktu Tutup" value={biz.closingTime} />
          </div>
        </div>
      )}

      {tab === 'staff' && (
        <div className="space-y-6">
          {/* Invite Form */}
          <form onSubmit={invite} className="border border-border bg-card p-6 space-y-4">
            <h3 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider">
              Undang Staf Baru
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-mono text-[8px] font-bold text-muted uppercase tracking-wider block">
                  Email Undangan
                </label>
                <input
                  type="email"
                  placeholder="staf@semayot.id"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-border bg-background font-mono text-xs text-foreground focus:outline-none focus:border-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="font-mono text-[8px] font-bold text-muted uppercase tracking-wider block">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  placeholder="Nama Staf"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-border bg-background font-mono text-xs text-foreground focus:outline-none focus:border-foreground"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={inviting}
              className="border border-foreground bg-foreground text-background font-mono text-[10px] font-bold px-6 py-3 uppercase tracking-widest hover:bg-transparent hover:text-foreground transition-all duration-300 disabled:opacity-50"
            >
              {inviting ? 'Mengirim Undangan...' : 'Kirim Undangan'}
            </button>
          </form>

          {/* Staff List Table */}
          <div className="space-y-3">
            <h3 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider">
              Daftar Staf Aktif
            </h3>
            
            {loading ? (
              <div className="font-mono text-[10px] text-muted font-bold uppercase tracking-widest py-4 animate-pulse">
                Menyinkronkan daftar pengguna...
              </div>
            ) : staff.length === 0 ? (
              <p className="font-mono text-xs text-muted uppercase tracking-wider py-8 text-center border border-border bg-card">
                Belum ada staf terdaftar.
              </p>
            ) : (
              <div className="border border-border overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-card border-b border-border">
                      <th className="text-left font-mono text-[9px] uppercase text-muted py-4 px-4 font-bold tracking-widest">Nama Staf</th>
                      <th className="text-left font-mono text-[9px] uppercase text-muted py-4 px-4 font-bold tracking-widest">Akses Peran</th>
                      <th className="text-center font-mono text-[9px] uppercase text-muted py-4 px-4 font-bold tracking-widest">Status</th>
                      <th className="text-right font-mono text-[9px] uppercase text-muted py-4 px-4 font-bold tracking-widest">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.map((s) => (
                      <tr key={s.id} className="border-b border-border/60 hover:bg-card/30 transition-colors">
                        <td className="py-4 px-4 font-display font-medium text-foreground">{s.full_name}</td>
                        <td className="py-4 px-4 font-mono text-xs font-bold text-muted uppercase tracking-wider">{s.role}</td>
                        <td className="py-4 px-4 text-center">
                          <span 
                            className={`inline-block font-mono text-[8px] font-bold px-2 py-1 border uppercase tracking-wider ${
                              s.is_active 
                                ? 'border-emerald-600/30 text-emerald-700 bg-emerald-500/5' 
                                : 'border-border text-muted bg-background/50'
                            }`}
                          >
                            {s.is_active ? 'AKTIF' : 'NON-AKTIF'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          {s.is_active && (
                            <button 
                              onClick={() => deactivate(s.id, s.full_name)} 
                              className="font-mono text-[9px] font-bold text-red-600 hover:text-red-800 uppercase tracking-widest"
                            >
                              NONAKTIFKAN
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
        {tab === 'pengeluaran' && <ExpensesView />}
        </div>
        {/* Vertical Branding */}
        <div className="hidden md:flex md:col-span-1 justify-center pt-16 select-none opacity-20 hover:opacity-40 transition-opacity duration-300">
          <div className="font-mono text-[9px] font-black uppercase tracking-[0.3em] branding-vertical text-center whitespace-nowrap">
            PENGATURAN KONSOL SEMAYOT
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string | null; mono?: boolean }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-4 items-center">
      <div className="font-mono text-[9px] font-bold text-muted uppercase tracking-wider">{label}</div>
      <div className={`col-span-2 text-foreground text-sm font-medium ${mono ? 'font-mono text-xs break-all text-muted' : ''}`}>
        {value ?? '—'}
      </div>
    </div>
  );
}

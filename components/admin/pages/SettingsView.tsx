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
    const r = await fetch('/api/admin/staff');
    const j = await r.json();
    if (r.ok) setStaff(j.data ?? []);
    else setError(j.error?.message ?? 'Gagal memuat staff.');
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
    const r = await fetch('/api/admin/staff/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inviteEmail, full_name: inviteName }),
    });
    const j = await r.json();
    if (r.ok) {
      setSuccessMsg(`Invitation terkirim ke ${inviteEmail}.`);
      setInviteEmail('');
      setInviteName('');
      await loadStaff();
    } else {
      setError(j.error?.message ?? 'Gagal invite.');
    }
    setInviting(false);
  };

  const deactivate = async (id: string, name: string) => {
    if (!confirm(`Nonaktifkan staff "${name}"?`)) return;
    const r = await fetch(`/api/admin/staff/${id}`, { method: 'DELETE' });
    if (r.ok) await loadStaff();
    else setError('Gagal nonaktifkan.');
  };

  return (
    <div>
      <div className="flex gap-2 mb-4 border-b border-[rgba(28,25,23,0.08)]">
        {(['bisnis', 'staff', 'pengeluaran'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${tab === t ? 'border-[#FF4F79] text-[#1C1917]' : 'border-transparent text-[#57534E] hover:text-[#1C1917]'}`}
          >
            {t === 'bisnis' ? 'Bisnis' : t === 'staff' ? 'Staff' : 'Pengeluaran'}
          </button>
        ))}
      </div>

      {error && <div className="text-sm text-[#DC2626] bg-[rgba(220,38,38,0.05)] rounded-lg p-3 mb-3">{error}</div>}
      {successMsg && <div className="text-sm text-[#15803D] bg-[rgba(21,128,61,0.1)] rounded-lg p-3 mb-3">{successMsg}</div>}

      {tab === 'bisnis' && (
        <div className="bg-white rounded-xl border border-[rgba(28,25,23,0.08)] p-6 space-y-3">
          <h3 className="font-semibold text-[#1C1917] mb-2">Info Bisnis (referensi)</h3>
          <p className="text-xs text-[#57534E] mb-3">
            Data di bawah ini adalah sumber kebenaran dari <code>lib/semayot/business-info.ts</code>. Untuk ubah, edit file di repo lalu redeploy.
          </p>
          <Field label="Nama" value={biz.name} />
          <Field label="Kategori" value={biz.category} />
          <Field label="Alamat" value={biz.address} />
          <Field label="Area" value={biz.area} />
          <Field label="Provinsi" value={biz.province} />
          <Field label="Landmark" value={biz.landmark} />
          <Field label="Telepon" value={biz.phone} />
          <Field label="WhatsApp" value={biz.whatsapp} />
          <Field label="Google Maps" value={biz.googleMapsUrl} mono />
          <Field label="Jam buka" value={biz.openingHoursStatus} />
          <Field label="Tutup" value={biz.closingTime} />
        </div>
      )}

      {tab === 'staff' && (
        <div>
          <form onSubmit={invite} className="bg-white rounded-xl border border-[rgba(28,25,23,0.08)] p-4 mb-4 space-y-2">
            <h3 className="font-semibold text-[#1C1917] mb-2">Undang Staff Baru</h3>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="email"
                placeholder="email@contoh.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
                className="px-3 py-2 rounded border border-[rgba(28,25,23,0.12)] text-sm"
              />
              <input
                type="text"
                placeholder="Nama lengkap"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                required
                className="px-3 py-2 rounded border border-[rgba(28,25,23,0.12)] text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={inviting}
              className="bg-[#FF4F79] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#E03D63] disabled:opacity-50"
            >
              {inviting ? 'Mengirim...' : 'Undang'}
            </button>
          </form>

          {loading ? (
            <p className="text-[#57534E]">Memuat...</p>
          ) : staff.length === 0 ? (
            <p className="text-[#57534E] text-center py-8">Belum ada staff.</p>
          ) : (
            <div className="bg-white rounded-xl border border-[rgba(28,25,23,0.08)] overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#FAF6F0] text-[#57534E] text-xs uppercase">
                  <tr>
                    <th className="text-left p-3">Nama</th>
                    <th className="text-left p-3">Role</th>
                    <th className="text-center p-3">Status</th>
                    <th className="text-right p-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((s) => (
                    <tr key={s.id} className="border-t border-[rgba(28,25,23,0.04)]">
                      <td className="p-3 text-[#1C1917]">{s.full_name}</td>
                      <td className="p-3 text-[#57534E] capitalize">{s.role}</td>
                      <td className="p-3 text-center">
                        {s.is_active ? (
                          <span className="text-xs bg-[rgba(21,128,61,0.1)] text-[#15803D] px-2 py-0.5 rounded">Aktif</span>
                        ) : (
                          <span className="text-xs bg-[rgba(28,25,23,0.06)] text-[#57534E] px-2 py-0.5 rounded">Non-aktif</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {s.is_active && (
                          <button onClick={() => deactivate(s.id, s.full_name)} className="text-xs text-[#DC2626] hover:underline">
                            Nonaktifkan
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
      )}

      {tab === 'pengeluaran' && <ExpensesView />}
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string | null; mono?: boolean }) {
  return (
    <div className="grid grid-cols-3 gap-2 text-sm">
      <div className="text-[#57534E]">{label}</div>
      <div className={`col-span-2 text-[#1C1917] ${mono ? 'font-mono text-xs' : ''}`}>{value ?? '—'}</div>
    </div>
  );
}

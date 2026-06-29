'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

type Status = 'pending' | 'applied' | 'skipped';
type Rec = {
  id: string;
  title: string;
  why_it_matters: string;
  apply_at: string;
  copy_value: string | null;
  status: Status;
};

const STATUS_LABEL: Record<Status, string> = {
  pending: 'Belum',
  applied: 'Diterapkan',
  skipped: 'Dilewati',
};

const STATUS_COLOR: Record<Status, string> = {
  pending: 'bg-[rgba(28,25,23,0.06)] text-[#57534E]',
  applied: 'bg-[rgba(21,128,61,0.1)] text-[#15803D]',
  skipped: 'bg-[rgba(217,119,6,0.1)] text-[#D97706]',
};

export function SEOView() {
  const pathname = usePathname();
  const [recs, setRecs] = useState<Rec[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const r = await fetch('/api/admin/seo/recommendations');
    const j = await r.json();
    if (r.ok) setRecs(j.data ?? []);
    else setError(j.error?.message ?? 'Gagal memuat.');
    setLoading(false);
  };

  useEffect(() => { load(); }, [pathname]);

  const updateStatus = async (id: string, status: Status) => {
    const r = await fetch(`/api/admin/seo/recommendations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (r.ok) await load();
    else setError('Gagal update status.');
  };

  const copy = async (id: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setError('Gagal menyalin ke clipboard.');
    }
  };

  if (loading) return <p className="text-[#57534E]">Memuat...</p>;
  if (error) return <p className="text-[#DC2626]">{error}</p>;

  const counts = {
    pending: recs.filter((r) => r.status === 'pending').length,
    applied: recs.filter((r) => r.status === 'applied').length,
    skipped: recs.filter((r) => r.status === 'skipped').length,
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-[#1C1917]">Rekomendasi SEO</h2>
        <p className="text-sm text-[#57534E] mt-1">
          {counts.pending} belum · {counts.applied} diterapkan · {counts.skipped} dilewati
        </p>
      </div>

      <div className="space-y-3">
        {recs.map((r) => (
          <div key={r.id} className="bg-white rounded-xl border border-[rgba(28,25,23,0.08)] p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h3 className="font-semibold text-[#1C1917]">{r.title}</h3>
                <p className="text-xs text-[#57534E] mt-1">📍 {r.apply_at}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded whitespace-nowrap ${STATUS_COLOR[r.status]}`}>
                {STATUS_LABEL[r.status]}
              </span>
            </div>

            <p className="text-sm text-[#57534E] mb-3">{r.why_it_matters}</p>

            {r.copy_value && (
              <div className="relative">
                <pre className="bg-[#1C1917] text-[#FAF6F0] text-xs p-3 rounded overflow-x-auto max-h-40">
                  {r.copy_value}
                </pre>
                <button
                  onClick={() => copy(r.id, r.copy_value!)}
                  className="absolute top-2 right-2 text-xs bg-[#FF4F79] text-white px-2 py-1 rounded hover:bg-[#E03D63]"
                >
                  {copied === r.id ? '✓ Tersalin' : 'Salin'}
                </button>
              </div>
            )}

            <div className="mt-3 flex gap-2">
              {(['pending', 'applied', 'skipped'] as Status[]).map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(r.id, s)}
                  className={`text-xs px-2 py-1 rounded ${r.status === s ? 'bg-[#1C1917] text-white' : 'bg-[rgba(28,25,23,0.06)] text-[#1C1917] hover:bg-[rgba(28,25,23,0.1)]'}`}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoneyDisplay } from '@/components/admin/MoneyDisplay';

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  category: 'dayak' | 'smoked' | 'pedas' | 'minuman';
  photo_url: string | null;
  badge: string | null;
  is_active: boolean;
};

export function MenuList() {
  const router = useRouter();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/menu?include_inactive=true');
    const json = await res.json();
    if (res.ok) {
      setItems(json.data);
      setError(null);
    } else {
      setError(json.error?.message ?? 'Gagal memuat menu.');
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus "${name}"?`)) return;
    const res = await fetch(`/api/admin/menu/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await load();
    } else {
      alert('Gagal hapus menu.');
    }
  };

  if (loading) return <p className="text-[#57534E]">Memuat...</p>;
  if (error) return <p className="text-[#DC2626]">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#1C1917]">Menu</h2>
        <button
          onClick={() => router.push('/admin/menu/new')}
          className="bg-[#FF4F79] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#E03D63]"
        >
          + Tambah Menu
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-[#57534E] text-center py-8">Belum ada menu. Tambah menu pertama.</p>
      ) : (
        <div className="bg-white rounded-xl border border-[rgba(28,25,23,0.08)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#FAF6F0] text-[#57534E] text-xs uppercase">
              <tr>
                <th className="text-left p-3">Nama</th>
                <th className="text-left p-3">Kategori</th>
                <th className="text-right p-3">Harga</th>
                <th className="text-center p-3">Status</th>
                <th className="text-right p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-[rgba(28,25,23,0.04)]">
                  <td className="p-3 font-medium text-[#1C1917]">{item.name}</td>
                  <td className="p-3 text-[#57534E] capitalize">{item.category}</td>
                  <td className="p-3 text-right"><MoneyDisplay cents={item.price_cents} /></td>
                  <td className="p-3 text-center">
                    {item.is_active ? (
                      <span className="text-xs bg-[rgba(21,128,61,0.1)] text-[#15803D] px-2 py-0.5 rounded">Aktif</span>
                    ) : (
                      <span className="text-xs bg-[rgba(28,25,23,0.06)] text-[#57534E] px-2 py-0.5 rounded">Non-aktif</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => router.push(`/admin/menu/${item.id}`)} className="text-[#FF4F79] text-sm mr-2">Edit</button>
                    <button onClick={() => handleDelete(item.id, item.name)} className="text-[#DC2626] text-sm">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

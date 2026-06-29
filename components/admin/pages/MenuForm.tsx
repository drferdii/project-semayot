'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { menuItemCreateSchema, type MenuItemCreate } from '@/lib/admin/schemas/menu';
import { FileUpload } from '@/components/admin/FileUpload';

export function MenuForm({ menuId }: { menuId?: string }) {
  const router = useRouter();
  const isEdit = !!menuId;
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(isEdit);

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<MenuItemCreate>({
    resolver: zodResolver(menuItemCreateSchema),
  });

  useEffect(() => {
    if (!isEdit) return;
    fetch('/api/admin/menu?include_inactive=true')
      .then((r) => r.json())
      .then((json) => {
        const item = json.data?.find((m: { id: string }) => m.id === menuId);
        if (item) {
          setValue('name', item.name);
          setValue('description', item.description ?? '');
          setValue('price_cents', item.price_cents);
          setValue('category', item.category);
          setValue('badge', item.badge ?? '');
          setPhotoUrl(item.photo_url);
        }
        setLoading(false);
      });
  }, [menuId, isEdit, setValue]);

  const onSubmit = async (data: MenuItemCreate) => {
    setServerError(null);
    const payload = { ...data, photo_url: photoUrl ?? '' };
    const url = isEdit ? `/api/admin/menu/${menuId}` : '/api/admin/menu';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (res.ok) {
      router.push('/admin/menu');
    } else {
      setServerError(json.error?.message ?? 'Gagal simpan menu.');
    }
  };

  if (loading) return <p className="text-[#57534E]">Memuat...</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4">
      {serverError && <div className="text-sm text-[#DC2626] bg-[rgba(220,38,38,0.05)] rounded-lg p-3">{serverError}</div>}

      <div>
        <label className="block text-sm font-medium mb-1.5">Nama Produk *</label>
        <input {...register('name')} className="w-full px-3 py-2 rounded-lg border border-[rgba(28,25,23,0.12)] bg-white" placeholder="cth. Daging Asap Suwir" />
        {errors.name && <p className="text-xs text-[#DC2626] mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Deskripsi</label>
        <textarea {...register('description')} className="w-full px-3 py-2 rounded-lg border border-[rgba(28,25,23,0.12)] bg-white" rows={2} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1.5">Harga (Rp) *</label>
          <input
            type="number"
            {...register('price_cents', { valueAsNumber: true })}
            className="w-full px-3 py-2 rounded-lg border border-[rgba(28,25,23,0.12)] bg-white"
            placeholder="cth. 45000"
          />
          {errors.price_cents && <p className="text-xs text-[#DC2626] mt-1">{errors.price_cents.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Kategori *</label>
          <select {...register('category')} className="w-full px-3 py-2 rounded-lg border border-[rgba(28,25,23,0.12)] bg-white">
            <option value="dayak">Dayak</option>
            <option value="smoked">Daging Asap</option>
            <option value="pedas">Pedas</option>
            <option value="minuman">Minuman</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Badge</label>
        <input {...register('badge')} className="w-full px-3 py-2 rounded-lg border border-[rgba(28,25,23,0.12)] bg-white" placeholder="cth. Favorit, Rekomendasi" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Foto Produk</label>
        <FileUpload bucket="menu-photos" currentUrl={photoUrl} onUploaded={setPhotoUrl} />
      </div>

      <div className="flex gap-2 pt-4">
        <button type="submit" disabled={isSubmitting} className="bg-[#FF4F79] text-white px-5 py-2 rounded-lg font-medium hover:bg-[#E03D63] disabled:opacity-50">
          {isSubmitting ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Menu'}
        </button>
        <button type="button" onClick={() => router.push('/admin/menu')} className="px-5 py-2 rounded-lg border border-[rgba(28,25,23,0.12)]">
          Batal
        </button>
      </div>
    </form>
  );
}

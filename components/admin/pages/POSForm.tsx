'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { MoneyDisplay } from '@/components/admin/MoneyDisplay';

type MenuItem = {
  id: string;
  name: string;
  price_cents: number;
  category: 'dayak' | 'smoked' | 'pedas' | 'minuman';
};

type CartItem = { menuItem: MenuItem; quantity: number };

export function POSForm() {
  const router = useRouter();
  const pathname = usePathname();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paidInput, setPaidInput] = useState('');
  const [paidCents, setPaidCents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/menu')
      .then((r) => r.json())
      .then((json) => {
        setItems(json.data ?? []);
        setLoading(false);
      });
  }, [pathname]);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem.id === item.id);
      if (existing) {
        return prev.map((c) => c.menuItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((c) => c.menuItem.id !== id));
      return;
    }
    setCart((prev) => prev.map((c) => c.menuItem.id === id ? { ...c, quantity: qty } : c));
  };

  const totalCents = cart.reduce((sum, c) => sum + c.menuItem.price_cents * c.quantity, 0);
  const changeCents = paidCents - totalCents;
  const canSubmit = cart.length > 0 && paidCents >= totalCents && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);
    const res = await fetch('/api/admin/pos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart.map((c) => ({ menu_item_id: c.menuItem.id, quantity: c.quantity })),
        paid_cents: paidCents,
      }),
    });
    const json = await res.json();
    if (res.ok) {
      setSuccessMsg(`Transaksi #${json.data.id.slice(0, 8)} berhasil!`);
      setCart([]);
      setPaidInput('');
      setPaidCents(0);
      // Navigate to transactions list after 1s
      setTimeout(() => router.push('/admin/transactions'), 1000);
    } else {
      setError(json.error?.message ?? 'Gagal menyimpan transaksi.');
    }
    setSubmitting(false);
  };

  // Group items by category
  const itemsByCategory = items.reduce<Record<string, MenuItem[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});
  const categoryOrder = ['dayak', 'smoked', 'pedas', 'minuman'];
  const categoryLabel: Record<string, string> = {
    dayak: 'Dayak',
    smoked: 'Daging Asap',
    pedas: 'Pedas',
    minuman: 'Minuman',
  };

  if (loading) return <p className="text-[#57534E]">Memuat...</p>;

  return (
    <div>
      {error && <div className="text-sm text-[#DC2626] bg-[rgba(220,38,38,0.05)] rounded-lg p-3 mb-4">{error}</div>}
      {successMsg && <div className="text-sm text-[#15803D] bg-[rgba(21,128,61,0.1)] rounded-lg p-3 mb-4">{successMsg}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: menu grid */}
        <div>
          {categoryOrder.map((cat) => {
            const catItems = itemsByCategory[cat];
            if (!catItems || catItems.length === 0) return null;
            return (
              <div key={cat} className="mb-4">
                <h3 className="text-xs uppercase tracking-wide text-[#57534E] mb-2">{categoryLabel[cat]}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {catItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => addToCart(item)}
                      className="bg-white p-3 rounded-lg border border-[rgba(28,25,23,0.08)] hover:border-[#FF4F79] text-left"
                    >
                      <div className="text-sm font-medium text-[#1C1917]">{item.name}</div>
                      <div className="text-xs text-[#57534E] mt-1"><MoneyDisplay cents={item.price_cents} /></div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: cart + total + cash */}
        <div className="bg-white rounded-xl border border-[rgba(28,25,23,0.08)] p-4 self-start">
          <h3 className="font-semibold text-[#1C1917] mb-2">Pesanan</h3>
          {cart.length === 0 ? (
            <p className="text-sm text-[#57534E] text-center py-4">Keranjang kosong. Klik menu di kiri untuk menambah.</p>
          ) : (
            <div className="space-y-1 mb-3 max-h-60 overflow-y-auto">
              {cart.map((c) => (
                <div key={c.menuItem.id} className="flex items-center justify-between text-sm border-b border-[rgba(28,25,23,0.04)] pb-1">
                  <div className="flex-1">
                    <div className="font-medium text-[#1C1917]">{c.menuItem.name}</div>
                    <div className="text-xs text-[#57534E]">
                      <MoneyDisplay cents={c.menuItem.price_cents} /> × {c.quantity} = <MoneyDisplay cents={c.menuItem.price_cents * c.quantity} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateQty(c.menuItem.id, c.quantity - 1)} className="w-6 h-6 rounded bg-[rgba(28,25,23,0.06)] text-[#1C1917] text-xs">−</button>
                    <span className="w-6 text-center text-sm">{c.quantity}</span>
                    <button onClick={() => updateQty(c.menuItem.id, c.quantity + 1)} className="w-6 h-6 rounded bg-[rgba(28,25,23,0.06)] text-[#1C1917] text-xs">+</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t-2 border-[#1C1917] pt-3 mt-2 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-[#57534E]">Total</span>
              <span className="font-semibold text-[#1C1917]"><MoneyDisplay cents={totalCents} /></span>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-[#57534E]">Tunai (Rp)</label>
              <input
                type="number"
                value={paidInput}
                onChange={(e) => {
                  setPaidInput(e.target.value);
                  const num = parseInt(e.target.value, 10);
                  setPaidCents(isNaN(num) ? 0 : num * 100);
                }}
                className="w-32 px-2 py-1 rounded border border-[rgba(28,25,23,0.12)] text-right"
                placeholder="0"
              />
            </div>
            {paidCents > 0 && (
              <div className="flex justify-between">
                <span className="text-[#57534E]">Kembalian</span>
                <span className={`font-semibold ${changeCents >= 0 ? 'text-[#15803D]' : 'text-[#DC2626]'}`}>
                  <MoneyDisplay cents={Math.max(0, changeCents)} />
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full mt-4 bg-[#FF4F79] text-white py-2.5 rounded-lg font-medium hover:bg-[#E03D63] disabled:opacity-50"
          >
            {submitting ? 'Menyimpan...' : 'Catat Transaksi'}
          </button>
        </div>
      </div>
    </div>
  );
}

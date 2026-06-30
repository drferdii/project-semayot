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
  const [customerPhone, setCustomerPhone] = useState('');
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
    try {
      const res = await fetch('/api/admin/pos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((c) => ({ menu_item_id: c.menuItem.id, quantity: c.quantity })),
          paid_cents: paidCents,
          customer_phone: customerPhone || undefined,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        setSuccessMsg(`Transaksi #${json.data.id.slice(0, 8).toUpperCase()} berhasil!`);
        setCart([]);
        setPaidInput('');
        setPaidCents(0);
        setCustomerPhone('');
        setTimeout(() => router.push('/admin/transactions'), 1000);
      } else {
        setError(json.error?.message ?? 'Gagal menyimpan transaksi.');
      }
    } catch {
      setError('Koneksi terputus.');
    }
    setSubmitting(false);
  };

  const itemsByCategory = items.reduce<Record<string, MenuItem[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  const categoryOrder = ['dayak', 'smoked', 'pedas', 'minuman'];
  const categoryLabel: Record<string, string> = {
    dayak: 'DAYAK TRADISIONAL',
    smoked: 'DAGING ASAP OTENTIK',
    pedas: 'CITA RASA PEDAS',
    minuman: 'MINUMAN SEGAR',
  };

  if (loading) {
    return (
      <div className="font-mono text-[10px] text-muted-foreground font-bold uppercase tracking-widest py-8 animate-pulse">
        Menyiapkan terminal kasir...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl">
      {error && (
        <div className="font-mono text-xs text-red-600 border border-red-600/20 bg-red-600/5 p-4 uppercase tracking-wider">
          KASIR_ERROR: {error}
        </div>
      )}
      {successMsg && (
        <div className="font-mono text-xs text-emerald-700 border border-emerald-600/20 bg-emerald-600/5 p-4 uppercase tracking-wider">
          KASIR_SUKSES: {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: menu grid */}
        <div className="lg:col-span-7 space-y-6">
          {categoryOrder.map((cat) => {
            const catItems = itemsByCategory[cat];
            if (!catItems || catItems.length === 0) return null;
            return (
              <div key={cat} className="space-y-3">
                <h3 className="font-mono text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                  {categoryLabel[cat]}
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {catItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => addToCart(item)}
                      className="bg-card p-4 border border-border hover:border-foreground text-left transition-all duration-200"
                    >
                      <div className="font-display font-semibold text-sm text-foreground leading-snug">
                        {item.name}
                      </div>
                      <div className="font-mono text-[10px] font-bold text-muted-foreground mt-2 tabular-nums">
                        <MoneyDisplay cents={item.price_cents} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: cart + total + cash */}
        <div className="lg:col-span-5 border border-border bg-card p-6 space-y-6">
          <h3 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider border-b border-border pb-3">
            Ringkasan Pesanan
          </h3>

          {cart.length === 0 ? (
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider py-12 text-center">
              Keranjang masih kosong. Klik hidangan di sebelah kiri.
            </p>
          ) : (
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {cart.map((c) => (
                <div key={c.menuItem.id} className="flex items-center justify-between text-xs border-b border-border/40 pb-3">
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="font-display font-semibold text-foreground truncate">{c.menuItem.name}</div>
                    <div className="font-mono text-[9px] text-muted-foreground mt-1 tabular-nums">
                      <MoneyDisplay cents={c.menuItem.price_cents} /> &times; {c.quantity}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 font-mono">
                    <button 
                      onClick={() => updateQty(c.menuItem.id, c.quantity - 1)} 
                      className="w-7 h-7 border border-border bg-background text-foreground hover:border-foreground hover:bg-foreground hover:text-background transition-colors flex items-center justify-center font-bold"
                    >
                      &minus;
                    </button>
                    <span className="w-8 text-center text-xs font-bold tabular-nums">{c.quantity}</span>
                    <button 
                      onClick={() => updateQty(c.menuItem.id, c.quantity + 1)} 
                      className="w-7 h-7 border border-border bg-background text-foreground hover:border-foreground hover:bg-foreground hover:text-background transition-colors flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Checkout Calculations */}
          <div className="border-t-[3px] border-double border-foreground pt-4 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-baseline">
              <span className="text-muted-foreground font-bold">TOTAL HARGA</span>
              <span className="font-display font-semibold text-xl text-foreground tabular-nums">
                <MoneyDisplay cents={totalCents} />
              </span>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-muted-foreground font-bold">MEMBER (NO HP)</label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-36 px-3 py-2 border border-border bg-background font-mono text-xs text-foreground text-right focus:outline-none focus:border-foreground"
                placeholder="0812..."
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-muted-foreground font-bold">UANG TUNAI (RP)</label>
              <input
                type="number"
                value={paidInput}
                onChange={(e) => {
                  setPaidInput(e.target.value);
                  const num = parseInt(e.target.value, 10);
                  setPaidCents(isNaN(num) ? 0 : num * 100);
                }}
                className="w-36 px-3 py-2 border border-border bg-background font-mono text-xs text-foreground text-right focus:outline-none focus:border-foreground"
                placeholder="0"
              />
            </div>

            {paidCents > 0 && (
              <div className="flex justify-between items-baseline border-t border-border/60 pt-3">
                <span className="text-muted-foreground font-bold">UANG KEMBALIAN</span>
                <span className={`font-bold tabular-nums text-sm ${changeCents >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                  <MoneyDisplay cents={Math.max(0, changeCents)} />
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full border border-foreground bg-foreground text-background font-mono text-[10px] font-bold py-3.5 uppercase tracking-widest hover:bg-transparent hover:text-foreground transition-all duration-300 disabled:opacity-50"
          >
            {submitting ? 'MEMPROSES TRANSAKSI...' : 'CATAT TRANSAKSI KASIR'}
          </button>
        </div>
      </div>
    </div>
  );
}

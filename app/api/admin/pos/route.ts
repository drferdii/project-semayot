import { NextResponse } from 'next/server';
import { createClient } from '@/lib/admin/supabase/server';
import { posCreateSchema } from '@/lib/admin/schemas/pos';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Sesi habis.' } },
      { status: 401 }
    );
  }

  // Check role (owner or active staff)
  const { data: roleData, error: roleErr } = await supabase.rpc('current_user_role');
  if (roleErr) {
    return NextResponse.json(
      { error: { code: 'DB_ERROR', message: 'Gagal cek role.' } },
      { status: 500 }
    );
  }
  if (roleData !== 'owner' && roleData !== 'staff') {
    return NextResponse.json(
      { error: { code: 'FORBIDDEN', message: 'Akses ditolak.' } },
      { status: 403 }
    );
  }

  // Verify user is active
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_active')
    .eq('id', user.id)
    .single();
  if (!profile?.is_active) {
    return NextResponse.json(
      { error: { code: 'FORBIDDEN', message: 'Akun tidak aktif.' } },
      { status: 403 }
    );
  }

  // Parse + validate body
  const body = await request.json();
  const parsed = posCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Data tidak valid.',
          details: parsed.error.issues.map((i) => ({ path: i.path.join('.'), issue: i.message })),
        },
      },
      { status: 400 }
    );
  }

  const { items, paid_cents, note } = parsed.data;

  // Fetch menu items for snapshot
  const itemIds = items.map((i) => i.menu_item_id);
  const { data: menuItems, error: menuErr } = await supabase
    .from('menu_items')
    .select('id, name, price_cents, is_active')
    .in('id', itemIds);
  if (menuErr) {
    return NextResponse.json(
      { error: { code: 'DB_ERROR', message: 'Gagal ambil data menu.' } },
      { status: 500 }
    );
  }
  if (!menuItems || menuItems.length !== itemIds.length) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Salah satu menu item tidak ditemukan.' } },
      { status: 404 }
    );
  }
  if (menuItems.some((m) => !m.is_active)) {
    return NextResponse.json(
      { error: { code: 'FORBIDDEN', message: 'Salah satu menu item tidak aktif.' } },
      { status: 403 }
    );
  }

  // Build a map for quick lookup
  const menuMap = new Map(menuItems.map((m) => [m.id, m]));

  // Calculate total
  let totalCents = 0;
  const txItems = items.map((item) => {
    const menu = menuMap.get(item.menu_item_id);
    if (!menu) throw new Error('unreachable');
    const subtotal = menu.price_cents * item.quantity;
    totalCents += subtotal;
    return {
      menu_item_id: menu.id,
      name_snapshot: menu.name,
      price_cents_snapshot: menu.price_cents,
      quantity: item.quantity,
      subtotal_cents: subtotal,
    };
  });

  if (paid_cents < totalCents) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Uang dibayar kurang dari total.' } },
      { status: 400 }
    );
  }

  // Create transaction + items in sequence (no transaction wrap for simplicity;
  // if items insert fails, tx will be orphaned — acceptable for MVP)
  const { data: tx, error: txErr } = await supabase
    .from('transactions')
    .insert({
      staff_id: user.id,
      total_cents: totalCents,
      paid_cents,
      note: note ?? null,
    })
    .select()
    .single();
  if (txErr) {
    return NextResponse.json(
      { error: { code: 'DB_ERROR', message: 'Gagal membuat transaksi.' } },
      { status: 500 }
    );
  }

  const { error: itemsInsertErr } = await supabase
    .from('transaction_items')
    .insert(txItems.map((i) => ({ ...i, transaction_id: tx.id })));
  if (itemsInsertErr) {
    return NextResponse.json(
      { error: { code: 'DB_ERROR', message: 'Gagal membuat item transaksi.' } },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      data: {
        ...tx,
        change_cents: paid_cents - totalCents,
        items: txItems,
      },
    },
    { status: 201 }
  );
}

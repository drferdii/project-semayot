import { NextResponse } from 'next/server';
import { createClient } from '@/lib/admin/supabase/server';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Sesi habis.' } },
      { status: 401 }
    );
  }

  const { data: role, error: roleErr } = await supabase.rpc('current_user_role');
  if (roleErr || role !== 'owner') {
    return NextResponse.json(
      { error: { code: 'FORBIDDEN', message: 'Akses ditolak. Hanya owner.' } },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') ?? new Date().toISOString().slice(0, 10);

  const { data: txs } = await supabase
    .from('transactions')
    .select('id, total_cents, paid_cents, change_cents, created_at')
    .gte('created_at', `${date}T00:00:00`)
    .lte('created_at', `${date}T23:59:59.999`);

  const { data: exps } = await supabase
    .from('expenses')
    .select('id, category, amount_cents')
    .eq('incurred_at', date);

  const txCount = txs?.length ?? 0;
  const revenueCents = (txs ?? []).reduce((sum, t) => sum + t.total_cents, 0);
  const expenseTotalCents = (exps ?? []).reduce((sum, e) => sum + e.amount_cents, 0);
  const profitCents = revenueCents - expenseTotalCents;

  const expensesByCategory = (exps ?? []).reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount_cents;
    return acc;
  }, {});

  return NextResponse.json({
    data: {
      date,
      transaction_count: txCount,
      revenue_cents: revenueCents,
      expense_total_cents: expenseTotalCents,
      profit_cents: profitCents,
      expenses_by_category: expensesByCategory,
      transactions: txs ?? [],
      expenses: exps ?? [],
    },
  });
}

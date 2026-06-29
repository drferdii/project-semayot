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
  const now = new Date();
  const year = parseInt(searchParams.get('year') ?? String(now.getFullYear()), 10);
  const month = parseInt(searchParams.get('month') ?? String(now.getMonth() + 1), 10);

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  // First day of NEXT month
  const endMonth = month === 12 ? 1 : month + 1;
  const endYear = month === 12 ? year + 1 : year;
  const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;

  const { data: txs } = await supabase
    .from('transactions')
    .select('id, total_cents, paid_cents, change_cents, created_at')
    .gte('created_at', `${startDate}T00:00:00`)
    .lt('created_at', `${endDate}T00:00:00`);

  const { data: exps } = await supabase
    .from('expenses')
    .select('id, category, amount_cents, incurred_at')
    .gte('incurred_at', startDate)
    .lt('incurred_at', endDate);

  const txCount = txs?.length ?? 0;
  const revenueCents = (txs ?? []).reduce((sum, t) => sum + t.total_cents, 0);
  const expenseTotalCents = (exps ?? []).reduce((sum, e) => sum + e.amount_cents, 0);
  const profitCents = revenueCents - expenseTotalCents;

  // Daily breakdown for the month
  const dailyBreakdown: Record<string, { revenue_cents: number; expense_cents: number }> = {};
  for (const t of txs ?? []) {
    const day = t.created_at.slice(0, 10);
    if (!dailyBreakdown[day]) dailyBreakdown[day] = { revenue_cents: 0, expense_cents: 0 };
    dailyBreakdown[day].revenue_cents += t.total_cents;
  }
  for (const e of exps ?? []) {
    if (!dailyBreakdown[e.incurred_at]) dailyBreakdown[e.incurred_at] = { revenue_cents: 0, expense_cents: 0 };
    dailyBreakdown[e.incurred_at].expense_cents += e.amount_cents;
  }

  return NextResponse.json({
    data: {
      year,
      month,
      transaction_count: txCount,
      revenue_cents: revenueCents,
      expense_total_cents: expenseTotalCents,
      profit_cents: profitCents,
      daily_breakdown: dailyBreakdown,
    },
  });
}

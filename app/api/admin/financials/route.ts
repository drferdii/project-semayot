import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value; },
          set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }); },
          remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: '', ...options }); },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current month's transactions
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0,0,0,0);

    const { data: txs, error: txError } = await supabase
      .from('transactions')
      .select('total_cents')
      .gte('created_at', startOfMonth.toISOString());
      
    if (txError) throw txError;

    const { data: expenses, error: expError } = await supabase
      .from('expenses')
      .select('amount_cents')
      .gte('date', startOfMonth.toISOString().split('T')[0]);

    if (expError) throw expError;

    const revenueCents = txs.reduce((sum, t) => sum + t.total_cents, 0);
    const opexCents = expenses.reduce((sum, e) => sum + e.amount_cents, 0);
    
    // For MVP, approximate COGS as 40% of revenue
    const cogsCents = Math.floor(revenueCents * 0.4);
    
    const netProfitCents = revenueCents - cogsCents - opexCents;

    return NextResponse.json({
      data: {
        revenue: revenueCents,
        cogs: cogsCents,
        opex: opexCents,
        net_profit: netProfitCents,
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

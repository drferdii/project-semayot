import { createClient } from '@/lib/admin/supabase/server';

function csvEscape(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function formatDate(d: string | Date): string {
  if (typeof d === 'string') return d.slice(0, 10);
  return d.toISOString().slice(0, 10);
}

function formatRupiah(cents: number): string {
  return 'Rp ' + (cents / 100).toLocaleString('id-ID');
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Sesi habis.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { data: role } = await supabase.rpc('current_user_role');
  if (role !== 'owner') {
    return new Response(JSON.stringify({ error: 'Akses ditolak.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const fromDate = from ?? '2000-01-01';
  // exclusive upper bound
  const toExclusive = to ? new Date(new Date(to).getTime() + 86400000).toISOString().slice(0, 10) : '3000-01-01';

  const { data: txs } = await supabase
    .from('transactions')
    .select('id, total_cents, change_cents, created_at')
    .gte('created_at', `${fromDate}T00:00:00`)
    .lt('created_at', `${toExclusive}T00:00:00`)
    .order('created_at');

  const { data: exps } = await supabase
    .from('expenses')
    .select('id, category, amount_cents, description, incurred_at')
    .gte('incurred_at', fromDate)
    .lt('incurred_at', toExclusive)
    .order('incurred_at');

  const lines: string[] = [];
  lines.push('Tanggal,Tipe,Kategori/Metode,Deskripsi,Amount (Rp)');

  for (const t of txs ?? []) {
    lines.push([
      csvEscape(formatDate(t.created_at)),
      csvEscape('Penjualan'),
      csvEscape('Tunai'),
      csvEscape(`Tx ${t.id.slice(0, 8)}`),
      csvEscape(formatRupiah(t.total_cents)),
    ].join(','));
  }
  for (const e of exps ?? []) {
    lines.push([
      csvEscape(e.incurred_at),
      csvEscape('Pengeluaran'),
      csvEscape(e.category),
      csvEscape(e.description ?? ''),
      csvEscape('-' + formatRupiah(e.amount_cents)),
    ].join(','));
  }

  const csv = lines.join('\n');
  const filename = `laporan-${fromDate}-to-${to ?? new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

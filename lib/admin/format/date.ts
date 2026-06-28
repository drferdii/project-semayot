const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

function parseDate(input: string): Date {
  const [y, m, d] = input.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatSingleDate(date: Date): string {
  return `${date.getDate()} ${MONTHS_ID[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatDateID(input: string): string {
  return formatSingleDate(parseDate(input));
}

export function formatDateRangeID(start: string, end: string): string {
  const s = parseDate(start);
  const e = parseDate(end);
  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
    return `${s.getDate()} - ${e.getDate()} ${MONTHS_ID[s.getMonth()]} ${s.getFullYear()}`;
  }
  if (s.getFullYear() === e.getFullYear()) {
    return `${s.getDate()} ${MONTHS_ID[s.getMonth()]} - ${e.getDate()} ${MONTHS_ID[e.getMonth()]} ${s.getFullYear()}`;
  }
  return `${formatSingleDate(s)} - ${formatSingleDate(e)}`;
}

export function getTodayID(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

import { describe, it, expect } from 'vitest';
import { formatDateID, formatDateRangeID, getTodayID } from '@/lib/admin/format/date';

describe('formatDateID', () => {
  it('formats ISO date to Indonesian format', () => {
    expect(formatDateID('2026-06-28')).toBe('28 Juni 2026');
    expect(formatDateID('2026-01-01')).toBe('1 Januari 2026');
  });
});

describe('formatDateRangeID', () => {
  it('formats same-month range', () => {
    expect(formatDateRangeID('2026-06-01', '2026-06-30')).toBe('1 - 30 Juni 2026');
  });
  it('formats cross-month range', () => {
    expect(formatDateRangeID('2026-06-28', '2026-07-05')).toBe('28 Juni - 5 Juli 2026');
  });
  it('formats cross-year range', () => {
    expect(formatDateRangeID('2025-12-30', '2026-01-02')).toBe('30 Desember 2025 - 2 Januari 2026');
  });
});

describe('getTodayID', () => {
  it('returns today in YYYY-MM-DD', () => {
    const today = getTodayID();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

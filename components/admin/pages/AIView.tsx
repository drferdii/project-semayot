'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { usePathname } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

type Period = 'today' | '7d' | '30d';

const PERIOD_LABEL: Record<Period, string> = {
  today: 'Hari ini',
  '7d': '7 hari',
  '30d': '30 hari',
};

function messageText(parts: Array<{ type: string; text?: string }>): string {
  return parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('');
}

export function AIView() {
  const pathname = usePathname();
  const [tab, setTab] = useState<'summary' | 'chat'>('summary');
  const [period, setPeriod] = useState<Period>('today');
  const [summary, setSummary] = useState<{ text: string; cached: boolean; generatedAt?: string } | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');

  const { messages, sendMessage, status, error: chatError } = useChat({
    id: 'admin-ai-chat',
    transport: new DefaultChatTransport({ api: '/api/admin/ai/chat' }),
  });
  const chatLoading = status === 'submitted' || status === 'streaming';

  const loadCached = async () => {
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const r = await fetch(`/api/admin/ai/summary?period=${period}`);
      const j = await r.json();
      if (j.data?.cached) {
        setSummary({ text: j.data.summary_text, cached: true, generatedAt: j.data.generated_at });
      } else {
        setSummary(null);
      }
    } catch {
      setSummaryError('Gagal cek cache.');
    }
    setSummaryLoading(false);
  };

  useEffect(() => {
    if (tab === 'summary') {
      loadCached();
    }
  }, [tab, period, pathname]);

  const generate = async (force = false) => {
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const r = await fetch('/api/admin/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period, force }),
      });
      const j = await r.json();
      if (!r.ok) {
        setSummaryError(j.error?.message ?? 'Gagal generate.');
        return;
      }
      setSummary({ text: j.data.summary_text, cached: j.data.cached, generatedAt: new Date().toISOString() });
    } catch {
      setSummaryError('Gagal generate.');
    }
    setSummaryLoading(false);
  };

  const onChatSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text || chatLoading) return;
    sendMessage({ text });
    setChatInput('');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#1C1917]">AI Summary</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setTab('summary')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'summary' ? 'bg-[#FF4F79] text-white' : 'bg-[rgba(28,25,23,0.06)] text-[#1C1917]'}`}
          >Ringkasan</button>
          <button
            onClick={() => setTab('chat')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'chat' ? 'bg-[#FF4F79] text-white' : 'bg-[rgba(28,25,23,0.06)] text-[#1C1917]'}`}
          >Tanya AI</button>
        </div>
      </div>

      {tab === 'summary' && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <label className="text-sm text-[#57534E]">Periode:</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as Period)}
              className="px-3 py-1.5 rounded border border-[rgba(28,25,23,0.12)] text-sm"
            >
              {(Object.keys(PERIOD_LABEL) as Period[]).map((p) => (
                <option key={p} value={p}>{PERIOD_LABEL[p]}</option>
              ))}
            </select>
            {summary?.cached && (
              <span className="text-xs bg-[rgba(21,128,61,0.1)] text-[#15803D] px-2 py-0.5 rounded">Cached</span>
            )}
          </div>

          {summaryError && <div className="text-sm text-[#DC2626] bg-[rgba(220,38,38,0.05)] rounded-lg p-3 mb-3">{summaryError}</div>}

          {summaryLoading ? (
            <p className="text-[#57534E]">Memuat...</p>
          ) : summary ? (
            <div className="bg-white rounded-xl border border-[rgba(28,25,23,0.08)] p-6">
              <pre className="whitespace-pre-wrap font-sans text-sm text-[#1C1917]">{summary.text}</pre>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => generate(true)}
                  disabled={summaryLoading}
                  className="text-sm bg-[#1C1917] text-white px-3 py-1.5 rounded hover:bg-[#0F0E0C] disabled:opacity-50"
                >Refresh (regenerate)</button>
                <button
                  onClick={() => navigator.clipboard?.writeText(summary.text)}
                  className="text-sm bg-[rgba(28,25,23,0.06)] text-[#1C1917] px-3 py-1.5 rounded hover:bg-[rgba(28,25,23,0.1)]"
                >Salin</button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[rgba(28,25,23,0.08)] p-6 text-center">
              <p className="text-[#57534E] mb-3">Belum ada ringkasan untuk periode ini.</p>
              <button
                onClick={() => generate(false)}
                disabled={summaryLoading}
                className="bg-[#FF4F79] text-white px-5 py-2 rounded-lg font-medium hover:bg-[#E03D63] disabled:opacity-50"
              >Generate Ringkasan</button>
            </div>
          )}
        </div>
      )}

      {tab === 'chat' && (
        <div>
          {chatError && <div className="text-sm text-[#DC2626] bg-[rgba(220,38,38,0.05)] rounded-lg p-3 mb-3">Error: {chatError.message}</div>}

          <div className="bg-white rounded-xl border border-[rgba(28,25,23,0.08)] p-4 mb-3 max-h-96 overflow-y-auto space-y-3">
            {messages.length === 0 ? (
              <p className="text-sm text-[#57534E] text-center py-8">
                Tanya tentang penjualan, menu, expense, dll. AI tahu data bisnis hari ini.
              </p>
            ) : (
              messages.map((m) => (
                <div key={m.id} className={`p-3 rounded-lg max-w-[80%] ${m.role === 'user' ? 'bg-[#FF4F79] text-white ml-auto' : 'bg-[#FAF6F0] text-[#1C1917]'}`}>
                  <div className="text-xs opacity-70 mb-1">{m.role === 'user' ? 'Anda' : 'Tanya Semayot'}</div>
                  <div className="text-sm whitespace-pre-wrap">{messageText(m.parts)}</div>
                </div>
              ))
            )}
            {chatLoading && (
              <div className="text-sm text-[#57534E] italic">Mengetik...</div>
            )}
          </div>

          <form onSubmit={onChatSubmit} className="flex gap-2">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Tanya soal penjualan, menu, expense..."
              className="flex-1 px-4 py-2.5 rounded-lg border border-[rgba(28,25,23,0.12)] bg-white"
              disabled={chatLoading}
            />
            <button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              className="bg-[#FF4F79] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#E03D63] disabled:opacity-50"
            >Kirim</button>
          </form>
        </div>
      )}
    </div>
  );
}

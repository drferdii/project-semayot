'use client';

import React, { useState, useEffect } from 'react';
import { MoneyDisplay } from '@/components/admin/MoneyDisplay';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { createClient } from '@/lib/admin/supabase/client';
import { SemayotMascot } from '@/components/semayot/semayot-mascot';
import { 
  Activity, 
  CloudSun, 
  Database, 
  Terminal, 
  TrendingUp, 
  Award, 
  Users, 
  Compass, 
  TrendingDown, 
  TrendingUp as TrendUpIcon 
} from 'lucide-react';

function messageText(parts: Array<{ type: string; text?: string }>): string {
  return parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('');
}

export default function OverviewPage() {
  const [userId, setUserId] = useState<string>('MEMUAT_ID...');
  const [userRole, setUserRole] = useState<string>('STAFF');
  const [userFullName, setUserFullName] = useState<string>('Chief');
  const [news, setNews] = useState<string>('Mendapatkan berita bisnis kuliner...');
  const [greeting, setGreeting] = useState({ title: 'LOG SESI AKTIF', msg: 'Semoga hari kerja Anda menyenangkan dan produktif.' });
  
  // Supabase Auth
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id.slice(0, 12).toUpperCase());
        // Fetch profile role and full name
        supabase
          .from('profiles')
          .select('role, full_name')
          .eq('id', user.id)
          .single()
          .then(({ data }) => {
            if (data?.role) setUserRole(data.role.toUpperCase());
            if (data?.full_name) setUserFullName(data.full_name);
          });
      }
    });

    // Simulative Business News
    const businessNews = [
      'Harga cabai rawit Kalbar stabil di Rp 45.000/kg; Pasokan komoditas aman.',
      'Permintaan produk daging asap lokal meningkat 15% menjelang festival pertengahan tahun.',
      'Inflasi bahan pokok Kalbar terkendali di angka 2.1%; Daya beli masyarakat stabil.',
      'Rantai pasok bahan baku daging babi dari peternak lokal Bengkayang berjalan lancar.'
    ];
    setNews(businessNews[Math.floor(Math.random() * businessNews.length)]);

    // Dynamic Time Greeting
    const hours = new Date().getHours();
    let title = 'HALO KAWAN SEMAYOT · SELAMAT PAGI 🌅';
    let msg = 'Mari persiapkan bahan segar dan nyalakan tungku panggangan dengan semangat pagi!';

    if (hours >= 11 && hours < 15) {
      title = 'LAYANAN MAKAN SIANG · SELAMAT SIANG ☀️';
      msg = 'Jam makan siang dimulai. Tetap jaga kerapihan pelayanan dan pastikan pesanan keluar tepat waktu.';
    } else if (hours >= 15 && hours < 18) {
      title = 'TREN SORE HARI · SELAMAT SORE ☕';
      msg = 'Sore hari biasanya menjadi puncak pesanan takeaway. Mari rapikan meja kasir dan cek stok bahan asap.';
    } else if (hours >= 18 || hours < 5) {
      title = 'KONSOL MALAM HARI · SELAMAT MALAM 🌙';
      msg = 'Layanan malam hari sedang berjalan. Pastikan kebersihan area makan sebelum jam tutup pukul 21:00.';
    }
    setGreeting({ title, msg });
  }, []);

  // AI Chat Assistant
  const { messages, sendMessage, status, error: chatError } = useChat({
    id: 'admin-overview-chat',
    transport: new DefaultChatTransport({ api: '/api/admin/ai/chat' }),
  });
  const chatLoading = status === 'submitted' || status === 'streaming';
  const [chatInput, setChatInput] = useState('');

  const onChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text || chatLoading) return;
    sendMessage({ text });
    setChatInput('');
  };

  const kpis = [
    { label: 'Penjualan Hari Ini', value: 'Rp 1.450.000', delta: '+12,4%', positive: true, spark: '0,21 9,19 18,17 27,15 36,16 45,13 55,10 64,8 73,7 82,5 91,3 100,1' },
    { label: 'Rata-rata Pembelian', value: 'Rp 68.500', delta: '+4,2%', positive: true, spark: '0,16 9,14 18,12 27,14 36,10 45,8 55,10 64,6 73,4 82,3 91,2 100,1' },
    { label: 'Total Transaksi', value: '24 Transaksi', delta: '+18,2%', positive: true, spark: '0,22 9,20 18,18 27,15 36,12 45,14 55,10 64,7 73,6 82,4 91,2 100,1' },
    { label: 'Indeks Kepuasan', value: '98,2%', delta: '+1,8pp', positive: true, spark: '0,18 9,17 18,15 27,14 36,12 45,11 55,9 64,8 73,6 82,5 91,3 100,2' },
  ];

  const recentTransactions = [
    { time: '19:42:01', id: 'TX-99283-A', menu: 'Babi Panggang Garing + Es Teh Manis', total: 'Rp 65.000', status: 'TERVERIFIKASI', casher: 'Josep' },
    { time: '19:35:12', id: 'TX-99282-M', menu: 'Babi Rica-Rica + Sayur Singkong', total: 'Rp 58.000', status: 'PROSES', casher: 'Novia' },
    { time: '19:12:45', id: 'TX-99281-F', menu: 'Babi Panggang Khas Dayak (Besar)', total: 'Rp 120.000', status: 'TERVERIFIKASI', casher: 'Josep' },
    { time: '18:55:30', id: 'TX-99280-D', menu: 'Sop Babi Wortel + Nasi Putih', total: 'Rp 45.000', status: 'TERVERIFIKASI', casher: 'Novia' },
  ];

  return (
    <div className="animate-fade-in py-6 page-overview select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Core Analytics & Operations */}
        <div className="lg:col-span-8 space-y-8">

          {/* PERSONALIZED WELCOME CARD */}
          <div className="border border-border bg-[#FFF0F3] p-8 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow duration-300">
            <div className="space-y-3 z-10 text-center sm:text-left">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#FF4F79] font-black block">
                {greeting.title}
              </span>
              <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-foreground uppercase leading-[1.05]">
                Selamat Datang Kembali, {userFullName}!
              </h1>
              <p className="text-xs text-muted max-w-[50ch] leading-relaxed">
                {greeting.msg}
              </p>
            </div>
            <div className="flex-shrink-0 z-10 bg-background rounded-full p-2 border border-border shadow-sm select-none">
              <SemayotMascot variant="welcome" size={110} />
            </div>
            {/* Decorative elements */}
            <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-[#FFC2D6]/20 blur-xl pointer-events-none" />
          </div>
          
          {/* FIRST SECTION: Metrik Operasional Utama */}
          <section className="space-y-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#FF4F79] block font-black">
              METRIK OPERASIONAL UTAMA
            </span>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
              {kpis.map((k, i) => (
                <div 
                  key={i} 
                  className="border border-border border-top-[3px] border-t-foreground p-5 bg-card hover:bg-background transition-colors duration-300 flex flex-col justify-between"
                  style={{ borderTopWidth: '3px' }}
                >
                  <div>
                    <div className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-muted mb-2">
                      {k.label}
                    </div>
                    <div className="font-display text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                      {k.value}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="font-mono text-[9px] font-bold text-emerald-700 bg-emerald-500/5 px-2 py-0.5 border border-emerald-600/20 inline-block uppercase tracking-wider">
                      {k.delta}
                    </div>
                    <div className="mt-3 h-5 opacity-30">
                      <svg className="w-full h-full" viewBox="0 0 100 24" preserveAspectRatio="none">
                        <polyline points={k.spark} fill="none" stroke="var(--foreground)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
                        <polygon points={`${k.spark} 100,24 0,24`} fill="var(--foreground)" opacity="0.05" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECOND SECTION: Tren Penjualan & Distribusi Porsi */}
          <section className="space-y-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#FF4F79] block font-black">
              ANALISIS TREN & DISTRIBUSI MENU
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sales Trend */}
              <div className="border border-border p-6 bg-card space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider">
                    Tren Penjualan Harian (7 Hari Terakhir)
                  </h3>
                </div>
                <div className="w-full h-44 opacity-90">
                  <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                    <line x1="40" y1="20" x2="480" y2="20" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4 2" />
                    <line x1="40" y1="80" x2="480" y2="80" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4 2" />
                    <line x1="40" y1="140" x2="480" y2="140" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4 2" />
                    <line x1="40" y1="180" x2="480" y2="180" stroke="var(--border)" strokeWidth="1" />
                    
                    <polygon points="40,180 110,130 180,150 250,90 320,105 390,60 460,40 460,180" fill="var(--foreground)" opacity="0.03" />
                    <polyline points="40,180 110,130 180,150 250,90 320,105 390,60 460,40" fill="none" stroke="var(--foreground)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                    
                    {[[40,180],[110,130],[180,150],[250,90],[320,105],[390,60],[460,40]].map(([cx,cy],i) => (
                      <circle key={i} cx={cx} cy={cy} r="3.5" fill="var(--card)" stroke="var(--foreground)" strokeWidth="2" />
                    ))}
                  </svg>
                  <div className="flex justify-between font-mono text-[9px] text-muted font-bold mt-3 px-8">
                    <span>SEN</span><span>SEL</span><span>RAB</span><span>KAM</span><span>JUM</span><span>SAB</span><span>MIN</span>
                  </div>
                </div>
              </div>

              {/* Product Portion */}
              <div className="border border-border p-6 bg-card space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider">
                    Distribusi Porsi Penjualan Menu
                  </h3>
                </div>
                <div className="w-full h-44 flex flex-col justify-center gap-3">
                  {[
                    { label: 'Babi Panggang Garing', pct: 45, val: 'Rp 19,2jt' },
                    { label: 'Babi Rica-Rica', pct: 28, val: 'Rp 11,9jt' },
                    { label: 'Sop Babi Wortel', pct: 15, val: 'Rp 6,4jt' },
                    { label: 'Es Teh Manis & Lainnya', pct: 12, val: 'Rp 5,1jt' }
                  ].map((bar, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between font-mono text-[9px] font-bold">
                        <span className="text-foreground uppercase tracking-wider">{bar.label}</span>
                        <span className="text-muted">{bar.val} ({bar.pct}%)</span>
                      </div>
                      <div className="h-2 bg-background border border-border/60 overflow-hidden">
                        <div 
                          className="h-full bg-[#1C1917] transition-all duration-1000" 
                          style={{ width: `${bar.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* THIRD SECTION: Proyeksi & Analisis AI */}
          <section className="space-y-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#FF4F79] block font-black">
              PROYEKSI & SENTIMEN AGEN AI
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* AI Sentiment Radar */}
              <div className="border border-border p-6 bg-card space-y-4 flex flex-col justify-between">
                <div className="flex justify-between items-center border-b border-border/40 pb-2">
                  <h3 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider">Sentimen Menu Konsumen</h3>
                  <div className="flex items-center gap-1.5 font-mono text-[8px] font-bold text-emerald-700 bg-emerald-500/5 px-2 py-0.5 border border-emerald-600/20">
                    <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse-soft" />
                    <span>AKTIF</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Babi Panggang Garing', sentiment: '98% POSITIF', color: 'text-emerald-700' },
                    { label: 'Babi Rica-Rica', sentiment: '94% POSITIF', color: 'text-emerald-700' },
                    { label: 'Sop Babi Wortel', sentiment: '88% NETRAL', color: 'text-muted' },
                  ].map((s, idx) => (
                    <div key={idx} className="flex justify-between items-center font-mono text-[10px] border-b border-border/20 pb-1">
                      <span className="text-foreground font-bold uppercase">{s.label}</span>
                      <span className={`font-black tracking-wider ${s.color}`}>{s.sentiment}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Revenue Forecaster */}
              <div className="border border-border p-6 bg-card space-y-4 flex flex-col justify-between">
                <div className="flex justify-between items-center border-b border-border/40 pb-2">
                  <h3 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider">Prediksi Omset Harian</h3>
                  <span className="font-mono text-[9px] text-[#FF4F79] font-black tracking-wider">94% AKURASI</span>
                </div>
                <div className="space-y-2">
                  <span className="font-mono text-[8px] text-muted font-bold block uppercase tracking-widest">PROYEKSI HARI INI</span>
                  <div className="font-display font-extrabold text-2xl text-foreground">Rp 1.850.000</div>
                  <p className="font-sans text-xs text-muted leading-relaxed">
                    Tren menunjukkan adanya kenaikan pesanan Babi Panggang Garing menjelang jam makan malam.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FOURTH SECTION: Transaksi Terkini */}
          <section className="space-y-4">
            <div className="flex justify-between items-end border-b border-border pb-3">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted block mb-1 font-bold">
                  Buku Log Transaksi Langsung
                </span>
                <h3 className="font-display text-lg font-bold text-foreground uppercase tracking-wider">
                  Transaksi Terkini
                </h3>
              </div>
              <span className="font-mono text-[8px] font-bold text-[#FF4F79] uppercase tracking-widest hidden md:inline">
                REAL-TIME SECARA SYNC
              </span>
            </div>

            <div className="overflow-x-auto border border-border">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border bg-card">
                    <th className="text-left font-mono text-[9px] uppercase text-muted py-4 px-4 font-bold tracking-widest">Waktu</th>
                    <th className="text-left font-mono text-[9px] uppercase text-muted py-4 px-4 font-bold tracking-widest">ID Transaksi</th>
                    <th className="text-left font-mono text-[9px] uppercase text-muted py-4 px-4 font-bold tracking-widest">Item Belanja / Menu</th>
                    <th className="text-left font-mono text-[9px] uppercase text-muted py-4 px-4 font-bold tracking-widest">Kasir</th>
                    <th className="text-right font-mono text-[9px] uppercase text-muted py-4 px-4 font-bold tracking-widest">Nominal</th>
                    <th className="text-right font-mono text-[9px] uppercase text-muted py-4 px-4 font-bold tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx, i) => (
                    <tr key={i} className="border-b border-border/60 group hover:bg-card/30 transition-colors duration-200">
                      <td className="py-4 px-4 font-mono text-[10px] text-muted font-bold">{tx.time}</td>
                      <td className="py-4 px-4 font-mono text-[10px] font-bold text-foreground">{tx.id}</td>
                      <td className="py-4 px-4">
                        <div className="font-display font-medium text-sm text-foreground tracking-tight">
                          {tx.menu}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono text-[9px] font-bold text-muted uppercase tracking-widest">
                        {tx.casher}
                      </td>
                      <td className="py-4 px-4 font-mono text-xs font-bold text-foreground text-right tabular-nums">
                        {tx.total}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span 
                          className={`inline-block font-mono text-[8px] font-bold px-2 py-0.5 border uppercase tracking-wider ${
                            tx.status === 'TERVERIFIKASI' 
                              ? 'border-emerald-600/30 text-emerald-700 bg-emerald-500/5' 
                              : 'border-border text-muted bg-background/50'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: Live System, Assistant & Status (Symmetric Sidebar) */}
        <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-28 z-20">
          
          {/* AI Assistant Chatbox */}
          <div className="border border-border bg-card p-6 h-[420px] flex flex-col justify-between">
            <div className="border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#FFC2D6] flex items-center justify-center text-xs shadow-sm select-none">
                  🐷
                </div>
                <div>
                  <span className="font-mono text-[8px] font-bold text-[#FF4F79] uppercase tracking-[0.15em] block">
                    ASISTEN_SISTEM
                  </span>
                  <h3 className="font-display font-bold text-sm text-foreground uppercase tracking-wider leading-none mt-0.5">
                    Konsultasi Agen AI
                  </h3>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto py-3 space-y-4 font-mono text-xs leading-relaxed">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-75 px-4 select-none">
                  <SemayotMascot variant="menu" size={85} />
                  <p className="font-mono text-[9px] text-muted uppercase tracking-widest max-w-[220px] leading-relaxed font-bold">
                    Tanyakan apa saja seputar data transaksi hari ini atau analisis menu, Chief.
                  </p>
                </div>
              ) : (
                messages.map((m) => (
                  <div 
                    key={m.id} 
                    className={`p-3 border max-w-[90%] ${
                      m.role === 'user' 
                        ? 'border-[#1C1917] bg-[#1C1917] text-white ml-auto' 
                        : 'border-border bg-background text-foreground'
                    }`}
                  >
                    <div className="text-[8px] opacity-60 font-bold uppercase tracking-widest mb-1">
                      {m.role === 'user' ? 'CHIEF' : 'AGEN_JEAN'}
                    </div>
                    <div className="font-sans text-xs whitespace-pre-wrap leading-normal">
                      {messageText(m.parts)}
                    </div>
                  </div>
                ))
              )}
              {chatLoading && (
                <div className="font-mono text-[8px] text-muted font-bold uppercase tracking-widest animate-pulse pl-1">
                  Kueri data diproses...
                </div>
              )}
              {chatError && (
                <div className="font-mono text-[9px] text-red-600 border border-red-600/25 bg-red-600/5 p-3 uppercase tracking-wider">
                  ERROR: {chatError.message}
                </div>
              )}
            </div>

            {/* Chat Input Form */}
            <form onSubmit={onChatSubmit} className="pt-3 border-t border-border flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Tanya agent..."
                className="flex-1 px-3 py-2 border border-border bg-background font-mono text-xs text-foreground focus:outline-none focus:border-foreground"
                disabled={chatLoading}
              />
              <button
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                className="border border-[#1C1917] bg-[#1C1917] text-white font-mono text-[9px] font-bold px-4 py-2.5 uppercase tracking-widest hover:bg-transparent hover:text-foreground transition-all duration-300 disabled:opacity-50 cursor-pointer"
              >
                KIRIM
              </button>
            </form>
          </div>

          {/* System Status Sidebar Card */}
          <div className="border border-border bg-card p-6 space-y-6">
            <div className="border-b border-border pb-3 flex justify-between items-center">
              <div>
                <span className="font-mono text-[8px] font-bold text-[#FF4F79] uppercase tracking-[0.15em] block">
                  STATUS_SISTEM
                </span>
                <h3 className="font-display font-bold text-sm text-foreground uppercase tracking-wider leading-none mt-0.5">
                  Konsol Diagnostik
                </h3>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold text-emerald-700 bg-emerald-500/5 px-2 py-0.5 border border-emerald-600/20">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse-soft" />
                <span>ONLINE</span>
              </div>
            </div>

            {/* Structured Info Stack */}
            <div className="space-y-4 font-mono text-[10px]">
              {/* User Session Info */}
              <div className="space-y-1.5">
                <span className="text-muted font-bold uppercase tracking-wider block">PENGGUNA AKTIF</span>
                <div className="flex justify-between items-center bg-background border border-border/50 px-3 py-2">
                  <span className="font-bold text-foreground truncate">{userId}</span>
                  <span className="text-[#FF4F79] font-black uppercase text-[8px] tracking-wider border border-[#FF4F79]/30 px-1.5 py-0.5">
                    {userRole}
                  </span>
                </div>
              </div>

              {/* Stock Index */}
              <div className="space-y-1.5">
                <span className="text-muted font-bold uppercase tracking-wider block">STOK DAGING ASAP</span>
                <div className="bg-background border border-border/50 p-3 space-y-2">
                  <div className="flex justify-between font-bold">
                    <span>INVENTARIS</span>
                    <span className="text-foreground">84% [AMAN]</span>
                  </div>
                  <div className="h-1.5 bg-card border border-border/60 overflow-hidden">
                    <div className="h-full bg-foreground" style={{ width: '84%' }} />
                  </div>
                </div>
              </div>

              {/* Weather Info */}
              <div className="space-y-1.5">
                <span className="text-muted font-bold uppercase tracking-wider block">CUACA BENGKAYANG</span>
                <div className="bg-background border border-border/50 p-3">
                  <div className="font-display font-bold text-sm text-foreground uppercase">26°C · Hujan Ringan</div>
                  <div className="text-[8px] text-muted font-bold mt-1 uppercase tracking-wide">Kelembaban: 88% | Angin: 12 km/h</div>
                </div>
              </div>

              {/* Diagnostics List */}
              <div className="space-y-1.5">
                <span className="text-muted font-bold uppercase tracking-wider block">KONEKSI PERIFERAL</span>
                <div className="bg-background border border-border/50 p-3 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted">PRINTER KASIR</span>
                    <span className="text-emerald-700 font-bold">[ONLINE]</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">DATABASE SYNC</span>
                    <span className="text-emerald-700 font-bold">[12ms]</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">SUPABASE AUTH</span>
                    <span className="text-emerald-700 font-bold">[NORMAL]</span>
                  </div>
                </div>
              </div>

              {/* Business News */}
              <div className="space-y-1.5">
                <span className="text-muted font-bold uppercase tracking-wider block">BERITA BISNIS LOKAL</span>
                <div className="bg-background border border-border/50 p-3 leading-relaxed text-foreground font-sans">
                  {news}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

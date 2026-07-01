'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/admin/supabase/client';

export function LoginForm({ redirect }: { redirect: string }) {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
      setError(
        'KONFIGURASI_ERROR: Variabel lingkungan Supabase belum diatur di server hosting (Vercel). Silakan tambahkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di panel kontrol Vercel Anda.'
      );
      return;
    }

    startTransition(async () => {
      try {
        const supabase = createClient();
        
        // Timeout 15 detik untuk menghindari UI hang
        const timeoutPromise = new Promise<{ error: Error }>((_, reject) => {
          setTimeout(() => reject(new Error('Koneksi ke server terlalu lama (Timeout). Silakan coba lagi nanti.')), 15000);
        });

        // Race antara autentikasi dan timeout
        const authPromise = supabase.auth.signInWithPassword({ email, password });
        
        const response = await Promise.race([authPromise, timeoutPromise]) as Awaited<typeof authPromise>;

        if (response.error) {
          setError('Email atau password salah.');
          return;
        }

        router.push(redirect);
        router.refresh();
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan jaringan atau server tidak merespons.');
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-3xl font-bold text-[#1C1917] mb-2">🐷 SEMAYOT</div>
          <div className="text-sm text-[#57534E]">Admin Dashboard</div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(28,25,23,0.08)] space-y-4">
          {error && (
            <div className="text-sm text-[#DC2626] bg-[rgba(220,38,38,0.05)] rounded-lg p-3">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#1C1917] mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-[rgba(28,25,23,0.12)] bg-[#FCF9F2] focus:outline-none focus:ring-2 focus:ring-[#FF4F79]"
              placeholder="admin@semayot.id"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#1C1917] mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-[rgba(28,25,23,0.12)] bg-[#FCF9F2] focus:outline-none focus:ring-2 focus:ring-[#FF4F79]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#FF4F79] text-white py-2.5 rounded-lg font-medium hover:bg-[#E03D63] disabled:opacity-50 transition-colors"
          >
            {isPending ? 'Masuk...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}

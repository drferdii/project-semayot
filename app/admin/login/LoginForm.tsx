'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export function LoginForm({ redirect }: { redirect: string }) {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError('Email atau password salah.');
        return;
      }
      router.push(redirect);
      router.refresh();
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

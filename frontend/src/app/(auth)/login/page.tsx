'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';

type LoginPayload = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginPayload>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex flex-col items-center leading-none group">
            <span
              className="text-2xl font-light tracking-[0.25em] uppercase text-[var(--gold)]"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              Maddheshiya
            </span>
            <span className="text-[9px] tracking-[0.5em] uppercase text-white/40 mt-1">
              Studio
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-[#111111] border border-[var(--gold)]/20 p-8">
          <h1
            className="text-xl font-light tracking-[0.2em] uppercase text-white mb-1 text-center"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Welcome Back
          </h1>
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 text-center mb-8">
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-[0.3em] uppercase text-white/40 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-[#0A0A0A] border border-white/10 text-white text-sm px-4 py-3 placeholder-white/20 focus:outline-none focus:border-[var(--gold)]/50 transition-colors"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.3em] uppercase text-white/40 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#0A0A0A] border border-white/10 text-white text-sm px-4 py-3 placeholder-white/20 focus:outline-none focus:border-[var(--gold)]/50 transition-colors"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs tracking-wide">{error}</p>
            )}

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-[10px] tracking-widest uppercase text-white/30 hover:text-[var(--gold)] transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-xs tracking-[0.3em] uppercase border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <p className="text-[10px] tracking-widest uppercase text-white/30 text-center mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[var(--gold)] hover:opacity-80 transition-opacity">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

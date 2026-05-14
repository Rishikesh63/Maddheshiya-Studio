'use client';

import { useState } from 'react';
import Link from 'next/link';
import { apiUrl } from '@/app/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch(apiUrl('/api/forgot-password/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error('Failed to send reset email');

      setMessage('Password reset link sent. Please check your inbox.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
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
            Forgot Password
          </h1>
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 text-center mb-8">
            We&apos;ll send you a reset link
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {message && (
              <p className="text-green-400 text-xs tracking-wide">{message}</p>
            )}
            {error && (
              <p className="text-red-400 text-xs tracking-wide">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-xs tracking-[0.3em] uppercase border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <p className="text-[10px] tracking-widest uppercase text-white/30 text-center mt-6">
            Remember your password?{' '}
            <Link href="/login" className="text-[var(--gold)] hover:opacity-80 transition-opacity">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

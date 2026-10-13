'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/app/context/AuthContext';
import { apiUrl } from '@/app/lib/api';

type LoginPayload = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginPayload>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const { login, loginWithTokens } = useAuth();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      setError('');
      try {
        const res = await fetch(apiUrl('/api/auth/google/'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: tokenResponse.access_token }),
        });
        const data = await res.json();
        if (res.ok) {
          await loginWithTokens(data.access, data.refresh);
          router.push('/');
        } else {
          setError(data.error ?? 'Google login failed. Please try again.');
        }
      } catch {
        setError('Cannot connect to server. Please try again.');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => setError('Google sign-in was cancelled or failed.'),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      router.push('/');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg === 'email_not_verified') {
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
        return;
      } else if (msg.toLowerCase().includes('failed to fetch') || msg.toLowerCase().includes('networkerror')) {
        setError('Cannot connect to server. Please try again in a moment.');
      } else {
        setError(msg || 'Invalid email or password');
      }
      setFailedAttempts((n) => n + 1);
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
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-[#0A0A0A] border border-white/10 text-white text-sm px-4 py-3 pr-11 placeholder-white/20 focus:outline-none focus:border-[var(--gold)]/50 transition-colors"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-white/30 hover:text-white/60 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs tracking-wide">{error}</p>
            )}

            {/* No-account prompt — appears after first failed attempt */}
            {failedAttempts >= 1 && (
              <div className="border border-[var(--gold)]/20 bg-[var(--gold)]/5 px-4 py-3">
                <p className="text-[10px] tracking-widest uppercase text-white/50 mb-2">
                  Don&apos;t have an account yet?
                </p>
                <Link
                  href="/register"
                  className="block w-full py-2 text-center text-[10px] tracking-[0.25em] uppercase bg-[var(--gold)] text-black font-medium hover:opacity-90 transition-opacity"
                >
                  Create Account
                </Link>
              </div>
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

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[9px] tracking-widest uppercase text-white/20">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google login */}
          <button
            onClick={() => handleGoogleLogin()}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 border border-white/10 text-white/60 text-xs tracking-wide hover:border-white/30 hover:text-white/90 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {/* Google SVG icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {googleLoading ? 'Signing in...' : 'Continue with Google'}
          </button>

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

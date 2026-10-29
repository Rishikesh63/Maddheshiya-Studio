'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Phone, Mail } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/app/context/AuthContext';
import { apiUrl } from '@/app/lib/api';

const GOOGLE_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function LoginPage() {
  const [tab, setTab] = useState<'email' | 'mobile'>('email');

  // Email/password state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  // Mobile OTP state
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const [error, setError] = useState('');
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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg === 'email_not_verified') {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        return;
      }
      setError(msg.toLowerCase().includes('failed to fetch') ? 'Cannot connect to server.' : (msg || 'Invalid email or password'));
      setFailedAttempts((n) => n + 1);
    } finally {
      setLoading(false);
    }
  };

  const handleSendPhoneOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 10) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }
    setPhoneLoading(true);
    try {
      const res = await fetch(apiUrl('/api/users/send-phone-otp/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: digits, name: name.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/verify-phone?phone=${encodeURIComponent(digits)}`);
      } else if (data.is_new && data.error?.includes('name')) {
        setIsNewUser(true);
        setError(data.error);
      } else {
        setError(data.error ?? 'Failed to send OTP. Please try again.');
      }
    } catch {
      setError('Cannot connect to server. Please try again.');
    } finally {
      setPhoneLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex flex-col items-center leading-none">
            <span className="text-2xl font-light tracking-[0.25em] uppercase text-[var(--gold)]" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Maddheshiya
            </span>
            <span className="text-[9px] tracking-[0.5em] uppercase text-white/40 mt-1">Studio</span>
          </Link>
        </div>

        <div className="bg-[#111111] border border-[var(--gold)]/20 p-8">
          <h1 className="text-xl font-light tracking-[0.2em] uppercase text-white mb-1 text-center" style={{ fontFamily: 'var(--font-cormorant)' }}>
            Welcome Back
          </h1>
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 text-center mb-6">
            Sign in to your account
          </p>

          {/* Tab switcher */}
          <div className="flex border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => { setTab('email'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] tracking-widest uppercase transition-all ${
                tab === 'email'
                  ? 'bg-[var(--gold)] text-black font-medium'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              <Mail size={11} /> Email
            </button>
            <button
              type="button"
              onClick={() => { setTab('mobile'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] tracking-widest uppercase transition-all ${
                tab === 'mobile'
                  ? 'bg-[var(--gold)] text-black font-medium'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              <Phone size={11} /> Mobile OTP
            </button>
          </div>

          {/* ── Email / Password tab ──────────────────────────────── */}
          {tab === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] tracking-[0.3em] uppercase text-white/40 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full bg-[#0A0A0A] border border-white/10 text-white text-sm px-4 py-3 placeholder-white/20 focus:outline-none focus:border-[var(--gold)]/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.3em] uppercase text-white/40 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full bg-[#0A0A0A] border border-white/10 text-white text-sm px-4 py-3 pr-11 placeholder-white/20 focus:outline-none focus:border-[var(--gold)]/50 transition-colors"
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-white/30 hover:text-white/60 transition-colors" tabIndex={-1}>
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-400 text-xs tracking-wide">{error}</p>}

              {failedAttempts >= 1 && (
                <div className="border border-[var(--gold)]/20 bg-[var(--gold)]/5 px-4 py-3">
                  <p className="text-[10px] tracking-widest uppercase text-white/50 mb-2">Don&apos;t have an account?</p>
                  <Link href="/register" className="block w-full py-2 text-center text-[10px] tracking-[0.25em] uppercase bg-[var(--gold)] text-black font-medium hover:opacity-90 transition-opacity">
                    Create Account
                  </Link>
                </div>
              )}

              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-[10px] tracking-widest uppercase text-white/30 hover:text-[var(--gold)] transition-colors">
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 text-xs tracking-[0.3em] uppercase border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>
          )}

          {/* ── Mobile OTP tab ────────────────────────────────────── */}
          {tab === 'mobile' && (
            <form onSubmit={handleSendPhoneOTP} className="space-y-4">
              <div>
                <label className="block text-[10px] tracking-[0.3em] uppercase text-white/40 mb-2">Mobile Number</label>
                <div className="flex">
                  <span className="flex items-center px-3 bg-white/5 border border-r-0 border-white/10 text-white/40 text-sm">+91</span>
                  <input
                    type="tel"
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    required
                    maxLength={10}
                    autoComplete="tel"
                    className="flex-1 bg-[#0A0A0A] border border-white/10 text-white text-sm px-4 py-3 placeholder-white/20 focus:outline-none focus:border-[var(--gold)]/50 transition-colors"
                  />
                </div>
              </div>

              {/* Name field — always shown but marked optional; required only for new users */}
              <div>
                <label className="block text-[10px] tracking-[0.3em] uppercase text-white/40 mb-2">
                  Your Name {isNewUser ? '*' : <span className="text-white/20">(new users only)</span>}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rishikesh Maddhesiya"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isNewUser}
                  autoComplete="name"
                  className="w-full bg-[#0A0A0A] border border-white/10 text-white text-sm px-4 py-3 placeholder-white/20 focus:outline-none focus:border-[var(--gold)]/50 transition-colors"
                />
                <p className="text-[9px] text-white/20 mt-1">Only needed if you&apos;re registering for the first time.</p>
              </div>

              {error && <p className="text-red-400 text-xs tracking-wide">{error}</p>}

              <button type="submit" disabled={phoneLoading || phone.length !== 10}
                className="w-full py-3 text-xs tracking-[0.3em] uppercase border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                {phoneLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[9px] tracking-widest uppercase text-white/20">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google */}
          <button onClick={() => handleGoogleLogin()} disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 border border-white/10 text-white/60 text-xs tracking-wide hover:border-white/30 hover:text-white/90 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed">
            {GOOGLE_ICON}
            {googleLoading ? 'Signing in...' : 'Continue with Google'}
          </button>

          <p className="text-[10px] tracking-widest uppercase text-white/30 text-center mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[var(--gold)] hover:opacity-80 transition-opacity">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

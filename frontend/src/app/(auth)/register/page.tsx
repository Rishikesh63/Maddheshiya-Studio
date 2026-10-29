'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Phone } from 'lucide-react';
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

export default function RegisterPage() {
  const router = useRouter();
  const { loginWithTokens } = useAuth();

  const [tab, setTab] = useState<'email' | 'mobile'>('email');

  // Email tab state
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mobile tab state
  const [phone, setPhone] = useState('');
  const [mobileName, setMobileName] = useState('');
  const [phoneLoading, setPhoneLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      setError(null);
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
          setError(data.error ?? 'Google sign-up failed. Please try again.');
        }
      } catch {
        setError('Cannot connect to server. Please try again.');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => setError('Google sign-in was cancelled or failed.'),
  });

  // ── Email registration ──────────────────────────────────────────────────────
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { name, email, password, confirmPassword } = formData;
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      const username = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');
      const res = await fetch(apiUrl('/api/users/register/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, email, password, password2: confirmPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        return;
      }
      if (data && typeof data === 'object') {
        const emailErrors: string[] = Array.isArray(data.email) ? data.email : [];
        if (emailErrors.includes('awaiting_verification')) {
          router.push(`/verify-email?email=${encodeURIComponent(email)}`);
          return;
        }
        const messages: string[] = [];
        for (const [field, val] of Object.entries(data)) {
          const msgs = Array.isArray(val) ? val : [String(val)];
          msgs.forEach((m) => {
            if (field === 'email' && String(m).toLowerCase().includes('already')) {
              messages.push('An account with this email already exists. Please log in instead.');
            } else {
              messages.push(String(m));
            }
          });
        }
        setError(messages.join(' ') || 'Registration failed');
      } else {
        setError('Registration failed');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      setError(msg.toLowerCase().includes('failed to fetch') ? 'Cannot connect to server.' : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // ── Mobile OTP registration ─────────────────────────────────────────────────
  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 10) { setError('Enter a valid 10-digit mobile number.'); return; }
    if (!mobileName.trim()) { setError('Please enter your name.'); return; }
    setPhoneLoading(true);
    try {
      const res = await fetch(apiUrl('/api/users/send-phone-otp/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: digits, name: mobileName.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/verify-phone?phone=${encodeURIComponent(digits)}`);
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
            Create Account
          </h1>
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 text-center mb-6">
            Join Maddheshiya Studio
          </p>

          {/* Tab switcher */}
          <div className="flex border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => { setTab('email'); setError(null); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] tracking-widest uppercase transition-all ${
                tab === 'email' ? 'bg-[var(--gold)] text-black font-medium' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <Mail size={11} /> Email
            </button>
            <button
              type="button"
              onClick={() => { setTab('mobile'); setError(null); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] tracking-widest uppercase transition-all ${
                tab === 'mobile' ? 'bg-[var(--gold)] text-black font-medium' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <Phone size={11} /> Mobile OTP
            </button>
          </div>

          {error && <p className="text-red-400 text-xs tracking-wide mb-4">{error}</p>}

          {/* ── Email tab ──────────────────────────────────────────────── */}
          {tab === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] tracking-[0.3em] uppercase text-white/40 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Rishikesh Maddhesiya"
                  value={formData.name}
                  onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                  autoComplete="name"
                  required
                  className="w-full bg-[#0A0A0A] border border-white/10 text-white text-sm px-4 py-3 placeholder-white/20 focus:outline-none focus:border-[var(--gold)]/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.3em] uppercase text-white/40 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                  autoComplete="email"
                  required
                  className="w-full bg-[#0A0A0A] border border-white/10 text-white text-sm px-4 py-3 placeholder-white/20 focus:outline-none focus:border-[var(--gold)]/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.3em] uppercase text-white/40 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={e => setFormData(f => ({ ...f, password: e.target.value }))}
                    autoComplete="new-password"
                    required
                    className="w-full bg-[#0A0A0A] border border-white/10 text-white text-sm px-4 py-3 pr-11 placeholder-white/20 focus:outline-none focus:border-[var(--gold)]/50 transition-colors"
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-white/30 hover:text-white/60 transition-colors" tabIndex={-1}>
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.3em] uppercase text-white/40 mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={e => setFormData(f => ({ ...f, confirmPassword: e.target.value }))}
                    autoComplete="new-password"
                    required
                    className="w-full bg-[#0A0A0A] border border-white/10 text-white text-sm px-4 py-3 pr-11 placeholder-white/20 focus:outline-none focus:border-[var(--gold)]/50 transition-colors"
                  />
                  <button type="button" onClick={() => setShowConfirm(v => !v)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-white/30 hover:text-white/60 transition-colors" tabIndex={-1}>
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 text-xs tracking-[0.3em] uppercase border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-2">
                {loading ? 'Creating Account...' : 'Register'}
              </button>
            </form>
          )}

          {/* ── Mobile OTP tab ─────────────────────────────────────────── */}
          {tab === 'mobile' && (
            <form onSubmit={handleMobileSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] tracking-[0.3em] uppercase text-white/40 mb-2">Full Name *</label>
                <input
                  type="text"
                  placeholder="Rishikesh Maddhesiya"
                  value={mobileName}
                  onChange={e => setMobileName(e.target.value)}
                  autoComplete="name"
                  required
                  className="w-full bg-[#0A0A0A] border border-white/10 text-white text-sm px-4 py-3 placeholder-white/20 focus:outline-none focus:border-[var(--gold)]/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.3em] uppercase text-white/40 mb-2">Mobile Number *</label>
                <div className="flex">
                  <span className="flex items-center px-3 bg-white/5 border border-r-0 border-white/10 text-white/40 text-sm">+91</span>
                  <input
                    type="tel"
                    placeholder="98765 43210"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    maxLength={10}
                    autoComplete="tel"
                    required
                    className="flex-1 bg-[#0A0A0A] border border-white/10 text-white text-sm px-4 py-3 placeholder-white/20 focus:outline-none focus:border-[var(--gold)]/50 transition-colors"
                  />
                </div>
                <p className="text-[9px] text-white/20 mt-1">An OTP will be sent to this number to verify your account.</p>
              </div>
              <button type="submit" disabled={phoneLoading || phone.length !== 10 || !mobileName.trim()}
                className="w-full py-3 text-xs tracking-[0.3em] uppercase border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-2">
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
            Already have an account?{' '}
            <Link href="/login" className="text-[var(--gold)] hover:opacity-80 transition-opacity">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

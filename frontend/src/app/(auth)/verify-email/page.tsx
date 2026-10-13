'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiUrl } from '@/app/lib/api';
import { useAuth } from '@/app/context/AuthContext';
import { MailCheck, RefreshCw } from 'lucide-react';

function VerifyEmailContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { loginWithTokens } = useAuth();

  const email = searchParams.get('email') ?? '';

  const [digits, setDigits]       = useState(['', '', '', '', '', '']);
  const [error, setError]         = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);
  const [resendMsg, setResendMsg] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown for resend button
  useEffect(() => {
    if (canResend) return;
    const interval = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) { clearInterval(interval); setCanResend(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [canResend]);

  const otp = digits.join('');

  const handleDigitChange = (i: number, value: string) => {
    // Accept paste of full 6-digit code
    if (value.length === 6 && /^\d{6}$/.test(value)) {
      const newDigits = value.split('');
      setDigits(newDigits);
      inputRefs.current[5]?.focus();
      return;
    }
    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[i] = digit;
    setDigits(newDigits);
    if (digit && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) { setError('Please enter the full 6-digit code.'); return; }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/api/users/verify-email/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        await loginWithTokens(data.access, data.refresh);
        router.push('/');
      } else {
        setError(data.error ?? 'Verification failed. Please try again.');
        setDigits(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError('Cannot connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setResendMsg(null);
    setError(null);
    try {
      const res = await fetch(apiUrl('/api/users/resend-otp/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setResendMsg(data.message ?? 'New code sent.');
      setCanResend(false);
      setResendTimer(60);
    } catch {
      setResendMsg('Failed to resend. Please try again.');
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-white/40 text-sm mb-4">No email address found.</p>
          <Link href="/register" className="text-[var(--gold)] text-xs tracking-widest uppercase hover:opacity-80">
            Go to Register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4 py-12">
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
            <span className="text-[9px] tracking-[0.5em] uppercase text-white/40 mt-1">Studio</span>
          </Link>
        </div>

        <div className="bg-[#111111] border border-[var(--gold)]/20 p-8">

          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-12 h-12 border border-[var(--gold)]/30 flex items-center justify-center">
              <MailCheck size={20} className="text-[var(--gold)]/70" />
            </div>
          </div>

          <h1
            className="text-xl font-light tracking-[0.2em] uppercase text-white mb-1 text-center"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Verify Your Email
          </h1>
          <p className="text-[10px] tracking-wide text-white/30 text-center mb-2">
            We sent a 6-digit code to
          </p>
          <p className="text-xs text-[var(--gold)]/70 text-center mb-8 truncate">{email}</p>

          {error && (
            <p className="text-red-400 text-xs tracking-wide mb-4 text-center">{error}</p>
          )}
          {resendMsg && (
            <p className="text-green-400 text-xs tracking-wide mb-4 text-center">{resendMsg}</p>
          )}

          <form onSubmit={handleSubmit}>
            {/* OTP digit boxes */}
            <div className="flex gap-2 justify-center mb-6">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={d}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onFocus={(e) => e.target.select()}
                  className={`w-11 h-13 text-center text-xl font-mono bg-[#0A0A0A] border text-white focus:outline-none transition-colors ${
                    d
                      ? 'border-[var(--gold)]/60'
                      : 'border-white/10 focus:border-[var(--gold)]/40'
                  }`}
                  style={{ height: '52px' }}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-3 text-xs tracking-[0.3em] uppercase border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition-all duration-300 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </form>

          {/* Resend */}
          <div className="mt-5 text-center">
            {canResend ? (
              <button
                onClick={handleResend}
                className="inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-[var(--gold)]/70 hover:text-[var(--gold)] transition-colors"
              >
                <RefreshCw size={11} />
                Resend Code
              </button>
            ) : (
              <p className="text-[10px] tracking-widest uppercase text-white/20">
                Resend in {resendTimer}s
              </p>
            )}
          </div>

          <p className="text-[10px] tracking-widest uppercase text-white/30 text-center mt-6">
            Wrong email?{' '}
            <Link href="/register" className="text-[var(--gold)] hover:opacity-80 transition-opacity">
              Register again
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border border-[var(--gold)]/30 border-t-[var(--gold)] rounded-full animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}

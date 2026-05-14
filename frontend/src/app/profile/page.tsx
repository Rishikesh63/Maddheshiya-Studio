'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { apiUrl } from '@/app/lib/api';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  username: string;
  phone: string;
  bio: string;
}

export default function ProfilePage() {
  const { user, tokens, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user && !loading) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!tokens?.access) {
      setLoading(false);
      return;
    }
    fetch(apiUrl('/api/users/me/'), {
      headers: { Authorization: `Bearer ${tokens.access}` },
    })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => setProfile(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tokens]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[var(--gold)]/30 border-t-[var(--gold)] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const initials = profile.name
    ? profile.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : profile.email[0].toUpperCase();

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-28 pb-16 px-4">
      <div className="max-w-lg mx-auto">

        {/* Avatar + name */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/30 flex items-center justify-center mb-4">
            <span
              className="text-3xl font-light text-[var(--gold)]"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              {initials}
            </span>
          </div>
          <h1
            className="text-2xl font-light tracking-[0.15em] uppercase text-white"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {profile.name || profile.username}
          </h1>
          <p className="text-[10px] tracking-widest uppercase text-white/30 mt-1">{profile.email}</p>
        </div>

        {/* Info card */}
        <div className="bg-[#111111] border border-[var(--gold)]/20 divide-y divide-white/5">
          <div className="px-6 py-4 flex justify-between items-center">
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">Full Name</span>
            <span className="text-sm text-white/80">{profile.name || '—'}</span>
          </div>
          <div className="px-6 py-4 flex justify-between items-center">
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">Email</span>
            <span className="text-sm text-white/80">{profile.email}</span>
          </div>
          <div className="px-6 py-4 flex justify-between items-center">
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">Phone</span>
            <span className="text-sm text-white/80">{profile.phone || '—'}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/booking"
            className="w-full py-3 text-center text-xs tracking-[0.3em] uppercase border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition-all duration-300 font-medium"
          >
            Book a Session
          </Link>
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="w-full py-3 text-center text-xs tracking-[0.3em] uppercase border border-white/10 text-white/40 hover:border-red-400/40 hover:text-red-400 transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

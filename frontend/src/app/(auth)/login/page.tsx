'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  access: string;
  refresh: string;
};

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginPayload>({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const { mutate, status } = useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: async (payload: LoginPayload) => {
      const res = await fetch('https://maddheshiya-studio.onrender.com/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Invalid credentials');
      }

      return res.json();
    },
    onSuccess: (data) => {
      sessionStorage.setItem('access_token', data.access);
      sessionStorage.setItem('refresh_token', data.refresh);
      router.push('/dashboard');
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    mutate(formData);
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 shadow-md rounded-md border bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          aria-label="Email"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border px-3 py-2 rounded"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          aria-label="Password"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end text-sm">
          <Link href="/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className={`w-full text-white py-2 rounded ${
            status === 'pending' ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={status === 'pending'}
        >
          {status === 'pending' ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="text-sm text-center mt-4">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-blue-600 hover:underline">
          Sign Up
        </Link>
      </p>

      {/* Placeholder for social logins */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 mb-2">Or login with</p>
        <div className="flex justify-center gap-4">
          <button className="bg-black text-white px-4 py-2 rounded">Google</button>
        </div>
      </div>
    </div>
  );
}

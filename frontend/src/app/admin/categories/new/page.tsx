'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { apiUrl } from '@/app/lib/api';
import { ArrowLeft } from 'lucide-react';

const TYPE_OPTIONS = [
  { value: 'printing', label: 'Printing (physical products — frames, photos, albums)' },
  { value: 'digital', label: 'Digital (downloadable — PSDs, presets)' },
];

export default function NewCategoryPage() {
  const { getValidToken } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    category_type: 'printing',
    description: '',
    order: '0',
    is_active: true,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const token = await getValidToken();
    if (!token) { setError('Session expired. Please log in again.'); return; }
    setSaving(true);
    setError('');

    try {
      const res = await fetch(apiUrl('/api/products/admin/categories/'), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          category_type: form.category_type,
          description: form.description,
          order: parseInt(form.order) || 0,
          is_active: form.is_active,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(typeof data === 'object' ? JSON.stringify(data) : String(data));
        return;
      }
      router.push('/admin/categories');
    } catch {
      setError('Something went wrong. Check your connection.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-xl">
      <Link
        href="/admin/categories"
        className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={12} /> Back to Categories
      </Link>

      <h1 className="text-2xl font-bold text-white mb-1">New Category</h1>
      <p className="text-sm text-zinc-400 mb-6">
        The slug is generated automatically from the name (e.g. &ldquo;Photo Framing&rdquo; → <code className="text-zinc-300">photo-framing</code>).
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Category Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
            placeholder="e.g. Photo Framing"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
          />
          {form.name && (
            <p className="text-xs text-zinc-500 mt-1">
              Slug will be: <span className="text-zinc-300 font-mono">{form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}</span>
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Type *</label>
          <div className="space-y-2">
            {TYPE_OPTIONS.map(opt => (
              <label key={opt.value} className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="category_type"
                  value={opt.value}
                  checked={form.category_type === opt.value}
                  onChange={() => setForm(f => ({ ...f, category_type: opt.value }))}
                  className="mt-0.5 accent-white"
                />
                <span className="text-sm text-zinc-300">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={3}
            placeholder="Optional short description"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Display Order</label>
            <input
              type="number"
              value={form.order}
              onChange={e => setForm(f => ({ ...f, order: e.target.value }))}
              min="0"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
            />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                className="w-4 h-4 rounded accent-white"
              />
              Active (visible)
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-200 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Creating...' : 'Create Category'}
          </button>
          <Link
            href="/admin/categories"
            className="px-5 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-sm font-medium hover:bg-zinc-700"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

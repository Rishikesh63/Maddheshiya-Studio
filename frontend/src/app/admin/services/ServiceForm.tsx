'use client';
import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/app/context/AuthContext';
import { apiUrl } from '@/app/lib/api';

interface ServiceFormProps {
  serviceId?: number;
}

const MAIN_CATEGORIES = [
  { value: 'photography', label: 'Photography' },
  { value: 'videography', label: 'Videography' },
  { value: 'products', label: 'Products' },
];

export default function ServiceForm({ serviceId }: ServiceFormProps) {
  const { tokens } = useAuth();
  const router = useRouter();
  const isEdit = !!serviceId;

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [existingImage, setExistingImage] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: '',
    main_category: 'photography',
    subcategory: '',
    description: '',
    short_description: '',
    base_price: '',
    is_active: true,
    is_featured: false,
    whats_included: '',
  });

  const authHeaders = () => ({ Authorization: `Bearer ${tokens?.access}` });

  useEffect(() => {
    if (!tokens || !isEdit) return;
    fetch(apiUrl(`/api/services/admin/services/${serviceId}/`), { headers: authHeaders() })
      .then(r => r.json())
      .then(data => {
        setForm({
          name: data.name ?? '',
          main_category: data.main_category ?? 'photography',
          subcategory: data.subcategory ?? '',
          description: data.description ?? '',
          short_description: data.short_description ?? '',
          base_price: data.base_price ?? '',
          is_active: data.is_active ?? true,
          is_featured: data.is_featured ?? false,
          whats_included: data.whats_included ?? '',
        });
        setExistingImage(data.image ?? data.thumbnail ?? '');
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens, serviceId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!tokens) return;
    setSaving(true);
    setError('');

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    if (image) fd.append('image', image);
    if (thumbnail) fd.append('thumbnail', thumbnail);

    const url = isEdit
      ? apiUrl(`/api/services/admin/services/${serviceId}/`)
      : apiUrl('/api/services/admin/services/');

    try {
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: fd,
      });
      if (!res.ok) {
        const data = await res.json();
        setError(JSON.stringify(data));
        return;
      }
      router.push('/admin/services');
    } catch {
      setError('Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  const textInput = (label: string, key: keyof typeof form, required = false) => (
    <div>
      <label className="block text-xs font-medium text-zinc-400 mb-1">{label}{required && ' *'}</label>
      <input
        type="text"
        value={form[key] as string}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        required={required}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
      />
    </div>
  );

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Service' : 'New Service'}</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {textInput('Service Name', 'name', true)}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Main Category</label>
            <select
              value={form.main_category}
              onChange={e => setForm(f => ({ ...f, main_category: e.target.value }))}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
            >
              {MAIN_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          {textInput('Sub-category', 'subcategory')}
        </div>

        {textInput('Short Description', 'short_description')}

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Description *</label>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            required
            rows={4}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">What&apos;s Included (one per line)</label>
          <textarea
            value={form.whats_included}
            onChange={e => setForm(f => ({ ...f, whats_included: e.target.value }))}
            rows={4}
            placeholder={"Photography session\nEdited photos\n2-hour coverage"}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Base Price (₹) *</label>
          <input
            type="number"
            value={form.base_price}
            onChange={e => setForm(f => ({ ...f, base_price: e.target.value }))}
            required
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Cover Image</label>
          {existingImage && (
            <Image src={existingImage} alt="current" width={96} height={96} className="object-cover rounded mb-2 bg-zinc-800" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={e => setImage(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-zinc-700 file:text-zinc-300 file:text-xs hover:file:bg-zinc-600"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setThumbnail(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-zinc-700 file:text-zinc-300 file:text-xs hover:file:bg-zinc-600"
          />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
              className="w-4 h-4 rounded accent-white"
            />
            Active
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))}
              className="w-4 h-4 rounded accent-white"
            />
            Featured
          </label>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-200 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Service'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/services')}
            className="px-5 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

'use client';
import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/app/context/AuthContext';
import { apiUrl } from '@/app/lib/api';

interface Category {
  id: number;
  name: string;
  category_type: string;
}

interface ProductFormProps {
  productId?: number;
}

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'coming_soon', label: 'Coming Soon' },
  { value: 'out_of_stock', label: 'Out of Stock' },
];

const DELIVERY_OPTIONS = [
  { value: '1-2', label: '1-2 Days' },
  { value: '3-5', label: '3-5 Days' },
  { value: '1-2 weeks', label: '1-2 Weeks' },
  { value: '2-4 weeks', label: '2-4 Weeks' },
  { value: 'custom', label: 'Custom' },
];

export default function ProductForm({ productId }: ProductFormProps) {
  const { tokens } = useAuth();
  const router = useRouter();
  const isEdit = !!productId;

  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    short_description: '',
    price: '',
    discount_price: '',
    status: 'active',
    stock: '-1',
    delivery_timeframe: '3-5',
    customization_available: false,
    customization_options: '',
    featured: false,
    order: '0',
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [existingThumbnail, setExistingThumbnail] = useState('');

  const authHeaders = () => ({ Authorization: `Bearer ${tokens?.access}` });

  useEffect(() => {
    if (!tokens) return;
    fetch(apiUrl('/api/products/admin/categories/'), { headers: authHeaders() })
      .then(r => r.json())
      .then(data => setCategories(Array.isArray(data) ? data : data.results ?? []));

    if (isEdit) {
      fetch(apiUrl(`/api/products/admin/products/${productId}/`), { headers: authHeaders() })
        .then(r => r.json())
        .then(data => {
          setForm({
            name: data.name ?? '',
            category: data.category?.id ?? '',
            description: data.description ?? '',
            short_description: data.short_description ?? '',
            price: data.price ?? '',
            discount_price: data.discount_price ?? '',
            status: data.status ?? 'active',
            stock: String(data.stock ?? -1),
            delivery_timeframe: data.delivery_timeframe ?? '3-5',
            customization_available: data.customization_available ?? false,
            customization_options: data.customization_options ?? '',
            featured: data.featured ?? false,
            order: String(data.order ?? 0),
          });
          setExistingThumbnail(data.thumbnail ?? '');
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens, productId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!tokens) return;
    setSaving(true);
    setError('');

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    if (thumbnail) fd.append('thumbnail', thumbnail);
    if (heroImage) fd.append('hero_image', heroImage);

    const url = isEdit
      ? apiUrl(`/api/products/admin/products/${productId}/`)
      : apiUrl('/api/products/admin/products/');

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
      router.push('/admin/products');
    } catch {
      setError('Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, key: keyof typeof form, type = 'text', required = false) => (
    <div>
      <label className="block text-xs font-medium text-zinc-400 mb-1">{label}{required && ' *'}</label>
      <input
        type={type}
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
        <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Product' : 'New Product'}</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {field('Product Name', 'name', 'text', true)}

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Category *</label>
          <select
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            required
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
          >
            <option value="">Select category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.category_type})</option>
            ))}
          </select>
        </div>

        {field('Short Description', 'short_description')}

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

        <div className="grid grid-cols-2 gap-4">
          {field('Price (₹)', 'price', 'number', true)}
          {field('Discount Price (₹)', 'discount_price', 'number')}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Status</label>
            <select
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
            >
              {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Delivery Timeframe</label>
            <select
              value={form.delivery_timeframe}
              onChange={e => setForm(f => ({ ...f, delivery_timeframe: e.target.value }))}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
            >
              {DELIVERY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {field('Stock (-1 = unlimited)', 'stock', 'number')}
          {field('Display Order', 'order', 'number')}
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Thumbnail Image{!isEdit && ' *'}</label>
          {existingThumbnail && (
            <Image src={existingThumbnail} alt="current thumbnail" width={96} height={96} className="object-cover rounded mb-2 bg-zinc-800" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={e => setThumbnail(e.target.files?.[0] ?? null)}
            required={!isEdit}
            className="w-full text-sm text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-zinc-700 file:text-zinc-300 file:text-xs hover:file:bg-zinc-600"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Hero Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setHeroImage(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-zinc-700 file:text-zinc-300 file:text-xs hover:file:bg-zinc-600"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Customization Options (comma-separated)</label>
          <input
            type="text"
            value={form.customization_options}
            onChange={e => setForm(f => ({ ...f, customization_options: e.target.value }))}
            placeholder="e.g. Small, Medium, Large"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
          />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={form.customization_available}
              onChange={e => setForm(f => ({ ...f, customization_available: e.target.checked }))}
              className="w-4 h-4 rounded accent-white"
            />
            Customization Available
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
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
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="px-5 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

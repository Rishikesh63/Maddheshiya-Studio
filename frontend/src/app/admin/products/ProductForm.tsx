'use client';
import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Trash2, Plus, Loader2 } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { apiUrl } from '@/app/lib/api';

interface Category {
  id: number;
  name: string;
  category_type: string;
}

interface ProductSample {
  id: number;
  image: string;
  label: string;
  order: number;
}

interface ProductDimension {
  id: number;
  size_id: string;
  label: string;
  price: string;
  is_active: boolean;
  order: number;
}

const STANDARD_SIZES = [
  { id: '6x8',   label: '6×8 in'   },
  { id: '8x10',  label: '8×10 in'  },
  { id: '8x12',  label: '8×12 in'  },
  { id: '10x12', label: '10×12 in' },
  { id: '10x15', label: '10×15 in' },
  { id: '12x15', label: '12×15 in' },
  { id: '12x18', label: '12×18 in' },
  { id: '16x20', label: '16×20 in' },
  { id: '16x24', label: '16×24 in' },
  { id: '18x24', label: '18×24 in' },
  { id: '20x24', label: '20×24 in' },
  { id: '20x30', label: '20×30 in' },
  { id: '24x36', label: '24×36 in' },
];

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

const ANGLE_LABELS = [
  'Front View',
  'Back View',
  'Side View',
  'Top View',
  'Close-up',
  'Lifestyle',
  'Packaging',
];

export default function ProductForm({ productId }: ProductFormProps) {
  const { getValidToken } = useAuth();
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

  // Multi-image samples state
  const [samples, setSamples] = useState<ProductSample[]>([]);
  const [newSampleFile, setNewSampleFile] = useState<File | null>(null);
  const [newSampleLabel, setNewSampleLabel] = useState('Front View');
  const [uploadingSample, setUploadingSample] = useState(false);
  const [sampleError, setSampleError] = useState('');

  // Dimensions state
  const [dimensions, setDimensions] = useState<ProductDimension[]>([]);
  const [newDimSizeId, setNewDimSizeId] = useState(STANDARD_SIZES[0].id);
  const [newDimPrice, setNewDimPrice] = useState('');
  const [savingDim, setSavingDim] = useState(false);
  const [dimError, setDimError] = useState('');

  useEffect(() => {
    getValidToken().then(token => {
      if (!token) return;
      const h = { Authorization: `Bearer ${token}` };
      fetch(apiUrl('/api/products/admin/categories/'), { headers: h })
        .then(r => r.json())
        .then(data => setCategories(Array.isArray(data) ? data : data.results ?? []));
      if (isEdit) {
        fetch(apiUrl(`/api/products/admin/products/${productId}/`), { headers: h })
          .then(r => r.json())
          .then(data => {
            setForm({
              name: data.name ?? '',
              category: data.category?.id ?? '',
              description: data.description ?? '',
              short_description: data.short_description ?? '',
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
        // Load existing samples
        fetch(apiUrl(`/api/products/admin/samples/?product=${productId}`), { headers: h })
          .then(r => r.json())
          .then(data => setSamples(Array.isArray(data) ? data : data.results ?? []));
        // Load existing dimensions
        fetch(apiUrl(`/api/products/admin/dimensions/?product=${productId}`), { headers: h })
          .then(r => r.json())
          .then(data => setDimensions(Array.isArray(data) ? data : data.results ?? []));
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const token = await getValidToken();
    if (!token) { setError('Session expired. Please log in again.'); return; }
    setSaving(true);
    setError('');

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    // Derive price from lowest dimension; fallback to 0 (dimensions set the real prices)
    const minPrice = dimensions.length > 0
      ? Math.min(...dimensions.map(d => Number(d.price)))
      : 0;
    fd.append('price', String(minPrice));
    if (thumbnail) fd.append('thumbnail', thumbnail);
    if (heroImage) fd.append('hero_image', heroImage);

    const url = isEdit
      ? apiUrl(`/api/products/admin/products/${productId}/`)
      : apiUrl('/api/products/admin/products/');

    try {
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) {
        const data = await res.json();
        setError(JSON.stringify(data));
        return;
      }
      // For new products: save staged dimensions now that we have a product id
      if (!isEdit && dimensions.length > 0) {
        const created = await res.json();
        await Promise.all(dimensions.map((d, i) =>
          fetch(apiUrl('/api/products/admin/dimensions/'), {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ product: created.id, size_id: d.size_id, price: d.price, order: i }),
          })
        ));
      }
      router.push('/admin/products');
    } catch {
      setError('Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSample = async () => {
    if (!newSampleFile || !productId) return;
    const token = await getValidToken();
    if (!token) return;
    setUploadingSample(true);
    setSampleError('');
    const fd = new FormData();
    fd.append('product', String(productId));
    fd.append('image', newSampleFile);
    fd.append('label', newSampleLabel);
    fd.append('order', String(samples.length));
    try {
      const res = await fetch(apiUrl('/api/products/admin/samples/'), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) { setSampleError('Upload failed.'); return; }
      const created: ProductSample = await res.json();
      setSamples(prev => [...prev, created]);
      setNewSampleFile(null);
      // Reset file input
      const fileInput = document.getElementById('sample-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch {
      setSampleError('Upload failed.');
    } finally {
      setUploadingSample(false);
    }
  };

  const handleDeleteSample = async (sampleId: number) => {
    const token = await getValidToken();
    if (!token) return;
    try {
      await fetch(apiUrl(`/api/products/admin/samples/${sampleId}/`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setSamples(prev => prev.filter(s => s.id !== sampleId));
    } catch {
      setSampleError('Delete failed.');
    }
  };

  const handleAddDimension = async () => {
    if (!newDimPrice) return;
    if (dimensions.some(d => d.size_id === newDimSizeId)) {
      setDimError('This size is already added. Remove it first to change the price.');
      return;
    }
    setDimError('');
    const sizeLabel = STANDARD_SIZES.find(s => s.id === newDimSizeId)?.label ?? newDimSizeId;

    if (isEdit && productId) {
      // Edit mode: save to DB immediately
      const token = await getValidToken();
      if (!token) return;
      setSavingDim(true);
      try {
        const res = await fetch(apiUrl('/api/products/admin/dimensions/'), {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ product: productId, size_id: newDimSizeId, price: newDimPrice, order: dimensions.length }),
        });
        if (!res.ok) { setDimError('Failed to add dimension.'); return; }
        const created: ProductDimension = await res.json();
        setDimensions(prev => [...prev, created]);
      } catch {
        setDimError('Failed to add dimension.');
      } finally {
        setSavingDim(false);
      }
    } else {
      // New product mode: stage locally, will be saved after product creation
      setDimensions(prev => [...prev, {
        id: Date.now(), // temporary local-only id
        size_id: newDimSizeId,
        label: sizeLabel,
        price: newDimPrice,
        is_active: true,
        order: prev.length,
      }]);
    }
    setNewDimPrice('');
  };

  const handleDeleteDimension = async (dimId: number) => {
    if (isEdit) {
      const token = await getValidToken();
      if (!token) return;
      try {
        await fetch(apiUrl(`/api/products/admin/dimensions/${dimId}/`), {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        setDimError('Delete failed.');
        return;
      }
    }
    setDimensions(prev => prev.filter(d => d.id !== dimId));
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

        {/* ── Dimensions & Pricing ────────────────────────────────────────── */}
        <div className="border-t border-zinc-800 pt-5">
          <h2 className="text-sm font-semibold text-white mb-1">Dimensions & Pricing</h2>
          <p className="text-xs text-zinc-500 mb-4">
            Add the sizes you offer for this frame. Only configured sizes will appear on the website.
            {!isEdit && <span className="text-yellow-500 ml-1">These will be saved when you create the product.</span>}
          </p>

          {dimensions.length > 0 && (
            <div className="mb-4 border border-zinc-700 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                    <th className="text-left px-4 py-2">Size</th>
                    <th className="text-right px-4 py-2">Price (₹)</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {dimensions.map(d => (
                    <tr key={d.id} className="border-t border-zinc-800 hover:bg-zinc-800/40 transition-colors">
                      <td className="px-4 py-2.5 text-white font-medium">{d.label}</td>
                      <td className="px-4 py-2.5 text-right text-emerald-400 font-mono">₹{d.price}</td>
                      <td className="px-3 py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteDimension(d.id)}
                          className="w-6 h-6 bg-red-600 rounded flex items-center justify-center ml-auto hover:bg-red-500 transition-colors"
                          title="Remove"
                        >
                          <Trash2 size={11} className="text-white" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-zinc-500 mb-1">Dimension</label>
                <select
                  value={newDimSizeId}
                  onChange={e => setNewDimSizeId(e.target.value)}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded px-2 py-1.5 text-sm text-white focus:outline-none"
                >
                  {STANDARD_SIZES.map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-zinc-500 mb-1">Price (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={newDimPrice}
                  onChange={e => setNewDimPrice(e.target.value)}
                  placeholder="e.g. 499"
                  className="w-full bg-zinc-700 border border-zinc-600 rounded px-2 py-1.5 text-sm text-white placeholder-zinc-500 focus:outline-none"
                />
              </div>
            </div>
            {dimError && <p className="text-red-400 text-xs">{dimError}</p>}
            <button
              type="button"
              onClick={handleAddDimension}
              disabled={!newDimPrice || savingDim}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded-lg disabled:opacity-40 transition-colors"
            >
              {savingDim ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              {savingDim ? 'Adding...' : 'Add Size'}
            </button>
          </div>
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

      {/* ── Additional Images (only available after product is created) ─────── */}
      {isEdit && (
        <div className="mt-10 border-t border-zinc-800 pt-8">
          <h2 className="text-lg font-semibold text-white mb-1">Product Images</h2>
          <p className="text-xs text-zinc-500 mb-5">
            Upload multiple angles — Front View, Back View, Side View, etc. These appear as a gallery on the product page.
          </p>

          {/* Existing samples */}
          {samples.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
              {samples.map(s => (
                <div key={s.id} className="relative group bg-zinc-800 rounded-lg overflow-hidden">
                  <Image
                    src={s.image}
                    alt={s.label || 'sample'}
                    width={120}
                    height={90}
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <div className="px-2 py-1 bg-zinc-900/80">
                    <p className="text-[10px] text-zinc-400 truncate">{s.label || '—'}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteSample(s.id)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-600 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete"
                  >
                    <Trash2 size={11} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add new sample */}
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 space-y-3">
            <p className="text-xs font-medium text-zinc-400">Add New Image</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-zinc-500 mb-1">Angle / Label</label>
                <select
                  value={newSampleLabel}
                  onChange={e => setNewSampleLabel(e.target.value)}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded px-2 py-1.5 text-sm text-white focus:outline-none"
                >
                  {ANGLE_LABELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-zinc-500 mb-1">Image File</label>
                <input
                  id="sample-file-input"
                  type="file"
                  accept="image/*"
                  onChange={e => setNewSampleFile(e.target.files?.[0] ?? null)}
                  className="w-full text-xs text-zinc-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-zinc-600 file:text-zinc-300 hover:file:bg-zinc-500"
                />
              </div>
            </div>
            {sampleError && <p className="text-red-400 text-xs">{sampleError}</p>}
            <button
              type="button"
              onClick={handleAddSample}
              disabled={!newSampleFile || uploadingSample}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded-lg disabled:opacity-40 transition-colors"
            >
              {uploadingSample ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              {uploadingSample ? 'Uploading...' : 'Upload Image'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

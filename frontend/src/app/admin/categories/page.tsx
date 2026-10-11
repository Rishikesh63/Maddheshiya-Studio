'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { apiUrl } from '@/app/lib/api';
import { Plus, Trash2, Tag } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
  category_type: string;
  is_active: boolean;
  order: number;
}

export default function CategoriesPage() {
  const { tokens } = useAuth();
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const authHeaders = () => ({ Authorization: `Bearer ${tokens?.access}` });

  useEffect(() => {
    if (!tokens) return;
    fetch(apiUrl('/api/products/admin/categories/'), { headers: authHeaders() })
      .then(r => r.json())
      .then(data => setCats(Array.isArray(data) ? data : data.results ?? []))
      .finally(() => setLoading(false));
  }, [tokens]);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete category "${name}"? Products in this category will be unlinked.`)) return;
    setDeleting(id);
    await fetch(apiUrl(`/api/products/admin/categories/${id}/`), {
      method: 'DELETE',
      headers: authHeaders(),
    });
    setCats(c => c.filter(x => x.id !== id));
    setDeleting(null);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Create categories first, then upload products to them.
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors"
        >
          <Plus size={15} /> New Category
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 bg-zinc-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : cats.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Tag size={36} className="text-zinc-700 mb-3" />
          <p className="text-zinc-400 text-sm">No categories yet.</p>
          <p className="text-zinc-600 text-xs mt-1 mb-4">
            Create a category like "Photo Framing" (slug: photo-framing) to start uploading products.
          </p>
          <Link
            href="/admin/categories/new"
            className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-200"
          >
            Create First Category
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900 text-zinc-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Slug</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {cats.map(cat => (
                <tr key={cat.id} className="bg-zinc-950 hover:bg-zinc-900 transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{cat.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-400">{cat.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide ${
                      cat.category_type === 'digital'
                        ? 'bg-blue-900/40 text-blue-300'
                        : 'bg-amber-900/40 text-amber-300'
                    }`}>
                      {cat.category_type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      cat.is_active ? 'bg-green-900/40 text-green-400' : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      {cat.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      disabled={deleting === cat.id}
                      className="p-1.5 rounded text-zinc-600 hover:text-red-400 hover:bg-red-900/20 transition-colors disabled:opacity-40"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

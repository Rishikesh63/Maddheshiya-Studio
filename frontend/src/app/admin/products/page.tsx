'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/app/context/AuthContext';
import { apiUrl } from '@/app/lib/api';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  slug: string;
  status: string;
  price: string;
  discount_price: string | null;
  featured: boolean;
  thumbnail: string;
  category: { name: string };
}

export default function AdminProductsPage() {
  const { getValidToken } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    const token = await getValidToken();
    if (!token) return;
    fetch(apiUrl('/api/products/admin/products/'), { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setProducts(Array.isArray(data) ? data : data.results ?? []))
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchProducts(); }, []);

  const deleteProduct = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    const token = await getValidToken();
    if (!token) return;
    await fetch(apiUrl(`/api/products/admin/products/${id}/`), {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts();
  };

  const toggleStatus = async (product: Product) => {
    const token = await getValidToken();
    if (!token) return;
    const nextStatus = product.status === 'active' ? 'inactive' : 'active';
    await fetch(apiUrl(`/api/products/admin/products/${product.id}/`), {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });
    fetchProducts();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-zinc-400 text-sm mt-0.5">{products.length} total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors"
        >
          <Plus size={15} /> Add Product
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-zinc-500">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          No products yet.{' '}
          <Link href="/admin/products/new" className="text-white underline">Add one</Link>.
        </div>
      ) : (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 text-left">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.thumbnail && (
                        <Image src={p.thumbnail} alt={p.name} width={36} height={36} className="rounded object-cover bg-zinc-800" />
                      )}
                      <div>
                        <p className="font-medium text-white">{p.name}</p>
                        {p.featured && (
                          <span className="text-xs text-yellow-400">Featured</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{p.category?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-zinc-300">
                    {p.discount_price ? (
                      <span>
                        <span className="text-white">₹{p.discount_price}</span>
                        <span className="line-through text-zinc-500 ml-1 text-xs">₹{p.price}</span>
                      </span>
                    ) : (
                      `₹${p.price}`
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStatus(p)} title="Toggle status">
                      {p.status === 'active' ? (
                        <ToggleRight size={20} className="text-green-400" />
                      ) : (
                        <ToggleLeft size={20} className="text-zinc-500" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-700 rounded transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
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

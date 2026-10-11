'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { apiUrl } from '@/app/lib/api';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  main_category: string;
  subcategory: string;
  base_price: string;
  is_active: boolean;
  is_featured: boolean;
  thumbnail: string;
}

export default function AdminServicesPage() {
  const { tokens } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const headers = () => ({ Authorization: `Bearer ${tokens?.access}` });

  const fetchServices = () => {
    if (!tokens) return;
    fetch(apiUrl('/api/services/admin/services/'), { headers: headers() })
      .then(r => r.json())
      .then(data => setServices(Array.isArray(data) ? data : data.results ?? []))
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchServices(); }, [tokens]);

  const deleteService = async (id: number) => {
    if (!confirm('Delete this service?')) return;
    await fetch(apiUrl(`/api/services/admin/services/${id}/`), {
      method: 'DELETE',
      headers: headers(),
    });
    fetchServices();
  };

  const toggleActive = async (service: Service) => {
    await fetch(apiUrl(`/api/services/admin/services/${service.id}/`), {
      method: 'PATCH',
      headers: { ...headers(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !service.is_active }),
    });
    fetchServices();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Services</h1>
          <p className="text-zinc-400 text-sm mt-0.5">{services.length} total</p>
        </div>
        <Link
          href="/admin/services/new"
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors"
        >
          <Plus size={15} /> Add Service
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-zinc-500">Loading...</div>
      ) : services.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          No services yet.{' '}
          <Link href="/admin/services/new" className="text-white underline">Add one</Link>.
        </div>
      ) : (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 text-left">
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Base Price</th>
                <th className="px-4 py-3 font-medium">Active</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {s.thumbnail && (
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.thumbnail} alt={s.name} className="w-9 h-9 rounded object-cover bg-zinc-800" />
                      )}
                      <div>
                        <p className="font-medium text-white">{s.name}</p>
                        {s.is_featured && <span className="text-xs text-yellow-400">Featured</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-400 capitalize">{s.main_category}{s.subcategory ? ` / ${s.subcategory}` : ''}</td>
                  <td className="px-4 py-3 text-zinc-300">₹{s.base_price}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(s)} title="Toggle active">
                      {s.is_active ? (
                        <ToggleRight size={20} className="text-green-400" />
                      ) : (
                        <ToggleLeft size={20} className="text-zinc-500" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/services/${s.id}`}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => deleteService(s.id)}
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

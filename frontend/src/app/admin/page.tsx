'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { apiUrl } from '@/app/lib/api';
import { Package, Camera, Plus, ArrowRight } from 'lucide-react';

interface Stats {
  products: number;
  services: number;
}

export default function AdminDashboard() {
  const { tokens } = useAuth();
  const [stats, setStats] = useState<Stats>({ products: 0, services: 0 });

  useEffect(() => {
    if (!tokens) return;
    const headers = { Authorization: `Bearer ${tokens.access}` };

    Promise.all([
      fetch(apiUrl('/api/products/admin/products/'), { headers }).then(r => r.json()),
      fetch(apiUrl('/api/services/admin/services/'), { headers }).then(r => r.json()),
    ]).then(([products, services]) => {
      setStats({
        products: Array.isArray(products) ? products.length : products.count ?? 0,
        services: Array.isArray(services) ? services.length : services.count ?? 0,
      });
    }).catch(() => {});
  }, [tokens]);

  const cards = [
    {
      label: 'Total Products',
      value: stats.products,
      icon: Package,
      href: '/admin/products',
      action: 'Manage Products',
    },
    {
      label: 'Total Services',
      value: stats.services,
      icon: Camera,
      href: '/admin/services',
      action: 'Manage Services',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400 text-sm mt-1">Manage your studio content from here.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
        {cards.map(({ label, value, icon: Icon, href, action }) => (
          <div key={label} className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-zinc-800 rounded-lg">
                <Icon size={18} className="text-zinc-300" />
              </div>
              <span className="text-sm text-zinc-400">{label}</span>
            </div>
            <p className="text-3xl font-bold text-white mb-4">{value}</p>
            <Link
              href={href}
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {action} <ArrowRight size={14} />
            </Link>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors"
          >
            <Plus size={15} /> Add Product
          </Link>
          <Link
            href="/admin/services/new"
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors"
          >
            <Plus size={15} /> Add Service
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useCart } from "../context/CartContext";
import { getImageUrl } from "../utils/s3-media";
import { ShoppingCart, Check, Play, ArrowLeft } from "lucide-react";

export interface VideoProduct {
  id: string;
  title: string;
  price: number;
  duration?: string;
  image: string | null;
  badge?: string;
}

interface Props {
  title: string;
  subtitle: string;
  description: string;
  cartCategory: string;
  products: VideoProduct[];
}

function ProductCard({ product, cartCategory }: { product: VideoProduct; cartCategory: string }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = useCallback(() => {
    addItem({
      id: product.id,
      title: product.title,
      category: cartCategory,
      price: product.price,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }, [addItem, product, cartCategory]);

  return (
    <div className="group bg-white border border-gray-200 flex flex-col overflow-hidden">
      <div className="relative aspect-video bg-gray-900 overflow-hidden">
        {product.image ? (
          <Image
            src={getImageUrl(product.image)}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <Play size={28} className="text-[#C9A84C]/50" />
            <span className="text-[10px] tracking-widest uppercase text-white/20">Preview</span>
          </div>
        )}
        {product.badge && (
          <span className="absolute top-2 left-2 bg-[#C9A84C] text-black text-[9px] px-2 py-0.5 tracking-wider font-semibold">
            {product.badge}
          </span>
        )}
        {product.duration && (
          <span className="absolute top-2 right-2 bg-black/70 text-white text-[9px] px-2 py-0.5 tracking-wider">
            {product.duration}
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1 gap-2 bg-white">
        <h3 className="text-sm font-semibold text-gray-800 leading-snug">{product.title}</h3>
        <p className="text-[#2eaa2e] font-bold text-base">₹{product.price.toLocaleString()}.00</p>
        <button
          onClick={handleAdd}
          className={`mt-auto py-2.5 text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
            added ? "bg-green-500 text-white" : "bg-[#C9A84C] text-black hover:bg-[#b8933e]"
          }`}
        >
          {added ? (
            <><Check size={11} /> Added</>
          ) : (
            <><ShoppingCart size={11} /> Add to Cart</>
          )}
        </button>
      </div>
    </div>
  );
}

function FloatingCart() {
  const { count } = useCart();
  if (count === 0) return null;
  return (
    <Link
      href="/cart"
      className="fixed bottom-8 right-8 z-40 flex items-center gap-3 px-5 py-3 bg-[var(--gold)] text-black text-xs tracking-widest uppercase font-medium shadow-2xl shadow-black/60 hover:bg-[#b8933e] transition-colors"
    >
      <ShoppingCart size={16} />
      <span>Cart</span>
      <span className="bg-black/20 text-black w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">
        {count}
      </span>
    </Link>
  );
}

export default function VideoProductPage({ title, subtitle, description, cartCategory, products }: Props) {
  return (
    <div className="bg-[var(--black)]">
      <Navbar />

      <section className="pt-36 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-white/30 hover:text-[var(--gold)]/60 transition-colors mb-8"
          >
            <ArrowLeft size={12} />
            Products
          </Link>
          <span className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]/60 block mb-3">
            Digital Product
          </span>
          <h1
            className="text-4xl md:text-6xl font-light text-white mb-2"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            {title}
          </h1>
          <p
            className="text-lg font-light text-white/40 mb-3"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            {subtitle}
          </p>
          <div className="w-12 h-px bg-[var(--gold)]/40 mb-5" />
          <p className="text-sm text-white/40 max-w-xl leading-relaxed">{description}</p>
        </div>
      </section>

      <section className="py-8 px-6 pb-28">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} cartCategory={cartCategory} />
            ))}
          </div>
        </div>
      </section>

      <FloatingCart />
      <Footer />
    </div>
  );
}

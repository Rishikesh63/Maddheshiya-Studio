"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { useCart } from "../../../context/CartContext";
import { albumPsdCategories, getProductCoverKey, type PsdProduct, type PsdCategory } from "./data";
import { getImageUrl } from "../../../utils/s3-media";
import { ArrowLeft, ShoppingCart, Check, ImageIcon } from "lucide-react";

function ProductCard({
  product,
  categoryId,
  categoryLabel,
}: {
  product: PsdProduct;
  categoryId: string;
  categoryLabel: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const coverKey = getProductCoverKey(product);

  const handleAdd = useCallback(() => {
    addItem({
      id: product.id,
      title: product.title,
      category: categoryLabel,
      price: product.price,
      image: coverKey,
      downloadPath: product.downloadPath || null,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }, [addItem, product, categoryLabel, coverKey]);

  return (
    <div className="group bg-white border border-gray-200 flex flex-col overflow-hidden">
      {/* Preview image */}
      <Link
        href={`/products/digital/album-psd/${categoryId}/${product.id}`}
        className="relative aspect-[4/3] bg-gray-100 overflow-hidden block"
      >
        {coverKey ? (
          <Image
            src={getImageUrl(coverKey)}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-50">
            <ImageIcon size={32} className="text-gray-300" />
            <span className="text-[10px] tracking-widest uppercase text-gray-300">Preview</span>
          </div>
        )}
        {product.sheets && (
          <span className="absolute top-2 right-2 bg-black/70 text-white text-[9px] px-2 py-0.5 tracking-wider">
            {product.sheets} Sheets
          </span>
        )}
      </Link>

      {/* Card body */}
      <div className="p-3 flex flex-col flex-1 gap-2 bg-white">
        <Link href={`/products/digital/album-psd/${categoryId}/${product.id}`}>
          <h3 className="text-sm font-semibold text-gray-800 leading-snug hover:text-[#C9A84C] transition-colors">
            {product.title}
          </h3>
        </Link>

        <p className="text-[#2eaa2e] font-bold text-base">₹{product.price}.00</p>

        {/* Buttons */}
        <div className="flex gap-2 mt-auto pt-1">
          <Link
            href={`/products/digital/album-psd/${categoryId}/${product.id}`}
            className="flex-1 py-2 text-center text-xs font-semibold bg-gray-900 text-white hover:bg-gray-700 transition-colors"
          >
            View All
          </Link>
          <button
            onClick={handleAdd}
            className={`flex-1 py-2 text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
              added
                ? "bg-green-500 text-white"
                : "bg-[#C9A84C] text-black hover:bg-[#b8933e]"
            }`}
          >
            {added ? (
              <>
                <Check size={11} /> Added
              </>
            ) : (
              <>
                <ShoppingCart size={11} /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function CategorySection({ cat }: { cat: PsdCategory }) {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-5 pb-3 border-b border-[var(--gold)]/20">
        {cat.label}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {cat.products.map((p) => (
          <ProductCard key={p.id} product={p} categoryId={cat.id} categoryLabel={cat.label} />
        ))}
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

export default function AlbumPsdPage() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const visibleCategories =
    activeTab === "all"
      ? albumPsdCategories
      : albumPsdCategories.filter((c) => c.id === activeTab);

  return (
    <div className="bg-[var(--black)]">
      <Navbar />

      {/* Header */}
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
            className="text-4xl md:text-6xl font-light text-white mb-3"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Album PSD
          </h1>
          <div className="w-12 h-px bg-[var(--gold)]/40 mb-5" />
          <p className="text-sm text-white/40 max-w-xl leading-relaxed">
            Fully layered Photoshop PSD templates for wedding albums. Print-ready in multiple sizes.
            Click <strong className="text-white/60">View All</strong> on any product to preview all sheets.
          </p>
        </div>
      </section>

      {/* Category tabs */}
      <div className="sticky top-[56px] z-30 bg-[var(--black)]/95 backdrop-blur-sm border-b border-[var(--gold)]/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-3">
            <button
              onClick={() => setActiveTab("all")}
              className={`shrink-0 px-4 py-2 text-[10px] tracking-widest uppercase transition-all duration-200 ${
                activeTab === "all"
                  ? "bg-[var(--gold)] text-black"
                  : "text-white/40 hover:text-[var(--gold)] border border-transparent hover:border-[var(--gold)]/20"
              }`}
            >
              All
            </button>
            {albumPsdCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`shrink-0 px-4 py-2 text-[10px] tracking-widest uppercase transition-all duration-200 ${
                  activeTab === cat.id
                    ? "bg-[var(--gold)] text-black"
                    : "text-white/40 hover:text-[var(--gold)] border border-transparent hover:border-[var(--gold)]/20"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <section className="py-10 px-6 pb-28">
        <div className="max-w-7xl mx-auto">
          {visibleCategories.map((cat) => (
            <CategorySection key={cat.id} cat={cat} />
          ))}
        </div>
      </section>

      <FloatingCart />
      <Footer />
    </div>
  );
}

"use client";

import { useState, useCallback, use } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../../../../components/Navbar";
import Footer from "../../../../../components/Footer";
import { useCart } from "../../../../../context/CartContext";
import { albumPsdCategories, getProductCoverKey, getSheetKey, type PsdProduct } from "../../data";
import { getImageUrl } from "../../../../../utils/s3-media";
import { ArrowLeft, ShoppingCart, Check, ImageIcon, ZoomIn } from "lucide-react";

type Props = { params: Promise<{ categoryId: string; productId: string }> };

/** Swap extension: jpg→png, png→jpg */
function altKey(key: string | null): string | null {
  if (!key) return null;
  if (key.endsWith(".jpg")) return key.slice(0, -4) + ".png";
  if (key.endsWith(".png")) return key.slice(0, -4) + ".jpg";
  return null;
}

/**
 * SheetTile — tries primary extension first, then the alternate extension,
 * then falls back to the placeholder icon.
 * Supports mixed JPG + PNG inside the same product folder.
 */
function SheetTile({
  product,
  num,
  totalSheets,
  onClick,
}: {
  product: PsdProduct;
  num: number;
  totalSheets: number;
  onClick: () => void;
}) {
  // 0 = try primary  |  1 = try alternate  |  2 = both failed → placeholder
  const [attempt, setAttempt] = useState<0 | 1 | 2>(0);

  const primaryKey = getSheetKey(product, num);           // e.g. sheet-01.png
  const fallbackKey = altKey(primaryKey);                 // e.g. sheet-01.jpg
  const currentKey = attempt === 0 ? primaryKey : fallbackKey;
  const isPng = product.sheetExt === "png";

  const handleError = () => {
    if (attempt === 0) setAttempt(1);   // try the other extension
    else setAttempt(2);                  // both failed — show placeholder
  };

  return (
    <div
      className="group relative aspect-[4/3] overflow-hidden cursor-pointer border border-gray-700 hover:border-[var(--gold)]/50 transition-colors"
      style={{
        backgroundImage:
          "linear-gradient(45deg,#2a2a2a 25%,transparent 25%)," +
          "linear-gradient(-45deg,#2a2a2a 25%,transparent 25%)," +
          "linear-gradient(45deg,transparent 75%,#2a2a2a 75%)," +
          "linear-gradient(-45deg,transparent 75%,#2a2a2a 75%)",
        backgroundSize: "16px 16px",
        backgroundPosition: "0 0,0 8px,8px -8px,-8px 0",
        backgroundColor: "#1a1a1a",
      }}
      onClick={onClick}
    >
      {currentKey && attempt < 2 ? (
        <Image
          key={currentKey}               /* force remount when src changes */
          src={getImageUrl(currentKey)}
          alt={`Sheet ${num}`}
          fill
          className="object-contain"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
          onError={handleError}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <ImageIcon size={22} className="text-gray-600" />
          <span className="text-[9px] text-gray-500 tracking-wider">Sheet {num}</span>
        </div>
      )}

      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <ZoomIn size={20} className="text-white" />
      </div>
      <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5">
        {num}/{totalSheets}
      </span>
    </div>
  );
}

/**
 * LightboxImage — same two-step fallback for the full-size lightbox.
 */
function LightboxImage({ product, num }: { product: PsdProduct; num: number }) {
  const [attempt, setAttempt] = useState<0 | 1 | 2>(0);

  const primaryKey = getSheetKey(product, num);
  const fallbackKey = altKey(primaryKey);
  const currentKey = attempt === 0 ? primaryKey : fallbackKey;

  const handleError = () => {
    if (attempt === 0) setAttempt(1);
    else setAttempt(2);
  };

  if (!currentKey || attempt >= 2) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <ImageIcon size={48} className="text-gray-600" />
      </div>
    );
  }

  return (
    <Image
      key={currentKey}
      src={getImageUrl(currentKey)}
      alt={`Sheet ${num}`}
      fill
      className="object-contain"
      sizes="92vw"
      priority
      onError={handleError}
    />
  );
}

/* ── main page ── */
export default function AlbumProductDetailPage({ params }: Props) {
  const { categoryId, productId } = use(params);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const cat = albumPsdCategories.find((c) => c.id === categoryId);
  const product = cat?.products.find((p) => p.id === productId);
  const coverKey = product ? getProductCoverKey(product) : null;

  const handleAdd = useCallback(() => {
    if (!product || !cat) return;
    addItem({
      id: product.id,
      title: product.title,
      category: cat.label,
      price: product.price,
      image: coverKey,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }, [addItem, product, cat, coverKey]);

  if (!cat || !product) {
    return (
      <div className="bg-[var(--black)] min-h-screen flex items-center justify-center">
        <Navbar />
        <p className="text-white/40 text-sm tracking-wider">Product not found.</p>
        <Footer />
      </div>
    );
  }

  const isPng = product.sheetExt === "png";
  const totalSheets = product.sheets ?? 20;
  const sheetNumbers = Array.from({ length: totalSheets }, (_, i) => i + 1);

  return (
    <div className="bg-[var(--black)]">
      <Navbar />

      {/* Header */}
      <section className="pt-36 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/products/digital/album-psd"
            className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-white/30 hover:text-[var(--gold)]/60 transition-colors mb-8"
          >
            <ArrowLeft size={12} />
            Album PSD
          </Link>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <span className="text-[9px] tracking-[0.4em] uppercase text-[var(--gold)]/50 block mb-2">
                {cat.label}
              </span>
              <h1
                className="text-3xl md:text-5xl font-light text-white mb-2"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {product.title}
              </h1>
              <p className="text-[#2eaa2e] text-xl font-semibold mb-2">₹{product.price}.00</p>
              {product.sheets && (
                <p className="text-xs text-white/40 tracking-wider">
                  {product.sheets} {isPng ? "PNG Files" : "PSD Sheets"} included
                </p>
              )}
            </div>

            <button
              onClick={handleAdd}
              className={`shrink-0 flex items-center gap-3 px-8 py-4 text-sm font-semibold tracking-wider uppercase transition-all duration-200 ${
                added
                  ? "bg-green-500 text-white"
                  : "bg-[var(--gold)] text-black hover:bg-[#b8933e]"
              }`}
            >
              {added ? (
                <><Check size={16} /> Added to Cart</>
              ) : (
                <><ShoppingCart size={16} /> Add to Cart</>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* All sheets grid */}
      <section className="py-8 px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-2xl font-light text-white mb-6 pb-3 border-b border-[var(--gold)]/10"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            {isPng ? "All Files" : "All Sheets"} — {totalSheets} {isPng ? "PNG" : "Pages"}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {sheetNumbers.map((num) => (
              <SheetTile
                key={num}
                product={product}
                num={num}
                totalSheets={totalSheets}
                onClick={() => setLightbox(num)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative w-[92vw] max-w-4xl aspect-[4/3] overflow-hidden"
            style={{
              backgroundImage:
                "linear-gradient(45deg,#2a2a2a 25%,transparent 25%)," +
                "linear-gradient(-45deg,#2a2a2a 25%,transparent 25%)," +
                "linear-gradient(45deg,transparent 75%,#2a2a2a 75%)," +
                "linear-gradient(-45deg,transparent 75%,#2a2a2a 75%)",
              backgroundSize: "24px 24px",
              backgroundPosition: "0 0,0 12px,12px -12px,-12px 0",
              backgroundColor: "#111",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <LightboxImage product={product} num={lightbox} />

            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white/60 text-xs px-3 py-1 tracking-widest">
              {lightbox} / {totalSheets}
            </span>
            <button
              className="absolute top-3 right-3 bg-black/60 text-white/70 hover:text-white w-8 h-8 flex items-center justify-center text-lg"
              onClick={() => setLightbox(null)}
            >
              ✕
            </button>
            {lightbox > 1 && (
              <button
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white/70 hover:text-white w-10 h-10 flex items-center justify-center text-2xl"
                onClick={() => setLightbox(lightbox - 1)}
              >
                ‹
              </button>
            )}
            {lightbox < totalSheets && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white/70 hover:text-white w-10 h-10 flex items-center justify-center text-2xl"
                onClick={() => setLightbox(lightbox + 1)}
              >
                ›
              </button>
            )}
          </div>
        </div>
      )}

      {/* Sticky bottom bar on mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[var(--black)]/95 backdrop-blur-sm border-t border-[var(--gold)]/10 p-4 flex items-center gap-3">
        <div className="flex-1">
          <p className="text-xs text-white/40 truncate">{product.title}</p>
          <p className="text-[var(--gold)] font-semibold">₹{product.price}.00</p>
        </div>
        <button
          onClick={handleAdd}
          className={`flex items-center gap-2 px-6 py-3 text-xs font-semibold tracking-wider uppercase transition-all ${
            added ? "bg-green-500 text-white" : "bg-[var(--gold)] text-black hover:bg-[#b8933e]"
          }`}
        >
          {added ? <><Check size={12} /> Added</> : <><ShoppingCart size={12} /> Add to Cart</>}
        </button>
      </div>

      <Footer />
    </div>
  );
}

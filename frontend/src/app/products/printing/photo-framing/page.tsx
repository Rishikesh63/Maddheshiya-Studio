"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { useCart } from "../../../context/CartContext";
import { apiUrl } from "@/app/lib/api";
import { ArrowLeft, ShoppingCart, Check, ImageIcon, Truck, ChevronLeft, ChevronRight, Zap } from "lucide-react";

// ── Sizes & Materials ──────────────────────────────────────────────────────────

const SIZES = [
  { id: "6x8",    label: "6×8",    w: 6,  h: 8,  price: 399              },
  { id: "8x10",   label: "8×10",   w: 8,  h: 10, price: 449              },
  { id: "8x12",   label: "8×12",   w: 8,  h: 12, price: 499              },
  { id: "10x12",  label: "10×12",  w: 10, h: 12, price: 599              },
  { id: "10x15",  label: "10×15",  w: 10, h: 15, price: 649              },
  { id: "12x15",  label: "12×15",  w: 12, h: 15, price: 699              },
  { id: "12x18",  label: "12×18",  w: 12, h: 18, price: 799, popular: true },
  { id: "16x20",  label: "16×20",  w: 16, h: 20, price: 999              },
  { id: "16x24",  label: "16×24",  w: 16, h: 24, price: 1099             },
  { id: "18x24",  label: "18×24",  w: 18, h: 24, price: 1149             },
  { id: "20x24",  label: "20×24",  w: 20, h: 24, price: 1199             },
  { id: "20x30",  label: "20×30",  w: 20, h: 30, price: 1399             },
  { id: "24x36",  label: "24×36",  w: 24, h: 36, price: 1499             },
];

const MATERIALS = [
  { id: "wood",    label: "Wood",    extra: 0   },
  { id: "acrylic", label: "Acrylic", extra: 150 },
  { id: "canvas",  label: "Canvas",  extra: 100 },
];

// ── API product shape ──────────────────────────────────────────────────────────

interface FrameSample {
  id: number;
  image: string;
  label: string;
  order: number;
}

interface FrameDimension {
  id: number;
  size_id: string;
  label: string;
  width: number;
  height: number;
  price: number;
  order: number;
}

interface FrameProduct {
  id: number;
  name: string;
  slug: string;
  thumbnail: string;
  short_description: string;
  status: string;
  price: number;
  samples: FrameSample[];
  dimensions: FrameDimension[];
}

// ── Image gallery ──────────────────────────────────────────────────────────────

function ImageGallery({
  thumbnail,
  samples,
  name,
}: {
  thumbnail: string;
  samples: FrameSample[];
  name: string;
}) {
  const images: { src: string; label: string }[] = [
    { src: thumbnail, label: "Main" },
    ...samples.map((s) => ({ src: s.image, label: s.label || "View" })),
  ].filter((img) => !!img.src);

  const [activeIdx, setActiveIdx] = useState(0);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});

  const go = (dir: 1 | -1) =>
    setActiveIdx((i) => (i + dir + images.length) % images.length);

  const active = images[activeIdx];
  const hasMultiple = images.length > 1;

  if (images.length === 0) {
    return (
      <div className="relative aspect-square bg-[#0a0a0a] flex items-center justify-center">
        <ImageIcon size={28} className="text-white/10" />
      </div>
    );
  }

  return (
    <div className="relative aspect-square bg-[#0a0a0a] overflow-hidden group/gallery">

      {/* Main image — always full, never cropped */}
      {active && !imgError[activeIdx] ? (
        <Image
          src={active.src}
          alt={`${name} — ${active.label}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain"
          onError={() => setImgError((p) => ({ ...p, [activeIdx]: true }))}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#111]">
          <ImageIcon size={20} className="text-white/10" />
        </div>
      )}

      {/* Angle label badge */}
      {hasMultiple && active && (
        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/70 text-[8px] tracking-widest uppercase text-white/70">
          {active.label}
        </div>
      )}

      {/* Prev / Next arrows */}
      {hasMultiple && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); go(-1); }}
            className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/70 flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 transition-opacity"
            aria-label="Previous image"
          >
            <ChevronLeft size={14} className="text-white" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); go(1); }}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/70 flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 transition-opacity"
            aria-label="Next image"
          >
            <ChevronRight size={14} className="text-white" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {hasMultiple && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-1">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setActiveIdx(i); }}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === activeIdx ? "bg-[var(--gold)] w-3" : "bg-white/40 w-1.5 hover:bg-white/70"
              }`}
              aria-label={`Image ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail strip on hover */}
      {images.length >= 2 && (
        <div className="absolute bottom-0 left-0 right-0 flex gap-0.5 p-1 bg-black/70 translate-y-full group-hover/gallery:translate-y-0 transition-transform duration-300">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setActiveIdx(i); }}
              className={`relative flex-1 aspect-square overflow-hidden border transition-all ${
                i === activeIdx ? "border-[var(--gold)]" : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              {!imgError[i] ? (
                <Image src={img.src} alt={img.label} fill className="object-contain bg-[#0a0a0a]" sizes="40px" />
              ) : (
                <div className="w-full h-full bg-white/10" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Frame card ─────────────────────────────────────────────────────────────────

function FrameCard({ frame }: { frame: FrameProduct }) {
  const { addItem } = useCart();
  const router = useRouter();

  // Use admin-configured dimensions if available, otherwise fall back to hardcoded SIZES
  const availableSizes: { id: string; label: string; price: number; popular?: boolean }[] =
    frame.dimensions && frame.dimensions.length > 0
      ? frame.dimensions.map((d) => ({ id: d.size_id, label: d.label, price: d.price }))
      : SIZES.map((s) => ({ id: s.id, label: s.label, price: s.price, popular: s.popular }));

  const [sizeId, setSizeId] = useState(availableSizes[0]?.id ?? '');
  const [matId, setMatId]   = useState(MATERIALS[0].id);
  const [added, setAdded]   = useState(false);

  const size  = availableSizes.find((s) => s.id === sizeId) ?? availableSizes[0];
  const mat   = MATERIALS.find((m) => m.id === matId)!;
  const price = (size?.price ?? 0) + mat.extra;

  const cartItem = useCallback(() => ({
    id: `frame-${frame.id}-${sizeId}-${matId}`,
    title: `${frame.name} — ${size?.label ?? sizeId} ${mat.label}`,
    category: "Photo Framing",
    price,
    image: frame.thumbnail || null,
  }), [frame, sizeId, matId, size, mat, price]);

  const handleAdd = useCallback(() => {
    addItem(cartItem());
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }, [addItem, cartItem]);

  const handleBuyNow = useCallback(() => {
    addItem(cartItem());
    router.push('/cart');
  }, [addItem, cartItem, router]);

  return (
    <div className="bg-[#111111] border border-[var(--gold)]/10 flex flex-col overflow-hidden">
      <ImageGallery
        thumbnail={frame.thumbnail}
        samples={frame.samples ?? []}
        name={frame.name}
      />

      {/* Card body */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <h3 className="text-sm font-light text-white leading-snug" style={{ fontFamily: "var(--font-cormorant)" }}>
          {frame.name}
        </h3>

        {/* Size picker */}
        <div>
          <p className="text-[9px] tracking-[0.3em] uppercase text-[var(--gold)]/50 mb-1.5">Size (inches)</p>
          <div className="flex flex-wrap gap-1">
            {availableSizes.map((s) => (
              <button
                key={s.id}
                onClick={() => setSizeId(s.id)}
                className={`px-2 py-1 text-[9px] tracking-wide border transition-all ${
                  sizeId === s.id
                    ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                    : "border-white/10 text-white/40 hover:border-white/30"
                }`}
              >
                {s.label}
                {s.popular && <span className="ml-1 text-[var(--gold)]">★</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Material picker */}
        <div>
          <p className="text-[9px] tracking-[0.3em] uppercase text-[var(--gold)]/50 mb-1.5">Material</p>
          <div className="flex gap-1">
            {MATERIALS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMatId(m.id)}
                className={`flex-1 py-1.5 text-[9px] tracking-wide border transition-all ${
                  matId === m.id
                    ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                    : "border-white/10 text-white/40 hover:border-white/30"
                }`}
              >
                {m.label}
                {m.extra > 0 && <span className="block text-[8px] opacity-60">+₹{m.extra}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Price + CTA */}
        <div className="mt-auto pt-2 border-t border-white/5">
          <span className="text-xl font-light text-[var(--gold)] block mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
            ₹{price}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleBuyNow}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] tracking-widest uppercase font-medium bg-[var(--gold)] text-black hover:bg-[#b8933e] transition-all"
            >
              <Zap size={11} /> Buy Now
            </button>
            <button
              onClick={handleAdd}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] tracking-widest uppercase font-medium transition-all ${
                added
                  ? "bg-green-600 text-white"
                  : "border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black"
              }`}
            >
              {added ? <><Check size={11} /> Added</> : <><ShoppingCart size={11} /> Cart</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-[#111111] border border-[var(--gold)]/10 overflow-hidden animate-pulse">
      <div className="aspect-square bg-white/5" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-white/5 rounded w-3/4" />
        <div className="flex gap-1">{[...Array(4)].map((_, i) => <div key={i} className="h-6 w-12 bg-white/5 rounded" />)}</div>
        <div className="flex gap-1">{[...Array(3)].map((_, i) => <div key={i} className="flex-1 h-8 bg-white/5 rounded" />)}</div>
        <div className="h-8 bg-white/5 rounded" />
      </div>
    </div>
  );
}

// ── Floating cart ──────────────────────────────────────────────────────────────

function FloatingCart() {
  const { count } = useCart();
  if (count === 0) return null;
  return (
    <Link
      href="/cart"
      className="fixed bottom-8 right-8 z-40 flex items-center gap-3 px-5 py-3 bg-[var(--gold)] text-black text-xs tracking-widest uppercase font-medium shadow-2xl shadow-black/60 hover:bg-[#b8933e] transition-colors"
    >
      <ShoppingCart size={16} />
      Cart
      <span className="bg-black/20 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">
        {count}
      </span>
    </Link>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function PhotoFramingPage() {
  const [frames, setFrames]   = useState<FrameProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl("/api/products/products/?category=photo-framing"))
      .then((r) => r.json())
      .then((data) => setFrames(Array.isArray(data) ? data : data.results ?? []))
      .catch(() => setFrames([]))
      .finally(() => setLoading(false));
  }, []);

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
            <ArrowLeft size={12} /> Products
          </Link>
          <span className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]/60 block mb-3">
            Printing Service
          </span>
          <h1 className="text-4xl md:text-6xl font-light text-white mb-3" style={{ fontFamily: "var(--font-cormorant)" }}>
            Photo Framing
          </h1>
          <div className="w-12 h-px bg-[var(--gold)]/40 mb-5" />
          <p className="text-sm text-white/40 max-w-xl leading-relaxed">
            Choose a frame style, pick your size and material, then add to cart.
            Share your photo on WhatsApp after ordering — we deliver to your door.
          </p>
          <div className="flex items-center gap-2 mt-5 text-xs text-white/30">
            <Truck size={13} className="text-[var(--gold)]/40" />
            Delivery in 3–7 working days · Free delivery above ₹999
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-10 px-6 pb-28">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : frames.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 text-center">
              <ImageIcon size={40} className="text-white/10 mb-4" />
              <p className="text-white/30 text-sm tracking-widest uppercase">Frame examples coming soon</p>
              <p className="text-white/20 text-xs mt-2">The admin is uploading frame designs. Check back shortly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {frames.map((f) => <FrameCard key={f.id} frame={f} />)}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 pb-20 border-t border-[var(--gold)]/10">
        <div className="max-w-4xl mx-auto pt-14">
          <h2 className="text-2xl font-light text-white text-center mb-10" style={{ fontFamily: "var(--font-cormorant)" }}>
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
            {[
              { step: "1", title: "Choose Frame",     desc: "Pick a frame design from our catalog above." },
              { step: "2", title: "Select Size",      desc: "Choose your preferred print size — the preview updates live." },
              { step: "3", title: "Add to Cart",      desc: "Add items to cart and complete checkout." },
              { step: "4", title: "Share Your Photo", desc: "Send your photo on WhatsApp after order — we print & deliver." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center gap-3">
                <div className="w-9 h-9 bg-[var(--gold)] text-black text-sm font-bold flex items-center justify-center">{step}</div>
                <p className="text-sm font-medium text-white">{title}</p>
                <p className="text-[11px] text-white/30 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FloatingCart />
      <Footer />
    </div>
  );
}

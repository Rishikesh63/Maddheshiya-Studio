"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { useCart } from "../../../context/CartContext";
import { apiUrl } from "@/app/lib/api";
import { ArrowLeft, ShoppingCart, Check, ImageIcon, Truck, Zap, ChevronLeft, ChevronRight } from "lucide-react";

// ── Pricing ────────────────────────────────────────────────────────────────────

const CARD_TYPES = [
  { id: "pvc-single",   label: "PVC Single-Side",  pricePerCard: 30,  minQty: 10 },
  { id: "pvc-double",   label: "PVC Double-Side",   pricePerCard: 45,  minQty: 10 },
  { id: "acrylic",      label: "Acrylic",            pricePerCard: 80,  minQty: 5  },
];

const QTY_OPTIONS = [10, 25, 50, 100, 250];

// ── API product shape ──────────────────────────────────────────────────────────

interface CardSample {
  id: number;
  image: string;
  label: string;
  order: number;
}

interface CardProduct {
  id: number;
  name: string;
  slug: string;
  thumbnail: string;
  short_description: string;
  status: string;
  samples: CardSample[];
}

// ── Image gallery ──────────────────────────────────────────────────────────────

function ImageGallery({ thumbnail, samples, name }: { thumbnail: string; samples: CardSample[]; name: string }) {
  const images: { src: string; label: string }[] = [
    { src: thumbnail, label: "Main" },
    ...samples.map((s) => ({ src: s.image, label: s.label || "View" })),
  ].filter((img) => !!img.src);

  const [activeIdx, setActiveIdx] = useState(0);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});

  const go = (dir: 1 | -1) => setActiveIdx((i) => (i + dir + images.length) % images.length);
  const active = images[activeIdx];
  const hasMultiple = images.length > 1;

  if (images.length === 0) {
    return (
      <div className="relative aspect-[4/3] bg-[#0a0a0a] flex flex-col items-center justify-center gap-2">
        <ImageIcon size={28} className="text-white/10" />
        <span className="text-[9px] tracking-widest uppercase text-white/20">Design Preview</span>
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/3] bg-[#0a0a0a] overflow-hidden group/gallery">
      {active && !imgError[activeIdx] ? (
        <Image
          src={active.src}
          alt={`${name} — ${active.label}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-opacity duration-300"
          onError={() => setImgError((p) => ({ ...p, [activeIdx]: true }))}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <ImageIcon size={28} className="text-white/10" />
        </div>
      )}
      {hasMultiple && active && (
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 text-[9px] tracking-widest uppercase text-white/70">
          {active.label}
        </div>
      )}
      {hasMultiple && (
        <>
          <button onClick={(e) => { e.stopPropagation(); go(-1); }} className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/60 flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 transition-opacity hover:bg-black/80" aria-label="Previous">
            <ChevronLeft size={14} className="text-white" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); go(1); }} className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/60 flex items-center justify-center opacity-0 group-hover/gallery:opacity-100 transition-opacity hover:bg-black/80" aria-label="Next">
            <ChevronRight size={14} className="text-white" />
          </button>
        </>
      )}
      {hasMultiple && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
          {images.map((_, i) => (
            <button key={i} onClick={(e) => { e.stopPropagation(); setActiveIdx(i); }} className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeIdx ? "bg-[var(--gold)] w-3" : "bg-white/30 hover:bg-white/60"}`} aria-label={`Image ${i + 1}`} />
          ))}
        </div>
      )}
      {images.length >= 3 && (
        <div className="absolute bottom-0 left-0 right-0 flex gap-0.5 p-1 bg-black/50 opacity-0 group-hover/gallery:opacity-100 transition-opacity">
          {images.map((img, i) => (
            <button key={i} onClick={(e) => { e.stopPropagation(); setActiveIdx(i); }} className={`relative flex-1 aspect-square overflow-hidden border transition-all ${i === activeIdx ? "border-[var(--gold)]" : "border-transparent opacity-50 hover:opacity-80"}`}>
              {!imgError[i] ? <Image src={img.src} alt={img.label} fill className="object-cover" sizes="40px" /> : <div className="w-full h-full bg-white/10" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── ID Card card ───────────────────────────────────────────────────────────────

function IdCardCard({ card }: { card: CardProduct }) {
  const { addItem } = useCart();
  const [typeId, setTypeId] = useState(CARD_TYPES[0].id);
  const [qty, setQty]       = useState(10);
  const [added, setAdded]   = useState(false);

  const cardType = CARD_TYPES.find((t) => t.id === typeId)!;
  const total    = cardType.pricePerCard * qty;

  const handleAdd = useCallback(() => {
    addItem({
      id: `idcard-${card.id}-${typeId}-${qty}`,
      title: `${card.name} — ${cardType.label} × ${qty}`,
      category: "ID Cards",
      price: total,
      image: card.thumbnail || null,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }, [addItem, card, typeId, qty, cardType, total]);

  return (
    <div className="bg-[#111111] border border-[var(--gold)]/10 flex flex-col overflow-hidden">
      <ImageGallery thumbnail={card.thumbnail} samples={card.samples ?? []} name={card.name} />

      {/* Card body */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <h3 className="text-sm font-light text-white leading-snug" style={{ fontFamily: "var(--font-cormorant)" }}>
          {card.name}
        </h3>

        {/* Type picker */}
        <div>
          <p className="text-[9px] tracking-[0.3em] uppercase text-[var(--gold)]/50 mb-1.5">Card Type</p>
          <div className="flex flex-col gap-1">
            {CARD_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTypeId(t.id); setQty(Math.max(qty, t.minQty)); }}
                className={`flex items-center justify-between px-2.5 py-1.5 border text-[9px] transition-all ${
                  typeId === t.id
                    ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                    : "border-white/10 text-white/40 hover:border-white/30"
                }`}
              >
                <span className="tracking-wide">{t.label}</span>
                <span>₹{t.pricePerCard}/card</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <p className="text-[9px] tracking-[0.3em] uppercase text-[var(--gold)]/50 mb-1.5">
            Quantity <span className="text-white/20 normal-case tracking-normal">(min {cardType.minQty})</span>
          </p>
          <div className="flex flex-wrap gap-1">
            {QTY_OPTIONS.filter((q) => q >= cardType.minQty).map((q) => (
              <button
                key={q}
                onClick={() => setQty(q)}
                className={`px-2.5 py-1 text-[9px] border transition-all ${
                  qty === q
                    ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                    : "border-white/10 text-white/40 hover:border-white/30"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Total + CTA */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
          <div>
            <p className="text-[8px] text-white/20 uppercase tracking-widest">Total</p>
            <span className="text-xl font-light text-[var(--gold)]" style={{ fontFamily: "var(--font-cormorant)" }}>
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>
          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 px-4 py-2 text-[10px] tracking-widest uppercase font-medium transition-all ${
              added
                ? "bg-green-600 text-white"
                : "border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black"
            }`}
          >
            {added ? <><Check size={11} /> Added</> : <><ShoppingCart size={11} /> Add to Cart</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton loader ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-[#111111] border border-[var(--gold)]/10 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-white/5" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-white/5 rounded w-3/4" />
        <div className="h-3 bg-white/5 rounded w-1/2" />
        {[...Array(3)].map((_, i) => <div key={i} className="h-8 bg-white/5 rounded" />)}
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

export default function IdCardsPage() {
  const [cards, setCards]     = useState<CardProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl("/api/products/products/?category=id-cards"))
      .then((r) => r.json())
      .then((data) => setCards(Array.isArray(data) ? data : data.results ?? []))
      .catch(() => setCards([]))
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
          <h1
            className="text-4xl md:text-6xl font-light text-white mb-3"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            ID Card Printing
          </h1>
          <div className="w-12 h-px bg-[var(--gold)]/40 mb-5" />
          <p className="text-sm text-white/40 max-w-xl leading-relaxed">
            Choose a design, pick your card type and quantity, then add to cart.
            Share your details on WhatsApp after ordering — we print and deliver.
          </p>

          {/* Quick info strip */}
          <div className="flex flex-wrap items-center gap-6 mt-6">
            <div className="flex items-center gap-2 text-xs text-white/30">
              <Zap size={12} className="text-[var(--gold)]/40" />
              1–4 working days
            </div>
            <div className="flex items-center gap-2 text-xs text-white/30">
              <Truck size={12} className="text-[var(--gold)]/40" />
              Free delivery above ₹999
            </div>
          </div>
        </div>
      </section>

      {/* Pricing reference */}
      <div className="px-6 mb-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3">
            {CARD_TYPES.map((t) => (
              <div key={t.id} className="px-4 py-2 border border-[var(--gold)]/10 bg-[#111]">
                <p className="text-[9px] tracking-widest uppercase text-[var(--gold)]/50">{t.label}</p>
                <p className="text-sm text-white/70 font-light">₹{t.pricePerCard}<span className="text-[9px] text-white/30">/card · min {t.minQty}</span></p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="py-8 px-6 pb-28">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : cards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 text-center">
              <ImageIcon size={40} className="text-white/10 mb-4" />
              <p className="text-white/30 text-sm tracking-widest uppercase">
                Design examples coming soon
              </p>
              <p className="text-white/20 text-xs mt-2">
                The admin is uploading ID card designs. Check back shortly.
              </p>
              <Link
                href="/contact"
                className="mt-6 px-6 py-2.5 border border-[var(--gold)]/30 text-[var(--gold)]/60 text-xs tracking-widest uppercase hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all"
              >
                Request Custom Quote
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {cards.map((c) => (
                <IdCardCard key={c.id} card={c} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 pb-20 border-t border-[var(--gold)]/10">
        <div className="max-w-4xl mx-auto pt-14">
          <h2
            className="text-2xl font-light text-white text-center mb-10"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
            {[
              { step: "1", title: "Choose Design",   desc: "Pick an ID card design from our catalog." },
              { step: "2", title: "Select Type & Qty", desc: "Choose PVC/Acrylic and how many cards you need." },
              { step: "3", title: "Add to Cart",      desc: "Add to cart and complete checkout." },
              { step: "4", title: "Send Your Details", desc: "Share name, photo, logo on WhatsApp — we print and deliver." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center gap-3">
                <div className="w-9 h-9 bg-[var(--gold)] text-black text-sm font-bold flex items-center justify-center">
                  {step}
                </div>
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

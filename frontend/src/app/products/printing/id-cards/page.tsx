"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { useCart } from "../../../context/CartContext";
import { ArrowLeft, ShoppingCart, Check, CreditCard, Shield, Layers, Zap } from "lucide-react";

interface CardType {
  id: string;
  label: string;
  tagline: string;
  description: string;
  features: string[];
  icon: React.ElementType;
  tiers: { label: string; price: number; unit: string; note?: string }[];
  badge?: string;
}

const cardTypes: CardType[] = [
  {
    id: "pvc",
    label: "PVC ID Card",
    tagline: "Professional & Durable",
    description:
      "Standard hard-plastic PVC ID cards with vibrant full-color printing. Lightweight, waterproof, and scratch-resistant. Ideal for offices, schools, events, and institutions.",
    features: [
      "CR80 standard size (85.6 × 54 mm)",
      "Full-color digital printing",
      "Waterproof & scratch-resistant",
      "Optional lamination (gloss/matte)",
      "Barcode, QR code, photo support",
      "Punch hole / slot hole available",
      "Delivery in 1–2 working days",
    ],
    icon: CreditCard,
    badge: "Most Popular",
    tiers: [
      { label: "Single-Sided", price: 30,  unit: "per card", note: "Min. 10 cards" },
      { label: "Double-Sided", price: 45,  unit: "per card", note: "Min. 10 cards" },
      { label: "Bulk (50+)",   price: 25,  unit: "per card", note: "Single-sided" },
      { label: "Bulk (100+)",  price: 20,  unit: "per card", note: "Best value" },
    ],
  },
  {
    id: "acrylic",
    label: "Acrylic ID Card",
    tagline: "Premium & Transparent",
    description:
      "High-end acrylic ID cards with a crystal-clear or frosted finish. Gives a luxury, corporate look — perfect for premium brands, corporate events, and VIP access passes.",
    features: [
      "Crystal-clear or frosted acrylic",
      "UV-printed sharp text & graphics",
      "Premium thick feel (1.2 mm)",
      "Custom shape & die-cut available",
      "Magnetic stripe / RFID chip option",
      "Holographic overlay available",
      "Delivery in 2–4 working days",
    ],
    icon: Shield,
    tiers: [
      { label: "Single-Sided", price: 80,  unit: "per card", note: "Min. 5 cards" },
      { label: "Double-Sided", price: 120, unit: "per card", note: "Min. 5 cards" },
      { label: "Bulk (25+)",   price: 70,  unit: "per card", note: "Single-sided" },
      { label: "Bulk (50+)",   price: 60,  unit: "per card", note: "Best value" },
    ],
  },
];

function CardSection({ card }: { card: CardType }) {
  const { addItem } = useCart();
  const [selectedTier, setSelectedTier] = useState(card.tiers[0]);
  const [qty, setQty] = useState(10);
  const [added, setAdded] = useState(false);

  const totalPrice = selectedTier.price * qty;

  const handleAdd = useCallback(() => {
    addItem({
      id: `id-${card.id}-${selectedTier.label.toLowerCase().replace(/\s/g, "-")}`,
      title: `${card.label} — ${selectedTier.label} × ${qty}`,
      category: "ID Cards",
      price: totalPrice,
      image: null,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }, [addItem, card, selectedTier, qty, totalPrice]);

  const Icon = card.icon;

  return (
    <div className="bg-[var(--black-card)] border border-[var(--gold)]/10 hover:border-[var(--gold)]/20 transition-all p-8 relative">
      {card.badge && (
        <span className="absolute -top-3 left-6 bg-[var(--gold)] text-black text-[9px] px-3 py-1 tracking-wider uppercase font-bold">
          {card.badge}
        </span>
      )}

      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 border border-[var(--gold)]/20 flex items-center justify-center shrink-0">
          <Icon size={22} className="text-[var(--gold)]/60" />
        </div>
        <div>
          <h2 className="text-2xl font-light text-white" style={{ fontFamily: "var(--font-cormorant)" }}>
            {card.label}
          </h2>
          <p className="text-xs text-[var(--gold)]/60 tracking-wider">{card.tagline}</p>
        </div>
      </div>

      <p className="text-sm text-white/40 leading-relaxed mb-6">{card.description}</p>

      {/* Features */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
        {card.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs text-white/50">
            <Check size={11} className="text-[var(--gold)]/50 mt-0.5 shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      <div className="border-t border-[var(--gold)]/10 pt-6">
        {/* Pricing tiers */}
        <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--gold)]/50 mb-3">Select Pricing Tier</p>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {card.tiers.map((tier) => (
            <button
              key={tier.label}
              onClick={() => setSelectedTier(tier)}
              className={`p-3 border text-left transition-all duration-200 ${
                selectedTier.label === tier.label
                  ? "border-[var(--gold)] bg-[var(--gold)]/5"
                  : "border-[var(--gold)]/10 hover:border-[var(--gold)]/30"
              }`}
            >
              <p className="text-xs font-medium text-white">{tier.label}</p>
              <p className="text-[var(--gold)] text-sm font-semibold mt-0.5">₹{tier.price} <span className="text-[10px] text-white/30 font-normal">{tier.unit}</span></p>
              {tier.note && <p className="text-[9px] text-white/25 mt-0.5">{tier.note}</p>}
            </button>
          ))}
        </div>

        {/* Quantity + total */}
        <div className="flex items-center gap-4 mb-5">
          <div>
            <p className="text-[10px] tracking-widest uppercase text-white/30 mb-2">Quantity</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-8 h-8 border border-[var(--gold)]/20 text-white hover:border-[var(--gold)]/50 flex items-center justify-center"
              >
                −
              </button>
              <input
                type="number"
                value={qty}
                min={1}
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 bg-[var(--black)] border border-[var(--gold)]/20 px-2 py-1.5 text-sm text-white text-center outline-none"
              />
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-8 h-8 border border-[var(--gold)]/20 text-white hover:border-[var(--gold)]/50 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex-1 text-right">
            <p className="text-[10px] tracking-widest uppercase text-white/30 mb-1">Total</p>
            <p className="text-2xl text-[var(--gold)]" style={{ fontFamily: "var(--font-cormorant)" }}>
              ₹{totalPrice.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleAdd}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs tracking-widest uppercase font-medium transition-all ${
              added
                ? "bg-green-600 text-white"
                : "bg-[var(--gold)] text-black hover:bg-[var(--gold-light)]"
            }`}
          >
            {added ? <><Check size={12} /> Added</> : <><ShoppingCart size={12} /> Add to Cart</>}
          </button>
          <Link
            href="/contact"
            className="flex-1 flex items-center justify-center gap-2 py-3 border border-[var(--gold)]/30 text-[var(--gold)]/60 text-xs tracking-widest uppercase hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all"
          >
            Custom Quote
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function IdCardsPage() {
  return (
    <div className="bg-[var(--black)]">
      <Navbar />

      {/* Header */}
      <section className="pt-36 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/products" className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-white/30 hover:text-[var(--gold)]/60 transition-colors mb-8">
            <ArrowLeft size={12} /> Products
          </Link>
          <span className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]/60 block mb-3">Printing Service</span>
          <h1 className="text-4xl md:text-6xl font-light text-white mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
            ID Card Printing
          </h1>
          <div className="w-12 h-px bg-[var(--gold)]/40 mb-4" />
          <p className="text-sm text-white/40 max-w-xl leading-relaxed">
            Professional ID cards for businesses, schools, events, and institutions. Choose between standard PVC or premium acrylic finish.
          </p>
        </div>
      </section>

      {/* Comparison highlight */}
      <section className="py-4 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-4 p-5 bg-[var(--black-card)] border border-[var(--gold)]/10">
            <div className="flex items-center gap-3">
              <Zap size={16} className="text-[var(--gold)]/60" />
              <div>
                <p className="text-xs text-white/60 font-medium">Fast Turnaround</p>
                <p className="text-[10px] text-white/30">1–4 working days</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Layers size={16} className="text-[var(--gold)]/60" />
              <div>
                <p className="text-xs text-white/60 font-medium">Two Premium Types</p>
                <p className="text-[10px] text-white/30">PVC &amp; Acrylic</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield size={16} className="text-[var(--gold)]/60" />
              <div>
                <p className="text-xs text-white/60 font-medium">Custom Design</p>
                <p className="text-[10px] text-white/30">Your logo &amp; details</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two card types */}
      <section className="py-10 px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {cardTypes.map((card) => (
              <CardSection key={card.id} card={card} />
            ))}
          </div>

          {/* Note */}
          <div className="mt-10 p-5 border border-[var(--gold)]/10 bg-[var(--black-card)]">
            <p className="text-xs text-white/40 leading-relaxed">
              <strong className="text-white/60">How to order:</strong> Add cards to cart and place order, or{" "}
              <Link href="/contact" className="text-[var(--gold)]/60 hover:text-[var(--gold)] transition-colors">
                contact us
              </Link>{" "}
              with your design file (PSD / CDR / AI / PDF). We also offer free basic design for bulk orders of 50+.
              Design file can be shared on WhatsApp after placing order.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

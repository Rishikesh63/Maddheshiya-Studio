"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { waLink } from "../lib/siteConfig";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingCart, MessageCircle, ImageIcon } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQty, total, clear } = useCart();

  const whatsappMessage =
    `Hi Maddheshiya Studio! I'd like to order the following:\n\n` +
    items.map((i) => `• ${i.title} (${i.category}) × ${i.quantity} = ₹${i.price * i.quantity}`).join("\n") +
    `\n\nTotal: ₹${total}\n\nPlease confirm availability.`;

  return (
    <div className="bg-[var(--black)] min-h-screen">
      <Navbar />

      <section className="pt-36 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/products/digital/album-psd"
            className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-white/30 hover:text-[var(--gold)]/60 transition-colors mb-10"
          >
            <ArrowLeft size={12} />
            Album PSD
          </Link>

          <div className="flex items-center gap-4 mb-10">
            <ShoppingCart size={22} className="text-[var(--gold)]/60" />
            <h1
              className="text-4xl md:text-5xl font-light text-white"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Your Cart
            </h1>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-24">
              <ShoppingCart size={40} className="text-[var(--gold)]/20 mx-auto mb-6" />
              <p className="text-white/30 text-sm tracking-wider mb-8">Your cart is empty</p>
              <Link
                href="/products/digital/album-psd"
                className="px-8 py-3 border border-[var(--gold)]/40 text-[var(--gold)]/60 text-[10px] tracking-widest uppercase hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all"
              >
                Browse Album PSD
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Items list */}
              <div className="lg:col-span-2 space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-[var(--black-card)] border border-[var(--gold)]/10"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-16 bg-[#1a1a1a] shrink-0 flex items-center justify-center">
                      {item.image ? (
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      ) : (
                        <ImageIcon size={18} className="text-[var(--gold)]/20" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] tracking-widest uppercase text-[var(--gold)]/40 mb-0.5">
                        {item.category}
                      </p>
                      <p
                        className="text-white font-light leading-snug mb-3"
                        style={{ fontFamily: "var(--font-cormorant)", fontSize: "1rem" }}
                      >
                        {item.title}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="w-7 h-7 border border-[var(--gold)]/20 text-white/50 hover:border-[var(--gold)]/50 hover:text-[var(--gold)] transition-colors flex items-center justify-center"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-sm text-white/70 w-5 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="w-7 h-7 border border-[var(--gold)]/20 text-white/50 hover:border-[var(--gold)]/50 hover:text-[var(--gold)] transition-colors flex items-center justify-center"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span
                            className="text-[var(--gold)]"
                            style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem" }}
                          >
                            ₹{item.price * item.quantity}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-white/20 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={clear}
                  className="text-[10px] tracking-widest uppercase text-white/20 hover:text-red-400/60 transition-colors mt-2"
                >
                  Clear Cart
                </button>
              </div>

              {/* Order summary */}
              <div className="lg:col-span-1">
                <div className="bg-[var(--black-card)] border border-[var(--gold)]/10 p-6 sticky top-24">
                  <h2
                    className="text-2xl font-light text-white mb-6"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    Order Summary
                  </h2>

                  <div className="space-y-3 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-xs">
                        <span className="text-white/40 truncate mr-2">
                          {item.title} ×{item.quantity}
                        </span>
                        <span className="text-white/60 shrink-0">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[var(--gold)]/10 pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] tracking-widest uppercase text-white/40">Total</span>
                      <span
                        className="text-2xl text-[var(--gold)]"
                        style={{ fontFamily: "var(--font-cormorant)" }}
                      >
                        ₹{total}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={waLink(whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-4 bg-[var(--gold)] text-black text-xs tracking-widest uppercase font-medium hover:bg-[var(--gold-light)] transition-colors mb-3"
                  >
                    <MessageCircle size={14} />
                    Order via WhatsApp
                  </Link>

                  <p className="text-[10px] text-white/20 text-center leading-relaxed">
                    We will send the PSD files via WhatsApp or email after payment confirmation.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

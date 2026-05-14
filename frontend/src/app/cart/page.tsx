"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingCart, ImageIcon, Download, CheckCircle, Loader2, CreditCard } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";

interface DownloadItem { id: string; title: string; url: string; }

type Step = "cart" | "checkout" | "processing" | "success";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CartPage() {
  const { items, removeItem, updateQty, total, clear } = useCart();
  const [step, setStep] = useState<Step>("cart");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [formError, setFormError] = useState("");
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [paidName, setPaidName] = useState("");
  const [nonDigitalItems, setNonDigitalItems] = useState<string[]>([]);

  const handlePay = useCallback(async () => {
    setFormError("");
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setFormError("Please fill in all fields.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setFormError("Enter a valid email address.");
      return;
    }
    if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ""))) {
      setFormError("Enter a valid 10-digit phone number.");
      return;
    }

    setStep("processing");

    const loaded = await loadRazorpay();
    if (!loaded) {
      setFormError("Failed to load payment gateway. Check your internet connection.");
      setStep("checkout");
      return;
    }

    // Create Razorpay order via backend
    let orderData;
    try {
      const res = await fetch(`${API_URL}/api/payments/create-order/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          amount: total,
          items: items.map((i) => ({
            id: i.id,
            title: i.title,
            price: i.price,
            downloadPath: i.downloadPath || null,
          })),
        }),
      });
      const text = await res.text();
      try {
        orderData = JSON.parse(text);
      } catch {
        throw new Error(`Backend error: ${text.slice(0, 200)}`);
      }
      if (!res.ok) throw new Error(orderData.error || "Order creation failed.");
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : "Could not create order. Try again.");
      setStep("checkout");
      return;
    }

    // Open Razorpay checkout
    const options = {
      key: RAZORPAY_KEY || orderData.key_id,
      amount: orderData.amount,
      currency: "INR",
      name: "Maddheshiya Studio",
      description: `${items.length} item${items.length > 1 ? "s" : ""}`,
      order_id: orderData.order_id,
      prefill: { name: form.name, email: form.email, contact: form.phone },
      theme: { color: "#C9A84C" },
      handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
        // Verify payment
        try {
          const verifyRes = await fetch(`${API_URL}/api/payments/verify/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) throw new Error(verifyData.error || "Verification failed");

          setDownloads(verifyData.downloads || []);
          setPaidName(verifyData.customer_name || form.name);
          setNonDigitalItems(
            (verifyData.items || [])
              .filter((i: { downloadPath?: string | null }) => !i.downloadPath)
              .map((i: { title: string }) => i.title)
          );
          clear();
          setStep("success");
        } catch {
          setFormError("Payment received but verification failed. Contact us with your payment ID: " + response.razorpay_payment_id);
          setStep("checkout");
        }
      },
      modal: {
        ondismiss: () => setStep("checkout"),
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }, [form, items, total, clear]);

  return (
    <div className="bg-[var(--black)] min-h-screen">
      <Navbar />

      <section className="pt-36 pb-24 px-6">
        <div className="max-w-4xl mx-auto">

          {/* ── SUCCESS SCREEN ── */}
          {step === "success" && (
            <div className="text-center py-10">
              <CheckCircle size={52} className="text-green-500 mx-auto mb-5" />
              <h1 className="text-4xl font-light text-white mb-3" style={{ fontFamily: "var(--font-cormorant)" }}>
                Payment Successful!
              </h1>
              <p className="text-sm text-white/40 mb-10">
                Thank you, <span className="text-white/70">{paidName}</span>. Your order is confirmed.
              </p>

              {downloads.length > 0 && (
                <div className="max-w-lg mx-auto mb-10">
                  <h2 className="text-xl font-light text-white mb-4 pb-2 border-b border-[var(--gold)]/20" style={{ fontFamily: "var(--font-cormorant)" }}>
                    Your Downloads
                  </h2>
                  <p className="text-xs text-white/30 mb-5 tracking-wider">Links expire in 24 hours.</p>
                  <div className="space-y-3">
                    {downloads.map((d) => (
                      <a
                        key={d.id}
                        href={d.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-4 p-4 bg-[var(--black-card)] border border-[var(--gold)]/20 hover:border-[var(--gold)]/50 transition-colors group"
                      >
                        <span className="text-sm text-white/70 group-hover:text-white transition-colors truncate">
                          {d.title}
                        </span>
                        <span className="shrink-0 flex items-center gap-2 text-[var(--gold)] text-xs tracking-widest uppercase">
                          <Download size={14} />
                          Download
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {nonDigitalItems.length > 0 && (
                <div className="max-w-lg mx-auto mb-10 p-5 bg-[var(--black-card)] border border-[var(--gold)]/10 text-left">
                  <h3 className="text-base font-light text-white mb-3" style={{ fontFamily: "var(--font-cormorant)" }}>
                    Service / Physical Orders
                  </h3>
                  <p className="text-xs text-white/40 mb-3">
                    These items will be delivered via WhatsApp once your order is processed:
                  </p>
                  <ul className="space-y-1">
                    {nonDigitalItems.map((t) => (
                      <li key={t} className="text-sm text-white/60 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-[var(--gold)]/40 shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Link
                href="/products"
                className="inline-block px-8 py-3 border border-[var(--gold)]/40 text-[var(--gold)]/60 text-[10px] tracking-widest uppercase hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all"
              >
                Continue Shopping
              </Link>
            </div>
          )}

          {/* ── PROCESSING ── */}
          {step === "processing" && (
            <div className="text-center py-32">
              <Loader2 size={40} className="text-[var(--gold)]/60 mx-auto mb-6 animate-spin" />
              <p className="text-white/40 text-sm tracking-wider">Opening payment gateway…</p>
            </div>
          )}

          {/* ── CHECKOUT FORM ── */}
          {step === "checkout" && (
            <div className="max-w-lg mx-auto">
              <button
                onClick={() => setStep("cart")}
                className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-white/30 hover:text-[var(--gold)]/60 transition-colors mb-10"
              >
                <ArrowLeft size={12} />
                Back to Cart
              </button>

              <h1 className="text-4xl font-light text-white mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
                Checkout
              </h1>
              <div className="w-10 h-px bg-[var(--gold)]/40 mb-8" />

              {/* Order mini-summary */}
              <div className="bg-[var(--black-card)] border border-[var(--gold)]/10 p-4 mb-8 space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs">
                    <span className="text-white/40 truncate mr-2">{item.title} ×{item.quantity}</span>
                    <span className="text-white/60 shrink-0">₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t border-[var(--gold)]/10 pt-3 flex justify-between">
                  <span className="text-[10px] tracking-widest uppercase text-white/30">Total</span>
                  <span className="text-[var(--gold)] font-semibold" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem" }}>
                    ₹{total}
                  </span>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-4 mb-6">
                {[
                  { key: "name", label: "Full Name", type: "text", placeholder: "Ravi Kumar" },
                  { key: "email", label: "Email Address", type: "email", placeholder: "you@email.com" },
                  { key: "phone", label: "Phone Number", type: "tel", placeholder: "9876543210" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-[10px] tracking-widest uppercase text-white/40 mb-2">{f.label}</label>
                    <input
                      type={f.type}
                      value={form[f.key as keyof typeof form]}
                      onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full bg-[var(--black)] border border-[var(--gold)]/20 text-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]/50 placeholder:text-white/20"
                    />
                  </div>
                ))}
              </div>

              {formError && (
                <p className="text-red-400/80 text-xs mb-4 leading-relaxed">{formError}</p>
              )}

              <button
                onClick={handlePay}
                className="w-full flex items-center justify-center gap-3 py-4 bg-[var(--gold)] text-black text-sm font-semibold tracking-widest uppercase hover:bg-[#b8933e] transition-colors"
              >
                <CreditCard size={16} />
                Pay ₹{total} with Razorpay
              </button>

              <p className="text-[10px] text-white/20 text-center mt-4 leading-relaxed">
                Secured by Razorpay · UPI · Visa · RuPay · Mastercard
              </p>
            </div>
          )}

          {/* ── CART ── */}
          {step === "cart" && (
            <>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-white/30 hover:text-[var(--gold)]/60 transition-colors mb-10"
              >
                <ArrowLeft size={12} />
                Products
              </Link>

              <div className="flex items-center gap-4 mb-10">
                <ShoppingCart size={22} className="text-[var(--gold)]/60" />
                <h1 className="text-4xl md:text-5xl font-light text-white" style={{ fontFamily: "var(--font-cormorant)" }}>
                  Your Cart
                </h1>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-24">
                  <ShoppingCart size={40} className="text-[var(--gold)]/20 mx-auto mb-6" />
                  <p className="text-white/30 text-sm tracking-wider mb-8">Your cart is empty</p>
                  <Link
                    href="/products"
                    className="px-8 py-3 border border-[var(--gold)]/40 text-[var(--gold)]/60 text-[10px] tracking-widest uppercase hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Items */}
                  <div className="lg:col-span-2 space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 bg-[var(--black-card)] border border-[var(--gold)]/10">
                        <div className="relative w-20 h-16 bg-[#1a1a1a] shrink-0 flex items-center justify-center">
                          {item.image ? (
                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                          ) : (
                            <ImageIcon size={18} className="text-[var(--gold)]/20" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] tracking-widest uppercase text-[var(--gold)]/40 mb-0.5">{item.category}</p>
                          <p className="text-white font-light leading-snug mb-3" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1rem" }}>
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
                              <span className="text-[var(--gold)]" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem" }}>
                                ₹{item.price * item.quantity}
                              </span>
                              <button onClick={() => removeItem(item.id)} className="text-white/20 hover:text-red-400 transition-colors">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button onClick={clear} className="text-[10px] tracking-widest uppercase text-white/20 hover:text-red-400/60 transition-colors mt-2">
                      Clear Cart
                    </button>
                  </div>

                  {/* Summary */}
                  <div className="lg:col-span-1">
                    <div className="bg-[var(--black-card)] border border-[var(--gold)]/10 p-6 sticky top-24">
                      <h2 className="text-2xl font-light text-white mb-6" style={{ fontFamily: "var(--font-cormorant)" }}>
                        Order Summary
                      </h2>
                      <div className="space-y-3 mb-6">
                        {items.map((item) => (
                          <div key={item.id} className="flex justify-between text-xs">
                            <span className="text-white/40 truncate mr-2">{item.title} ×{item.quantity}</span>
                            <span className="text-white/60 shrink-0">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-[var(--gold)]/10 pt-4 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] tracking-widest uppercase text-white/40">Total</span>
                          <span className="text-2xl text-[var(--gold)]" style={{ fontFamily: "var(--font-cormorant)" }}>
                            ₹{total}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setStep("checkout")}
                        className="flex items-center justify-center gap-3 w-full py-4 bg-[var(--gold)] text-black text-xs tracking-widest uppercase font-medium hover:bg-[#b8933e] transition-colors"
                      >
                        <CreditCard size={14} />
                        Proceed to Pay
                      </button>

                      <p className="text-[10px] text-white/20 text-center mt-4 leading-relaxed">
                        Secure payment via Razorpay · UPI · Cards · NetBanking
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

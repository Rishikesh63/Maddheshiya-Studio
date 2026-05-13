"use client";

import { useState, useRef, useCallback, ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { useCart } from "../../../context/CartContext";
import {
  ArrowLeft, ShoppingCart, Check, Upload, X, MapPin,
  Phone, User, Calendar, FileText, Package, Truck
} from "lucide-react";

const frameSizes = [
  { id: "8x12",  label: "8×12",  inches: "8 × 12 inches",  price: 499,  popular: false, desc: "Perfect for portrait photos, family snapshots and small wall décor." },
  { id: "10x12", label: "10×12", inches: "10 × 12 inches", price: 599,  popular: false, desc: "Ideal for school photos, individual portraits and desk display." },
  { id: "12x15", label: "12×15", inches: "12 × 15 inches", price: 699,  popular: false, desc: "Great for couple photos, event highlights and bedside display." },
  { id: "12x18", label: "12×18", inches: "12 × 18 inches", price: 799,  popular: true,  desc: "Most popular — wedding portraits and living room wall art." },
  { id: "16x30", label: "16×30", inches: "16 × 30 inches", price: 999,  popular: false, desc: "Panoramic format for group photos and wide-scene memories." },
  { id: "20x24", label: "20×24", inches: "20 × 24 inches", price: 1199, popular: false, desc: "Large wall art format for statement pieces and premium gifting." },
  { id: "24x36", label: "24×36", inches: "24 × 36 inches", price: 1499, popular: false, desc: "Extra-large poster format for reception walls and galleries." },
];

const materials = [
  { id: "wood",    label: "Wood Frame",    extra: 0,   desc: "Classic solid wood with matte finish. Warm and timeless." },
  { id: "acrylic", label: "Acrylic Frame", extra: 150, desc: "Modern clear acrylic border. Sleek, premium, and contemporary." },
  { id: "canvas",  label: "Canvas Print",  extra: 100, desc: "Gallery-style canvas wrap. No frame — pure art gallery look." },
];

interface OrderForm {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  deliveryDate: string;
  notes: string;
}

const emptyForm: OrderForm = { name: "", phone: "", address: "", city: "", pincode: "", deliveryDate: "", notes: "" };

export default function PhotoFramingPage() {
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState(frameSizes[3]);
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0]);
  const [qty, setQty] = useState(1);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string>("");
  const [form, setForm] = useState<OrderForm>(emptyForm);
  const [added, setAdded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<OrderForm>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const totalPrice = (selectedSize.price + selectedMaterial.extra) * qty;

  const handlePhoto = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleField = useCallback((field: keyof OrderForm, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: "" }));
  }, []);

  function validate(): boolean {
    const e: Partial<OrderForm> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Enter a valid 10-digit number";
    if (!form.address.trim()) e.address = "Delivery address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.pincode.trim()) e.pincode = "PIN code is required";
    else if (!/^\d{6}$/.test(form.pincode)) e.pincode = "Enter a valid 6-digit PIN";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const handleAddToCart = useCallback(() => {
    addItem({
      id: `frame-${selectedSize.id}-${selectedMaterial.id}`,
      title: `Photo Frame ${selectedSize.label} — ${selectedMaterial.label}`,
      category: "Photo Framing",
      price: selectedSize.price + selectedMaterial.extra,
      image: null,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }, [addItem, selectedSize, selectedMaterial]);

  function handleOrderWhatsApp() {
    if (!validate()) return;
    const msg = encodeURIComponent(
      `📸 *Photo Framing Order — Maddheshiya Studio*\n\n` +
      `*Frame Size:* ${selectedSize.label} (${selectedSize.inches})\n` +
      `*Material:* ${selectedMaterial.label}\n` +
      `*Quantity:* ${qty}\n` +
      `*Total Amount:* ₹${totalPrice}\n\n` +
      `*Customer Details:*\n` +
      `Name: ${form.name}\n` +
      `Phone: ${form.phone}\n` +
      `Address: ${form.address}, ${form.city} — ${form.pincode}\n` +
      (form.deliveryDate ? `Preferred Delivery: ${form.deliveryDate}\n` : "") +
      (form.notes ? `Notes: ${form.notes}\n` : "") +
      `\n_Photo will be shared separately on WhatsApp._`
    );
    window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919XXXXXXXXX"}?text=${msg}`, "_blank");
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="bg-[var(--black)] min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
          <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mb-6">
            <Check size={28} className="text-green-400" />
          </div>
          <h2 className="text-3xl font-light text-white mb-3" style={{ fontFamily: "var(--font-cormorant)" }}>
            Order Submitted!
          </h2>
          <p className="text-sm text-white/40 max-w-sm mb-2">
            Your order details have been sent to WhatsApp. Please also share your photo there.
          </p>
          <p className="text-xs text-[var(--gold)]/60 mb-8">We will confirm your order within 2 hours.</p>
          <div className="flex gap-4">
            <button onClick={() => setSubmitted(false)} className="px-6 py-3 border border-[var(--gold)]/30 text-[var(--gold)]/60 text-xs tracking-widest uppercase hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all">
              New Order
            </button>
            <Link href="/products" className="px-6 py-3 bg-[var(--gold)] text-black text-xs tracking-widest uppercase font-medium hover:bg-[var(--gold-light)] transition-colors">
              Back to Products
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
            Photo Framing
          </h1>
          <div className="w-12 h-px bg-[var(--gold)]/40 mb-4" />
          <p className="text-sm text-white/40 max-w-xl leading-relaxed">
            Premium quality photo prints in wood, acrylic, and canvas formats. Upload your photo, choose your size, and we deliver to your door.
          </p>
        </div>
      </section>

      <section className="py-8 px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* LEFT: Size + Material + Upload */}
            <div className="lg:col-span-2 space-y-10">

              {/* Step 1 — Frame Size */}
              <div>
                <h2 className="text-xs tracking-[0.3em] uppercase text-[var(--gold)]/60 mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[var(--gold)] text-black text-[10px] font-bold flex items-center justify-center">1</span>
                  Choose Frame Size
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {frameSizes.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSize(s)}
                      className={`relative p-4 border text-left transition-all duration-200 ${
                        selectedSize.id === s.id
                          ? "border-[var(--gold)] bg-[var(--gold)]/5"
                          : "border-[var(--gold)]/10 bg-[var(--black-card)] hover:border-[var(--gold)]/30"
                      }`}
                    >
                      {s.popular && (
                        <span className="absolute -top-2 left-3 bg-[var(--gold)] text-black text-[8px] px-2 py-0.5 tracking-wider uppercase font-bold">
                          Popular
                        </span>
                      )}
                      <p className="text-lg font-light text-white mb-0.5" style={{ fontFamily: "var(--font-cormorant)" }}>
                        {s.label}
                      </p>
                      <p className="text-[10px] text-white/30">{s.inches}</p>
                      <p className="text-sm text-[var(--gold)] mt-2">₹{s.price}</p>
                    </button>
                  ))}
                </div>
                {selectedSize && (
                  <p className="text-xs text-white/40 mt-3 leading-relaxed">{selectedSize.desc}</p>
                )}
              </div>

              {/* Step 2 — Material */}
              <div>
                <h2 className="text-xs tracking-[0.3em] uppercase text-[var(--gold)]/60 mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[var(--gold)] text-black text-[10px] font-bold flex items-center justify-center">2</span>
                  Choose Material
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {materials.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMaterial(m)}
                      className={`p-4 border text-left transition-all duration-200 ${
                        selectedMaterial.id === m.id
                          ? "border-[var(--gold)] bg-[var(--gold)]/5"
                          : "border-[var(--gold)]/10 bg-[var(--black-card)] hover:border-[var(--gold)]/30"
                      }`}
                    >
                      <p className="text-sm font-medium text-white mb-1">{m.label}</p>
                      <p className="text-[10px] text-white/40 leading-snug mb-2">{m.desc}</p>
                      <p className="text-xs text-[var(--gold)]">
                        {m.extra === 0 ? "Included" : `+₹${m.extra}`}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3 — Upload Photo */}
              <div>
                <h2 className="text-xs tracking-[0.3em] uppercase text-[var(--gold)]/60 mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[var(--gold)] text-black text-[10px] font-bold flex items-center justify-center">3</span>
                  Upload Your Photo
                </h2>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhoto}
                  className="hidden"
                />
                {photoPreview ? (
                  <div className="relative inline-block">
                    <Image
                      src={photoPreview}
                      alt="Uploaded photo preview"
                      width={320}
                      height={220}
                      className="object-cover border border-[var(--gold)]/20"
                      style={{ maxHeight: 220, width: "auto" }}
                    />
                    <button
                      onClick={() => { setPhotoPreview(null); setPhotoName(""); }}
                      className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 hover:bg-red-500/80 transition-colors"
                    >
                      <X size={12} />
                    </button>
                    <p className="text-[10px] text-white/30 mt-2 truncate max-w-[320px]">{photoName}</p>
                  </div>
                ) : (
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="w-full max-w-md border-2 border-dashed border-[var(--gold)]/20 hover:border-[var(--gold)]/50 bg-[var(--black-card)] p-10 flex flex-col items-center gap-3 transition-colors"
                  >
                    <Upload size={28} className="text-[var(--gold)]/40" />
                    <p className="text-sm text-white/40">Click to upload your photo</p>
                    <p className="text-[10px] text-white/20">JPG, PNG, HEIC — max 20MB</p>
                  </button>
                )}
                <p className="text-[10px] text-white/20 mt-3">
                  * You can also share the photo directly on WhatsApp after placing the order.
                </p>
              </div>

              {/* Step 4 — Quantity */}
              <div>
                <h2 className="text-xs tracking-[0.3em] uppercase text-[var(--gold)]/60 mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[var(--gold)] text-black text-[10px] font-bold flex items-center justify-center">4</span>
                  Quantity
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 border border-[var(--gold)]/20 text-white hover:border-[var(--gold)]/50 transition-colors flex items-center justify-center text-lg"
                  >
                    −
                  </button>
                  <span className="text-white text-lg w-8 text-center">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="w-10 h-10 border border-[var(--gold)]/20 text-white hover:border-[var(--gold)]/50 transition-colors flex items-center justify-center text-lg"
                  >
                    +
                  </button>
                  <span className="text-xs text-white/30 ml-2">= ₹{totalPrice}</span>
                </div>
              </div>

              {/* Step 5 — Delivery Details */}
              <div>
                <h2 className="text-xs tracking-[0.3em] uppercase text-[var(--gold)]/60 mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[var(--gold)] text-black text-[10px] font-bold flex items-center justify-center">5</span>
                  Delivery Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-white/40 block mb-2 flex items-center gap-1.5">
                      <User size={10} /> Full Name *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleField("name", e.target.value)}
                      placeholder="Your full name"
                      className={`w-full bg-[var(--black-card)] border px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-[var(--gold)]/60 transition-colors ${errors.name ? "border-red-500/60" : "border-[var(--gold)]/15"}`}
                    />
                    {errors.name && <p className="text-red-400 text-[10px] mt-1">{errors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-white/40 block mb-2 flex items-center gap-1.5">
                      <Phone size={10} /> Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleField("phone", e.target.value)}
                      placeholder="10-digit mobile number"
                      className={`w-full bg-[var(--black-card)] border px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-[var(--gold)]/60 transition-colors ${errors.phone ? "border-red-500/60" : "border-[var(--gold)]/15"}`}
                    />
                    {errors.phone && <p className="text-red-400 text-[10px] mt-1">{errors.phone}</p>}
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-2">
                    <label className="text-[10px] tracking-widest uppercase text-white/40 block mb-2 flex items-center gap-1.5">
                      <MapPin size={10} /> Delivery Address *
                    </label>
                    <textarea
                      value={form.address}
                      onChange={(e) => handleField("address", e.target.value)}
                      placeholder="House no., street, area, landmark"
                      rows={2}
                      className={`w-full bg-[var(--black-card)] border px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-[var(--gold)]/60 transition-colors resize-none ${errors.address ? "border-red-500/60" : "border-[var(--gold)]/15"}`}
                    />
                    {errors.address && <p className="text-red-400 text-[10px] mt-1">{errors.address}</p>}
                  </div>

                  {/* City */}
                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-white/40 block mb-2">City *</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => handleField("city", e.target.value)}
                      placeholder="City"
                      className={`w-full bg-[var(--black-card)] border px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-[var(--gold)]/60 transition-colors ${errors.city ? "border-red-500/60" : "border-[var(--gold)]/15"}`}
                    />
                    {errors.city && <p className="text-red-400 text-[10px] mt-1">{errors.city}</p>}
                  </div>

                  {/* PIN */}
                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-white/40 block mb-2">PIN Code *</label>
                    <input
                      type="text"
                      value={form.pincode}
                      onChange={(e) => handleField("pincode", e.target.value)}
                      placeholder="6-digit PIN code"
                      maxLength={6}
                      className={`w-full bg-[var(--black-card)] border px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-[var(--gold)]/60 transition-colors ${errors.pincode ? "border-red-500/60" : "border-[var(--gold)]/15"}`}
                    />
                    {errors.pincode && <p className="text-red-400 text-[10px] mt-1">{errors.pincode}</p>}
                  </div>

                  {/* Delivery date */}
                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-white/40 block mb-2 flex items-center gap-1.5">
                      <Calendar size={10} /> Preferred Delivery Date
                    </label>
                    <input
                      type="date"
                      value={form.deliveryDate}
                      onChange={(e) => handleField("deliveryDate", e.target.value)}
                      min={new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0]}
                      className="w-full bg-[var(--black-card)] border border-[var(--gold)]/15 px-4 py-3 text-sm text-white outline-none focus:border-[var(--gold)]/60 transition-colors"
                      style={{ colorScheme: "dark" }}
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-white/40 block mb-2 flex items-center gap-1.5">
                      <FileText size={10} /> Special Instructions
                    </label>
                    <input
                      type="text"
                      value={form.notes}
                      onChange={(e) => handleField("notes", e.target.value)}
                      placeholder="E.g. matte finish, no border, gift wrap..."
                      className="w-full bg-[var(--black-card)] border border-[var(--gold)]/15 px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-[var(--gold)]/60 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Order Summary (sticky) */}
            <div className="lg:col-span-1">
              <div className="bg-[var(--black-card)] border border-[var(--gold)]/10 p-6 sticky top-24">
                <h3 className="text-xl font-light text-white mb-5" style={{ fontFamily: "var(--font-cormorant)" }}>
                  Order Summary
                </h3>

                <div className="space-y-3 mb-5 pb-5 border-b border-[var(--gold)]/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Frame Size</span>
                    <span className="text-white">{selectedSize.label}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Material</span>
                    <span className="text-white">{selectedMaterial.label}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Quantity</span>
                    <span className="text-white">{qty}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Unit Price</span>
                    <span className="text-white">₹{selectedSize.price + selectedMaterial.extra}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] tracking-widest uppercase text-white/40">Total</span>
                  <span className="text-2xl text-[var(--gold)]" style={{ fontFamily: "var(--font-cormorant)" }}>
                    ₹{totalPrice}
                  </span>
                </div>

                {/* Delivery info */}
                <div className="flex items-start gap-2 mb-6 p-3 bg-[var(--gold)]/5 border border-[var(--gold)]/10">
                  <Truck size={14} className="text-[var(--gold)]/60 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-white/60 font-medium">Delivery: 3–7 working days</p>
                    <p className="text-[10px] text-white/30 mt-0.5">Free delivery on orders above ₹999</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {/* Add to cart */}
                  <button
                    onClick={handleAddToCart}
                    className={`flex items-center justify-center gap-2 w-full py-3 text-xs tracking-widest uppercase font-medium transition-all ${
                      added ? "bg-green-600 text-white" : "border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black"
                    }`}
                  >
                    {added ? <><Check size={12} /> Added to Cart</> : <><ShoppingCart size={12} /> Add to Cart</>}
                  </button>

                  {/* Place order via WhatsApp */}
                  <button
                    onClick={handleOrderWhatsApp}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-[var(--gold)] text-black text-xs tracking-widest uppercase font-medium hover:bg-[var(--gold-light)] transition-colors"
                  >
                    <Package size={14} />
                    Place Order
                  </button>
                </div>

                <p className="text-[10px] text-white/20 text-center mt-4 leading-relaxed">
                  Fill all details above before placing order. Your photo can be shared on WhatsApp.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

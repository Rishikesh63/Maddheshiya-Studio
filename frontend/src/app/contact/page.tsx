"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { waLink } from "../lib/siteConfig";
import { Mail, Phone, MapPin, Instagram, Facebook, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In production, submit to your contact API or formspree etc.
    setSubmitted(true);
  };

  return (
    <div className="bg-[var(--black)]">
      <Navbar />

      <section className="pt-36 pb-16 px-6 text-center">
        <span className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]/60 block mb-4">Get in Touch</span>
        <h1 className="text-5xl md:text-7xl font-light text-white mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
          Contact Us
        </h1>
        <div className="w-12 h-px bg-[var(--gold)]/40 mx-auto mb-6" />
        <p className="text-sm text-white/40 max-w-md mx-auto">
          We would love to hear about your event. Reach out and let&apos;s start planning together.
        </p>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Form */}
          <div>
            {submitted ? (
              <div className="border border-[var(--gold)]/20 p-8 text-center">
                <h2 className="text-2xl font-light text-white mb-3" style={{ fontFamily: "var(--font-cormorant)" }}>
                  Message Received
                </h2>
                <p className="text-sm text-white/40">We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {[
                  { id: "name", label: "Full Name", type: "text", required: true },
                  { id: "email", label: "Email Address", type: "email", required: true },
                  { id: "phone", label: "Phone Number", type: "tel", required: false },
                ].map((f) => (
                  <div key={f.id}>
                    <label className="block text-xs tracking-widest uppercase text-white/40 mb-2">{f.label}</label>
                    <input
                      type={f.type}
                      name={f.id}
                      required={f.required}
                      className="w-full bg-[var(--black-card)] border border-[var(--gold)]/20 text-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]/50"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs tracking-widest uppercase text-white/40 mb-2">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="w-full bg-[var(--black-card)] border border-[var(--gold)]/20 text-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]/50 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-10 py-4 bg-[var(--gold)] text-black text-xs tracking-widest uppercase font-medium hover:bg-[var(--gold-light)] transition-colors"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-2xl font-light text-white mb-6" style={{ fontFamily: "var(--font-cormorant)" }}>
                Studio Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin size={14} className="text-[var(--gold)]/50 mt-0.5 shrink-0" />
                  <span className="text-sm text-white/50">Koilahiya Chauraha, Mangalpur, Post Sarhari, Tikariya Road, Pipiganj, 273165</span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={14} className="text-[var(--gold)]/50 mt-1 shrink-0" />
                  <div className="flex flex-col gap-1">
                    {["+91 73173 71874", "+91 70717 20077", "+91 63896 32464"].map((num) => (
                      <a key={num} href={`tel:${num.replace(/\s/g, "")}`} className="text-sm text-white/50 hover:text-[var(--gold)] transition-colors">
                        {num}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={14} className="text-[var(--gold)]/50 mt-0.5 shrink-0" />
                  <a href="mailto:rishikesh6389@gmail.com" className="text-sm text-white/50 hover:text-[var(--gold)] transition-colors">
                    rishikesh6389@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-light text-white mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>Quick Links</h3>
              <div className="flex flex-col gap-3">
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 bg-[#25D366] text-white text-xs tracking-widest uppercase hover:bg-[#20b558] transition-colors"
                >
                  <MessageCircle size={14} />
                  Chat on WhatsApp
                </a>
                <a
                  href="https://www.instagram.com/mithlesh_mds/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 border border-[var(--gold)]/20 text-[var(--gold)]/60 text-xs tracking-widest uppercase hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all"
                >
                  <Instagram size={14} />
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/mithlesh.maddheshiya.3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 border border-[var(--gold)]/20 text-[var(--gold)]/60 text-xs tracking-widest uppercase hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all"
                >
                  <Facebook size={14} />
                  Facebook
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-light text-white mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>Service Areas</h3>
              <div className="flex flex-wrap gap-2">
                {["Gorakhpur", "Maharajganj", "Pipiganj", "Kushinagar", "Deoria", "Basti"].map((city) => (
                  <span key={city} className="text-[10px] tracking-widest uppercase text-white/30 border border-white/10 px-3 py-1.5">
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

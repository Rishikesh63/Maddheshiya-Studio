import { Metadata } from "next";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Digital Products",
  description:
    "Album PSD, invitation videos, album design, wedding highlights, ring ceremony, birthday highlights and more.",
};

const products = [
  { slug: "album-psd", title: "Album PSD", desc: "Professional album retouching & composites", price: "From ₹500" },
  { slug: "invitation-video", title: "Invitation Videos", desc: "Cinematic digital wedding invitations", price: "From ₹1,500" },
  { slug: "wedding-highlight", title: "Wedding Highlight", desc: "Cinematic wedding highlight reel", price: "From ₹3,500" },
  { slug: "ring-ceremony-highlight", title: "Ring Ceremony Highlights", desc: "Elegant short film of your ring exchange", price: "From ₹2,000" },
  { slug: "wedding-title", title: "Wedding Title", desc: "Cinematic title card for wedding films", price: "From ₹500" },
  { slug: "video-logo", title: "Video Logo", desc: "Animated logo intro for your videos", price: "From ₹800" },
  { slug: "birthday-highlight", title: "Birthday Highlight", desc: "Fun cinematic birthday event film", price: "From ₹2,000" },
  { slug: "prewedding-highlight", title: "Pre-Wedding Highlight", desc: "Romantic cinematic pre-wedding film", price: "From ₹2,500" },
];

export default function DigitalProductsPage() {
  return (
    <div className="bg-[var(--black)]">
      <Navbar />
      <section className="pt-36 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-white/30 hover:text-[var(--gold)]/60 transition-colors mb-10"
          >
            <ArrowLeft size={12} /> Products
          </Link>
          <span className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]/60 block mb-4">
            Products
          </span>
          <h1
            className="text-5xl md:text-6xl font-light text-white mb-4"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Digital Products
          </h1>
          <div className="w-12 h-px bg-[var(--gold)]/40 mb-12" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p) => (
              <Link key={p.slug} href={`/products/digital/${p.slug}`} className="group block">
                <div className="p-8 bg-[var(--black-card)] border border-[var(--gold)]/10 hover:border-[var(--gold)]/30 transition-all duration-400 h-full">
                  <h3
                    className="text-xl font-light text-white mb-2"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {p.title}
                  </h3>
                  <p className="text-xs text-white/40 mb-4 leading-relaxed">{p.desc}</p>
                  <p className="text-sm text-[var(--gold)] mb-6">{p.price}</p>
                  <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-[var(--gold)]/40 group-hover:text-[var(--gold)] transition-colors">
                    <span>View</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

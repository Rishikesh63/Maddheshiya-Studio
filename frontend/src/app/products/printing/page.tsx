import { Metadata } from "next";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Printing Products",
  description: "ID cards, t-shirt printing, and photo framing services.",
};

const products = [
  { slug: "id-cards", title: "ID Card Printing", desc: "Professional PVC & paper ID cards", price: "From ₹30/card" },
  { slug: "tshirt-printing", title: "T-Shirt Printing", desc: "Custom DTF & screen prints", price: "From ₹299" },
  { slug: "photo-framing", title: "Photo Framing", desc: "Premium wood, acrylic & canvas frames", price: "From ₹499" },
];

export default function PrintingProductsPage() {
  return (
    <div className="bg-[var(--black)]">
      <Navbar />
      <section className="pt-36 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/products" className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-white/30 hover:text-[var(--gold)]/60 transition-colors mb-10">
            <ArrowLeft size={12} /> Products
          </Link>
          <span className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]/60 block mb-4">Products</span>
          <h1 className="text-5xl md:text-6xl font-light text-white mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
            Printing Products
          </h1>
          <div className="w-12 h-px bg-[var(--gold)]/40 mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {products.map((p) => (
              <Link key={p.slug} href={`/products/printing/${p.slug}`} className="group block">
                <div className="p-8 bg-[var(--black-card)] border border-[var(--gold)]/10 hover:border-[var(--gold)]/30 transition-all duration-400 h-full">
                  <h3 className="text-xl font-light text-white mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>{p.title}</h3>
                  <p className="text-xs text-white/40 mb-4">{p.desc}</p>
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

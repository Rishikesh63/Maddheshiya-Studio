import { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Package, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Products & Creative Services",
  description:
    "Digital products and printing services — invitation videos, album design, ID cards, t-shirt printing, photo framing and more.",
};

const digitalProducts = [
  {
    slug: "photo-psd",
    title: "Photo PSD Editing",
    desc: "Advanced retouching, composites & color grading",
    price: "From ₹500",
  },
  {
    slug: "invitation-video",
    title: "Invitation Videos",
    desc: "Cinematic digital invitations for WhatsApp & social",
    price: "From ₹1,500",
  },
  {
    slug: "album-design",
    title: "Album Design",
    desc: "Heirloom-quality photo album layouts, print-ready",
    price: "From ₹2,000",
  },
];

const printingProducts = [
  {
    slug: "id-cards",
    title: "ID Card Printing",
    desc: "Professional PVC & paper ID cards",
    price: "From ₹30/card",
  },
  {
    slug: "tshirt-printing",
    title: "T-Shirt Printing",
    desc: "Custom DTF & screen prints for events and teams",
    price: "From ₹299",
  },
  {
    slug: "photo-framing",
    title: "Photo Framing",
    desc: "Premium wood, acrylic & canvas frames",
    price: "From ₹499",
  },
];

function ProductCard({
  product,
  category,
}: {
  product: { slug: string; title: string; desc: string; price: string };
  category: "digital" | "printing";
}) {
  return (
    <Link href={`/products/${category}/${product.slug}`} className="group block">
      <div className="p-8 bg-[var(--black-card)] border border-[var(--gold)]/10 hover:border-[var(--gold)]/30 transition-all duration-400 h-full">
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[var(--gold)]/10 group-hover:border-[var(--gold)]/30 transition-colors" />
        <h3
          className="text-xl font-light text-white mb-2"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          {product.title}
        </h3>
        <p className="text-xs text-white/40 mb-4 leading-relaxed">{product.desc}</p>
        <p className="text-sm text-[var(--gold)] mb-6">{product.price}</p>
        <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-[var(--gold)]/40 group-hover:text-[var(--gold)] transition-colors">
          <span>View Details</span>
          <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

export default function ProductsPage() {
  return (
    <div className="bg-[var(--black)]">
      <Navbar />

      <section className="pt-36 pb-20 px-6 text-center">
        <Package size={28} className="text-[var(--gold)]/60 mx-auto mb-6" />
        <span className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]/60 block mb-4">
          Creative Services
        </span>
        <h1
          className="text-5xl md:text-7xl font-light text-white mb-4"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Products & Prints
        </h1>
        <div className="w-12 h-px bg-[var(--gold)]/40 mx-auto mb-6" />
        <p className="text-sm text-white/40 max-w-md mx-auto">
          From digital invitation videos to premium print products — everything you need to celebrate beautifully.
        </p>
      </section>

      {/* Digital */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <span className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]/60 block mb-2">Category</span>
            <h2
              className="text-3xl font-light text-white"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Digital Products
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
            {digitalProducts.map((p) => (
              <ProductCard key={p.slug} product={p} category="digital" />
            ))}
          </div>
        </div>
      </section>

      {/* Printing */}
      <section className="py-12 px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <span className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]/60 block mb-2">Category</span>
            <h2
              className="text-3xl font-light text-white"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Printing Products
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
            {printingProducts.map((p) => (
              <ProductCard key={p.slug} product={p} category="printing" />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

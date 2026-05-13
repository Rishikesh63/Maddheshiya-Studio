import { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BookingCTA from "../components/BookingCTA";
import { Camera, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Photography Services",
  description:
    "Premium wedding, pre-wedding, studio, product, and drone photography services by Maddheshiya Studio.",
};

const services = [
  {
    slug: "wedding",
    title: "Wedding Photography",
    desc: "Full-day coverage capturing every emotion of your special day with cinematic artistry.",
    tag: "Most Popular",
  },
  {
    slug: "prewedding",
    title: "Pre-Wedding",
    desc: "Intimate shoots celebrating your love story before the big day.",
  },
  {
    slug: "studio",
    title: "Studio Photography",
    desc: "Professional studio setups for portraits, fashion, and commercial shoots.",
  },
  {
    slug: "product",
    title: "Product Photography",
    desc: "E-commerce and lifestyle product shoots that convert.",
  },
  {
    slug: "drone",
    title: "Drone Photography",
    desc: "Breathtaking aerial perspectives by licensed drone operators.",
  },
];

export default function PhotographyPage() {
  return (
    <div className="bg-[var(--black)]">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <Camera size={28} className="text-[var(--gold)]/60 mx-auto mb-6" />
          <span className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]/60 block mb-4">
            Our Services
          </span>
          <h1
            className="text-5xl md:text-7xl font-light text-white mb-4"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Photography
          </h1>
          <div className="w-12 h-px bg-[var(--gold)]/40 mx-auto mb-6" />
          <p className="text-sm text-white/40 max-w-md mx-auto">
            Every frame tells a story. We craft images that carry the weight of your most precious moments.
          </p>
        </div>
      </section>

      {/* Service cards */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <Link key={s.slug} href={`/photography/${s.slug}`} className="group block">
              <div className="relative p-8 bg-[var(--black-card)] border border-[var(--gold)]/10 hover:border-[var(--gold)]/30 transition-all duration-400 h-full">
                {s.tag && (
                  <span className="absolute top-4 right-4 text-[8px] tracking-[0.25em] uppercase text-[var(--gold)] border border-[var(--gold)]/30 px-2 py-1">
                    {s.tag}
                  </span>
                )}
                <div className="absolute top-0 right-0 w-10 h-10 border-t border-r border-[var(--gold)]/15 group-hover:border-[var(--gold)]/40 transition-colors" />
                <h2
                  className="text-2xl font-light text-white mb-3"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  {s.title}
                </h2>
                <p className="text-xs text-white/40 leading-relaxed mb-6">{s.desc}</p>
                <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-[var(--gold)]/50 group-hover:text-[var(--gold)] transition-colors">
                  <span>Explore</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <BookingCTA />
      <Footer />
    </div>
  );
}

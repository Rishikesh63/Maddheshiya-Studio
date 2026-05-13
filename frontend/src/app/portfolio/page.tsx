import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BookingCTA from "../components/BookingCTA";
import { getPortfolioItems } from "../lib/api";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Explore our portfolio of wedding photography, cinematic films, drone footage, and creative services.",
};

const categories = [
  { slug: "all", label: "All" },
  { slug: "photography", label: "Photography" },
  { slug: "videography", label: "Videography" },
  { slug: "printing", label: "Printing" },
  { slug: "invitation-video", label: "Invitation" },
  { slug: "album-design", label: "Albums" },
  { slug: "framing", label: "Framing" },
];

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = category && category !== "all" ? category : undefined;

  let items: Awaited<ReturnType<typeof getPortfolioItems>> = [];
  try {
    items = await getPortfolioItems({ category: activeCategory });
  } catch {
    // API unavailable
  }

  return (
    <div className="bg-[var(--black)]">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-16 px-6 text-center">
        <span className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]/60 block mb-4">
          Our Work
        </span>
        <h1
          className="text-5xl md:text-7xl font-light text-white mb-4"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Portfolio
        </h1>
        <div className="w-12 h-px bg-[var(--gold)]/40 mx-auto mb-6" />
        <p className="text-sm text-white/40 max-w-md mx-auto">
          A curated showcase of love stories, cinematic films, and creative work.
        </p>
      </section>

      {/* Category filter */}
      <section className="px-6 pb-12">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-3">
          {categories.map((c) => {
            const isActive = (!category && c.slug === "all") || category === c.slug;
            return (
              <Link
                key={c.slug}
                href={c.slug === "all" ? "/portfolio" : `/portfolio?category=${c.slug}`}
                className={`px-5 py-2 text-[10px] tracking-widest uppercase transition-all duration-300 ${
                  isActive
                    ? "bg-[var(--gold)] text-black"
                    : "border border-[var(--gold)]/20 text-white/40 hover:border-[var(--gold)]/50 hover:text-[var(--gold)]/70"
                }`}
              >
                {c.label}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Masonry grid */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {items.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/portfolio/${item.category.slug}/${item.slug}`}
                  className="group block break-inside-avoid"
                >
                  <div className="relative overflow-hidden bg-[var(--black-card)]">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      width={600}
                      height={400}
                      className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 cinematic-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400">
                      <span className="text-[9px] tracking-[0.3em] uppercase text-[var(--gold)]/70 block mb-1">
                        {item.service_type || item.category.name}
                      </span>
                      <h3
                        className="text-lg font-light text-white"
                        style={{ fontFamily: "var(--font-cormorant)" }}
                      >
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-white/20 text-sm tracking-widest uppercase">
                Portfolio items will appear here once published
              </p>
              <div className="mt-8 columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                {[320, 240, 360, 280, 300, 260].map((h, i) => (
                  <div
                    key={i}
                    className="break-inside-avoid bg-[var(--black-card)] border border-[var(--gold)]/5"
                    style={{ height: h }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <BookingCTA />
      <Footer />
    </div>
  );
}

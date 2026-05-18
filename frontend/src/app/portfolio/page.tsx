import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BookingCTA from "../components/BookingCTA";
import { staticPortfolioItems } from "./staticData";
import { getImageUrl } from "../utils/s3-media";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Explore our portfolio of wedding photography, cinematic films, drone footage, and creative services.",
};

const categories = [
  { slug: "all", label: "All" },
  { slug: "photography", label: "Photography" },
  { slug: "videography", label: "Videography" },
  { slug: "invitation-video", label: "Invitation" },
  { slug: "album-design", label: "Albums" },
  { slug: "printing", label: "Printing" },
  { slug: "framing", label: "Framing" },
];

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = category && category !== "all" ? category : undefined;

  const filtered = activeCategory
    ? staticPortfolioItems.filter((i) => i.category === activeCategory)
    : staticPortfolioItems;

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

      {/* Grid */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {filtered.map((item) => {
              const src = item.youtubeId
                ? `https://img.youtube.com/vi/${item.youtubeId}/maxresdefault.jpg`
                : item.image
                ? getImageUrl(item.image)
                : null;

              if (!src) return null;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="group block break-inside-avoid"
                >
                  <div className="relative overflow-hidden bg-[var(--black-card)]">
                    <Image
                      src={src}
                      alt={item.title}
                      width={600}
                      height={400}
                      unoptimized={!!item.youtubeId}
                      className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400">
                      <span className="text-[9px] tracking-[0.3em] uppercase text-[var(--gold)]/70 block mb-1">
                        {item.categoryLabel}
                      </span>
                      <h3 className="text-lg font-light text-white" style={{ fontFamily: "var(--font-cormorant)" }}>
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <BookingCTA />
      <Footer />
    </div>
  );
}

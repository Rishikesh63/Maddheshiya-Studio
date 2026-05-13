import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getPortfolioItems } from "../lib/api";

export default async function FeaturedPortfolio() {
  let items: Awaited<ReturnType<typeof getPortfolioItems>> = [];
  try {
    items = await getPortfolioItems({ featured: true });
  } catch {
    // API not available — show skeleton
  }

  return (
    <section className="py-24 px-6 bg-[var(--black-soft)]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <span className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]/60 block mb-4">
              Featured Work
            </span>
            <h2
              className="text-4xl md:text-6xl font-light text-white"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Portfolio
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="flex items-center gap-2 text-xs tracking-widest uppercase text-[var(--gold)]/60 hover:text-[var(--gold)] transition-colors group"
          >
            View All Work
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Masonry grid */}
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
          /* Skeleton placeholders */
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {[320, 280, 360, 300, 340, 290].map((h, i) => (
              <div
                key={i}
                className="break-inside-avoid bg-[var(--black-card)] border border-[var(--gold)]/5 animate-pulse"
                style={{ height: h }}
              >
                <div className="w-full h-full flex items-end p-5">
                  <div className="space-y-2 w-full">
                    <div className="h-2 w-16 bg-[var(--gold)]/10 rounded" />
                    <div className="h-4 w-32 bg-white/5 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

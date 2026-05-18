import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { staticPortfolioItems } from "../portfolio/staticData";
import { getImageUrl } from "../utils/s3-media";

export default function FeaturedPortfolio() {
  // Show first 6 items as featured on homepage
  const featured = staticPortfolioItems.slice(0, 6);

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

        {/* Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {featured.map((item) => {
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="text-[9px] tracking-[0.3em] uppercase text-[var(--gold)]/70 block mb-1">
                      {item.categoryLabel}
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
            );
          })}
        </div>
      </div>
    </section>
  );
}

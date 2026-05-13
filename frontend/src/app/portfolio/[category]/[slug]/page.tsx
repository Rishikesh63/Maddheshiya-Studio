import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import BookingCTA from "../../../components/BookingCTA";
import { getPortfolioItem, getPortfolioItems } from "../../../lib/api";
import { ArrowLeft, MapPin, User, Film } from "lucide-react";

type Props = { params: Promise<{ category: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const item = await getPortfolioItem(slug);
    return { title: item.title, description: item.description.slice(0, 160) };
  } catch {
    return {};
  }
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { category, slug } = await params;

  let item: Awaited<ReturnType<typeof getPortfolioItem>> | null = null;
  try {
    item = await getPortfolioItem(slug);
  } catch {
    notFound();
  }
  if (!item) notFound();

  let related: Awaited<ReturnType<typeof getPortfolioItems>> = [];
  try {
    const all = await getPortfolioItems({ category });
    related = all.filter((i) => i.slug !== slug).slice(0, 3);
  } catch {
    // ignore
  }

  return (
    <div className="bg-[var(--black)]">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <Link href={`/portfolio/${category}`} className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-white/30 hover:text-[var(--gold)]/60 transition-colors mb-10">
            <ArrowLeft size={12} /> Portfolio
          </Link>
          <span className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]/60 block mb-4">
            {item.service_type || item.category.name}
          </span>
          <h1 className="text-4xl md:text-6xl font-light text-white mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
            {item.title}
          </h1>
          <div className="flex flex-wrap gap-6 text-xs text-white/40">
            {item.client_name && (
              <span className="flex items-center gap-2"><User size={12} className="text-[var(--gold)]/40" /> {item.client_name}</span>
            )}
            {item.location && (
              <span className="flex items-center gap-2"><MapPin size={12} className="text-[var(--gold)]/40" /> {item.location}</span>
            )}
          </div>
        </div>
      </section>

      {/* Main image */}
      <section className="px-6 mb-8">
        <div className="max-w-5xl mx-auto">
          <div className="relative aspect-video bg-[var(--black-card)] overflow-hidden">
            <Image src={item.thumbnail} alt={item.title} fill className="object-cover" priority />
          </div>
        </div>
      </section>

      {/* Description + video */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <p className="text-sm text-white/50 leading-relaxed">{item.description}</p>
          </div>
          {item.video_url && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Film size={14} className="text-[var(--gold)]/60" />
                <span className="text-[10px] tracking-widest uppercase text-white/40">Video</span>
              </div>
              <a href={item.video_url} target="_blank" rel="noopener noreferrer"
                className="block px-6 py-3 border border-[var(--gold)]/30 text-[10px] tracking-widest uppercase text-[var(--gold)]/60 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all text-center">
                Watch Film
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Gallery grid */}
      {item.gallery_images && item.gallery_images.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-light text-white mb-8" style={{ fontFamily: "var(--font-cormorant)" }}>Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {item.gallery_images.map((img) => (
                <div key={img.id} className="relative aspect-square overflow-hidden bg-[var(--black-card)]">
                  <Image src={img.image} alt={img.caption || item.title} fill className="object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-light text-white mb-8" style={{ fontFamily: "var(--font-cormorant)" }}>Related Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link key={r.id} href={`/portfolio/${category}/${r.slug}`} className="group block">
                  <div className="relative aspect-video overflow-hidden bg-[var(--black-card)]">
                    <Image src={r.thumbnail} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 cinematic-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-sm font-light text-white/60 mt-3" style={{ fontFamily: "var(--font-cormorant)" }}>{r.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <BookingCTA />
      <Footer />
    </div>
  );
}

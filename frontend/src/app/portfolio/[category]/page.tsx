import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BookingCTA from "../../components/BookingCTA";
import { getPortfolioItems } from "../../lib/api";
import { ArrowLeft } from "lucide-react";

const validCategories = [
  "photography", "videography", "printing", "invitation-video", "album-design", "framing",
];

type Props = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  return validCategories.map((c) => ({ category: c }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const title = category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return { title: `${title} Portfolio`, description: `Portfolio of ${title} work by Maddheshiya Studio.` };
}

export default async function PortfolioCategoryPage({ params }: Props) {
  const { category } = await params;
  if (!validCategories.includes(category)) notFound();
  const title = category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  let items: Awaited<ReturnType<typeof getPortfolioItems>> = [];
  try {
    items = await getPortfolioItems({ category });
  } catch {
    // API unavailable
  }

  return (
    <div className="bg-[var(--black)]">
      <Navbar />
      <section className="pt-36 pb-16 px-6 text-center">
        <Link href="/portfolio" className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-white/30 hover:text-[var(--gold)]/60 transition-colors mb-10">
          <ArrowLeft size={12} /> Portfolio
        </Link>
        <span className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]/60 block mb-4">Portfolio</span>
        <h1 className="text-5xl md:text-7xl font-light text-white mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
          {title}
        </h1>
        <div className="w-12 h-px bg-[var(--gold)]/40 mx-auto" />
      </section>
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {items.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {items.map((item) => (
                <Link key={item.id} href={`/portfolio/${category}/${item.slug}`} className="group block break-inside-avoid">
                  <div className="relative overflow-hidden bg-[var(--black-card)]">
                    <Image src={item.thumbnail} alt={item.title} width={600} height={400} className="w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 cinematic-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400">
                      <span className="text-[9px] tracking-[0.3em] uppercase text-[var(--gold)]/70 block mb-1">{item.service_type}</span>
                      <h3 className="text-lg font-light text-white" style={{ fontFamily: "var(--font-cormorant)" }}>{item.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-white/20 text-sm tracking-widest uppercase py-24">No published items yet</p>
          )}
        </div>
      </section>
      <BookingCTA />
      <Footer />
    </div>
  );
}

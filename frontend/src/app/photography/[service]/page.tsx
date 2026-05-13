import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BookingCTA from "../../components/BookingCTA";
import { photographyServices } from "../../lib/serviceData";
import { Check, ArrowLeft, Calendar } from "lucide-react";

type Props = { params: Promise<{ service: string }> };

export async function generateStaticParams() {
  return Object.keys(photographyServices).map((service) => ({ service }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service } = await params;
  const data = photographyServices[service];
  if (!data) return {};
  return {
    title: data.title,
    description: data.description,
  };
}

export default async function PhotographyServicePage({ params }: Props) {
  const { service } = await params;
  const data = photographyServices[service];
  if (!data) notFound();

  return (
    <div className="bg-[var(--black)]">
      <Navbar />

      {/* Hero banner */}
      <section className="relative pt-36 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d] to-[var(--black)]" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.2) 0%, transparent 60%)",
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <Link
            href="/photography"
            className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-white/30 hover:text-[var(--gold)]/60 transition-colors mb-10"
          >
            <ArrowLeft size={12} />
            Photography
          </Link>
          <span className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]/60 block mb-4">
            Photography
          </span>
          <h1
            className="text-5xl md:text-8xl font-light text-white mb-6 leading-tight"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            {data.heroText}
          </h1>
          <div className="w-12 h-px bg-[var(--gold)]/40 mx-auto mb-6" />
          <p className="text-sm text-white/50 max-w-xl mx-auto leading-relaxed">
            {data.subtitle}
          </p>
        </div>
      </section>

      {/* About + Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <h2
              className="text-3xl md:text-4xl font-light text-white mb-5"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              About This Service
            </h2>
            <p className="text-sm text-white/50 leading-relaxed mb-8">{data.description}</p>
            <div className="flex flex-col gap-3">
              <Link
                href="/booking"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--gold)] text-black text-xs tracking-widest uppercase font-medium hover:bg-[var(--gold-light)] transition-colors"
              >
                <Calendar size={14} />
                Book This Service
              </Link>
              <Link
                href="/availability"
                className="inline-flex items-center gap-3 px-8 py-4 border border-[var(--gold)]/30 text-[var(--gold)]/70 text-xs tracking-widest uppercase hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all"
              >
                Check Availability
              </Link>
            </div>
          </div>
          <div>
            <h3
              className="text-2xl font-light text-white mb-6"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              What&apos;s Included
            </h3>
            <ul className="space-y-3">
              {data.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <Check size={14} className="text-[var(--gold)]/60 mt-0.5 shrink-0" />
                  <span className="text-sm text-white/50">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Gallery placeholder */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl font-light text-white mb-8 text-center"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Gallery
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-[var(--black-card)] border border-[var(--gold)]/5 animate-pulse"
              />
            ))}
          </div>
          <p className="text-center text-xs text-white/20 mt-6">Gallery images will appear here once uploaded</p>
        </div>
      </section>

      <BookingCTA />
      <Footer />
    </div>
  );
}

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BookingCTA from "../../components/BookingCTA";
import { getPackages, type Package } from "../../lib/api";
import { Check, ArrowLeft } from "lucide-react";

const typeMap: Record<string, string> = {
  wedding: "Wedding Packages",
  prewedding: "Pre-Wedding Packages",
  corporate: "Corporate Packages",
};

type Props = { params: Promise<{ type: string }> };

export async function generateStaticParams() {
  return Object.keys(typeMap).map((type) => ({ type }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  const label = typeMap[type];
  if (!label) return {};
  return { title: label, description: `${label} by Maddheshiya Studio.` };
}

export default async function PackageTypePage({ params }: Props) {
  const { type } = await params;
  if (!typeMap[type]) notFound();

  let packages: Package[] = [];
  try {
    const all = await getPackages();
    packages = all;
  } catch {
    // API unavailable
  }

  return (
    <div className="bg-[var(--black)]">
      <Navbar />
      <section className="pt-36 pb-16 px-6 text-center">
        <Link href="/packages" className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-white/30 hover:text-[var(--gold)]/60 transition-colors mb-10">
          <ArrowLeft size={12} /> Packages
        </Link>
        <span className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]/60 block mb-4">Pricing</span>
        <h1 className="text-5xl md:text-7xl font-light text-white mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
          {typeMap[type]}
        </h1>
        <div className="w-12 h-px bg-[var(--gold)]/40 mx-auto" />
      </section>
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          {packages.length === 0 ? (
            <p className="text-center text-white/20 text-sm tracking-widest uppercase py-16">Packages coming soon</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {packages.map((pkg) => (
                <div key={pkg.id} className={`relative p-8 bg-[var(--black-card)] border ${pkg.featured ? "border-[var(--gold)]/40" : "border-[var(--gold)]/10"}`}>
                  {pkg.featured && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--gold)] text-black text-[8px] tracking-widest uppercase px-3 py-1">Popular</span>
                  )}
                  <h3 className="text-2xl font-light text-white mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>{pkg.name}</h3>
                  <p className="text-3xl text-[var(--gold)] mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>₹{Number(pkg.price).toLocaleString()}</p>
                  <ul className="space-y-2 mb-8">
                    {pkg.inclusions_list.map((inc) => (
                      <li key={inc} className="flex items-start gap-2">
                        <Check size={12} className="text-[var(--gold)]/60 mt-0.5 shrink-0" />
                        <span className="text-xs text-white/50">{inc}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/booking" className="block text-center px-6 py-3 border border-[var(--gold)]/30 text-[var(--gold)]/60 text-xs tracking-widest uppercase hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all">
                    Book This
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <BookingCTA />
      <Footer />
    </div>
  );
}

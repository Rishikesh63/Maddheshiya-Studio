import { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BookingCTA from "../components/BookingCTA";
import { getPackages, type Package } from "../lib/api";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Packages & Pricing",
  description: "Photography, videography, and hybrid packages for weddings, pre-weddings, and corporate events.",
};

export default async function PackagesPage() {
  let packages: Package[] = [];
  try {
    packages = await getPackages();
  } catch {
    // API unavailable
  }

  const photography = packages.filter((p) => p.service_type === "photography");
  const videography = packages.filter((p) => p.service_type === "videography");
  const hybrid = packages.filter((p) => p.service_type === "hybrid");

  return (
    <div className="bg-[var(--black)]">
      <Navbar />

      <section className="pt-36 pb-16 px-6 text-center">
        <span className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]/60 block mb-4">Pricing</span>
        <h1 className="text-5xl md:text-7xl font-light text-white mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
          Packages
        </h1>
        <div className="w-12 h-px bg-[var(--gold)]/40 mx-auto mb-6" />
        <p className="text-sm text-white/40 max-w-md mx-auto">
          Transparent pricing for every occasion. All packages can be customised.
        </p>
      </section>

      {packages.length === 0 && (
        <section className="pb-24 px-6">
          <div className="max-w-5xl mx-auto text-center py-16">
            <p className="text-white/20 text-sm tracking-widest uppercase mb-4">Packages coming soon</p>
            <p className="text-xs text-white/20">Contact us for custom pricing</p>
            <Link href="/contact" className="inline-block mt-6 px-8 py-3 border border-[var(--gold)]/30 text-[var(--gold)]/60 text-xs tracking-widest uppercase hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all">
              Contact Us
            </Link>
          </div>
        </section>
      )}

      {[
        { label: "Photography", items: photography },
        { label: "Videography", items: videography },
        { label: "Hybrid (Photo + Video)", items: hybrid },
      ]
        .filter((g) => g.items.length > 0)
        .map((group) => (
          <section key={group.label} className="py-16 px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-light text-white mb-10" style={{ fontFamily: "var(--font-cormorant)" }}>
                {group.label}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {group.items.map((pkg) => (
                  <div key={pkg.id} className={`relative p-8 bg-[var(--black-card)] border transition-all duration-300 ${pkg.featured ? "border-[var(--gold)]/40" : "border-[var(--gold)]/10"}`}>
                    {pkg.featured && (
                      <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--gold)] text-black text-[8px] tracking-widest uppercase px-3 py-1">
                        Popular
                      </span>
                    )}
                    <h3 className="text-2xl font-light text-white mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
                      {pkg.name}
                    </h3>
                    <p className="text-3xl text-[var(--gold)] mb-1" style={{ fontFamily: "var(--font-cormorant)" }}>
                      ₹{Number(pkg.price).toLocaleString()}
                    </p>
                    <p className="text-xs text-white/30 mb-5">{pkg.duration_hours} hours · {pkg.advance_required}% advance</p>
                    <p className="text-xs text-white/40 leading-relaxed mb-6">{pkg.description}</p>
                    <ul className="space-y-2 mb-8">
                      {pkg.inclusions_list.map((inc) => (
                        <li key={inc} className="flex items-start gap-2">
                          <Check size={12} className="text-[var(--gold)]/60 mt-0.5 shrink-0" />
                          <span className="text-xs text-white/50">{inc}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/booking" className="block text-center px-6 py-3 border border-[var(--gold)]/30 text-[var(--gold)]/60 text-xs tracking-widest uppercase hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all">
                      Book This Package
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

      <BookingCTA />
      <Footer />
    </div>
  );
}

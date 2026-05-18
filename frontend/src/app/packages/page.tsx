import { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BookingCTA from "../components/BookingCTA";
import { Check } from "lucide-react";
import { staticPackages } from "../lib/packagesData";

export const metadata: Metadata = {
  title: "Packages & Pricing",
  description: "Photography, videography, and hybrid packages for weddings, pre-weddings, and corporate events.",
};

const groups = [
  { label: "Photography", type: "photography" as const },
  { label: "Videography", type: "videography" as const },
  { label: "Hybrid (Photo + Video)", type: "hybrid" as const },
];

export default function PackagesPage() {
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
          Transparent pricing for every occasion. All packages can be customised as per your requirement.
        </p>
      </section>

      {groups.map((group) => {
        const pkgs = staticPackages.filter((p) => p.service_type === group.type);
        return (
          <section key={group.type} className="py-16 px-6 border-t border-[var(--gold)]/5">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-light text-white mb-10" style={{ fontFamily: "var(--font-cormorant)" }}>
                {group.label}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {pkgs.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`relative p-8 bg-[var(--black-card)] border transition-all duration-300 ${
                      pkg.featured ? "border-[var(--gold)]/40" : "border-[var(--gold)]/10"
                    }`}
                  >
                    {pkg.featured && (
                      <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--gold)] text-black text-[8px] tracking-widest uppercase px-3 py-1">
                        Popular
                      </span>
                    )}
                    <h3 className="text-2xl font-light text-white mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
                      {pkg.name}
                    </h3>
                    <p className="text-3xl text-[var(--gold)] mb-1" style={{ fontFamily: "var(--font-cormorant)" }}>
                      {pkg.price}
                    </p>
                    <p className="text-xs text-white/30 mb-5">{pkg.duration}</p>
                    <p className="text-xs text-white/40 leading-relaxed mb-6">{pkg.description}</p>
                    <ul className="space-y-2 mb-8">
                      {pkg.inclusions.map((inc) => (
                        <li key={inc} className="flex items-start gap-2">
                          <Check size={12} className="text-[var(--gold)]/60 mt-0.5 shrink-0" />
                          <span className="text-xs text-white/50">{inc}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/booking"
                      className="block text-center px-6 py-3 border border-[var(--gold)]/30 text-[var(--gold)]/60 text-xs tracking-widest uppercase hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all"
                    >
                      Book This Package
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <BookingCTA />
      <Footer />
    </div>
  );
}

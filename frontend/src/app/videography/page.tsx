import { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BookingCTA from "../components/BookingCTA";
import { Video, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Videography Services",
  description:
    "Cinematic wedding films, reels, drone videography and event coverage by Maddheshiya Studio.",
};

const services = [
  {
    slug: "wedding-films",
    title: "Wedding Films",
    desc: "Narrative-driven cinematic films that capture every emotion of your day.",
    tag: "Most Popular",
  },
  {
    slug: "reels",
    title: "Cinematic Reels",
    desc: "High-impact short films for Instagram, YouTube, and social media.",
  },
  {
    slug: "drone",
    title: "Drone Videography",
    desc: "Epic 4K aerial footage by licensed drone pilots.",
  },
  {
    slug: "events",
    title: "Event Videography",
    desc: "Multi-camera professional coverage for corporate and cultural events.",
  },
];

export default function VideographyPage() {
  return (
    <div className="bg-[var(--black)]">
      <Navbar />

      <section className="pt-36 pb-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <Video size={28} className="text-[var(--gold)]/60 mx-auto mb-6" />
          <span className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]/60 block mb-4">
            Our Services
          </span>
          <h1
            className="text-5xl md:text-7xl font-light text-white mb-4"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Videography
          </h1>
          <div className="w-12 h-px bg-[var(--gold)]/40 mx-auto mb-6" />
          <p className="text-sm text-white/40 max-w-md mx-auto">
            Cinema-grade storytelling that transports you back to every moment you cherish.
          </p>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map((s) => (
            <Link key={s.slug} href={`/videography/${s.slug}`} className="group block">
              <div className="relative p-8 bg-[var(--black-card)] border border-[var(--gold)]/10 hover:border-[var(--gold)]/30 transition-all duration-400 h-full">
                {s.tag && (
                  <span className="absolute top-4 right-4 text-[8px] tracking-[0.25em] uppercase text-[var(--gold)] border border-[var(--gold)]/30 px-2 py-1">
                    {s.tag}
                  </span>
                )}
                <div className="absolute top-0 right-0 w-10 h-10 border-t border-r border-[var(--gold)]/15 group-hover:border-[var(--gold)]/40 transition-colors" />
                <h2
                  className="text-2xl font-light text-white mb-3"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  {s.title}
                </h2>
                <p className="text-xs text-white/40 leading-relaxed mb-6">{s.desc}</p>
                <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-[var(--gold)]/50 group-hover:text-[var(--gold)] transition-colors">
                  <span>Explore</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <BookingCTA />
      <Footer />
    </div>
  );
}

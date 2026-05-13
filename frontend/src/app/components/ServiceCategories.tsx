"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Camera, Video, ArrowRight } from "lucide-react";

const categories = [
  {
    href: "/photography",
    label: "Photography",
    subtitle: "Wedding · Pre-Wedding · Studio · Product · Drone",
    icon: Camera,
    description:
      "Timeless frames capturing every emotion, expression, and stolen glance on your most cherished day.",
    gradient: "from-[#0A0A0A] to-[#1a1408]",
  },
  {
    href: "/videography",
    label: "Videography",
    subtitle: "Wedding Films · Reels · Drone · Events",
    icon: Video,
    description:
      "Cinematic films that transport you back — the music, the tears, the first dance, forever preserved.",
    gradient: "from-[#0A0A0A] to-[#0d1218]",
  },
];

export default function ServiceCategories() {
  return (
    <section className="py-24 px-6 bg-[var(--black)]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]/60 block mb-4">
            Our Craft
          </span>
          <h2
            className="text-4xl md:text-6xl font-light text-white mb-4"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            What We Do
          </h2>
          <div className="divider-gold mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.href}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              whileHover={{ y: -4 }}
            >
              <Link href={cat.href} className="group block">
                <div
                  className={`relative bg-gradient-to-br ${cat.gradient} border border-[var(--gold)]/10 p-10 overflow-hidden transition-all duration-500 group-hover:border-[var(--gold)]/30 group-hover:gold-glow`}
                >
                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-[var(--gold)]/20 group-hover:border-[var(--gold)]/50 transition-colors duration-500" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-[var(--gold)]/20 group-hover:border-[var(--gold)]/50 transition-colors duration-500" />

                  <cat.icon
                    size={28}
                    className="text-[var(--gold)]/60 mb-6 group-hover:text-[var(--gold)] transition-colors duration-300"
                  />

                  <h3
                    className="text-4xl font-light text-white mb-2"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {cat.label}
                  </h3>
                  <p className="text-[9px] tracking-[0.3em] uppercase text-[var(--gold)]/50 mb-5">
                    {cat.subtitle}
                  </p>
                  <p className="text-sm text-white/50 leading-relaxed mb-8 max-w-xs">
                    {cat.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-[var(--gold)]/60 group-hover:text-[var(--gold)] transition-colors duration-300">
                    <span>Explore</span>
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-2 transition-transform duration-300"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Play, Instagram } from "lucide-react";
import Link from "next/link";
import { waLink, SOCIAL_LINKS } from "../lib/siteConfig";

const reels = [1, 2, 3, 4, 5, 6];

export default function ReelsShowcase() {
  return (
    <section className="py-24 px-6 bg-[var(--black-soft)]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <span className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]/60 block mb-4">
            Social Media
          </span>
          <h2
            className="text-4xl md:text-6xl font-light text-white mb-4"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Follow Our Journey
          </h2>
          <div className="divider-gold mx-auto mb-6" />
          <Link
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-[var(--gold)]/60 hover:text-[var(--gold)] transition-colors"
          >
            <Instagram size={14} />
            @maddheshiyastudio
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {reels.map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group relative aspect-square bg-[var(--black-card)] border border-[var(--gold)]/5 hover:border-[var(--gold)]/20 overflow-hidden cursor-pointer transition-all duration-300"
            >
              {/* Placeholder gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(${135 + i * 20}deg, #161616, #0d0d0d)`,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 border border-[var(--gold)]/50 flex items-center justify-center rounded-full">
                  <Play size={18} className="text-[var(--gold)] ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="h-1.5 w-12 bg-[var(--gold)]/20 rounded mb-1.5" />
                <div className="h-1.5 w-8 bg-[var(--gold)]/10 rounded" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 text-xs tracking-widest uppercase bg-[#25D366] text-white hover:bg-[#20b558] transition-colors duration-300 font-medium"
          >
            Chat on WhatsApp
          </Link>
          <Link
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 text-xs tracking-widest uppercase border border-[var(--gold)]/30 text-[var(--gold)]/70 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all duration-300"
          >
            Follow on Instagram
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

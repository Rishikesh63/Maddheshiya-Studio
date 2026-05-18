"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Instagram, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { waLink, SOCIAL_LINKS } from "../lib/siteConfig";

const reels = [
  { id: "Ti3RipE7eMw", title: "Short Film" },
  { id: "U7LAeHs1jH0", title: "Photoshop Plugin Tutorial" },
  { id: "XHDCtnCA5FY", title: "Short Film" },
  { id: "YTEc_oAZjmc", title: "Cute Animated Wedding Invitation" },
  { id: "ZFx2mScbkiE", title: "Animated Save The Date Invitation" },
  { id: "IUlfoB7uAyY", title: "Bride Groom Cartoon Invitation" },
];

export default function ReelsShowcase() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section className="py-24 px-6 bg-[var(--black-soft)]">
      {/* YouTube modal */}
      {activeId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setActiveId(null)}
        >
          <div className="relative w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveId(null)}
              className="absolute -top-10 right-0 text-white/60 hover:text-white transition-colors flex items-center gap-1 text-xs tracking-wider"
            >
              <X size={14} /> Close
            </button>
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${activeId}?autoplay=1&rel=0`}
                title="Video preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      )}

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
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-[var(--gold)]/60 hover:text-[var(--gold)] transition-colors"
          >
            <Instagram size={14} />
            @maddheshiyastudio
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {reels.map((reel, i) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group relative aspect-square bg-[var(--black-card)] border border-[var(--gold)]/5 hover:border-[var(--gold)]/30 overflow-hidden cursor-pointer transition-all duration-300"
              onClick={() => setActiveId(reel.id)}
            >
              <Image
                src={`https://img.youtube.com/vi/${reel.id}/maxresdefault.jpg`}
                alt={reel.title}
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300" />
              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border border-[var(--gold)]/60 flex items-center justify-center rounded-full bg-black/30 group-hover:bg-[var(--gold)]/20 group-hover:border-[var(--gold)] transition-all duration-300">
                  <Play size={18} className="text-[var(--gold)] ml-0.5" fill="currentColor" />
                </div>
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

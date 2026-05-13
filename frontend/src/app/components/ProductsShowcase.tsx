"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Film, FrameIcon, Wand2, CreditCard, Shirt, Clapperboard, Star, ArrowRight } from "lucide-react";

const products = [
  {
    icon: Film,
    label: "Invitation Videos",
    desc: "Cinematic digital invitations for WhatsApp & social media",
    href: "/products/digital/invitation-video",
  },
  {
    icon: Clapperboard,
    label: "Wedding Highlight",
    desc: "Cinematic 5–10 min wedding highlight reel, color-graded",
    href: "/products/digital/wedding-highlight",
  },
  {
    icon: Star,
    label: "Pre-Wedding Highlight",
    desc: "Romantic cinematic film of your pre-wedding shoot",
    href: "/products/digital/prewedding-highlight",
  },
  {
    icon: Wand2,
    label: "Album PSD",
    desc: "Professional album retouching, composites & color grading",
    href: "/products/digital/album-psd",
  },
  {
    icon: FrameIcon,
    label: "Photo Framing",
    desc: "Premium wood, acrylic & canvas frames for your memories",
    href: "/products/printing/photo-framing",
  },
  {
    icon: CreditCard,
    label: "ID Cards",
    desc: "Professional PVC & paper ID cards for every occasion",
    href: "/products/printing/id-cards",
  },
  {
    icon: Shirt,
    label: "T-Shirt Printing",
    desc: "Custom DTF & screen prints for events and teams",
    href: "/products/printing/tshirt-printing",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function ProductsShowcase() {
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
            Creative Services
          </span>
          <h2
            className="text-4xl md:text-6xl font-light text-white mb-4"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Products & Prints
          </h2>
          <div className="divider-gold mx-auto" />
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {products.map((p) => (
            <motion.div key={p.href} variants={item}>
              <Link href={p.href} className="group block">
                <div className="p-8 bg-[var(--black-card)] border border-[var(--gold)]/10 hover:border-[var(--gold)]/30 transition-all duration-400 h-full">
                  <p.icon
                    size={24}
                    className="text-[var(--gold)]/50 mb-5 group-hover:text-[var(--gold)] transition-colors duration-300"
                  />
                  <h3
                    className="text-xl font-light text-white mb-2"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {p.label}
                  </h3>
                  <p className="text-xs text-white/40 leading-relaxed mb-6">{p.desc}</p>
                  <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-[var(--gold)]/40 group-hover:text-[var(--gold)] transition-colors">
                    <span>Learn More</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

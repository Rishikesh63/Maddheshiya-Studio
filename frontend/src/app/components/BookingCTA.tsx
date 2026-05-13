"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, MessageCircle, BookOpen } from "lucide-react";
import { waLink } from "../lib/siteConfig";

const actions = [
  {
    icon: Calendar,
    label: "Check Availability",
    desc: "View open dates for your event",
    href: "/availability",
    style: "border",
  },
  {
    icon: BookOpen,
    label: "Book Consultation",
    desc: "Plan your dream shoot with us",
    href: "/booking",
    style: "gold",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp Us",
    desc: "Quick response, always",
    href: waLink(),
    style: "border",
    external: true,
  },
];

export default function BookingCTA() {
  return (
    <section className="py-24 px-6 bg-[var(--black)] border-t border-[var(--gold)]/10">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]/60 block mb-4">
            Start Your Journey
          </span>
          <h2
            className="text-4xl md:text-6xl font-light text-white mb-4"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Ready to Create
            <br />
            <span className="text-gold-gradient">Something Beautiful?</span>
          </h2>
          <p className="text-sm text-white/40 mb-12 max-w-md mx-auto">
            Let&apos;s begin crafting your story. Check our availability or reach out directly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {actions.map((a, i) => (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
              >
                <Link
                  href={a.href}
                  target={a.external ? "_blank" : undefined}
                  rel={a.external ? "noopener noreferrer" : undefined}
                  className={`flex items-center gap-3 px-8 py-4 text-xs tracking-widest uppercase transition-all duration-300 group ${
                    a.style === "gold"
                      ? "bg-[var(--gold)] text-black hover:bg-[var(--gold-light)] font-medium"
                      : "border border-[var(--gold)]/30 text-[var(--gold)]/70 hover:border-[var(--gold)] hover:text-[var(--gold)]"
                  }`}
                >
                  <a.icon size={16} className="shrink-0" />
                  <span>{a.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

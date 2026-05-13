"use client";

import { motion } from "framer-motion";
import { Zap, Plane, Clapperboard, Monitor, Users } from "lucide-react";

const reasons = [
  {
    icon: Clapperboard,
    title: "Cinematic Editing",
    desc: "Hollywood-grade color grading and storytelling for every project we deliver.",
  },
  {
    icon: Plane,
    title: "Drone Coverage",
    desc: "Licensed drone operators for breathtaking aerial shots and 4K flyovers.",
  },
  {
    icon: Monitor,
    title: "HD Output",
    desc: "4K video and high-resolution images delivered in professional formats.",
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    desc: "Previews within 48 hours and full deliveries on committed timelines.",
  },
  {
    icon: Users,
    title: "Experienced Team",
    desc: "A dedicated team with 500+ events and a passion for storytelling.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 px-6 bg-[var(--black-soft)]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]/60 block mb-4">
            Why Us
          </span>
          <h2
            className="text-4xl md:text-6xl font-light text-white mb-4"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            The Maddheshiya Difference
          </h2>
          <div className="divider-gold mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="w-14 h-14 border border-[var(--gold)]/20 flex items-center justify-center mx-auto mb-5 group-hover:border-[var(--gold)]/50 transition-colors duration-300">
                <r.icon size={22} className="text-[var(--gold)]/60 group-hover:text-[var(--gold)] transition-colors duration-300" />
              </div>
              <h3
                className="text-lg font-light text-white mb-2"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {r.title}
              </h3>
              <p className="text-xs text-white/40 leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

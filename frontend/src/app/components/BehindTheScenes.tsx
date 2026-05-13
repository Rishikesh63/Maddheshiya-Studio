"use client";

import { motion } from "framer-motion";

const scenes = [
  {
    number: "01",
    title: "Editing Workflow",
    desc: "Every photo and video passes through a meticulous color-grading and retouching pipeline before delivery.",
  },
  {
    number: "02",
    title: "Camera Setup",
    desc: "We use cinema-grade full-frame cameras and prime lenses to capture the finest details in any light.",
  },
  {
    number: "03",
    title: "Drone Operations",
    desc: "Licensed drone pilots plan each flight for maximum cinematic impact while maintaining complete safety.",
  },
  {
    number: "04",
    title: "Studio Environment",
    desc: "Our climate-controlled studio features professional lighting rigs, seamless backdrops, and full makeup stations.",
  },
];

export default function BehindTheScenes() {
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
            The Process
          </span>
          <h2
            className="text-4xl md:text-6xl font-light text-white mb-4"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Behind the Lens
          </h2>
          <div className="divider-gold mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--gold)]/10">
          {scenes.map((scene, i) => (
            <motion.div
              key={scene.number}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="bg-[var(--black)] p-10 group hover:bg-[var(--black-card)] transition-colors duration-300"
            >
              <div className="flex items-start gap-6">
                <span
                  className="text-5xl font-light text-[var(--gold)]/20 group-hover:text-[var(--gold)]/40 transition-colors duration-300 leading-none"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  {scene.number}
                </span>
                <div>
                  <h3
                    className="text-2xl font-light text-white mb-3"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {scene.title}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed">{scene.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

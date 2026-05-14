import { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BookingCTA from "../components/BookingCTA";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Maddheshiya Studio — a premium wedding photography and videography studio passionate about capturing love stories.",
};

const values = [
  { title: "Cinematic Vision", desc: "We approach every event as a director, not just a photographer. Every frame is composed." },
  { title: "Attention to Detail", desc: "From lighting to editing, no detail is too small. Perfection is our standard." },
  { title: "Client-First", desc: "Your comfort and vision drive everything we create. We listen before we shoot." },
  { title: "Timeless Quality", desc: "Our deliverables are crafted to look as beautiful in 20 years as they do today." },
];

export default function AboutPage() {
  return (
    <div className="bg-[var(--black)]">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-20 px-6 text-center">
        <span className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]/60 block mb-4">Our Story</span>
        <h1 className="text-5xl md:text-8xl font-light text-white mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
          About Us
        </h1>
        <div className="w-12 h-px bg-[var(--gold)]/40 mx-auto" />
      </section>

      {/* Story */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-base text-white/50 leading-relaxed mb-6">
            Maddheshiya Studio was founded with a single belief: every love story deserves to be told beautifully. Based in Gorakhpur, we serve couples and families across Uttar Pradesh and beyond, crafting cinematic images and films that last a lifetime.
          </p>
          <p className="text-base text-white/50 leading-relaxed mb-6">
            Our team blends documentary storytelling with fine-art portraiture, creating work that feels authentic and timeless. We use cinema-grade equipment, including drone systems and professional audio rigs, to ensure no moment is missed.
          </p>
          <p className="text-base text-white/50 leading-relaxed">
            Beyond weddings, we also offer a full suite of creative services: from invitation video design and album creation to commercial photography and professional printing.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-[var(--black-soft)]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: "500+", label: "Events Covered" },
            { number: "8+", label: "Years Experience" },
            { number: "50+", label: "Cities Served" },
            { number: "1000+", label: "Happy Clients" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-light text-[var(--gold)] mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
                {s.number}
              </p>
              <p className="text-[10px] tracking-widest uppercase text-white/30">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]/60 block mb-4">Our Principles</span>
            <h2 className="text-4xl font-light text-white" style={{ fontFamily: "var(--font-cormorant)" }}>What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <div key={v.title} className="p-8 border border-[var(--gold)]/10 bg-[var(--black-card)]">
                <span className="text-3xl font-light text-[var(--gold)]/20 block mb-3" style={{ fontFamily: "var(--font-cormorant)" }}>
                  0{i + 1}
                </span>
                <h3 className="text-xl font-light text-white mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>{v.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment */}
      <section className="py-16 px-6 bg-[var(--black-soft)]">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]/60 block mb-4">Our Gear</span>
          <h2 className="text-4xl font-light text-white mb-8" style={{ fontFamily: "var(--font-cormorant)" }}>Professional Equipment</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Full-Frame Cameras", "Cinema Lenses", "Licensed Drones", "Pro Audio"].map((item) => (
              <div key={item} className="p-5 border border-[var(--gold)]/10 bg-[var(--black)]">
                <p className="text-xs text-white/50 tracking-widest uppercase">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BookingCTA />
      <Footer />
    </div>
  );
}

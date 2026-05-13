"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { getAvailability, getLocations, type AvailabilitySlot, type Location } from "../lib/api";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

function formatMonth(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export default function AvailabilityPage() {
  const [month, setMonth] = useState(new Date());
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getLocations()
      .then(setLocations)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getAvailability(formatMonth(month), selectedLocation || undefined)
      .then(setSlots)
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, [month, selectedLocation]);

  const slotMap = new Map<string, AvailabilitySlot["status"]>();
  slots.forEach((s) => slotMap.set(s.date, s.status));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function dayModifiers(date: Date) {
    const key = date.toISOString().split("T")[0];
    const status = slotMap.get(key);
    if (date < today) return "past";
    if (status === "booked") return "booked";
    if (status === "limited") return "limited";
    if (status === "available") return "available";
    return undefined;
  }

  return (
    <div className="bg-[var(--black)]">
      <Navbar />

      <section className="pt-36 pb-12 px-6 text-center">
        <Calendar size={28} className="text-[var(--gold)]/60 mx-auto mb-6" />
        <span className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]/60 block mb-4">
          Planning
        </span>
        <h1
          className="text-5xl md:text-7xl font-light text-white mb-4"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Availability
        </h1>
        <div className="w-12 h-px bg-[var(--gold)]/40 mx-auto mb-6" />
        <p className="text-sm text-white/40 max-w-md mx-auto">
          Check open dates for your event and book your preferred slot.
        </p>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Location selector */}
          {locations.length > 0 && (
            <div className="mb-8 flex items-center gap-4">
              <MapPin size={16} className="text-[var(--gold)]/50 shrink-0" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-[var(--black-card)] border border-[var(--gold)]/20 text-white/70 text-xs tracking-widest uppercase px-4 py-3 focus:outline-none focus:border-[var(--gold)]/50"
              >
                <option value="">All Locations</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.slug}>
                    {l.name}, {l.state}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Calendar */}
          <div className="bg-[var(--black-card)] border border-[var(--gold)]/10 p-8">
            <style>{`
              .rdp {
                --rdp-accent-color: var(--gold);
                --rdp-background-color: var(--black-card);
                color: rgba(250,250,248,0.8);
                margin: 0 auto;
              }
              .rdp-day_button {
                color: rgba(250,250,248,0.6);
              }
              .rdp-day_button:hover {
                background: rgba(201,168,76,0.15) !important;
                color: var(--gold) !important;
              }
              .rdp-selected .rdp-day_button {
                background: var(--gold) !important;
                color: #0A0A0A !important;
              }
              .day-available .rdp-day_button { background: rgba(34,197,94,0.15); color: #4ade80; }
              .day-booked .rdp-day_button { background: rgba(239,68,68,0.15); color: #f87171; pointer-events: none; }
              .day-limited .rdp-day_button { background: rgba(234,179,8,0.15); color: #facc15; }
              .day-past .rdp-day_button { opacity: 0.3; pointer-events: none; }
              .rdp-nav_button { color: var(--gold) !important; }
              .rdp-caption_label { color: rgba(250,250,248,0.8); font-family: var(--font-cormorant); font-size: 1.1rem; letter-spacing: 0.1em; }
              .rdp-head_cell { color: rgba(201,168,76,0.5); font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; }
            `}</style>

            {loading ? (
              <div className="flex items-center justify-center h-64 text-white/20 text-xs tracking-widest uppercase">
                Loading...
              </div>
            ) : (
              <DayPicker
                mode="single"
                month={month}
                onMonthChange={setMonth}
                modifiersClassNames={{
                  available: "day-available",
                  booked: "day-booked",
                  limited: "day-limited",
                  past: "day-past",
                }}
                modifiers={{
                  available: (d) => dayModifiers(d) === "available",
                  booked: (d) => dayModifiers(d) === "booked",
                  limited: (d) => dayModifiers(d) === "limited",
                  past: (d) => dayModifiers(d) === "past",
                }}
              />
            )}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap items-center gap-6">
            {[
              { color: "bg-green-500/20 text-green-400", label: "Available" },
              { color: "bg-yellow-500/20 text-yellow-400", label: "Limited" },
              { color: "bg-red-500/20 text-red-400", label: "Booked" },
              { color: "bg-white/5 text-white/30", label: "Past" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${l.color}`} />
                <span className="text-[10px] tracking-widest uppercase text-white/40">{l.label}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 text-center">
            <Link
              href="/booking"
              className="inline-flex items-center gap-3 px-10 py-4 bg-[var(--gold)] text-black text-xs tracking-widest uppercase font-medium hover:bg-[var(--gold-light)] transition-colors"
            >
              Proceed to Booking
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useForm } from "react-hook-form";
import { createBooking, getLocations, getPackages, type Location, type Package } from "../lib/api";
import { Check, ChevronRight } from "lucide-react";
import { useEffect } from "react";

type FormData = {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  event_type: string;
  event_date: string;
  venue_name: string;
  guest_count: number;
  notes: string;
  service_type: string;
  location: number;
  package: number;
};

const steps = ["Service", "Location", "Package", "Event Details", "Contact"];

export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [locations, setLocations] = useState<Location[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>();
  const serviceType = watch("service_type");
  const locationId = watch("location");

  useEffect(() => {
    getLocations().then(setLocations).catch(() => {});
  }, []);

  useEffect(() => {
    if (serviceType) {
      getPackages(serviceType).then(setPackages).catch(() => {});
    }
  }, [serviceType]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setError(null);
    try {
      const result = await createBooking({
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        event_type: data.event_type,
        event_date: data.event_date,
        venue_name: data.venue_name,
        guest_count: data.guest_count,
        notes: data.notes,
        location: Number(data.location),
        package: Number(data.package),
      });
      setBookingId(result.booking_id);
    } catch {
      setError("There was an error submitting your booking. Please try again or contact us via WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  if (bookingId) {
    return (
      <div className="bg-[var(--black)] min-h-screen">
        <Navbar />
        <div className="pt-36 pb-24 px-6 flex items-center justify-center min-h-screen">
          <div className="max-w-md text-center">
            <div className="w-16 h-16 border border-[var(--gold)]/40 flex items-center justify-center mx-auto mb-8">
              <Check size={28} className="text-[var(--gold)]" />
            </div>
            <h1 className="text-4xl font-light text-white mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
              Booking Received
            </h1>
            <p className="text-sm text-white/50 mb-4">Your inquiry has been submitted successfully.</p>
            <div className="border border-[var(--gold)]/20 p-6 mb-8">
              <p className="text-[10px] tracking-widest uppercase text-white/30 mb-2">Booking Reference</p>
              <p className="text-xl text-[var(--gold)]" style={{ fontFamily: "var(--font-cormorant)" }}>{bookingId}</p>
            </div>
            <p className="text-xs text-white/30">We will contact you within 24 hours to confirm your booking.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[var(--black)]">
      <Navbar />

      <section className="pt-36 pb-12 px-6 text-center">
        <span className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]/60 block mb-4">Book</span>
        <h1 className="text-5xl md:text-7xl font-light text-white mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
          Book Your Session
        </h1>
        <div className="w-12 h-px bg-[var(--gold)]/40 mx-auto" />
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-12 overflow-x-auto pb-2">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2 shrink-0">
                <div className={`w-7 h-7 flex items-center justify-center text-[10px] border transition-all duration-300 ${
                  i < step ? "bg-[var(--gold)] border-[var(--gold)] text-black" :
                  i === step ? "border-[var(--gold)] text-[var(--gold)]" :
                  "border-white/10 text-white/20"
                }`}>
                  {i < step ? <Check size={12} /> : i + 1}
                </div>
                <span className={`text-[10px] tracking-widest uppercase hidden sm:block transition-colors ${
                  i === step ? "text-[var(--gold)]" : i < step ? "text-white/50" : "text-white/20"
                }`}>{s}</span>
                {i < steps.length - 1 && <ChevronRight size={12} className="text-white/15 mx-1" />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 0: Service */}
            {step === 0 && (
              <div>
                <h2 className="text-2xl font-light text-white mb-8" style={{ fontFamily: "var(--font-cormorant)" }}>
                  Select Service Type
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { value: "photography", label: "Photography", desc: "Wedding, pre-wedding, studio, product" },
                    { value: "videography", label: "Videography", desc: "Wedding films, reels, drone, events" },
                    { value: "hybrid", label: "Hybrid (Photo + Video)", desc: "Full coverage with both teams" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { setValue("service_type", opt.value); setStep(1); }}
                      className={`text-left p-6 border transition-all duration-300 ${
                        serviceType === opt.value
                          ? "border-[var(--gold)] bg-[var(--gold)]/5"
                          : "border-[var(--gold)]/10 hover:border-[var(--gold)]/30 bg-[var(--black-card)]"
                      }`}
                    >
                      <p className="text-base font-light text-white mb-1" style={{ fontFamily: "var(--font-cormorant)" }}>{opt.label}</p>
                      <p className="text-xs text-white/40">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Location */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-light text-white mb-8" style={{ fontFamily: "var(--font-cormorant)" }}>
                  Select Your City
                </h2>
                {locations.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {locations.map((loc) => (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => { setValue("location", loc.id); setStep(2); }}
                        className={`text-left p-5 border transition-all duration-300 ${
                          locationId === loc.id
                            ? "border-[var(--gold)] bg-[var(--gold)]/5"
                            : "border-[var(--gold)]/10 hover:border-[var(--gold)]/30 bg-[var(--black-card)]"
                        }`}
                      >
                        <p className="text-sm font-light text-white mb-1">{loc.name}</p>
                        <p className="text-xs text-white/40">{loc.state}</p>
                        {Number(loc.travel_charge) > 0 && (
                          <p className="text-xs text-[var(--gold)]/60 mt-2">+₹{loc.travel_charge} travel</p>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="mb-8">
                    <label className="block text-xs tracking-widest uppercase text-white/40 mb-2">City / Location</label>
                    <input
                      {...register("event_type")}
                      placeholder="Enter your city"
                      className="w-full bg-[var(--black-card)] border border-[var(--gold)]/20 text-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]/50"
                    />
                    <button type="button" onClick={() => setStep(2)} className="mt-4 px-8 py-3 bg-[var(--gold)] text-black text-xs tracking-widest uppercase">
                      Continue
                    </button>
                  </div>
                )}
                <button type="button" onClick={() => setStep(0)} className="text-xs text-white/30 hover:text-white/60">← Back</button>
              </div>
            )}

            {/* Step 2: Package */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-light text-white mb-8" style={{ fontFamily: "var(--font-cormorant)" }}>
                  Select a Package
                </h2>
                {packages.length > 0 ? (
                  <div className="flex flex-col gap-4 mb-8">
                    {packages.map((pkg) => (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => { setValue("package", pkg.id); setStep(3); }}
                        className="text-left p-6 border border-[var(--gold)]/10 hover:border-[var(--gold)]/40 bg-[var(--black-card)] transition-all duration-300"
                      >
                        <div className="flex justify-between mb-2">
                          <p className="text-base font-light text-white" style={{ fontFamily: "var(--font-cormorant)" }}>{pkg.name}</p>
                          <p className="text-[var(--gold)]">₹{pkg.price}</p>
                        </div>
                        <p className="text-xs text-white/40 mb-3">{pkg.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {pkg.inclusions_list.slice(0, 3).map((inc) => (
                            <span key={inc} className="text-[9px] tracking-widest uppercase text-white/30 border border-white/10 px-2 py-0.5">{inc}</span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="mb-8 p-6 border border-[var(--gold)]/10 bg-[var(--black-card)]">
                    <p className="text-sm text-white/40">Packages will be shown here. Please continue to fill in your details.</p>
                    <button type="button" onClick={() => setStep(3)} className="mt-4 px-8 py-3 bg-[var(--gold)] text-black text-xs tracking-widest uppercase">
                      Continue
                    </button>
                  </div>
                )}
                <button type="button" onClick={() => setStep(1)} className="text-xs text-white/30 hover:text-white/60">← Back</button>
              </div>
            )}

            {/* Step 3: Event Details */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-light text-white mb-8" style={{ fontFamily: "var(--font-cormorant)" }}>
                  Event Details
                </h2>
                <div className="flex flex-col gap-5 mb-8">
                  {[
                    { id: "event_type" as const, label: "Event Type", placeholder: "e.g., Wedding, Pre-wedding, Corporate" },
                    { id: "event_date" as const, label: "Event Date", type: "date" },
                    { id: "venue_name" as const, label: "Venue Name", placeholder: "Enter venue name" },
                  ].map((f) => (
                    <div key={f.id}>
                      <label className="block text-xs tracking-widest uppercase text-white/40 mb-2">{f.label}</label>
                      <input
                        type={f.type || "text"}
                        {...register(f.id, { required: f.id !== "venue_name" })}
                        placeholder={f.placeholder}
                        className="w-full bg-[var(--black-card)] border border-[var(--gold)]/20 text-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]/50"
                      />
                      {errors[f.id] && <p className="text-red-400 text-xs mt-1">Required</p>}
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-white/40 mb-2">Approx. Guest Count</label>
                    <input
                      type="number"
                      {...register("guest_count")}
                      placeholder="e.g., 200"
                      className="w-full bg-[var(--black-card)] border border-[var(--gold)]/20 text-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]/50"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(2)} className="text-xs text-white/30 hover:text-white/60">← Back</button>
                  <button type="button" onClick={() => setStep(4)} className="px-8 py-3 bg-[var(--gold)] text-black text-xs tracking-widest uppercase">
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Contact */}
            {step === 4 && (
              <div>
                <h2 className="text-2xl font-light text-white mb-8" style={{ fontFamily: "var(--font-cormorant)" }}>
                  Your Contact Details
                </h2>
                <div className="flex flex-col gap-5 mb-8">
                  {[
                    { id: "customer_name" as const, label: "Full Name", placeholder: "Your full name" },
                    { id: "customer_phone" as const, label: "Phone Number", placeholder: "+91 XXXXX XXXXX" },
                    { id: "customer_email" as const, label: "Email Address", type: "email", placeholder: "you@example.com" },
                  ].map((f) => (
                    <div key={f.id}>
                      <label className="block text-xs tracking-widest uppercase text-white/40 mb-2">{f.label}</label>
                      <input
                        type={f.type || "text"}
                        {...register(f.id, { required: true })}
                        placeholder={f.placeholder}
                        className="w-full bg-[var(--black-card)] border border-[var(--gold)]/20 text-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]/50"
                      />
                      {errors[f.id] && <p className="text-red-400 text-xs mt-1">Required</p>}
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-white/40 mb-2">Additional Notes</label>
                    <textarea
                      {...register("notes")}
                      placeholder="Any specific requirements or questions..."
                      rows={4}
                      className="w-full bg-[var(--black-card)] border border-[var(--gold)]/20 text-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]/50 resize-none"
                    />
                  </div>
                </div>
                {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(3)} className="text-xs text-white/30 hover:text-white/60">← Back</button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-10 py-4 bg-[var(--gold)] text-black text-xs tracking-widest uppercase font-medium hover:bg-[var(--gold-light)] transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit Booking"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}

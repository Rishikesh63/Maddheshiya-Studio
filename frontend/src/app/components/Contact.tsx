"use client";

import React, { useState, useEffect, useRef } from 'react';
import { CalendarDays, MessageSquare, MapPin, Send, Star, LucideIcon, ChevronDown } from 'lucide-react';

// --- Mock UI Components for Demonstration (with improved types) ---
const Button = ({ children, className, variant, ...props }: React.ComponentProps<'button'> & { variant?: string }) => (
    <button className={`inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${className}`} {...props}>
      {children}
    </button>
);
const Input = ({ className, ...props }: React.ComponentProps<'input'>) => (
    <input className={`flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow ${className}`} {...props} />
);
const Textarea = ({ className, ...props }: React.ComponentProps<'textarea'>) => (
    <textarea className={`flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow ${className}`} {...props} />
);
const Card = ({ children, className, ...props }: React.ComponentProps<'div'>) => (
    <div className={`rounded-xl border bg-card text-card-foreground ${className}`} {...props}>
        {children}
    </div>
);
const CardContent = ({ children, className, ...props }: React.ComponentProps<'div'>) => (
    <div className={`p-6 ${className}`} {...props}>
        {children}
    </div>
);

// --- Improved Custom Select Component ---
const CustomSelect = ({ items, placeholder }: { items: string[]; placeholder: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);

  const handleItemClick = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={selectRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
      >
        <span className={selectedValue ? "text-slate-900" : "text-slate-500"}>
          {selectedValue || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg max-h-60 overflow-y-auto animate-fade-in-sm">
          <div className="p-1">
            {items.map((item) => (
              <div
                key={item}
                onClick={() => handleItemClick(item)}
                className="p-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md cursor-pointer"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Data Layer ---
const services = [
  "Professional Photography", "Videography", "AI Powered Editing", 
  "ID Card making", "T-Shirt Printing", "Drone Footage", 
  "E-Commerce Photography", "Album Designing", "Photo Framing", 
  "AI Assistant Development"
];

const contactInfo = [
    {
        icon: MapPin,
        title: "Visit Our Studios",
        lines: ["Maharajganj Chauraha,", "Gorakhpur, Uttar Pradesh 273165"]
    },
    {
        icon: MessageSquare,
        title: "Email & Phone",
        lines: ["info@maddheshiyastudio.com", "+91 98765 43210"]
    },
    {
        icon: CalendarDays,
        title: "Operating Hours",
        lines: ["Mon - Sat: 9:00 AM - 8:00 PM", "Sunday: 10:00 AM - 4:00 PM"]
    }
];

// --- Reusable Components ---
const InfoCard = ({ icon: Icon, title, lines }: { icon: LucideIcon; title: string; lines: string[] }) => (
    <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
            <Icon className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
            <h4 className="font-semibold text-slate-800">{title}</h4>
            <div className="text-slate-600 mt-1">
                {lines.map((line, index) => <p key={index}>{line}</p>)}
            </div>
        </div>
    </div>
);

const FormField = ({ id, label, children }: { id: string; label: string; children: React.ReactNode }) => (
    <div className="space-y-2">
        <label htmlFor={id} className="text-sm font-medium text-slate-700">{label}</label>
        {children}
    </div>
);

// --- Main Contact Section ---
const Contact = () => {
  return (
    <>
      <style>{`
        @keyframes fade-in-sm {
          from { opacity: 0; transform: scale(0.98) translateY(-5px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in-sm { animation: fade-in-sm 0.2s ease-out forwards; }
      `}</style>
      <section id="contact" className="py-20 sm:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Get In Touch</h2>
            <p className="text-lg text-slate-600">
              Book a service, rent equipment, or inquire about listing your gear. We&apos;re here to help!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <Card className="shadow-lg border-slate-200 bg-white">
              <CardContent className="p-6 md:p-8">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField id="name" label="Full Name">
                      <Input id="name" placeholder="Your name" />
                    </FormField>
                    <FormField id="email" label="Email Address">
                      <Input id="email" type="email" placeholder="you@example.com" />
                    </FormField>
                  </div>

                  <FormField id="phone" label="Phone Number">
                    <Input id="phone" placeholder="Your phone number" />
                  </FormField>

                  <FormField id="service" label="What are you interested in?">
                    <CustomSelect items={services} placeholder="Select a service" />
                  </FormField>

                  <FormField id="message" label="Your Message">
                    <Textarea id="message" placeholder="Let us know how we can help you..." rows={4} />
                  </FormField>

                  <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-base">
                    Send Message <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Connect With Us</h3>
                <div className="space-y-6">
                  {contactInfo.map(info => <InfoCard key={info.title} {...info} />)}
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-8 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-2 mb-3">
                      {[...Array(5)].map((_, i) => <Star key={i} size={20} className="fill-current text-yellow-400" />)}
                  </div>
                <h3 className="font-bold text-xl mb-3">Special Offer!</h3>
                <p className="opacity-90 mb-4">
                  Get <strong>15% off</strong> on your first booking or rental. Use code <span className="font-semibold bg-white/20 px-2 py-1 rounded-md">FIRSTFRAME15</span> at checkout.
                </p>
                <Button variant="outline" className="w-full bg-white/20 border-white/30 hover:bg-white/30 text-white">
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;

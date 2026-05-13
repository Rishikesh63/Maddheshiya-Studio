"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Camera, Video, Package, ShoppingCart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const photographyLinks = [
  { href: "/photography/wedding", label: "Wedding" },
  { href: "/photography/prewedding", label: "Pre-Wedding" },
  { href: "/photography/studio", label: "Studio" },
  { href: "/photography/product", label: "Product" },
  { href: "/photography/drone", label: "Drone" },
];

const videographyLinks = [
  { href: "/videography/wedding-films", label: "Wedding Films" },
  { href: "/videography/reels", label: "Cinematic Reels" },
  { href: "/videography/drone", label: "Drone Videography" },
  { href: "/videography/events", label: "Events" },
];

const productLinks = [
  { group: "Digital", items: [
    { href: "/products/digital/album-psd", label: "Album PSD" },
    { href: "/products/digital/invitation-video", label: "Invitation Video" },
    { href: "/products/digital/wedding-highlight", label: "Wedding Highlight" },
    { href: "/products/digital/prewedding-highlight", label: "Pre-Wedding Highlight" },
  ]},
  { group: "Printing", items: [
    { href: "/products/printing/id-cards", label: "ID Cards" },
    { href: "/products/printing/tshirt-printing", label: "T-Shirt Printing" },
    { href: "/products/printing/photo-framing", label: "Photo Framing" },
  ]},
];

function DropdownMenu({
  label,
  icon: Icon,
  href,
  children,
}: {
  label: string;
  icon: React.ElementType;
  href: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={href}
        className="flex items-center gap-1 text-sm tracking-widest uppercase text-white/70 hover:text-[var(--gold)] transition-colors duration-300 py-2"
        onClick={() => setOpen(false)}
      >
        <Icon size={14} className="opacity-60" />
        {label}
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </Link>

      {open && (
        <div className="absolute top-full left-0 mt-1 bg-[#111111] border border-[var(--gold)]/20 shadow-2xl shadow-black/60 min-w-[200px] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-1">{children}</div>
        </div>
      )}
    </div>
  );
}

function DropdownLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block px-4 py-2.5 text-xs tracking-widest uppercase text-white/60 hover:text-[var(--gold)] hover:bg-[var(--gold)]/5 transition-colors duration-200"
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { count: cartCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileSection(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[var(--gold)]/10 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none group">
          <span
            className="text-xl font-light tracking-[0.25em] uppercase text-[var(--gold)] transition-opacity duration-300 group-hover:opacity-80"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Maddheshiya
          </span>
          <span className="text-[9px] tracking-[0.5em] uppercase text-white/40 mt-0.5">
            Studio
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          <DropdownMenu label="Photography" icon={Camera} href="/photography">
            {photographyLinks.map((l) => (
              <DropdownLink key={l.href} href={l.href} label={l.label} />
            ))}
          </DropdownMenu>

          <DropdownMenu label="Videography" icon={Video} href="/videography">
            {videographyLinks.map((l) => (
              <DropdownLink key={l.href} href={l.href} label={l.label} />
            ))}
          </DropdownMenu>

          <DropdownMenu label="Products" icon={Package} href="/products">
            {productLinks.map((group) => (
              <div key={group.group}>
                <div className="px-4 pt-3 pb-1 text-[9px] tracking-[0.3em] uppercase text-[var(--gold)]/60">
                  {group.group}
                </div>
                {group.items.map((l) => (
                  <DropdownLink key={l.href} href={l.href} label={l.label} />
                ))}
              </div>
            ))}
          </DropdownMenu>

          {[
            { href: "/portfolio", label: "Portfolio" },
            { href: "/packages", label: "Packages" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm tracking-widest uppercase text-white/70 hover:text-[var(--gold)] transition-colors duration-300"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right: Cart + Book Now + Auth */}
        <div className="hidden lg:flex items-center gap-4">
          {user && (
            <button
              onClick={logout}
              className="text-xs tracking-widest uppercase text-white/50 hover:text-white/80 transition-colors"
            >
              Logout
            </button>
          )}
          <Link
            href="/cart"
            className="relative text-white/50 hover:text-[var(--gold)] transition-colors"
            aria-label="Cart"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-[var(--gold)] text-black text-[9px] font-bold flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            href="/booking"
            className="px-6 py-2.5 text-xs tracking-widest uppercase border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--black)] transition-all duration-300 font-medium"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden text-white/80 hover:text-[var(--gold)] transition-colors z-50"
          onClick={() => setMobileOpen((p) => !p)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-0 top-0 bg-[#0A0A0A] z-40 transition-transform duration-400 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto pt-24 pb-12 px-8 flex flex-col gap-2">

          {/* Mobile dropdown sections */}
          {[
            { key: "photo", label: "Photography", links: photographyLinks, href: "/photography" },
            { key: "video", label: "Videography", links: videographyLinks, href: "/videography" },
          ].map((section) => (
            <div key={section.key}>
              <button
                onClick={() =>
                  setMobileSection(mobileSection === section.key ? null : section.key)
                }
                className="w-full flex items-center justify-between py-4 border-b border-white/10 text-sm tracking-widest uppercase text-white/70"
              >
                {section.label}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    mobileSection === section.key ? "rotate-180" : ""
                  }`}
                />
              </button>
              {mobileSection === section.key && (
                <div className="pl-4 py-2 flex flex-col gap-1">
                  {section.links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="py-2 text-xs tracking-widest uppercase text-white/50 hover:text-[var(--gold)]"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Products mobile */}
          <div>
            <button
              onClick={() =>
                setMobileSection(mobileSection === "products" ? null : "products")
              }
              className="w-full flex items-center justify-between py-4 border-b border-white/10 text-sm tracking-widest uppercase text-white/70"
            >
              Products
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  mobileSection === "products" ? "rotate-180" : ""
                }`}
              />
            </button>
            {mobileSection === "products" && (
              <div className="pl-4 py-2 flex flex-col gap-1">
                {productLinks.map((group) => (
                  <div key={group.group}>
                    <div className="text-[9px] tracking-[0.3em] uppercase text-[var(--gold)]/50 pt-3 pb-1">
                      {group.group}
                    </div>
                    {group.items.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="block py-2 text-xs tracking-widest uppercase text-white/50 hover:text-[var(--gold)]"
                      >
                        {l.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {[
            { href: "/portfolio", label: "Portfolio" },
            { href: "/packages", label: "Packages" },
            { href: "/availability", label: "Availability" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="py-4 border-b border-white/10 text-sm tracking-widest uppercase text-white/70 hover:text-[var(--gold)]"
            >
              {l.label}
            </Link>
          ))}

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/booking"
              className="w-full py-4 text-center text-xs tracking-widest uppercase border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition-all duration-300"
            >
              Book Now
            </Link>
            {user ? (
              <button
                onClick={logout}
                className="w-full py-3 text-center text-xs tracking-widest uppercase text-white/40"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="w-full py-3 text-center text-xs tracking-widest uppercase text-white/40 hover:text-white/70"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

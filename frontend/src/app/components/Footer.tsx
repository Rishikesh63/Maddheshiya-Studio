import React from "react";
import Link from "next/link";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import { SOCIAL_LINKS } from "../lib/siteConfig";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const photographyLinks = [
  { href: "/photography/wedding", label: "Wedding Photography" },
  { href: "/photography/prewedding", label: "Pre-Wedding" },
  { href: "/photography/studio", label: "Studio Photography" },
  { href: "/photography/product", label: "Product Photography" },
  { href: "/photography/drone", label: "Drone Photography" },
];

const videographyLinks = [
  { href: "/videography/wedding-films", label: "Wedding Films" },
  { href: "/videography/reels", label: "Cinematic Reels" },
  { href: "/videography/drone", label: "Drone Videography" },
  { href: "/videography/events", label: "Event Videography" },
];

const digitalProductLinks = [
  { href: "/products/digital/album-psd", label: "Album PSD" },
  { href: "/products/digital/invitation-video", label: "Invitation Video" },
  { href: "/products/digital/wedding-highlight", label: "Wedding Highlight" },
  { href: "/products/digital/prewedding-highlight", label: "Pre-Wedding Highlight" },
  { href: "/products/digital/ring-ceremony-highlight", label: "Ring Ceremony Highlight" },
  { href: "/products/digital/wedding-title", label: "Wedding Title" },
  { href: "/products/digital/video-logo", label: "Video Logo" },
  { href: "/products/digital/birthday-highlight", label: "Birthday Highlight" },
];

const printingProductLinks = [
  { href: "/products/printing/id-cards", label: "ID Cards" },
  { href: "/products/printing/tshirt-printing", label: "T-Shirt Printing" },
  { href: "/products/printing/photo-framing", label: "Photo Framing" },
];

const quickLinks = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/packages", label: "Packages" },
  { href: "/availability", label: "Availability" },
  { href: "/booking", label: "Book Now" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

const socials = [
  { href: SOCIAL_LINKS.instagram, icon: <Instagram size={16} />, label: "Instagram" },
  { href: SOCIAL_LINKS.facebook,  icon: <Facebook size={16} />,  label: "Facebook" },
  { href: SOCIAL_LINKS.whatsapp,  icon: <WhatsAppIcon />,         label: "WhatsApp" },
  { href: SOCIAL_LINKS.linkedin,  icon: <Linkedin size={16} />,  label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-[var(--gold)]/10 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="block mb-5">
              <span
                className="text-2xl font-light tracking-[0.2em] uppercase text-[var(--gold)]"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Maddheshiya
              </span>
              <br />
              <span className="text-[9px] tracking-[0.5em] uppercase text-white/30">Studio</span>
            </Link>
            <p className="text-xs text-white/40 leading-relaxed mb-6 max-w-[200px]">
              Premium wedding photography, cinematic films, and creative services.
            </p>
            <div className="flex items-center gap-4">
              {socials.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-white/30 hover:text-[var(--gold)] transition-colors duration-300"
                >
                  {s.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Photography */}
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-[var(--gold)]/60 mb-5">
              Photography
            </h4>
            <ul className="space-y-3">
              {photographyLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-xs text-white/40 hover:text-[var(--gold)]/80 transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Videography */}
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-[var(--gold)]/60 mb-5">
              Videography
            </h4>
            <ul className="space-y-3">
              {videographyLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-xs text-white/40 hover:text-[var(--gold)]/80 transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-[var(--gold)]/60 mb-5">
              Products
            </h4>
            <p className="text-[9px] tracking-[0.25em] uppercase text-[var(--gold)]/40 mb-3">Digital</p>
            <ul className="space-y-3 mb-6">
              {digitalProductLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-xs text-white/40 hover:text-[var(--gold)]/80 transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-[9px] tracking-[0.25em] uppercase text-[var(--gold)]/40 mb-3">Printing</p>
            <ul className="space-y-3">
              {printingProductLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-xs text-white/40 hover:text-[var(--gold)]/80 transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-[var(--gold)]/60 mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-xs text-white/40 hover:text-[var(--gold)]/80 transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--gold)]/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] tracking-widest uppercase text-white/20">
            © {new Date().getFullYear()} Maddheshiya Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[10px] tracking-widest uppercase text-white/20">
            <Link href="/contact" className="hover:text-white/40 transition-colors">Contact</Link>
            <span>·</span>
            <Link href="/about" className="hover:text-white/40 transition-colors">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

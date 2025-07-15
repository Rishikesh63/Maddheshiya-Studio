"use client";

import React from 'react';
import { Camera, Instagram, Facebook, Linkedin, Mail, ArrowRight } from 'lucide-react';

// --- Mock UI Components for Demonstration ---
const Link = ({ href, children, ...props }: { href: string; children: React.ReactNode; [key:string]: any }) => (
  <a href={href} {...props}>{children}</a>
);

// --- Type Definitions ---
interface FooterLinkItem {
  href: string;
  label: string;
}

interface SocialLinkItem {
  href: string;
  icon: React.ReactElement;
  label: string;
}

// --- Data Layer ---
const serviceLinks: FooterLinkItem[] = [
  { href: "#", label: "Professional Photography" },
  { href: "#", label: "Event Videography" },
  { href: "#", label: "Drone Services" },
  { href: "#", label: "AI Editing" },
  { href: "#", label: "Album Designing" },
];

const rentalLinks: FooterLinkItem[] = [
  { href: "#", label: "Camera Equipment" },
  { href: "#", label: "Lighting Gear" },
  { href: "#", label: "Lenses & Filters" },
  { href: "#", label: "Tripods & Gimbals" },
];

const legalLinks: FooterLinkItem[] = [
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
    { href: "#", label: "FAQ" },
];

// Using an inline SVG for WhatsApp to avoid extra dependencies
const WhatsappIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
);

const socialLinks: SocialLinkItem[] = [
  { href: "https://www.instagram.com/mithlesh_mds/", icon: <Instagram size={20} />, label: "Instagram" },
  { href: "https://www.facebook.com/mithlesh.maddheshiya.3", icon: <Facebook size={20} />, label: "Facebook" },
  { href: "https://whatsapp.com/channel/0029VagkphGEVccOiwnVkg47", icon: <WhatsappIcon />, label: "WhatsApp" },
  { href: "https://www.linkedin.com/groups/14707064/", icon: <Linkedin size={20} />, label: "LinkedIn" },
];

// --- Reusable Sub-Components ---
const FooterColumn = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
    <ul className="space-y-3">
      {children}
    </ul>
  </div>
);

const FooterLink = ({ href, label }: FooterLinkItem) => (
  <li>
    <Link href={href} className="text-slate-300 hover:text-indigo-400 transition-colors duration-300 flex items-center gap-2">
      <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
      {label}
    </Link>
  </li>
);

const SocialLink = ({ href, icon, label }: SocialLinkItem) => (
    <Link href={href} aria-label={label} className="text-slate-400 hover:text-indigo-400 hover:scale-110 transition-all duration-300">
        {icon}
    </Link>
);

// --- Main Footer Component ---
const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Camera className="text-indigo-500 h-7 w-7" />
              <span className="text-xl font-bold">
                Maddheshiya<span className="text-indigo-500">Studio</span>
              </span>
            </div>
            <p className="text-slate-400 mb-6 pr-4">
              A tech-driven platform for photography, videography, and gear rentals.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(link => <SocialLink key={link.label} {...link} />)}
            </div>
          </div>

          {/* Services Column */}
          <FooterColumn title="Our Services">
            <div className="group">
                {serviceLinks.map(link => <FooterLink key={link.label} {...link} />)}
            </div>
          </FooterColumn>

          {/* Rentals Column */}
          <FooterColumn title="Rentals">
             <div className="group">
                {rentalLinks.map(link => <FooterLink key={link.label} {...link} />)}
            </div>
          </FooterColumn>

          {/* Subscribe Column */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Subscribe</h3>
            <p className="text-slate-400 mb-4">
              Get updates on our latest services, gear, and special offers.
            </p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="your.email@example.com" 
                className="bg-slate-800 border border-slate-700 rounded-l-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              />
              <button type="submit" aria-label="Subscribe" className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-r-md transition-colors">
                <Mail className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Maddheshiya Studio. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-slate-400">
              {legalLinks.map(link => (
                  <Link key={link.label} href={link.href} className="hover:text-indigo-400 transition-colors">{link.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

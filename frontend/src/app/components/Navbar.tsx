"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag, UserCircle, ShoppingCart } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-slate-800">
          <ShoppingBag className="h-8 w-8 text-indigo-600" />
          <span className="text-xl font-bold">
            Maddheshiya<span className="text-indigo-600">Studio</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-600 hover:text-indigo-600 font-medium transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-indigo-600 after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth - Desktop */}
          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="flex items-center gap-2 text-slate-600 hover:text-indigo-600"
            >
              <ShoppingCart size={22} />
              <span className="sr-only">Cart</span>
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-slate-600 hover:text-indigo-600"
                >
                  <UserCircle size={22} />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-slate-600 hover:text-indigo-600 font-medium transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-slate-800 z-50"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 bg-white z-40 transition-transform duration-300 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="container mx-auto px-4 pt-24 pb-8 flex flex-col h-full">
          {/* Navigation Links */}
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className="text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-md py-3 px-4 text-lg transition-colors text-center"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <hr className="my-6 border-slate-200" />

          {/* Auth - Mobile */}
          <div className="flex flex-col space-y-4">
            <Link
              href="/cart"
              onClick={closeMobileMenu}
              className="text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-md py-3 px-4 text-lg transition-colors text-center flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} />
              Cart
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={closeMobileMenu}
                  className="text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-md py-3 px-4 text-lg transition-colors text-center"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-md py-3 px-4 text-lg transition-colors text-center"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                onClick={closeMobileMenu}
                className="bg-indigo-600 text-white rounded-md py-3 px-4 text-lg transition-colors text-center font-semibold"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

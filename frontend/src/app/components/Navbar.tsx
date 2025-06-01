"use client";
import React, { useState, useEffect } from "react";
import { Menu, X} from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? "bg-black/90 backdrop-blur-md shadow-md py-3"
          : "bg-amber-950 py-5"
      }`}
    >
      <div className="container px-4 md:px-6 flex items-center">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
           <img src="images/logo.png" alt="Logo" className="h-12 w-25 object-contain" />
          <span className="text-xl font-bold text-forge-dark">
            Maddheshiya<span className="text-forge-purple">Studio</span>
          </span>
        </a>

        {/* Desktop Menu - aligned right */}
        <div className="hidden md:flex items-center space-x-8 ml-auto">
          <a
            href="#services"
            className="text-forge-dark hover:text-forge-purple transition-colors font-medium"
          >
            Services
          </a>
          <a
            href="#gear"
            className="text-forge-dark hover:text-forge-purple transition-colors font-medium"
          >
            Gear Rental
          </a>
          <a
            href="#testimonials"
            className="text-forge-dark hover:text-forge-purple transition-colors font-medium"
          >
            Testimonials
          </a>
           <a
            href="#contact"
            className="text-forge-dark hover:text-forge-purple transition-colors font-medium"
          >
            Contact
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden ml-auto text-forge-dark"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <a
              href="#services"
              className="text-forge-dark hover:text-forge-purple transition-colors py-2 px-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </a>
            <a
              href="#studios"
              className="text-forge-dark hover:text-forge-purple transition-colors py-2 px-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Studios
            </a>
            <a
              href="#gear"
              className="text-forge-dark hover:text-forge-purple transition-colors py-2 px-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Gear Rental
            </a>
            <a
              href="#testimonials"
              className="text-forge-dark hover:text-forge-purple transition-colors py-2 px-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Testimonials
            </a>
                <a
              href="#contact"
              className="text-forge-dark hover:text-forge-purple transition-colors py-2 px-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </a>
            
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

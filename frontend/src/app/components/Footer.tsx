import React from 'react';
import { Camera, Instagram, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
     <footer className="bg-gradient-to-br from-forge-dark to-forge-darkpurple text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Camera className="text-forge-purple h-6 w-6" />
              <span className="text-xl font-bold">
                Maddheshiya<span className="text-forge-purple">Studio</span>
              </span>
            </div>
            <p className="text-gray-300 mb-4">
              A tech-driven platform for photography, videography, and gear rentals.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-forge-purple transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-forge-purple transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-forge-purple transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-forge-purple transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-forge-purple transition-colors">Wedding Photography</a></li>
              <li><a href="#" className="text-gray-300 hover:text-forge-purple transition-colors">Event Videography</a></li>
              <li><a href="#" className="text-gray-300 hover:text-forge-purple transition-colors">Product Photography</a></li>
              <li><a href="#" className="text-gray-300 hover:text-forge-purple transition-colors">Drone Services</a></li>
              <li><a href="#" className="text-gray-300 hover:text-forge-purple transition-colors">VR Experiences</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Rentals</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-forge-purple transition-colors">Studio Spaces</a></li>
              <li><a href="#" className="text-gray-300 hover:text-forge-purple transition-colors">Camera Equipment</a></li>
              <li><a href="#" className="text-gray-300 hover:text-forge-purple transition-colors">Lighting Gear</a></li>
              <li><a href="#" className="text-gray-300 hover:text-forge-purple transition-colors">Audio Equipment</a></li>
              <li><a href="#" className="text-gray-300 hover:text-forge-purple transition-colors">List Your Gear</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Subscribe</h3>
            <p className="text-gray-300 mb-4">
              Get updates on our latest services, gear availability, and special offers.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-white/10 rounded-l-md px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-forge-purple"
              />
              <button className="bg-forge-purple hover:bg-forge-darkpurple px-3 py-2 rounded-r-md">
                <Mail className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Maddheshiya Studio. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-forge-purple transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-forge-purple transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-forge-purple transition-colors">FAQ</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

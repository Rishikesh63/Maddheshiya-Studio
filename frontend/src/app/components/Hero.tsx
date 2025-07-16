"use client";

import React from 'react';
import { ArrowRight, Camera, Video, Film, LucideIcon } from 'lucide-react';

// --- Mock UI Components (cleaned up) ---
const Button = ({ children, className, ...props }: React.ComponentProps<'button'>) => (
  <button
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Image = ({ src, alt, className, ...props }: React.ComponentProps<'img'>) => (
  <img
    src={src}
    alt={alt}
    className={className}
    {...props}
    onError={(e) => {
      (e.target as HTMLImageElement).src = 'https://placehold.co/500x500/e2e8f0/4a5568?text=Image+Error';
    }}
  />
);

// --- Type Definitions ---
interface Feature {
  icon: LucideIcon;
  text: string;
}

// --- Data Layer ---
const features: Feature[] = [
  { icon: Camera, text: "Photography" },
  { icon: Video, text: "Videography" },
  { icon: Film, text: "Rentals" },
];

// --- Reusable Feature Icon Component ---
const FeatureIcon = ({ icon: Icon, text }: Feature) => (
  <div className="text-center">
    <div className="bg-white shadow-md rounded-xl p-3 inline-block mb-3 transition-transform duration-300 group-hover:scale-110">
      <Icon className="h-6 w-6 text-indigo-600" />
    </div>
    <p className="font-medium text-slate-700">{text}</p>
  </div>
);

// --- Main Hero Section Component ---
const Hero = () => {
  return (
    <>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.8s ease-out forwards; }
      `}</style>

      <section className="relative min-h-screen flex items-center pt-20 pb-10 overflow-hidden bg-slate-50">
        {/* Blurred Background Shapes */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-indigo-200/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-200/50 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Textual Content */}
            <header className="space-y-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="inline-block bg-indigo-100 px-4 py-2 rounded-full">
                <p className="text-indigo-800 font-semibold flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                  Tech-Driven Photography & Videography
                </p>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900">
                Capture <span className="text-indigo-600">moments</span> that matter, rent <span className="text-indigo-600">gear</span> you need
              </h1>

              <p className="text-lg text-slate-600 max-w-xl">
                Maddheshiya Studio combines photography, videography, and gear rentals all in one platform. 
                Book shoots, rent studios, or list your gear - all in one place.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 h-auto text-base">
                  Book a Shoot <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button className="border border-slate-300 text-slate-700 hover:bg-slate-100 px-8 py-3 h-auto text-base">
                  Explore Studios
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-8 max-w-md group">
                {features.map((item) => (
                  <FeatureIcon key={item.text} icon={item.icon} text={item.text} />
                ))}
              </div>
            </header>

            {/* Hero Images */}
            <div className="hidden lg:block relative animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl transform rotate-3 transition-transform duration-500 hover:rotate-0 hover:scale-105">
                <Image 
                  src="https://images.pexels.com/photos/4342400/pexels-photo-4342400.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="A photographer capturing a moment" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-12 -left-12 w-64 aspect-square rounded-2xl overflow-hidden shadow-xl transform -rotate-6 transition-transform duration-500 hover:rotate-0 hover:scale-105">
                <Image 
                  src="https://images.pexels.com/photos/2041049/pexels-photo-2041049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="A videographer filming a scene" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-8 -right-8 w-48 aspect-square rounded-2xl overflow-hidden shadow-xl transform rotate-6 transition-transform duration-500 hover:rotate-0 hover:scale-105">
                <Image 
                  src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Abstract representation of an AI agent" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;

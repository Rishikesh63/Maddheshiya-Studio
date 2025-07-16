"use client";

import React from 'react';
import { ArrowRight, Camera, Video, Airplay, Zap, Aperture } from 'lucide-react';
import NextImage from 'next/image';

// --- UI Components ---
const Button = ({
  children,
  className,
  ...props
}: React.ComponentProps<'button'>) => (
  <button
    type="button"
    className={`inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Image = ({
  src,
  alt,
  className,
  ...props
}: React.ComponentProps<typeof NextImage>) => (
  <NextImage
    src={src}
    alt={alt}
    className={className}
    width={600}
    height={400}
    {...props}
  />
);

// --- Type Definitions ---
interface GearItem {
  id: string;
  image: string;
  name: string;
  category: string;
  categoryIcon: React.ReactElement;
  price: string;
}

// --- Data Layer ---
const gearItems: GearItem[] = [
  {
    id: "sony-a7iii",
    image: "https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?q=80&w=2487",
    name: "Sony Alpha A7III",
    category: "Camera",
    categoryIcon: <Camera size={14} />,
    price: "₹2,000/day",
  },
  {
    id: "canon-ef-24-70",
    image: "https://images.unsplash.com/photo-1516724562728-afc824a36e84?q=80&w=2071",
    name: "Canon EF 24-70mm f/2.8",
    category: "Lens",
    categoryIcon: <Aperture size={14} />,
    price: "₹1,000/day",
  },
  {
    id: "dji-mavic-3",
    image: "https://images.unsplash.com/photo-1517497052582-25e6fe8ec001?q=80&w=1935",
    name: "DJI Mavic 3 Pro",
    category: "Drone",
    categoryIcon: <Airplay size={14} />,
    price: "₹2,500/day",
  },
  {
    id: "godox-lighting-kit",
    image: "https://images.unsplash.com/photo-1519683109079-d5f539e1542f?q=80&w=2070",
    name: "Godox Lighting Kit",
    category: "Lighting",
    categoryIcon: <Zap size={14} />,
    price: "₹1,200/day",
  },
  {
    id: "rode-videomic-pro",
    image: "https://images.unsplash.com/photo-1621886292933-282f7e449258?q=80&w=2070",
    name: "Rode VideoMic Pro+",
    category: "Audio",
    categoryIcon: <Zap size={14} />,
    price: "₹800/day",
  },
];

// --- Reusable Gear Card Component ---
const GearCard = ({
  image,
  name,
  category,
  price,
  categoryIcon,
}: GearItem) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-200 hover:border-indigo-300">
      <div className="h-48 overflow-hidden relative">
        <Image
          src={image}
          alt={`Image of ${name}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
          {categoryIcon}
          {category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-slate-800 truncate">{name}</h3>
        <div className="flex justify-between items-center mt-3">
          <span className="text-indigo-600 font-semibold">{price}</span>
          <Button className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:text-indigo-800 px-4 py-2 h-auto text-sm">
            Rent <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- Main Gear Rental Section ---
const Gear = () => {
  return (
    <section id="gear" className="py-20 sm:py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <header className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Rent Professional Gear
          </h2>
          <p className="text-lg text-slate-600">
            Access high-end photography and videography equipment without the
            investment. Rent what you need, when you need it.
          </p>
        </header>

        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 space-x-6 snap-x snap-mandatory no-scrollbar">
          {gearItems.map((item) => (
            <div key={item.id} className="min-w-[280px] sm:min-w-[300px] snap-center">
              <GearCard {...item} />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 h-auto text-base">
            View All Equipment
          </Button>
        </div>

        <div className="mt-20 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl shadow-lg p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                Have gear? List it and earn.
              </h3>
              <p className="text-slate-300 mb-6">
                Own photography or videography equipment that sits idle? List it
                on our platform and earn passive income when others rent your gear.
              </p>
              <Button className="bg-white text-slate-900 hover:bg-slate-200 font-semibold px-6 py-2.5">
                List Your Equipment
              </Button>
            </div>
            <div className="hidden md:block rounded-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1542567455-cd733f23fbb1?q=80&w=2070"
                alt="Professional camera gear in a studio"
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hide scrollbar for gear slider */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default Gear;

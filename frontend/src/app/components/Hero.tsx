import React from 'react';
import Image from 'next/image'; // If you're using Next.js
import { Button } from '@/app/components/ui/button';
import { ArrowRight, Camera, Video, Film } from 'lucide-react';
import { LucideIcon } from "lucide-react";

const features = [
  { icon: Camera, text: "Photography" },
  { icon: Video, text: "Videography" },
  { icon: Film, text: "Rentals" },
];

const FeatureIcon = ({ Icon, text }: { Icon: LucideIcon; text: string }) => (
  <div className="text-center">
    <div className="bg-white shadow-lg rounded-xl p-3 inline-block mb-2">
      <Icon className="h-6 w-6 text-forge-purple" />
    </div>
    <p className="font-medium">{text}</p>
  </div>
);

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-gradient-to-b from-white to-forge-light">
      {/* Blurred Background Shapes */}
      <div className="absolute top-1/4 right-10 w-64 h-64 bg-forge-purple/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-10 w-72 h-72 bg-forge-purple/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Textual Content */}
          <header className="space-y-8 animate-fade-in">
            <div className="inline-block bg-forge-purple/10 px-4 py-2 rounded-full">
              <p className="text-gray-800 font-medium flex items-center gap-1">
                <span className="w-2 h-2 bg-forge-purple rounded-full" />
                Tech-Driven Photography & Videography
              </p>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-700">
              Capture <span className="text-forge-purple">moments</span> that matter, rent <span className="text-forge-purple">gear</span> you need
            </h1>

            <p className="text-lg text-gray-600 max-w-xl">
              Maddheshiya Studio combines photography, videography, and gear rentals all in one platform. 
              Book shoots, rent studios, or list your gear - all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-forge-purple hover:bg-forge-darkpurple text-white">
                Book a Shoot <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-forge-purple text-forge-purple hover:bg-forge-purple/10">
                Explore Studios
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8 max-w-md">
              {features.map((item, idx) => (
                <FeatureIcon key={idx} Icon={item.icon} text={item.text} />
              ))}
            </div>
          </header>

          {/* Hero Images */}
          <div className="hidden lg:block relative animate-slide-up">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl transform rotate-2">
              <Image 
                src="/images/p3.jpg" 
                alt="Professional Photography" 
                width={500} height={500}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-10 -left-10 w-64 aspect-square rounded-2xl overflow-hidden shadow-xl transform -rotate-3">
              <Image 
                src="/images/p2.jpg" 
                alt="Photography Equipment" 
                width={256} height={256}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-5 -right-5 w-48 aspect-square rounded-2xl overflow-hidden shadow-xl">
              <Image 
                src="/images/p1.jpg" 
                alt="Studio Photography" 
                width={192} height={192}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

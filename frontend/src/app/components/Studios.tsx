
import React from 'react';
import { CalendarDays, Clock, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

const Studios = () => {
  const studios = [
    {
      name: "Daylight Studio",
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069",
      description: "Natural light studio with large windows, perfect for portrait and product photography.",
      price: "₹1,000/hour",
      size: "500 sq.ft"
    },
    {
      name: "Versatile Studio",
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069",
      description: "Configurable studio space with multiple backdrops and lighting setups for any type of shoot.",
      price: "₹1,500/hour",
      size: "800 sq.ft"
    }
  ];

  return (
    <section id="studios" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-forge-dark mb-4">Professional Studios for Rent</h2>
          <p className="text-lg text-gray-600">
            Book our fully-equipped studios by the hour. Perfect for photographers, videographers, and content creators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {studios.map((studio, index) => (
            <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg group">
              <div className="h-64 overflow-hidden">
                <img 
                  src={studio.image} 
                  alt={studio.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-bold text-forge-dark">{studio.name}</h3>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{studio.description}</p>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-1 bg-forge-light px-3 py-1 rounded-full text-sm">
                    <Clock className="w-4 h-4 text-black" />
                    <span className='text-blue-700'>{studio.price}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-forge-light px-3 py-1 rounded-full text-sm">
                    <CalendarDays className="w-4 h-4 text-black" />
                    <span className='text-blue-700'>Available 24/7</span>
                  </div>
                </div>
                <Button className="w-full bg-forge-purple hover:bg-forge-darkpurple text-white">
                  Book Studio <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600 mb-6">
            All studios come with basic lighting equipment, backdrops, and amenities.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Studios;

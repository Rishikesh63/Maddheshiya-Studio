"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Mock UI Components for Demonstration (with improved types) ---
const Image = ({ src, alt, className, ...props }: React.ComponentProps<'img'>) => (
  <img 
    src={src} 
    alt={alt} 
    className={className} 
    {...props} 
    onError={(e) => { 
      // Prevents infinite loop if placeholder also fails
      if ((e.target as HTMLImageElement).src !== 'https://placehold.co/48x48/e2e8f0/4a5568?text=??') {
        (e.target as HTMLImageElement).src = 'https://placehold.co/48x48/e2e8f0/4a5568?text=??';
      }
    }} 
  />
);

// --- Type Definitions ---
interface Testimonial {
    id: string;
    content: string;
    name: string;
    role: string;
    image: string;
}

// --- Data Layer ---
const testimonialsData: Testimonial[] = [
  {
    id: 'testimonial-1',
    content: "Maddheshiya Studio captured our wedding beautifully. The team was professional, and the drone footage gave us perspectives we never imagined possible!",
    name: "Priya Sharma",
    role: "Wedding Client",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887"
  },
  {
    id: 'testimonial-2',
    content: "Renting out my camera equipment through Maddheshiya Studio has been incredible. I earn passive income on gear that would otherwise sit unused.",
    name: "Rahul Mehra",
    role: "Equipment Owner",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887"
  },
  {
    id: 'testimonial-3',
    content: "As an e-commerce business owner, their product photography services have significantly increased our conversion rates. Highly recommend!",
    name: "Anjali Patel",
    role: "Business Owner",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961"
  },
  {
    id: 'testimonial-4',
    content: "The one-on-one photography workshop was fantastic. I learned so much about composition and lighting in just a few hours. A great investment!",
    name: "Sameer Verma",
    role: "Workshop Attendee",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1887"
  }
];

// --- Reusable Testimonial Card Component ---
const TestimonialCard = ({ content, name, role, image }: Testimonial) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg h-full flex flex-col">
      <div className="flex justify-between mb-4">
        <Quote className="h-8 w-8 text-indigo-500/20" />
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          ))}
        </div>
      </div>
      <p className="text-gray-600 mb-6 flex-grow">{content}</p>
      <div className="flex items-center gap-4">
        <Image src={image} alt={name} className="w-12 h-12 rounded-full object-cover" />
        <div>
          <h4 className="font-bold text-gray-800">{name}</h4>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
};

// --- Main Testimonials Section ---
const Testimonials = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.9;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const checkScrollable = () => {
        const hasOverflow = container.scrollWidth > container.clientWidth;
        setIsScrollable(hasOverflow);
        if(hasOverflow) {
            handleScroll();
        } else {
            setShowLeftArrow(false);
            setShowRightArrow(false);
        }
      };
      
      const resizeObserver = new ResizeObserver(checkScrollable);
      resizeObserver.observe(container);
      
      container.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => {
        resizeObserver.disconnect();
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  return (
    <section id="testimonials" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">What Our Clients Say</h2>
          <p className="text-lg text-gray-600">
            Don&apos;t just take our word for it. Here&apos;s what people are saying about us.
          </p>
        </div>

        <div className="relative">
          {isScrollable && (
            <>
              <button
                onClick={() => scroll('left')}
                className={`absolute top-1/2 -left-4 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all hidden lg:flex items-center justify-center ${showLeftArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={() => scroll('right')}
                className={`absolute top-1/2 -right-4 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all hidden lg:flex items-center justify-center ${showRightArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </>
          )}

          <div
            ref={scrollContainerRef}
            className="flex gap-8 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 -mx-4 px-4"
          >
            {testimonialsData.map((testimonial) => (
              <div key={testimonial.id} className="snap-center w-[85vw] md:w-[400px] lg:w-1/3 flex-shrink-0">
                <TestimonialCard {...testimonial} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </section>
  );
};

export default Testimonials;


import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialCard = ({ 
  content, 
  name, 
  role, 
  image 
}: { 
  content: string, 
  name: string, 
  role: string, 
  image: string 
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between mb-4">
        <Quote className="h-8 w-8 text-forge-purple/20" />
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          ))}
        </div>
      </div>
      <p className="text-gray-600 mb-6">{content}</p>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="font-bold text-forge-dark">{name}</h4>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      content: "Maddheshiya Studio captured our wedding beautifully. The team was professional, and the drone footage gave us perspectives we never imagined possible!",
      name: "Priya Sharma",
      role: "Wedding Client",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887"
    },
    {
      content: "Renting out my camera equipment through Maddheshiya Studio has been incredible. I earn passive income on gear that would otherwise sit unused.",
      name: "Rahul Mehra",
      role: "Equipment Owner",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887"
    },
    {
      content: "As an e-commerce business owner, their product photography services have significantly increased our conversion rates. Highly recommend!",
      name: "Anjali Patel",
      role: "Business Owner",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961"
    }
  ];

  return (
    <section id="testimonials" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-forge-dark mb-4">What Our Clients Say</h2>
          <p className="text-lg text-gray-600">
            Don&apos;t just take our word for it. Here&apos;s what people are saying about Maddheshiya Studio Studio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index}
              content={testimonial.content}
              name={testimonial.name}
              role={testimonial.role}
              image={testimonial.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

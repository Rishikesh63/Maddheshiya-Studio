import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';


const GearCard = ({ image, name, category, price }: { image: string, name: string, category: string, price: string }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-forge-dark/80 text-white text-xs px-2 py-1 rounded-full">
          {category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-forge-dark">{name}</h3>
        <div className="flex justify-between items-center mt-2">
          <span className="text-forge-purple font-medium">{price}</span>
          <Button variant="ghost" className="p-0 h-auto text-forge-darkpurple hover:text-forge-purple">
            Rent <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const Gear = () => {
  const gearItems = [
    {
      image: "https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?q=80&w=2487",
      name: "Sony Alpha A7III",
      category: "Camera",
      price: "₹2,000/day"
    },
    {
      image: "https://images.unsplash.com/photo-1516724562728-afc824a36e84?q=80&w=2071",
      name: "Canon EF 24-70mm f/2.8",
      category: "Lens",
      price: "₹1,000/day"
    },
    {
      image: "https://images.unsplash.com/photo-1517497052582-25e6fe8ec001?q=80&w=1935",
      name: "DJI Mavic 3 Pro",
      category: "Drone",
      price: "₹2,500/day"
    },
    {
      image: "https://images.unsplash.com/photo-1519683109079-d5f539e1542f?q=80&w=2070",
      name: "Godox Lighting Kit",
      category: "Lighting",
      price: "₹1,200/day"
    },
  ];

  return (
    <section id="gear" className="py-20 bg-forge-light/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-forge-dark mb-4">Rent Professional Gear</h2>
          <p className="text-lg text-gray-600">
            Access high-end photography and videography equipment without the investment. Rent what you need, when you need it.
          </p>
        </div>

        <div className="flex overflow-x-auto pb-8 space-x-6 snap-x snap-mandatory no-scrollbar">
          {gearItems.map((item, index) => (
            <div key={index} className="min-w-[250px] sm:min-w-[280px] snap-center text-black">
              <GearCard 
                image={item.image}
                name={item.name}
                category={item.category}
                price={item.price}
              />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" className="bg-forge-purple hover:bg-forge-darkpurple text-white">
            View All Equipment
          </Button>
        </div>

        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-950 mb-4">Have gear? List it and earn</h3>
              <p className="text-gray-600 mb-6">
                Own photography or videography equipment that sits idle? List it on our platform and earn passive income when others rent your gear.
              </p>
              <Button className="bg-forge-purple hover:bg-forge-darkpurple text-white">
                List Your Equipment
              </Button>
            </div>
            <div className="rounded-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1542567455-cd733f23fbb1?q=80&w=2070" 
                alt="Camera Equipment" 
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gear;

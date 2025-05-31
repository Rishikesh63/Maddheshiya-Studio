
import React from 'react';
import { Camera, Video, Palette, Plane, Users, Sparkles, Shirt } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

const ServiceCard = ({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="p-6 bg-amber-300 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] group">
      <div className="w-12 h-12 rounded-xl bg-forge-purple/10 flex items-center justify-center mb-4 group-hover:bg-forge-purple/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-forge-dark mb-2 text-black">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex">

        <Button
          variant="outline"
          className="text-forge-purple border-forge-purple hover:bg-forge-purple/10 px-4 py-2 text-sm"
        >
          Explore
        </Button>
      </div>
    </div>
  );
};


const Services = () => {
  const services = [
    {
      icon: <Camera className="w-6 h-6 text-forge-purple" />,
      title: "Professional Photography",
      description: "High-quality photography for weddings, events, products, and more."
    },
    {
      icon: <Video className="w-6 h-6 text-forge-purple" />,
      title: "Videography",
      description: "Cinematic videos for special moments, promotional content, and documentaries."
    },
    {
      icon: <Palette className="w-6 h-6 text-forge-purple" />,
      title: "AI-Powered Editing",
      description: "Cutting-edge tools that automate and enhance your photo and video editing process."
    },
    {
      icon: <Shirt className="w-6 h-6 text-forge-purple" />,
      title: "Custom T-Shirt Printing",
      description: "High-quality custom t-shirt printing with your designs or our professional designs."
    },
    {
      icon: <Plane className="w-6 h-6 text-forge-purple" />,
      title: "Drone Footage",
      description: "Breathtaking aerial perspectives for unique views of your events and properties."
    },
    {
      icon: <Users className="w-6 h-6 text-forge-purple" />,
      title: "Virtual Reality Tours",
      description: "Immersive VR experiences for weddings, real estate, and special events."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-forge-purple" />,
      title: "E-commerce Photography",
      description: "Specialized product photography to boost your online store's conversion rates."
    }
  ];

  return (
    <section id="services" className="py-20 bg-forge-light/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-forge-dark mb-4">Our Creative Services</h2>
          <p className="text-lg text-gray-600">
            From professional photoshoots to custom t-shirt printing, we provide everything you need to capture, create, and wear stunning visual content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard 
              key={index} 
              icon={service.icon} 
              title={service.title} 
              description={service.description} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

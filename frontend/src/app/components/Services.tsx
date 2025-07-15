"use client";

import React from 'react';
import {
  Camera,
  Video,
  Palette,
  Plane,
  Sparkles,
  Shirt,
  IdCard,
  BookOpen,
  PictureInPicture,
  Bot,
  ArrowRight
} from 'lucide-react';

// --- Mock Next.js Components for Demonstration ---
// In a real Next.js app, you would import these from 'next/navigation' and 'next/link'.
const useRouter = () => ({
  push: (path: string) => console.log(`Navigating to: ${path}`),
});

const Link = ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: any; }) => (
    <a href={href} {...props}>{children}</a>
);

// --- Type Definitions ---
interface Service {
  icon: React.ReactElement;
  title: string;
  description: string;
  slug: string;
}

// --- Data Layer (Moved outside the component) ---
// This prevents the array from being redeclared on every render.
const servicesData: Service[] = [
  {
    icon: <Camera className="w-6 h-6 text-indigo-600" />,
    title: "Professional Photography",
    description: "High-quality photography for weddings, events, products, and more.",
    slug: '/photography',
  },
  {
    icon: <Video className="w-6 h-6 text-indigo-600" />,
    title: "Videography",
    description: "Cinematic videos for special moments, promotional content, and documentaries.",
    slug: '/videography',
  },
  {
    icon: <Palette className="w-6 h-6 text-indigo-600" />,
    title: "AI-Powered Editing",
    description: "Cutting-edge tools that automate and enhance your photo and video editing process.",
    slug: '/ai-editing',
  },
  {
    icon: <Shirt className="w-6 h-6 text-indigo-600" />,
    title: "Custom T-Shirt Printing",
    description: "High-quality custom t-shirt printing with your designs or our professional designs.",
    slug: '/tshirt-printing',
  },
  {
    icon: <Plane className="w-6 h-6 text-indigo-600" />,
    title: "Drone Footage",
    description: "Breathtaking aerial perspectives for unique views of your events and properties.",
    slug: '/drone-footage',
  },
  {
    icon: <Sparkles className="w-6 h-6 text-indigo-600" />,
    title: "E-commerce Photography",
    description: "Specialized product photography to boost your online store's conversion rates.",
    slug: '/ecommerce-photography',
  },
  {
    icon: <IdCard className="w-6 h-6 text-indigo-600" />,
    title: "ID Card Making",
    description: "Personalized ID cards for schools, offices, and events with secure design and fast turnaround.",
    slug: '/id-cards',
  },
  {
    icon: <BookOpen className="w-6 h-6 text-indigo-600" />,
    title: "Album Designing",
    description: "Professionally crafted photo albums that preserve your memories with elegance and creativity.",
    slug: '/album-design',
  },
  {
    icon: <PictureInPicture className="w-6 h-6 text-indigo-600" />,
    title: "Photo Framing",
    description: "Custom photo framing solutions to beautifully showcase your special moments.",
    slug: '/photo-framing',
  },
  {
    icon: <Bot className="w-6 h-6 text-indigo-600" />,
    title: "AI Assistant Development",
    description: "Custom AI chatbot and assistant solutions for websites, businesses, and automation workflows.",
    slug: '/ai-assistants',
  }
];

// --- Reusable Service Card Component ---
const ServiceCard = ({ icon, title, description, slug }: Service) => {
  return (
    <div className="group relative p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-indigo-300">
      <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-5 transition-colors group-hover:bg-indigo-200">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-600 mb-6">{description}</p>
      <Link href={slug} className="inline-flex items-center font-semibold text-indigo-600 group-hover:text-indigo-800 transition-colors">
        Explore
        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
};

// --- Main Services Section ---
const Services = () => {
  return (
    <section id="services" className="py-20 sm:py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Creative Services</h2>
          <p className="text-lg text-slate-600">
            From professional photoshoots to custom t-shirt printing, we provide everything you need to capture, create, and wear stunning visual content.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service) => (
            <ServiceCard
              key={service.slug} // Using a unique slug for the key is better practice
              icon={service.icon}
              title={service.title}
              description={service.description}
              slug={service.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

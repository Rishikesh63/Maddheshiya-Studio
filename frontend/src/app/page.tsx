"use client";

import { CldImage } from 'next-cloudinary';

import Navbar from "./components/Navbar";
import Hero from '@/app/components/Hero';
import Services from '@/app/components/Services';
import Testimonials from '@/app/components/Testimonials';
import Footer from '@/app/components/Footer';
import Gear from "@/app/components/Gear";
import Contact from "@/app/components/Contact";

export default function Home() {
   console.log("Cloud Name:", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME); 
  return (
    <div>
      <Navbar />
      <main>
        <Hero />

        {/* Cloudinary Image */}
        <div className="flex justify-center my-8">
          <CldImage
            src="cld-sample-5" // Replace with your uploaded public ID
            width="500"
            height="500"
            crop={{
              type: 'auto',
              source: true
            }}
            alt="Sample"
          />
        </div>

        <Services />
        <Gear />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

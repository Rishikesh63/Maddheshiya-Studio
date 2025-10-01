"use client";
import Navbar from "./components/Navbar";
import Hero from '@/app/components/Hero';
import Services from '@/app/components/Services';
import Testimonials from '@/app/components/Testimonials';
import Footer from '@/app/components/Footer';

import Contact from "@/app/components/Contact";
import PhotoGallery from '@/app/components/PhotoGallery';
import VideoGallery from "@/app/components/VideoGallery";
import CreativeServices from "@/app/components/CreativeServices";

export default function Home() {
   console.log("Cloud Name:", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME); 
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <CreativeServices />
        <PhotoGallery/>
        <VideoGallery/>
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

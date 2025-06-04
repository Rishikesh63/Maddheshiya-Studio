"use client";
import Navbar from "./components/Navbar";
import Hero from '@/app/components/Hero';
import Services from '@/app/components/Services';
import Testimonials from '@/app/components/Testimonials';
import Footer from '@/app/components/Footer';
import Gear from "@/app/components/Gear";
import Contact from "@/app/components/Contact";
import PhotoGallery from '@/app/components/PhotoGallery';
import VideoGallery from "@/app/components/VideoGallery";

export default function Home() {
   console.log("Cloud Name:", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME); 
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Gear />
        <PhotoGallery/>
        <VideoGallery/>
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

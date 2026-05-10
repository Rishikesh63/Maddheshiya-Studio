"use client";
import Navbar from "./components/Navbar";
import Hero from '@/app/components/Hero';
import Services from '@/app/components/Services';
import Footer from '@/app/components/Footer';

import Contact from "@/app/components/Contact";
import PhotoGallery from '@/app/components/PhotoGallery';
import VideoGallery from "@/app/components/VideoGallery";
import CreativeServices from "@/app/components/CreativeServices";

export default function Home() {
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <CreativeServices />
        <PhotoGallery/>
        <VideoGallery/>
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

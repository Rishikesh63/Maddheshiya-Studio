import { Metadata } from "next";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ServiceCategories from "./components/ServiceCategories";
import FeaturedPortfolio from "./components/FeaturedPortfolio";
import ProductsShowcase from "./components/ProductsShowcase";
import WhyChooseUs from "./components/WhyChooseUs";
import BehindTheScenes from "./components/BehindTheScenes";
import ReelsShowcase from "./components/ReelsShowcase";
import BookingCTA from "./components/BookingCTA";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Maddheshiya Studio | Premium Wedding Photography & Videography",
  description:
    "Maddheshiya Studio — Premium wedding photography, cinematic films, drone coverage, and creative services in Kanpur, Lucknow & across India.",
};

export default function Home() {
  return (
    <div className="bg-[var(--black)]">
      <Navbar />
      <main>
        <HeroSection />
        <ServiceCategories />
        <FeaturedPortfolio />
        <ProductsShowcase />
        <WhyChooseUs />
        <BehindTheScenes />
        <ReelsShowcase />
        <BookingCTA />
      </main>
      <Footer />
    </div>
  );
}

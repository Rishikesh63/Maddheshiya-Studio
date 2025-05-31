import Navbar from "./components/Navbar";
import Hero from '@/app/components/Hero';
import Services from '@/app/components/Services';
import Testimonials from '@/app/components/Testimonials';
import Footer from '@/app/components/Footer';
import Gear from "@/app/components/Gear";
import Contact from "@/app/components/Contact";
export default function Home() {
  return (

    <div >
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Gear />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

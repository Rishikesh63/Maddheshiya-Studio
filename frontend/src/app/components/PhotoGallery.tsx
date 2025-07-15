"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ArrowRight, ArrowLeft, X, Camera } from "lucide-react";

// --- Type Definitions ---
interface Photo {
  id: string;
  publicId?: string;
  url: string;
  title: string;
  altText: string;
  category: string;
}

// --- Data Layer ---
// The data now includes both `publicId` for Cloudinary and `url` for fallbacks.
const photoMedia: Photo[] = [
  {
    id: "wedding_cermony_jvbjur",
    publicId: "wedding_cermony_jvbjur", // Cloudinary publicId
    url: "https://res.cloudinary.com/dxwgmuoht/image/upload/v1752604990/wedding_cermony_jvbjur.jpg",
    title: "Candid Wedding Moment",
    altText: "A candid, joyful moment at an Indian wedding.",
    category: "Candid Wedding",
  },
  {
    id: "pexels-artosuraj-30706029_dotbjq",
    publicId: "pexels-artosuraj-30706029_dotbjq", // Cloudinary publicId
    url: "https://res.cloudinary.com/dxwgmuoht/image/upload/v1752604991/pexels-artosuraj-30706029_dotbjq.jpg",
    title: "Haldi Ceremony",
    altText: "A happy couple during their Haldi ceremony.",
    category: "Ceremony",
  },
  {
    id: "ethinic_photography_pr3lfn",
    publicId: "ethinic_photography_pr3lfn", // Cloudinary publicId
    url: "https://res.cloudinary.com/dxwgmuoht/image/upload/v1752606238/ethinic_photography_pr3lfn.jpg",
    title: "Ethnic Fashion",
    altText: "A model in a traditional Indian saree.",
    category: "Fashion",
  },
  {
    id: "architecture-taj-mahal",
    // This entry has no publicId, so it will use the URL as a fallback
    url: "https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "The Taj Mahal",
    altText: "A beautiful architectural shot of the Taj Mahal.",
    category: "Architecture",
  },
  {
    id: "Product-photography_dzobxp",
    publicId: "Product-photography_dzobxp", // Cloudinary publicId
    url: "https://res.cloudinary.com/dxwgmuoht/image/upload/v1752606005/Product-photography_dzobxp.jpg",
    title: "Product Photography",
    altText: "A professional shot of a vintage camera.",
    category: "E-commerce",
  },
  {
    id: "indian-food-photography",
    // This entry also uses the URL fallback
    url: "https://images.pexels.com/photos/12737921/pexels-photo-12737921.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "Indian Thali",
    altText: "A top-down shot of a delicious Indian food thali.",
    category: "Food Photography",
  },
];


// --- Universal Image Component (Corrected) ---
// This component now correctly uses the provided URL directly.
const UniversalImage = ({ photo, className, ...props }: { photo: Photo; className: string; [key: string]: any; }) => {
  const placeholderImg = 'https://placehold.co/600x800/e2e8f0/4a5568?text=Image+Not+Found';

  // Use the `url` property as the primary source, as it contains the full Cloudinary link.
  const imageUrl = photo.url || placeholderImg;

  return (
    <img
      src={imageUrl}
      alt={photo.altText}
      className={className}
      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement;
        target.onerror = null; // prevents looping
        target.src = placeholderImg;
      }}
      {...props}
    />
  );
};


// --- Reusable UI Components ---

const Lightbox = ({ photo, onClose, onNext, onPrev }: { photo: Photo; onClose: () => void; onNext: () => void; onPrev: () => void; }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-50" aria-label="Close image view">
        <X size={32} />
      </button>
      <div className="relative w-full h-full max-w-5xl max-h-[90vh] flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <UniversalImage photo={photo} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"/>
        <div className="text-center mt-4 text-white">
          <h3 className="text-xl font-bold">{photo.title}</h3>
          <p className="text-white/80">{photo.category}</p>
        </div>
      </div>
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white rounded-full transition-all" aria-label="Previous image">
        <ArrowLeft size={28} />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white rounded-full transition-all" aria-label="Next image">
        <ArrowRight size={28} />
      </button>
    </div>
  );
};

const PhotoCard = ({ photo, onClick }: { photo: Photo; onClick: () => void; }) => (
  <div className="relative bg-white shadow-lg rounded-2xl overflow-hidden w-[300px] flex-shrink-0 group cursor-pointer" onClick={onClick}>
    <div className="w-full h-[400px] overflow-hidden">
      <UniversalImage photo={photo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"/>
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end">
      <div className="p-4 text-white">
        <h3 className="font-bold text-lg">{photo.title}</h3>
        <p className="text-sm text-white/80 flex items-center gap-1.5"><Camera size={14}/> {photo.category}</p>
      </div>
    </div>
  </div>
);


// --- Main Section Component ---

const App = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleNext = useCallback(() => {
    setSelectedImageIndex((prevIndex) => {
      if (prevIndex === null) return 0;
      return (prevIndex + 1) % photoMedia.length;
    });
  }, []);

  const handlePrev = useCallback(() => {
    setSelectedImageIndex((prevIndex) => {
      if (prevIndex === null) return 0;
      return (prevIndex - 1 + photoMedia.length) % photoMedia.length;
    });
  }, []);

  const handleOpen = (index: number) => setSelectedImageIndex(index);
  const handleClose = () => setSelectedImageIndex(null);

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-in-out; }
      `}</style>
      <section id="photo-gallery" className="py-20 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Photography Portfolio
            </h2>
            <p className="text-lg text-gray-600">
              A curated album of our finest work, from weddings and events to professional e-commerce and fashion shoots.
            </p>
          </div>
          <div className="overflow-x-auto no-scrollbar pb-6">
            <div className="flex gap-6 px-4 md:px-6 lg:px-8 w-max">
              {photoMedia.map((media, index: number) => (
                <PhotoCard
                  key={media.id}
                  photo={media}
                  onClick={() => handleOpen(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      {selectedImageIndex !== null && (
        <Lightbox
          photo={photoMedia[selectedImageIndex]}
          onClose={handleClose}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </>
  );
};

export default App;

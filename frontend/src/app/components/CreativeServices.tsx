"use client";

/*
  Services 3D Gallery React Component
  - Place this file in your components folder (e.g., components/Services3DGallery.tsx)
  - Requires Tailwind for styling (used in this project)
  - Uses the <model-viewer> web component for rotatable 3D preview (glTF/GLB).

  Two ways to include model-viewer:
  1) CDN (quick): add the script tag to your app root (e.g., in pages/_document.js or app/layout.tsx):
     <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>

  2) NPM (recommended for production):
     npm install @google/model-viewer
     then import (client-side only):
     import '@google/model-viewer';

  The component gracefully falls back to an image if a 3D model is not provided.
*/

import React, { useState, useEffect } from "react";
import { Camera, X } from "lucide-react";
import '@google/model-viewer';

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string; // fallback image
  modelUrl?: string; // optional glb/gltf file URL for 3D rotatable view
  price?: string;
}

const services: ServiceItem[] = [
  {
    id: "tshirt_print",
    title: "Custom T-Shirt Printing",
    description: "Premium DTG & screen-printing for custom designs and bulk orders.",
    thumbnail: "https://images.pexels.com/photos/994517/pexels-photo-994517.jpeg",
    modelUrl: "https://modelviewer.dev/shared-assets/models/ToyCar.glb", // demo glb (replace with your model)
    price: "From ₹299",
  },
  {
    id: "id_card",
    title: "ID Card Making",
    description: "Lamination, PVC cards, custom designs and fast turnaround.",
    thumbnail: "https://images.pexels.com/photos/3184299/pexels-photo-3184299.jpeg",
    // no model for this one - will fallback to image
    price: "From ₹49",
  },
  {
    id: "photo_framing",
    title: "Photo Framing",
    description: "Custom frames, mattes, and ready-to-hang options for every style.",
    thumbnail: "https://images.pexels.com/photos/1053687/pexels-photo-1053687.jpeg",
    modelUrl: "https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb",
    price: "From ₹499",
  },
  {
    id: "album_design",
    title: "Album Designing",
    description: "Hardbound and softbound albums with premium printing options.",
    thumbnail: "https://images.pexels.com/photos/94271/pexels-photo-94271.jpeg",
    modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    price: "From ₹899",
  },
];

const FallbackImage = ({ src, alt }: { src: string; alt: string }) => (
  // Simple image with object-fit and error fallback handled via onError
  <img
    src={src}
    alt={alt}
    className="w-full h-64 object-cover rounded-lg shadow"
    onError={(e) => {
      const t = e.currentTarget as HTMLImageElement;
      t.onerror = null;
      t.src = "https://placehold.co/600x400?text=No+Preview";
    }}
  />
);

const CreativeServices: React.FC = () => {
  const [active, setActive] = useState<ServiceItem | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <section id="services" className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Our Services & Products</h2>
          <p className="text-gray-600 mt-2">Custom T-Shirt Printing, ID Cards, Photo Framing, Album Designing and more — preview rotatable product samples below.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <article key={s.id} className="bg-white rounded-2xl shadow p-4 flex flex-col">
              <div className="relative">
                {s.modelUrl ? (
                  // model-viewer element (3D rotatable)
                  <div className="rounded-lg overflow-hidden bg-gray-100">
                    {/*
                      model-viewer supports attributes: camera-controls, auto-rotate, ar, exposure, poster
                      Keep it accessible using title/aria-label.
                    */}
                    <model-viewer
                      src={s.modelUrl}
                      alt={s.title}
                      ar
                      camera-controls
                      autoplay
                      disable-zoom
                      auto-rotate={autoRotate}
                      style={{ width: "100%", height: "260px" }}
                    >
                      {/* Fallback slot content used when model-viewer is not available */}
                      <FallbackImage src={s.thumbnail} alt={s.title} />
                    </model-viewer>
                  </div>
                ) : (
                  <FallbackImage src={s.thumbnail} alt={s.title} />
                )}

                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => setActive(s)}
                    className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow hover:scale-105 transition-transform"
                    aria-label={`Open ${s.title}`}
                  >
                    <Camera size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-lg">{s.title}</h3>
                <p className="text-sm text-gray-600 mt-1 flex-1">{s.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-800">{s.price}</span>
                  <button
                    onClick={() => setActive(s)}
                    className="text-sm px-3 py-1 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
                  >
                    View
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Lightbox / Detail Modal */}
        {active && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60" onClick={() => setActive(null)} />
            <div className="relative max-w-4xl w-full bg-white rounded-2xl shadow-lg overflow-hidden z-50">
              <div className="flex items-start justify-between p-4 border-b">
                <div>
                  <h3 className="text-xl font-bold">{active.title}</h3>
                  <p className="text-sm text-gray-600">{active.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-700">Auto-rotate</label>
                  <input type="checkbox" checked={autoRotate} onChange={(e) => setAutoRotate(e.target.checked)} className="w-4 h-4" />
                  <button onClick={() => setActive(null)} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="w-full h-96 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                  {active.modelUrl ? (
                    <model-viewer
                      src={active.modelUrl}
                      alt={active.title}
                      ar
                      camera-controls
                      auto-rotate={autoRotate}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <FallbackImage src={active.thumbnail} alt={active.title} />
                    </model-viewer>
                  ) : (
                    <FallbackImage src={active.thumbnail} alt={active.title} />
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <h4 className="font-semibold">Price</h4>
                    <p className="text-gray-800 mt-1">{active.price}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Details</h4>
                    <p className="text-gray-600 mt-1">We deliver high-quality results with fast turnaround, options for bulk orders, and customization. Contact us for a quote and sample previews.</p>
                  </div>

                  <div className="mt-auto flex gap-3">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">Request Quote</button>
                    <button className="px-4 py-2 border rounded-lg">Contact</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CreativeServices;

"use client";

import { CldImage } from "next-cloudinary";
import React from "react";
import { ArrowRight } from "lucide-react";

const photoMedia = [
  {
    type: "image",
    publicId: "8x10_ndqnuu",
  },
  {
    type: "image",
    publicId: "Premium_Vector___Photography_logo_design_crpxuz",
  },
  // Add more images as needed
];

const PhotoGallery = () => {
  return (
    <section id="photo-gallery" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-forge-dark mb-4">
            Photography Portfolio
          </h2>
          <p className="text-lg text-gray-600">Explore our photography collection.</p>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <div className="flex gap-6 px-2 md:px-4 lg:px-6 w-max">
            {photoMedia.map((media, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-2xl overflow-hidden min-w-[300px] max-w-xs flex-shrink-0 hover:scale-105 transition-transform duration-300"
              >
                <div className="w-full h-[400px] overflow-hidden">
                  <CldImage
                    src={media.publicId}
                    width={300}
                    height={300}
                    crop="fill"
                    alt="Cloudinary image"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 text-center">
                  <p className="text-gray-700 text-sm">Image: {media.publicId}</p>
                  <button className="mt-2 inline-flex items-center text-blue-600 hover:underline text-sm">
                    View Full <ArrowRight className="ml-1 w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhotoGallery;

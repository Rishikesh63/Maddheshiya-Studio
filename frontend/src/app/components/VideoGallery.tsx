"use client";

import { CldVideoPlayer } from "next-cloudinary";
import React from "react";
import { ArrowRight } from "lucide-react";

const videoMedia = [
  {
    type: "video",
    publicId: "Ring_Ceremony_c7e9xh",
  },
  {
    type:"video",
    publicId: "Wedding_fyh6ak",
  }
  // Add more videos as needed
];

const VideoGallery = () => {
  return (
    <section id="video-gallery" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-forge-dark mb-4">
            Videography Highlights
          </h2>
          <p className="text-lg text-gray-600">Watch our video productions and ceremonies.</p>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <div className="flex gap-6 px-2 md:px-4 lg:px-6 w-max">
            {videoMedia.map((media, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-2xl overflow-hidden min-w-[400px] max-w-xs flex-shrink-0 hover:scale-105 transition-transform duration-300"
              >
                <div className="w-full h-[500px] relative object-covers">
                  <CldVideoPlayer
                    src={media.publicId}
                    controls
                    className="w-full h-full bottom-0 left-0 absolute object-cover rounded-t-2xl"
                  />
                </div>

                <div className="p-4 text-center">
                  <p className="text-gray-700 text-sm">Video: Ring Ceremony</p>
                  <button className="mt-2 inline-flex items-center text-blue-600 hover:underline text-sm">
                    Watch Full <ArrowRight className="ml-1 w-4 h-4" />
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

export default VideoGallery;

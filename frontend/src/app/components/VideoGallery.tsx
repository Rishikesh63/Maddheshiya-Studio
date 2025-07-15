"use client";

import React, { useRef, useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";


const videoMedia = [
  {
    type: "video",
    publicId: "Ring_Ceremony_c7e9xh",
    title: "Ring Ceremony",
  },
  {
    type: "video",
    publicId: "Wedding_fyh6ak",
    title: "Wedding Highlights",
  },
  {
    type: "video",
    publicId: "Preewedding_u7h0yv",
    title: "Prewedding Shoot",
  },
  {
    type:"video",
    publicId:"Indian_Wedding_Video_Link_Provided_jfpvjz",
    title:"Drone Footage",
  }
 
];


const VideoCard = ({ media }: { media: { publicId: string, title: string } }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);


  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
 
  const videoUrl = cloudName ? `https://res.cloudinary.com/${cloudName}/video/upload/f_auto,q_auto/${media.publicId}` : "";
  const posterUrl = cloudName ? `https://res.cloudinary.com/${cloudName}/video/upload/so_0/f_auto,q_auto/${media.publicId}.jpg` : "";

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleVideoPause = () => setIsPlaying(false);
    const handleVideoPlay = () => setIsPlaying(true);

    videoElement.addEventListener('pause', handleVideoPause);
    videoElement.addEventListener('play', handleVideoPlay);

    return () => {
      videoElement.removeEventListener('pause', handleVideoPause);
      videoElement.removeEventListener('play', handleVideoPlay);
    };
  }, []);


  if (!cloudName) {
    return (
        <div className="snap-center bg-white shadow-lg rounded-2xl overflow-hidden w-[90vw] md:w-[450px] flex-shrink-0 flex items-center justify-center p-4" style={{ aspectRatio: '16 / 9' }}>
            <p className="text-red-500 text-center">Cloudinary cloud name is not configured.</p>
        </div>
    );
  }

  return (
    <div
      key={media.publicId}
      className="snap-center bg-white shadow-lg rounded-2xl overflow-hidden w-[90vw] md:w-[450px] flex-shrink-0"
    >
      <div className="bg-black relative">
        <video
          ref={videoRef}
          width="100%"
          controls
          poster={posterUrl}
          style={{ aspectRatio: '16 / 9', objectFit: 'contain' }}
          preload="metadata"
          playsInline 
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Custom Play Button Overlay */}
        {!isPlaying && (
          <div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black bg-opacity-20"
            onClick={handlePlay}
          >
            <PlayCircle className="w-20 h-20 text-white/80 hover:text-white transition-colors" />
          </div>
        )}
      </div>

      <div className="p-5 text-center">
        <p className="font-semibold text-gray-800">{media.title}</p>
        <button className="mt-2 inline-flex items-center text-blue-600 hover:underline text-sm font-medium">
          Watch Full <ArrowRight className="ml-1 w-4 h-4" />
        </button>
      </div>
    </div>
  );
};


const VideoGallery = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 1);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const checkScrollable = () => {
        const isNowScrollable = container.scrollWidth > container.clientWidth;
        setIsScrollable(isNowScrollable);
        if (isNowScrollable) {
            handleScroll();
        }
      };
      
      const observer = new MutationObserver(checkScrollable);
      observer.observe(container, { childList: true, subtree: true });
      
      container.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', checkScrollable);

      return () => {
        observer.disconnect();
        container.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', checkScrollable);
      };
    }
  }, [videoMedia]);


  return (
    <section id="video-gallery" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Videography Highlights
          </h2>
          <p className="text-lg text-gray-600">
            Watch our video productions and ceremonies.
          </p>
        </div>

        <div className="relative">
          {isScrollable && showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute top-1/2 left-0 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-opacity hidden md:block"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar"
          >
            {videoMedia.map((media) => (
              <VideoCard key={media.publicId} media={media} />
            ))}
          </div>

          {isScrollable && showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute top-1/2 right-0 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-opacity hidden md:block"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoGallery;

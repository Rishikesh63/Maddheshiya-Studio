"use client";

import React, { useState, useCallback } from 'react';
import { Video, Upload, X, CheckCircle, Film, Camera, Airplay, Zap, Package } from 'lucide-react';

// --- Mock UI Components for Demonstration (with improved types) ---
const Button = ({ children, className, ...props }: React.ComponentProps<'button'>) => (
    <button className={`inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${className}`} {...props}>{children}</button>
);
const Card = ({ children, className, ...props }: React.ComponentProps<'div'>) => (
    <div className={`rounded-xl border bg-white text-card-foreground shadow-sm ${className}`} {...props}>{children}</div>
);
const CardContent = ({ children, className, ...props }: React.ComponentProps<'div'>) => (
    <div className={`p-6 ${className}`} {...props}>{children}</div>
);
const CardHeader = ({ children, className, ...props }: React.ComponentProps<'div'>) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>{children}</div>
);
const CardTitle = ({ children, className, ...props }: React.ComponentProps<'h3'>) => (
    <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>{children}</h3>
);
const Input = ({ className, ...props }: React.ComponentProps<'input'>) => (
    <input className={`flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm ${className}`} {...props} />
);

// --- Type Definitions ---
interface PricingItem {
  icon: React.ReactElement;
  title: string;
  price: string;
}
interface UploadedFile {
  name: string;
  url: string;
  type: string;
}

// --- Data Layer ---
const includedFeatures = [
  "Wedding Films", "Corporate Videos", "Promotional Content", 
  "Documentary Style", "Live Event Recording"
];

const eventTypes: PricingItem[] = [
  { icon: <Package size={24} className="text-indigo-500" />, title: 'Wedding Film', price: '₹30,000' },
  { icon: <Package size={24} className="text-indigo-500" />, title: 'Tilak Ceremony', price: '₹20,000' },
  { icon: <Package size={24} className="text-indigo-500" />, title: 'Engagement Shoot', price: '₹25,000' },
  { icon: <Package size={24} className="text-indigo-500" />, title: 'Corporate Event', price: '₹35,000' },
];

const cameraTypes: PricingItem[] = [
  { icon: <Camera size={24} className="text-indigo-500" />, title: 'Canon DSLR', price: 'Included' },
  { icon: <Camera size={24} className="text-indigo-500" />, title: 'Sony Mirrorless', price: '+ ₹5,000' },
  { icon: <Airplay size={24} className="text-indigo-500" />, title: 'Drone Footage', price: '+ ₹8,000' },
  { icon: <Zap size={24} className="text-indigo-500" />, title: 'Crane Shot', price: '+ ₹10,000' },
];

// --- Reusable Sub-components ---
const FeatureListItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-center gap-3">
    <CheckCircle className="w-5 h-5 text-green-500" />
    <span className="text-slate-700">{children}</span>
  </li>
);

const PricingCard = ({ icon, title, price }: PricingItem) => (
  <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
    <CardHeader>
      <div className="flex items-center gap-4">
        <div className="bg-indigo-100 p-3 rounded-lg">{icon}</div>
        <CardTitle className="text-slate-800">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-indigo-600 font-semibold text-lg">{price}</p>
    </CardContent>
  </Card>
);

const VideoPreview = ({ file, onRemove }: { file: UploadedFile; onRemove: () => void; }) => (
    <div className="relative group bg-slate-100 rounded-lg overflow-hidden">
        <video src={file.url} controls className="w-full h-48 object-cover" />
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-xs truncate">
            {file.name}
        </div>
        <button
            onClick={onRemove}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove video"
        >
            <X className="w-4 h-4" />
        </button>
    </div>
);

// --- Main Videography Page Component ---
const VideographyPage = () => {
  const [uploadedVideos, setUploadedVideos] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback((files: FileList | null) => {
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('video/')) {
          const reader = new FileReader();
          reader.onload = (e: ProgressEvent<FileReader>) => {
            const readerTarget = e.target;
            if (readerTarget?.result) {
              setUploadedVideos(prev => [...prev, {
                name: file.name,
                url: readerTarget.result as string,
                type: file.type
              }]);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }, []);

  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, action: 'enter' | 'leave' | 'over' | 'drop') => {
    e.preventDefault();
    e.stopPropagation();
    if (action === 'enter' || action === 'over') setIsDragging(true);
    if (action === 'leave' || action === 'drop') setIsDragging(false);
    if (action === 'drop') handleFileChange(e.dataTransfer.files);
  };

  const removeVideo = (index: number) => {
    setUploadedVideos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Video className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Videography Services</h1>
                  <p className="text-lg text-slate-600 mt-1">Cinematic videos for weddings, events, and more.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Service Details</h3>
                  <p className="text-slate-600 mb-6">
                    Create stunning visual stories with our professional videography services. From wedding films to corporate videos, we bring your vision to life with cinematic quality.
                  </p>
                  <p className="text-lg font-semibold text-indigo-600 mb-6">Starting from ₹20,000</p>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2">Book This Service</Button>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">What&apos;s Included</h3>
                  <ul className="space-y-3">
                    {includedFeatures.map(feature => <FeatureListItem key={feature}>{feature}</FeatureListItem>)}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Event Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {eventTypes.map((item) => <PricingCard key={item.title} {...item} />)}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Add-ons & Upgrades</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {cameraTypes.map((item) => <PricingCard key={item.title} {...item} />)}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-slate-900">Video Portfolio</CardTitle>
              <p className="text-slate-600">Upload and showcase your videography work to clients.</p>
            </CardHeader>
            <CardContent>
              <div 
                onDragEnter={(e) => handleDragEvents(e, 'enter')}
                onDragLeave={(e) => handleDragEvents(e, 'leave')}
                onDragOver={(e) => handleDragEvents(e, 'over')}
                onDrop={(e) => handleDragEvents(e, 'drop')}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300 ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-100'}`}
              >
                <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                <label htmlFor="video-upload" className="font-semibold text-indigo-600 cursor-pointer">
                  Choose files
                  <Input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e.target.files)}
                    className="hidden"
                  />
                </label>
                <p className="text-slate-500 text-sm mt-1">or drag and drop</p>
              </div>

              {uploadedVideos.length > 0 && (
                <div className="mt-8">
                    <h3 className="font-semibold mb-4">Uploaded Videos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {uploadedVideos.map((file, index) => (
                            <VideoPreview key={index} file={file} onRemove={() => removeVideo(index)} />
                        ))}
                    </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VideographyPage;

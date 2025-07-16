"use client";

import React, { useState, useCallback } from 'react';
import { Plane, Upload, X, CheckCircle, Film, Map, Building } from 'lucide-react';

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
interface FeatureItem {
  icon: React.ReactElement;
  title: string;
  description: string;
}
interface UploadedFile {
  name: string;
  url: string;
  type: string;
}

// --- Data Layer ---
const includedFeatures = [
  "Aerial Photography & Videography", "4K High-Resolution Recording", "Real Estate Virtual Tours", 
  "Event & Wedding Coverage", "Construction Site Monitoring"
];

const featureHighlights: FeatureItem[] = [
    { icon: <Film size={24} className="text-indigo-500" />, title: 'Cinematic Quality', description: 'Capture breathtaking, movie-like aerial shots.' },
    { icon: <Map size={24} className="text-indigo-500" />, title: 'Unique Perspectives', description: 'Showcase properties and events from stunning new angles.' },
    { icon: <Building size={24} className="text-indigo-500" />, title: 'Versatile Applications', description: 'Perfect for real estate, construction, events, and more.' },
];

// --- Reusable Sub-components ---
const FeatureListItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-center gap-3">
    <CheckCircle className="w-5 h-5 text-green-500" />
    <span className="text-slate-700">{children}</span>
  </li>
);

const FeatureHighlightCard = ({ icon, title, description }: FeatureItem) => (
  <div className="text-center p-4">
    <div className="flex justify-center items-center mb-4">
        <div className="bg-indigo-100 p-4 rounded-full">{icon}</div>
    </div>
    <h4 className="text-lg font-semibold text-slate-800 mb-1">{title}</h4>
    <p className="text-slate-600 text-sm">{description}</p>
  </div>
);

const MediaPreview = ({ file, onRemove }: { file: UploadedFile; onRemove: () => void; }) => (
    <div className="relative group bg-slate-100 rounded-lg overflow-hidden">
        {file.type.startsWith('image/') ? (
            <img src={file.url} alt={file.name} className="w-full h-40 object-cover" />
        ) : (
            <video src={file.url} controls className="w-full h-40 object-cover" />
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
                onClick={onRemove}
                className="bg-red-500 text-white rounded-full p-2"
                aria-label="Remove media"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    </div>
);

// --- Main Drone Footage Page Component ---
const DroneFootagePage = () => {
  const [uploadedFootage, setUploadedFootage] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback((files: FileList | null) => {
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
          const reader = new FileReader();
          reader.onload = (e: ProgressEvent<FileReader>) => {
            const readerTarget = e.target;
            if (readerTarget?.result) {
              setUploadedFootage(prev => [...prev, {
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

  const removeFootage = (index: number) => {
    setUploadedFootage(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Plane className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Drone Footage</h1>
                  <p className="text-lg text-slate-600 mt-1">Breathtaking aerial views for your events and properties.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Service Details</h3>
                  <p className="text-slate-600 mb-6">Capture stunning aerial footage with our professional drone services. Perfect for real estate, events, construction monitoring, and cinematic productions.</p>
                  <p className="text-lg font-semibold text-indigo-600 mb-6">Starting from ₹8,000</p>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featureHighlights.map((item) => <FeatureHighlightCard key={item.title} {...item} />)}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-slate-900">Your Aerial Portfolio</CardTitle>
              <p className="text-slate-600">Upload and showcase your drone footage to clients.</p>
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
                <label htmlFor="footage-upload" className="font-semibold text-indigo-600 cursor-pointer">
                  Choose files
                  <Input
                    id="footage-upload"
                    type="file"
                    accept="video/*,image/*"
                    multiple
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e.target.files)}
                    className="hidden"
                  />
                </label>
                <p className="text-slate-500 text-sm mt-1">or drag and drop</p>
              </div>

              {uploadedFootage.length > 0 && (
                <div className="mt-8">
                    <h3 className="font-semibold mb-4 text-slate-800">Your Uploaded Footage</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {uploadedFootage.map((file, index) => (
                            <MediaPreview key={index} file={file} onRemove={() => removeFootage(index)} />
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

export default DroneFootagePage;

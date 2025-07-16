"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { Upload, X, CheckCircle, Frame } from 'lucide-react';

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
    <input className={`flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow ${className}`} {...props} />
);

// --- Type Definitions ---
interface UploadedFile {
  name: string;
  url: string;
  type: string;
}
interface FrameMaterial {
    name: string;
    multiplier: number;
}

// --- Data Layer ---
const includedFeatures = [
  "Custom Frame Selection", "Premium Matting", "UV Protection Glass", 
  "Multiple Sizes Available", "Professional Installation Service"
];
const frameMaterials: FrameMaterial[] = [
    { name: 'Standard Wood', multiplier: 1.0 },
    { name: 'Premium Oak', multiplier: 1.5 },
    { name: 'Modern Metal', multiplier: 1.8 },
    { name: 'Ornate Gold', multiplier: 2.5 },
];

// --- Reusable Sub-components ---
const FeatureListItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-center gap-3">
    <CheckCircle className="w-5 h-5 text-green-500" />
    <span className="text-slate-700">{children}</span>
  </li>
);

const ImagePreview = ({ file, onRemove }: { file: UploadedFile; onRemove: () => void; }) => (
    <div className="relative group bg-slate-100 rounded-lg overflow-hidden">
        <img src={file.url} alt={file.name} className="w-full h-40 object-cover" />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
                onClick={onRemove}
                className="bg-red-500 text-white rounded-full p-2"
                aria-label="Remove image"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    </div>
);

const PricingCalculator = () => {
    const [length, setLength] = useState<string>('');
    const [width, setWidth] = useState<string>('');
    const [material, setMaterial] = useState<FrameMaterial>(frameMaterials[0]);
    
    const ratePerSquareInch = 2;

    const calculatedPrice = useMemo(() => {
        const numLength = parseFloat(length);
        const numWidth = parseFloat(width);
        if (numLength > 0 && numWidth > 0) {
            return numLength * numWidth * ratePerSquareInch * material.multiplier;
        }
        return 0;
    }, [length, width, material]);

    return (
        <div className="bg-slate-100 p-6 rounded-lg border border-slate-200">
            <h4 className="text-lg font-bold text-slate-800 mb-4">Price Calculator</h4>
            <div className="space-y-4">
                <div>
                    <label className="block mb-1 text-slate-700 font-medium text-sm">Frame Size (inches)</label>
                    <div className="flex gap-2 items-center">
                        <Input type="number" placeholder="Length" value={length} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLength(e.target.value)} />
                        <span className="text-slate-500">×</span>
                        <Input type="number" placeholder="Width" value={width} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWidth(e.target.value)} />
                    </div>
                </div>
                <div>
                    <label className="block mb-1 text-slate-700 font-medium text-sm">Frame Material</label>
                    <div className="grid grid-cols-2 gap-2">
                        {frameMaterials.map(mat => (
                            <Button key={mat.name} onClick={() => setMaterial(mat)} className={`${material.name === mat.name ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-200'}`}>
                                {mat.name}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="pt-2">
                    <p className="text-xl font-bold text-indigo-600 text-center">
                        {calculatedPrice > 0 ? `Estimated Price: ₹${calculatedPrice.toFixed(2)}` : 'Enter dimensions to see price'}
                    </p>
                </div>
            </div>
        </div>
    );
};

// --- Main Photo Framing Page Component ---
const PhotoFramingPage = () => {
  const [uploadedFrames, setUploadedFrames] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback((files: FileList | null) => {
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e: ProgressEvent<FileReader>) => {
            const readerTarget = e.target;
            if (readerTarget?.result) {
              setUploadedFrames(prev => [...prev, {
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

  const removeFrame = (index: number) => {
    setUploadedFrames(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Frame className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Custom Photo Framing</h1>
                  <p className="text-lg text-slate-600 mt-1">Showcase your favorite memories in style.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Service Details</h3>
                  <p className="text-slate-600 mb-6">Professional photo framing using premium materials and expert craftsmanship. We help you display your precious memories beautifully.</p>
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

          <PricingCalculator />

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-slate-900">Upload Your Photos</CardTitle>
              <p className="text-slate-600">Upload the photos you want to get framed.</p>
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
                <label htmlFor="frame-upload" className="font-semibold text-indigo-600 cursor-pointer">
                  Choose files
                  <Input
                    id="frame-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e.target.files)}
                    className="hidden"
                  />
                </label>
                <p className="text-slate-500 text-sm mt-1">or drag and drop</p>
              </div>

              {uploadedFrames.length > 0 && (
                <div className="mt-8">
                    <h3 className="font-semibold mb-4 text-slate-800">Your Photos</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {uploadedFrames.map((file, index) => (
                            <ImagePreview key={index} file={file} onRemove={() => removeFrame(index)} />
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

export default PhotoFramingPage;

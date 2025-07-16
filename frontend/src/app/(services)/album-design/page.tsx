"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { Album, Upload, X, CheckCircle } from 'lucide-react';

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
interface AlbumOption {
    name: string;
    multiplier: number;
}

// --- Data Layer ---
const includedFeatures = [
  "Custom Layout Design", "Premium Paper Quality", "Choice of Cover",
  "Wedding & Event Albums", "Family & Travel Photo Books"
];
const albumSizes: AlbumOption[] = [
    { name: '8x12 inch', multiplier: 1.0 },
    { name: '12x15 inch', multiplier: 1.5 },
    { name: '12x18 inch', multiplier: 2.0 },
];
const coverTypes: AlbumOption[] = [
    { name: 'Hardcover', multiplier: 1.0 },
    { name: 'Leatherette', multiplier: 1.4 },
    { name: 'Acrylic', multiplier: 2.2 },
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
    const [sheetCount, setSheetCount] = useState<number>(20);
    const [size, setSize] = useState<AlbumOption>(albumSizes[0]);
    const [cover, setCover] = useState<AlbumOption>(coverTypes[0]);

    const basePrice = 1500;
    const pricePerSheet = 100;

    const totalPrice = useMemo(() => {
        const sheetsCost = basePrice + Math.max(0, sheetCount - 20) * pricePerSheet;
        return sheetsCost * size.multiplier * cover.multiplier;
    }, [sheetCount, size, cover]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl text-slate-900">Album Price Calculator</CardTitle>
                <p className="text-slate-600">Get an instant estimate for your custom album.</p>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <label className="block mb-2 text-slate-700 font-medium text-sm">Album Size</label>
                    <div className="grid grid-cols-3 gap-2">
                        {albumSizes.map(s => (
                            <Button key={s.name} onClick={() => setSize(s)} className={`${size.name === s.name ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                                {s.name}
                            </Button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block mb-2 text-slate-700 font-medium text-sm">Cover Type</label>
                    <div className="grid grid-cols-3 gap-2">
                        {coverTypes.map(c => (
                            <Button key={c.name} onClick={() => setCover(c)} className={`${cover.name === c.name ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                                {c.name}
                            </Button>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="sheet-count" className="block mb-2 text-slate-700 font-medium text-sm">Number of Sheets (Min: 20)</label>
                    <div className="flex items-center gap-4">
                        <Input
                            id="sheet-count" type="range" min={20} max={100} step={2}
                            value={sheetCount}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSheetCount(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="font-semibold text-indigo-600 w-12 text-center">{sheetCount}</span>
                    </div>
                </div>
                <div className="pt-4 border-t border-slate-200">
                    <p className="text-2xl font-bold text-indigo-600 text-center">
                        Estimated Price: ₹{totalPrice.toLocaleString('en-IN')}
                    </p>
                    <p className="text-sm text-slate-500 text-center mt-1">Base price includes 20 sheets. ₹{pricePerSheet}/sheet beyond that.</p>
                </div>
            </CardContent>
        </Card>
    );
};

// --- Main Album Design Page Component ---
const AlbumDesignPage = () => {
  const [uploadedAlbums, setUploadedAlbums] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback((files: FileList | null) => {
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e: ProgressEvent<FileReader>) => {
            const readerTarget = e.target;
            if (readerTarget?.result) {
              setUploadedAlbums(prev => [...prev, {
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

  const removeAlbum = (index: number) => {
    setUploadedAlbums(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Album className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Album & Photobook Design</h1>
                  <p className="text-lg text-slate-600 mt-1">Preserve your precious memories in a beautifully crafted album.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Service Details</h3>
                  <p className="text-slate-600 mb-6">Transform your digital memories into stunning physical albums. We create custom-designed photo books that tell your story with elegance and style.</p>
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
              <p className="text-slate-600">Provide the photos you want to include in your album.</p>
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
                <label htmlFor="album-upload" className="font-semibold text-indigo-600 cursor-pointer">
                  Choose files
                  <Input
                    id="album-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e.target.files)}
                    className="hidden"
                  />
                </label>
                <p className="text-slate-500 text-sm mt-1">or drag and drop</p>
              </div>

              {uploadedAlbums.length > 0 && (
                <div className="mt-8">
                    <h3 className="font-semibold mb-4 text-slate-800">Your Photos</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {uploadedAlbums.map((file, index) => (
                            <ImagePreview key={index} file={file} onRemove={() => removeAlbum(index)} />
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

export default AlbumDesignPage;

'use client';
import React, { useState } from 'react';
import { Image, Upload, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';

const PhotoFraming = () => {
  const [uploadedFrames, setUploadedFrames] = useState<string[]>([]);
  const [length, setLength] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);

  const ratePerSquareInch = 2; // ₹2 per sq.inch

  const handleFrameUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const readerTarget = e.target as FileReader | null;
          if (readerTarget?.result) {
            setUploadedFrames(prev => [...prev, readerTarget.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeFrame = (index: number) => {
    setUploadedFrames(prev => prev.filter((_, i) => i !== index));
  };

  const handleCalculatePrice = () => {
    if (length > 0 && width > 0) {
      const price = length * width * ratePerSquareInch;
      setCalculatedPrice(price);
    } else {
      setCalculatedPrice(0);
    }
  };

  return (
    <div className="min-h-screen bg-forge-light/30 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-forge-purple/10 flex items-center justify-center">
                  <Image className="w-8 h-8 text-forge-purple" />
                </div>
                <div>
                  <CardTitle className="text-3xl text-forge-dark">Photo Framing</CardTitle>
                  <p className="text-lg text-gray-600 mt-2">Custom photo framing services to showcase your favorite memories in style.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-forge-dark mb-4">Service Details</h3>
                  <p className="text-gray-600 mb-6">Professional photo framing services using premium materials and expert craftsmanship. We help you display your precious memories beautifully.</p>

                  <div className="mb-4">
                    <label className="block mb-1 text-gray-700 font-medium">Enter Frame Size (in inches)</label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="number"
                        placeholder="Length"
                        value={length}
                        onChange={(e) => setLength(Number(e.target.value))}
                        className="w-1/2"
                      />
                      <span className="text-gray-500">×</span>
                      <Input
                        type="number"
                        placeholder="Width"
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        className="w-1/2"
                      />
                    </div>
                    <Button
                      onClick={handleCalculatePrice}
                      className="mt-3 bg-forge-purple hover:bg-forge-darkpurple text-white"
                    >
                      Calculate Price
                    </Button>
                  </div>

                  <div className="mb-6">
                    <p className="text-lg font-semibold text-forge-purple">
                      {calculatedPrice > 0 ? `Estimated Price: ₹${calculatedPrice}` : 'Starting from ₹800'}
                    </p>
                  </div>

                  <Button className="bg-forge-purple hover:bg-forge-darkpurple text-white">
                    Book This Service
                  </Button>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-forge-dark mb-4">What&apos;s Included</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-forge-purple rounded-full"></div>
                      <span className="text-gray-700">Custom Frame Selection</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-forge-purple rounded-full"></div>
                      <span className="text-gray-700">Premium Matting</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-forge-purple rounded-full"></div>
                      <span className="text-gray-700">UV Protection Glass</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-forge-purple rounded-full"></div>
                      <span className="text-gray-700">Multiple Sizes</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-forge-purple rounded-full"></div>
                      <span className="text-gray-700">Installation Service</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-forge-dark">Framing Portfolio</CardTitle>
              <p className="text-gray-600">Upload and showcase your framing work</p>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <label htmlFor="frame-upload" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Framed Photos
                </label>
                <div className="flex items-center gap-4">
                  <Input
                    id="frame-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFrameUpload}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>

              {uploadedFrames.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {uploadedFrames.map((frame, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={frame}
                        alt={`Frame ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeFrame(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PhotoFraming;

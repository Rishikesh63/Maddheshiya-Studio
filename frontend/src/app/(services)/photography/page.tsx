'use client';
import React, { useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';

const PhotographyPage = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const readerTarget = e.target as FileReader | null;
          if (readerTarget?.result) {
            setUploadedImages(prev => [...prev, readerTarget.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-forge-light/30 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-forge-purple/10 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-forge-purple" />
                </div>
                <div>
                  <CardTitle className="text-3xl text-forge-dark">Professional Photography</CardTitle>
                  <p className="text-lg text-gray-600 mt-2">High-quality photography for weddings, events, products, and more.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-forge-dark mb-4">Service Details</h3>
                  <p className="text-gray-600 mb-6">Our professional photography services capture life&apos;s most precious moments with artistic excellence. We specialize in wedding photography, event documentation, product photography for businesses, and portrait sessions.</p>
                  
                  <div className="mb-6">
                    <p className="text-lg font-semibold text-forge-purple">Starting from ₹15,000</p>
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
                      <span className="text-gray-700">Wedding Photography</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-forge-purple rounded-full"></div>
                      <span className="text-gray-700">Event Coverage</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-forge-purple rounded-full"></div>
                      <span className="text-gray-700">Product Photography</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-forge-purple rounded-full"></div>
                      <span className="text-gray-700">Portrait Sessions</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-forge-purple rounded-full"></div>
                      <span className="text-gray-700">Corporate Headshots</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-forge-dark">Portfolio & Client Work</CardTitle>
              <p className="text-gray-600">Upload and showcase your photography work to clients</p>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Your Work
                </label>
                <div className="flex items-center gap-4">
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>

              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
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

export default PhotographyPage;

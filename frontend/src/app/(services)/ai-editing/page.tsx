'use client';
import React, { useState } from 'react';
import { Palette, Upload, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';

const AIEditing = () => {
  const [uploadedWork, setUploadedWork] = useState<string[]>([]);

  const handleWorkUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setUploadedWork(prev => [...prev, e.target.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeWork = (index: number) => {
    setUploadedWork(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-forge-light/30 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-forge-purple/10 flex items-center justify-center">
                  <Palette className="w-8 h-8 text-forge-purple" />
                </div>
                <div>
                  <CardTitle className="text-3xl text-forge-dark">AI-Powered Editing</CardTitle>
                  <p className="text-lg text-gray-600 mt-2">Cutting-edge tools that automate and enhance your photo and video editing process.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-forge-dark mb-4">Service Details</h3>
                  <p className="text-gray-600 mb-6">Transform your raw footage and photos with our AI-powered editing services. We use the latest technology to enhance colors, remove unwanted elements, and create stunning visual effects.</p>
                  
                  <div className="mb-6">
                    <p className="text-lg font-semibold text-forge-purple">Starting from ₹5,000</p>
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
                      <span className="text-gray-700">Color Correction</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-forge-purple rounded-full"></div>
                      <span className="text-gray-700">Background Removal</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-forge-purple rounded-full"></div>
                      <span className="text-gray-700">Object Enhancement</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-forge-purple rounded-full"></div>
                      <span className="text-gray-700">Automated Editing</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-forge-purple rounded-full"></div>
                      <span className="text-gray-700">Style Transfer</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-forge-dark">Before & After Gallery</CardTitle>
              <p className="text-gray-600">Upload and showcase your AI editing work to clients</p>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <label htmlFor="work-upload" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Your Work
                </label>
                <div className="flex items-center gap-4">
                  <Input
                    id="work-upload"
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleWorkUpload}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>

              {uploadedWork.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {uploadedWork.map((work, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={work}
                        alt={`AI Edit ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeWork(index)}
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

export default AIEditing;

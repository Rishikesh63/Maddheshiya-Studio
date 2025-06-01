'use client';
import React, { useState } from 'react';
import { Album, Upload, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';

const AlbumDesign = () => {
  const [uploadedAlbums, setUploadedAlbums] = useState<string[]>([]);

  const handleAlbumUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const readerTarget = e.target as FileReader | null;

          if (readerTarget?.result) {
            setUploadedAlbums(prev => [...prev, readerTarget.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeAlbum = (index: number) => {
    setUploadedAlbums(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-forge-light/30 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-forge-purple/10 flex items-center justify-center">
                  <Album className="w-8 h-8 text-forge-purple" />
                </div>
                <div>
                  <CardTitle className="text-3xl text-forge-dark">Album Design</CardTitle>
                  <p className="text-lg text-gray-600 mt-2">Beautiful photo albums and books designed to preserve your precious memories.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-forge-dark mb-4">Service Details</h3>
                  <p className="text-gray-600 mb-6">Transform your digital memories into beautiful physical albums. We create custom-designed photo books that tell your story with elegance and style.</p>
                  
                  <div className="mb-6">
                    <p className="text-lg font-semibold text-forge-purple">Starting from ₹2,500</p>
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
                      <span className="text-gray-700">Custom Layout Design</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-forge-purple rounded-full"></div>
                      <span className="text-gray-700">Premium Paper Quality</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-forge-purple rounded-full"></div>
                      <span className="text-gray-700">Wedding Albums</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-forge-purple rounded-full"></div>
                      <span className="text-gray-700">Family Photo Books</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-forge-purple rounded-full"></div>
                      <span className="text-gray-700">Corporate Catalogs</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-forge-dark">Album Portfolio</CardTitle>
              <p className="text-gray-600">Upload and showcase your album designs</p>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <label htmlFor="album-upload" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Album Designs
                </label>
                <div className="flex items-center gap-4">
                  <Input
                    id="album-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAlbumUpload}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>

              {uploadedAlbums.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {uploadedAlbums.map((album, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={album}
                        alt={`Album ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeAlbum(index)}
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

export default AlbumDesign;

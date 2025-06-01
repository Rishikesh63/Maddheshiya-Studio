'use client';
import React, { useState } from 'react';
import { Video, Upload, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';

const VideographyPage = () => {
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setUploadedVideos(prev => [...prev, e.target.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeVideo = (index: number) => {
    setUploadedVideos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-forge-light/30 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-forge-purple/10 flex items-center justify-center">
                  <Video className="w-8 h-8 text-forge-purple" />
                </div>
                <div>
                  <CardTitle className="text-3xl text-forge-dark">Videography</CardTitle>
                  <p className="text-lg text-gray-600 mt-2">Cinematic videos for special moments, promotional content, and documentaries.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-forge-dark mb-4">Service Details</h3>
                  <p className="text-gray-600 mb-6">Create stunning visual stories with our professional videography services. From wedding films to corporate videos, we bring your vision to life with cinematic quality.</p>
                  
                  <div className="mb-6">
                    <p className="text-lg font-semibold text-forge-purple">Starting from ₹25,000</p>
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
                      <span className="text-gray-700">Wedding Films</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-forge-purple rounded-full"></div>
                      <span className="text-gray-700">Corporate Videos</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-forge-purple rounded-full"></div>
                      <span className="text-gray-700">Promotional Content</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-forge-purple rounded-full"></div>
                      <span className="text-gray-700">Documentary Style</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-forge-purple rounded-full"></div>
                      <span className="text-gray-700">Live Event Recording</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-forge-dark">Video Portfolio</CardTitle>
              <p className="text-gray-600">Upload and showcase your videography work to clients</p>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <label htmlFor="video-upload" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Your Work
                </label>
                <div className="flex items-center gap-4">
                  <Input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={handleVideoUpload}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>

              {uploadedVideos.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {uploadedVideos.map((video, index) => (
                    <div key={index} className="relative group">
                      <video
                        src={video}
                        controls
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeVideo(index)}
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

export default VideographyPage;

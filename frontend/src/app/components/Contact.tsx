
import React from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Card, CardContent } from '@/app/components/ui/card';
import { CalendarDays, MessageSquare, MapPin, Send } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-forge-light/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-forge-dark mb-4">Get In Touch</h2>
          <p className="text-lg text-gray-600">
            Book a service, rent equipment, or inquire about listing your gear. We&apos;re here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <Card className="shadow-lg border-0">
            <CardContent className="pt-6">
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                    <Input id="email" type="email" placeholder="you@example.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                  <Input id="phone" placeholder="Your phone number" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="service" className="text-sm font-medium">What are you interested in?</label>
                  <Select>
                    <SelectTrigger id="service">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 bg-blue-500">
                      <SelectItem value="photography">Photography Service</SelectItem>
                      <SelectItem value="videography">Videography Service</SelectItem>
                      <SelectItem value="studio">Studio Rental</SelectItem>
                      <SelectItem value="gear">Gear Rental</SelectItem>
                      <SelectItem value="listing">List My Equipment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Your Message</label>
                  <Textarea id="message" placeholder="Let us know how we can help you..." rows={4} />
                </div>

                <Button type="submit" className="w-full bg-forge-purple hover:bg-forge-darkpurple text-white">
                  Send Message <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-forge-dark mb-6">Connect With Us</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-forge-purple/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-forge-purple" />
                  </div>
                  <div>
                    <h4 className="font-medium text-forge-dark">Visit Our Studios</h4>
                    <p className="text-gray-600 mt-1">Maharajganj Chauraha,<br />Gorakhpur, Uttar Pradesh 273165</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-forge-purple/10 flex items-center justify-center shrink-0">
                    <MessageSquare className="h-5 w-5 text-forge-purple" />
                  </div>
                  <div>
                    <h4 className="font-medium text-forge-dark">Email & Phone</h4>
                    <p className="text-gray-600 mt-1">info@Maddheshiya Studio.studio<br />+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-forge-purple/10 flex items-center justify-center shrink-0">
                    <CalendarDays className="h-5 w-5 text-forge-purple" />
                  </div>
                  <div>
                    <h4 className="font-medium text-forge-dark">Operating Hours</h4>
                    <p className="text-gray-600 mt-1">Monday - Saturday: 9:00 AM - 8:00 PM<br />Sunday: 10:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-500 p-6 rounded-2xl shadow-lg">
              <h3 className="font-bold text-forge-dark mb-4">Special Offer!</h3>
              <p className="text-gray-600 mb-4">
                Get 15% off on your first booking or rental. Use code <span className="font-bold text-forge-purple">FIRSTFRAME15</span> at checkout.
              </p>
              <Button variant="outline" className="w-full border-forge-purple text-forge-purple hover:bg-forge-purple/10">
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

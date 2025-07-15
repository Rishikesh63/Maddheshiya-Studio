// In your layout.tsx file

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ENHANCED METADATA
export const metadata: Metadata = {
  title: 'Maddheshiya Studio',
  description: 'Capture moments that matter, rent gear you need.',
  
  // Open Graph (for Facebook, LinkedIn, etc.) and Twitter metadata
  openGraph: {
    title: 'Maddheshiya Studio',
    description: 'Capture moments that matter, rent gear you need.',
    url: 'https://maddheshiya-studio.vercel.app', // Replace with your actual domain
    siteName: 'Maddheshiya Studio',
    // You should create an image and place it in your `public` folder
    // e.g., `public/og-image.png`
    images: [
      {
        url: '/og-image.png', // Path to your Open Graph image
        width: 1200,
        height: 630,
        alt: 'Maddheshiya Studio - Photography and Gear Rental',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maddheshiya Studio',
    description: 'Capture moments that matter, rent gear you need.',
    // Again, use the path to your image in the `public` folder
    images: ['/og-image.png'],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
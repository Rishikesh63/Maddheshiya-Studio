// src/app/layout.tsx
import './globals.css';
import { Geist } from 'next/font/google';
import { Metadata } from 'next';
import ClientWrapper from './ClientWrapper';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

export const metadata: Metadata = {
  title: 'Maddheshiya Studio',
  description: 'Capture moments that matter, rent gear you need.',
  openGraph: {
    title: 'Maddheshiya Studio',
    description: 'Capture moments that matter, rent gear you need.',
    url: 'https://maddheshiya-studio.vercel.app',
    siteName: 'Maddheshiya Studio',
    images: [
      {
        url: '/og-image.png',
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
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geistSans.variable}>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}

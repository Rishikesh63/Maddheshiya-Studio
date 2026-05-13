import './globals.css';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { Metadata } from 'next';
import ClientWrapper from './ClientWrapper';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Maddheshiya Studio | Premium Wedding Photography & Videography',
    template: '%s | Maddheshiya Studio',
  },
  description:
    'Maddheshiya Studio — Premium wedding photography, cinematic videography, drone coverage, and creative services. Capturing love stories with a luxury cinematic approach.',
  keywords: [
    'wedding photography',
    'wedding videography',
    'cinematic wedding film',
    'drone photography',
    'prewedding shoot',
    'wedding photographer Kanpur',
    'wedding photographer Lucknow',
    'Maddheshiya Studio',
  ],
  openGraph: {
    title: 'Maddheshiya Studio | Premium Wedding Photography & Videography',
    description:
      'Capturing love stories with cinematic precision. Premium wedding photography, films, drone, and creative services.',
    url: 'https://maddheshiya-studio.vercel.app',
    siteName: 'Maddheshiya Studio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Maddheshiya Studio — Premium Wedding Photography',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maddheshiya Studio | Premium Wedding Photography',
    description: 'Capturing love stories with cinematic precision.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}

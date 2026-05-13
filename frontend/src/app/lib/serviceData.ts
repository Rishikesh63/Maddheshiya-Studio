export interface ServiceStaticData {
  title: string;
  subtitle: string;
  description: string;
  heroText: string;
  features: string[];
  galleryAlt: string;
}

export const photographyServices: Record<string, ServiceStaticData> = {
  wedding: {
    title: 'Wedding Photography',
    subtitle: 'Every moment, beautifully preserved',
    description:
      'From the intimate exchange of vows to the grand reception, we capture every emotion with cinematic artistry. Our wedding photography blends photojournalism with fine-art portraiture.',
    heroText: 'WEDDING PHOTOGRAPHY',
    features: [
      'Full-day coverage',
      'Edited digital gallery',
      'Drone aerial shots',
      'Candid + posed portraits',
      'Pre-wedding session',
      'Online gallery delivery',
    ],
    galleryAlt: 'Wedding photography portfolio',
  },
  prewedding: {
    title: 'Pre-Wedding Photography',
    subtitle: 'Your love story, before the big day',
    description:
      'Celebrate your journey to the altar with a stunning pre-wedding shoot. We craft intimate, cinematic frames that tell your unique love story in beautiful locations.',
    heroText: 'PRE-WEDDING',
    features: [
      'Location scouting',
      '4-6 hour session',
      'Multiple outfit changes',
      'Edited high-res gallery',
      'Cinematic retouching',
      'Outdoor & studio options',
    ],
    galleryAlt: 'Pre-wedding photography portfolio',
  },
  studio: {
    title: 'Studio Photography',
    subtitle: 'Controlled perfection in every frame',
    description:
      'Our fully-equipped studio offers premium setups for portraits, fashion, family, and commercial shoots. Professional lighting, backdrops, and a creative team at your disposal.',
    heroText: 'STUDIO PHOTOGRAPHY',
    features: [
      'Professional lighting setup',
      'Multiple backdrop options',
      'Hair & makeup coordination',
      'Same-day preview',
      'High-resolution delivery',
      'Print-ready files',
    ],
    galleryAlt: 'Studio photography portfolio',
  },
  product: {
    title: 'Product Photography',
    subtitle: 'Visual commerce, elevated',
    description:
      'Transform your products into compelling visual stories. From e-commerce flat lays to lifestyle shoots, we create images that convert browsers into buyers.',
    heroText: 'PRODUCT PHOTOGRAPHY',
    features: [
      'White background / lifestyle',
      '360° product views',
      'E-commerce ready files',
      'Color-accurate editing',
      'Multiple SKU handling',
      'Fast 48-hour delivery',
    ],
    galleryAlt: 'Product photography portfolio',
  },
  drone: {
    title: 'Drone Photography',
    subtitle: 'Breathtaking aerial perspectives',
    description:
      'Add cinematic aerial dimension to your wedding or event. Licensed drone operators capture sweeping landscapes, venue exteriors, and crowd moments from above.',
    heroText: 'DRONE PHOTOGRAPHY',
    features: [
      'Licensed drone operators',
      '4K aerial footage',
      'Venue flyovers',
      'Landscape panoramas',
      'Safe event coverage',
      'Edited aerial gallery',
    ],
    galleryAlt: 'Drone photography portfolio',
  },
};

export const videographyServices: Record<string, ServiceStaticData> = {
  'wedding-films': {
    title: 'Wedding Films',
    subtitle: 'Cinematic storytelling of your biggest day',
    description:
      'We craft narrative-driven wedding films that transport you back to every emotion. Using cinema-grade equipment and masterful editing, your love story becomes a film you will cherish forever.',
    heroText: 'WEDDING FILMS',
    features: [
      'Full-day filming',
      'Cinematic highlight film (8-12 min)',
      'Full ceremony & reception edit',
      'Aerial drone footage',
      'Professional audio capture',
      'Color-graded delivery',
    ],
    galleryAlt: 'Wedding film portfolio',
  },
  reels: {
    title: 'Cinematic Reels',
    subtitle: 'Short films for the social age',
    description:
      'High-impact short-form videos optimized for Instagram, YouTube, and social media. We create reels that stop the scroll and tell your story in under 60 seconds.',
    heroText: 'CINEMATIC REELS',
    features: [
      'Instagram / YouTube optimized',
      '30–90 second edits',
      'Trending music sync',
      'Motion graphics',
      'Color grading',
      '24-hour turnaround option',
    ],
    galleryAlt: 'Cinematic reels portfolio',
  },
  drone: {
    title: 'Drone Videography',
    subtitle: 'Epic aerial footage for unforgettable moments',
    description:
      'Breathtaking aerial videography for weddings, events, real estate, and commercial projects. Our licensed pilots capture stunning sky-high perspectives.',
    heroText: 'DRONE VIDEOGRAPHY',
    features: [
      'Licensed drone pilots',
      '4K / 6K aerial video',
      'Smooth cinematic movements',
      'Venue & landscape coverage',
      'Integration with ground footage',
      'Stabilized delivery',
    ],
    galleryAlt: 'Drone videography portfolio',
  },
  events: {
    title: 'Event Videography',
    subtitle: 'Corporate, cultural, and celebration films',
    description:
      'From corporate conferences to cultural ceremonies, we document events with professional multi-camera setups and deliver polished highlight reels and full recordings.',
    heroText: 'EVENT VIDEOGRAPHY',
    features: [
      'Multi-camera setup',
      'Live audio recording',
      'Event highlight reel',
      'Full event recording',
      'Speaker/performance coverage',
      'Same-week delivery',
    ],
    galleryAlt: 'Event videography portfolio',
  },
};

export const productData: Record<
  string,
  {
    title: string;
    subtitle: string;
    description: string;
    category: 'digital' | 'printing';
    deliveryTime: string;
    startingPrice: string;
    features: string[];
  }
> = {
  'photo-psd': {
    title: 'Photo PSD Editing',
    subtitle: 'Professional photo retouching & composites',
    description:
      'Advanced Photoshop editing for wedding and portrait photos. Background replacement, skin retouching, color grading, and composite art.',
    category: 'digital',
    deliveryTime: '3–5 days',
    startingPrice: '₹500',
    features: ['Skin retouching', 'Background removal', 'Color grading', 'Composite art', 'High-res PSD delivery'],
  },
  'invitation-video': {
    title: 'Invitation Videos',
    subtitle: 'Cinematic digital wedding invitations',
    description:
      'Stunning animated invitation videos for weddings, engagements, and events. Shareable via WhatsApp and social media.',
    category: 'digital',
    deliveryTime: '2–4 days',
    startingPrice: '₹1,500',
    features: ['Custom animation', 'Your photos & details', 'HD delivery', 'WhatsApp-ready size', 'Multiple variants'],
  },
  'album-design': {
    title: 'Album Design',
    subtitle: 'Heirloom-quality photo album layouts',
    description:
      'Beautifully designed wedding album layouts. We create print-ready album pages that tell your story with elegance.',
    category: 'digital',
    deliveryTime: '5–7 days',
    startingPrice: '₹2,000',
    features: ['Custom layouts', '12×18 to 18×24 sizes', 'Print-ready PDF', 'Unlimited revisions', 'Elegantly designed'],
  },
  'id-cards': {
    title: 'ID Card Printing',
    subtitle: 'Professional ID cards for businesses & events',
    description:
      'High-quality PVC and paper ID cards for corporate, schools, events, and organizations. Custom design and fast printing.',
    category: 'printing',
    deliveryTime: '1–2 days',
    startingPrice: '₹30/card',
    features: ['PVC & paper options', 'Custom design', 'Bulk orders', 'Lamination available', 'Same-day option'],
  },
  'tshirt-printing': {
    title: 'T-Shirt Printing',
    subtitle: 'Custom prints for events & teams',
    description:
      'DTF, screen, and sublimation printing on premium quality t-shirts. Perfect for events, teams, and merchandise.',
    category: 'printing',
    deliveryTime: '3–5 days',
    startingPrice: '₹299/shirt',
    features: ['DTF / screen print', 'All sizes available', 'Bulk discounts', 'Color-accurate print', 'Premium fabric options'],
  },
  'photo-framing': {
    title: 'Photo Framing',
    subtitle: 'Premium frames for your cherished memories',
    description:
      'Beautiful photo frames in wood, metal, and acrylic. Custom sizes, collages, and canvas prints for your home and office.',
    category: 'printing',
    deliveryTime: '3–7 days',
    startingPrice: '₹499',
    features: ['Wood & acrylic frames', 'Canvas prints', 'Collage frames', 'Custom sizing', 'Home delivery'],
  },
};

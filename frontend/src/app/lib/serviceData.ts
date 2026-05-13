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
    price: number;
    features: string[];
  }
> = {
  'album-psd': {
    title: 'Album PSD',
    subtitle: 'Professional album retouching & composites',
    description:
      'Advanced Photoshop editing for wedding album pages. Background replacement, skin retouching, cinematic color grading, and composite art.',
    category: 'digital',
    deliveryTime: '3–5 days',
    startingPrice: '₹500',
    price: 500,
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
    price: 1500,
    features: ['Custom animation', 'Your photos & details', 'HD delivery', 'WhatsApp-ready size', 'Multiple variants'],
  },
  'wedding-highlight': {
    title: 'Wedding Highlight',
    subtitle: 'Cinematic same-day wedding highlight reel',
    description:
      'A beautifully edited 5–10 minute cinematic highlight reel of your wedding day. Color-graded, music-synced, and delivered in HD.',
    category: 'digital',
    deliveryTime: '5–7 days',
    startingPrice: '₹3,500',
    price: 3500,
    features: ['5–10 min highlight film', 'Cinematic color grading', 'Music sync', 'HD delivery', 'WhatsApp-ready teaser'],
  },
  'ring-ceremony-highlight': {
    title: 'Ring Ceremony Highlights',
    subtitle: 'Elegant short film of your ring exchange',
    description:
      'A focused cinematic edit of your ring ceremony — every emotion, every exchange, beautifully preserved in a short film.',
    category: 'digital',
    deliveryTime: '3–5 days',
    startingPrice: '₹2,000',
    price: 2000,
    features: ['3–5 min edited film', 'Slow-motion moments', 'Color grading', 'Music sync', 'HD & WhatsApp formats'],
  },
  'wedding-title': {
    title: 'Wedding Title',
    subtitle: 'Cinematic name title card for your wedding film',
    description:
      'Custom animated title cards for wedding films and invitations. Elegant typography, gold accents, and cinematic motion.',
    category: 'digital',
    deliveryTime: '1–2 days',
    startingPrice: '₹500',
    price: 500,
    features: ['Custom typography', 'Gold / luxury styles', 'HD export', 'Multiple font options', 'Quick delivery'],
  },
  'video-logo': {
    title: 'Video Logo',
    subtitle: 'Animated logo intro for your videos',
    description:
      'Professional animated logo intros for photographers, studios, and businesses. Cinematic motion and sound design.',
    category: 'digital',
    deliveryTime: '2–3 days',
    startingPrice: '₹800',
    price: 800,
    features: ['Custom animation', 'Sound design', 'HD & 4K export', 'Multiple style options', 'Transparent background'],
  },
  'birthday-highlight': {
    title: 'Birthday Highlight',
    subtitle: 'Fun and cinematic birthday event film',
    description:
      'A vibrant, energetic highlight reel of your birthday celebration. Perfect for sharing on social media or keeping as a memory.',
    category: 'digital',
    deliveryTime: '3–5 days',
    startingPrice: '₹2,000',
    price: 2000,
    features: ['3–5 min highlight', 'Trending music sync', 'Color grading', 'Reels cut included', 'HD delivery'],
  },
  'prewedding-highlight': {
    title: 'Pre-Wedding Highlight',
    subtitle: 'Romantic cinematic pre-wedding film',
    description:
      'A dreamy, cinematic edit of your pre-wedding shoot. Crafted to tell your love story before the big day.',
    category: 'digital',
    deliveryTime: '5–7 days',
    startingPrice: '₹2,500',
    price: 2500,
    features: ['5–8 min film', 'Cinematic grading', 'Romantic music sync', 'Drone shots included', 'HD & Instagram reel'],
  },
  'id-cards': {
    title: 'ID Card Printing',
    subtitle: 'Professional ID cards for businesses & events',
    description:
      'High-quality PVC and paper ID cards for corporate, schools, events, and organizations. Custom design and fast printing.',
    category: 'printing',
    deliveryTime: '1–2 days',
    startingPrice: '₹30/card',
    price: 30,
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
    price: 299,
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
    price: 499,
    features: ['Wood & acrylic frames', 'Canvas prints', 'Collage frames', 'Custom sizing', 'Home delivery'],
  },
};

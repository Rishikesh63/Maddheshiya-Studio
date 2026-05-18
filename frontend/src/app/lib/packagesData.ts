export interface StaticPackage {
  id: number;
  name: string;
  price: string;
  priceNum: number;
  duration: string;
  description: string;
  inclusions: string[];
  service_type: "photography" | "videography" | "hybrid";
  featured?: boolean;
}

// ── Edit your packages here ────────────────────────────────────────────────
export const staticPackages: StaticPackage[] = [
  // Photography
  {
    id: 1,
    name: "Basic",
    price: "₹15,000",
    priceNum: 15000,
    duration: "4 hours",
    description: "Perfect for small ceremonies and intimate events.",
    service_type: "photography",
    inclusions: ["4 hours of coverage", "200 edited photos", "Online gallery", "1 photographer"],
  },
  {
    id: 2,
    name: "Standard",
    price: "₹25,000",
    priceNum: 25000,
    duration: "8 hours",
    description: "Full day coverage for weddings and big celebrations.",
    service_type: "photography",
    featured: true,
    inclusions: ["8 hours of coverage", "500 edited photos", "Online gallery", "1 photographer", "Candid + portraits", "USB delivery"],
  },
  {
    id: 3,
    name: "Premium",
    price: "₹40,000",
    priceNum: 40000,
    duration: "12 hours",
    description: "Complete coverage with two photographers and album.",
    service_type: "photography",
    inclusions: ["12 hours of coverage", "800+ edited photos", "2 photographers", "Drone shots", "Premium photo album", "USB + online gallery", "Same day highlights"],
  },

  // Videography
  {
    id: 4,
    name: "Basic Film",
    price: "₹20,000",
    priceNum: 20000,
    duration: "4 hours",
    description: "Highlight reel for small functions and ceremonies.",
    service_type: "videography",
    inclusions: ["4 hours of coverage", "5 min highlight reel", "Color graded edit", "1 videographer", "Digital delivery"],
  },
  {
    id: 5,
    name: "Cinematic",
    price: "₹35,000",
    priceNum: 35000,
    duration: "8 hours",
    description: "Full cinematic wedding film with drone footage.",
    service_type: "videography",
    featured: true,
    inclusions: ["8 hours of coverage", "10 min cinematic film", "5 min highlight reel", "Drone coverage", "Color graded 4K", "USB + online link"],
  },
  {
    id: 6,
    name: "Grand Film",
    price: "₹60,000",
    priceNum: 60000,
    duration: "12 hours",
    description: "Full day documentary style cinematic coverage.",
    service_type: "videography",
    inclusions: ["12 hours of coverage", "20 min full film", "5 min highlight reel", "2 videographers", "Drone + gimbal shots", "Same day edit teaser", "4K USB + online"],
  },

  // Hybrid
  {
    id: 7,
    name: "Combo Basic",
    price: "₹30,000",
    priceNum: 30000,
    duration: "6 hours",
    description: "Photo and video together for one price.",
    service_type: "hybrid",
    inclusions: ["6 hours of coverage", "300 edited photos", "5 min highlight reel", "1 photographer + 1 videographer", "Digital delivery"],
  },
  {
    id: 8,
    name: "Combo Standard",
    price: "₹50,000",
    priceNum: 50000,
    duration: "10 hours",
    description: "Complete wedding coverage — photo, video and drone.",
    service_type: "hybrid",
    featured: true,
    inclusions: ["10 hours of coverage", "600 edited photos", "10 min cinematic film", "Drone coverage", "2 photographers + 1 videographer", "Album + USB"],
  },
  {
    id: 9,
    name: "Combo Premium",
    price: "₹80,000",
    priceNum: 80000,
    duration: "Full day",
    description: "Our best — two teams, full day, everything included.",
    service_type: "hybrid",
    inclusions: ["Full day coverage", "1000+ edited photos", "20 min full film + reel", "2 photographers + 2 videographers", "Drone + studio setup", "Premium album", "Same day edit teaser", "4K USB + gallery"],
  },
];
// ──────────────────────────────────────────────────────────────────────────

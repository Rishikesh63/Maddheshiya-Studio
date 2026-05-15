export interface PsdProduct {
  id: string;
  title: string;
  price: number;
  sheets?: number;
  image: string | null;        // S3 key for cover thumbnail e.g. "products/album-psd/12x36/alb-12x36-01/cover.jpg"
  sheetPath?: string | null;   // S3 folder for sheet previews e.g. "products/album-psd/12x36/alb-12x36-01"
  downloadPath?: string | null; // S3 key for purchasable ZIP/PSD file e.g. "products/album-psd/12x36/alb-12x36-01/album.zip"
}

export interface PsdCategory {
  id: string;
  label: string;
  products: PsdProduct[];
}

export const albumPsdCategories: PsdCategory[] = [
  {
    id: "12x36",
    label: "Albums 12×36",
    products: [
      { id: "alb-18x24-01", title: "Wedding Classic 12×36 Vol.1", price: 149, sheets: 20, image: null },
      { id: "alb-12x36-02", title: "Wedding Classic 12×36 Vol.2", price: 149, sheets: 30, image: null },
      { id: "alb-12x36-03", title: "Premium Gold 12×36", price: 199, sheets: 40, image: null },
      { id: "alb-12x36-04", title: "Floral Theme 12×36", price: 179, sheets: 25, image: null },
      { id: "alb-12x36-05", title: "Modern Minimal 12×36", price: 159, sheets: 20, image: null },
      { id: "alb-12x36-06", title: "Royal Dark 12×36", price: 219, sheets: 35, image: null },
      { id: "alb-12x36-07", title: "Vintage Series 12×36", price: 169, sheets: 28, image: null },
      { id: "alb-12x36-08", title: "Cinematic Black 12×36", price: 189, sheets: 30, image: null },
    ],
  },
  {
    id: "18x24",
    label: "Albums 18×24",
    products: [
      { id: "alb-18x24-01", title: "Birthday Album 18×24", price: 169, sheets: 20, image: "products/album-psd/18X24/birthday/cover.jpg", sheetPath: "products/album-psd/18X24/birthday", downloadPath: "products/album-psd/18X24/birthday/birthday.zip" },
      { id: "alb-18x24-02", title: "Premium Elite 18×24", price: 199, sheets: 40, image: null },
      { id: "alb-18x24-03", title: "Floral Garden 18×24", price: 179, sheets: 30, image: null },
      { id: "alb-18x24-04", title: "Luxury Gold 18×24", price: 229, sheets: 35, image: null },
      { id: "alb-18x24-05", title: "Modern Bokeh 18×24", price: 159, sheets: 20, image: null },
      { id: "alb-18x24-06", title: "Cinematic Film 18×24", price: 189, sheets: 28, image: null },
    ],
  },
  {
    id: "16x24",
    label: "Albums 16×24",
    products: [
      { id: "alb-16x24-01", title: "Elegance Series 16×24", price: 159, sheets: 25, image: null },
      { id: "alb-16x24-02", title: "Classic Romance 16×24", price: 149, sheets: 20, image: null },
      { id: "alb-16x24-03", title: "Premium Gold 16×24", price: 199, sheets: 35, image: null },
      { id: "alb-16x24-04", title: "Dark Luxury 16×24", price: 179, sheets: 30, image: null },
      { id: "alb-16x24-05", title: "Soft Pastel 16×24", price: 139, sheets: 18, image: null },
    ],
  },
  {
    id: "15x30",
    label: "Albums 15×30",
    products: [
      { id: "alb-15x30-01", title: "Panoramic Wedding 15×30", price: 179, sheets: 25, image: null },
      { id: "alb-15x30-02", title: "Wide Cinematic 15×30", price: 199, sheets: 30, image: null },
      { id: "alb-15x30-03", title: "Royal Edition 15×30", price: 229, sheets: 40, image: null },
      { id: "alb-15x30-04", title: "Classic Elegance 15×30", price: 159, sheets: 22, image: null },
      { id: "alb-15x30-05", title: "Premium Series 15×30", price: 189, sheets: 28, image: null },
    ],
  },
  {
    id: "ported-sheet",
    label: "Ported Sheet",
    products: [
      { id: "ps-01", title: "Ported Sheet Vol.1", price: 99, sheets: 15, image: null },
      { id: "ps-02", title: "Ported Sheet Vol.2", price: 99, sheets: 15, image: null },
      { id: "ps-03", title: "Ported Sheet Premium", price: 129, sheets: 20, image: null },
      { id: "ps-04", title: "Ported Sheet Wedding", price: 109, sheets: 18, image: null },
      { id: "ps-05", title: "Ported Sheet Event", price: 89, sheets: 12, image: null },
    ],
  },
  {
    id: "cover",
    label: "Cover",
    products: [
      { id: "cov-01", title: "Wedding Cover Design", price: 79, sheets: 10, image: null },
      { id: "cov-02", title: "Premium Album Cover", price: 99, sheets: 15, image: null },
      { id: "cov-03", title: "Classic Cover Vol.1", price: 69, sheets: 10, image: null },
      { id: "cov-04", title: "Luxury Gold Cover", price: 119, sheets: 12, image: null },
      { id: "cov-05", title: "Cinematic Cover Frame", price: 89, sheets: 8, image: null },
    ],
  },
  {
    id: "design-material",
    label: "Design Material",
    products: [
      { id: "dm-01", title: "Overlay Pack Vol.1", price: 199, sheets: 30, image: null },
      { id: "dm-02", title: "Floral Brushes Set", price: 149, sheets: 20, image: null },
      { id: "dm-03", title: "Gold Texture Pack", price: 179, sheets: 25, image: null },
      { id: "dm-04", title: "Wedding Frame Bundle", price: 229, sheets: 40, image: null },
      { id: "dm-05", title: "Action & Preset Pack", price: 249, sheets: 35, image: null },
    ],
  },
];

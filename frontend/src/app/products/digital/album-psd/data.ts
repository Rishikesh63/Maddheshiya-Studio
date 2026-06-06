export interface PsdProduct {
  id: string;
  title: string;
  price: number;
  sheets?: number;
  image?: string | null;        // S3 key for an explicit cover thumbnail. If omitted, sheet-{coverSheet} is used instead.
  coverSheet?: number;          // Which sheet number to use as cover when no explicit `image` is set. Defaults to 1.
  sheetExt?: "jpg" | "png";    // File extension for sheet images. Defaults to "jpg". Use "png" for PNG packs.
  sheetPath?: string | null;   // S3 folder for sheet previews e.g. "products/album-psd/12x36/alb-12x36-01"
  downloadPath?: string | null; // S3 key for purchasable ZIP/PSD file e.g. "products/album-psd/12x36/alb-12x36-01/album.zip"
}

/**
 * Returns the S3 key for a specific sheet number.
 */
export function getSheetKey(product: PsdProduct, num: number): string | null {
  if (!product.sheetPath) return null;
  const ext = product.sheetExt ?? "jpg";
  return `${product.sheetPath}/sheet-${String(num).padStart(2, "0")}.${ext}`;
}

/**
 * Returns the S3 key for the product's cover thumbnail.
 * Priority: explicit `image` → first (or `coverSheet`) sheet from `sheetPath` → null
 */
export function getProductCoverKey(product: PsdProduct): string | null {
  if (product.image) return product.image;
  return getSheetKey(product, product.coverSheet ?? 1);
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
      { id: "alb-12x36-01", title: "Traditional Wedding 12×36", price: 89, sheets: 40, image: "products/album-psd/12X36/traditional-wedding/cover.jpg", sheetPath: "products/album-psd/12X36/traditional-wedding", downloadPath: "products/album-psd/12X36/traditional-wedding/traditional-wedding.zip" },
      { id: "alb-12x36-02", title: "Cinematic Wedding 12×36", price: 89, sheets: 40, image: "products/album-psd/12X36/cinematic-wedding/cover.jpg", sheetPath: "products/album-psd/12X36/cinematic-wedding", downloadPath: "products/album-psd/12X36/cinematic-wedding/cinematic-wedding.zip" },
      { id: "alb-12x36-03", title: "Candid Wedding 12×36", price: 149, sheets: 85, image: "products/album-psd/12X36/candid-wedding/cover.jpg", sheetPath: "products/album-psd/12X36/candid-wedding", downloadPath: "products/album-psd/12X36/candid-wedding/candid-wedding.zip" },
      { id: "alb-12x36-04", title: "Premium Gold 12×36", price: 199, sheets: 40, image: null },
      { id: "alb-12x36-05", title: "Floral Theme 12×36", price: 179, sheets: 25, image: null },
      { id: "alb-12x36-06", title: "Modern Minimal 12×36", price: 159, sheets: 20, image: null },
      { id: "alb-12x36-07", title: "Royal Dark 12×36", price: 219, sheets: 35, image: null },
      { id: "alb-12x36-08", title: "Vintage Series 12×36", price: 169, sheets: 28, image: null },
      { id: "alb-12x36-09", title: "Cinematic Black 12×36", price: 189, sheets: 30, image: null },
    ],
  },
  {
    id: "18x24",
    label: "Albums 18×24",
    products: [
      { id: "alb-18x24-01", title: "Birthday Album 18×24", price: 49, sheets: 20, image: "products/album-psd/18X24/birthday/cover.jpg", sheetPath: "products/album-psd/18X24/birthday", downloadPath: "products/album-psd/18X24/birthday/birthday.zip" },
      { id: "alb-18x24-02", title: "Premium Elite 18×24", price: 199, sheets: 40, image: null },
      { id: "alb-18x24-03", title: "Floral Garden 18×24", price: 179, sheets: 30, image: null },
      { id: "alb-18x24-04", title: "Luxury Gold 18×24", price: 229, sheets: 35, image: null },
      { id: "alb-18x24-05", title: "Modern Bokeh 18×24", price: 159, sheets: 20, image: null },
      { id: "alb-18x24-06", title: "Cinematic Film 18×24", price: 189, sheets: 28, image: null },
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
      { id: "dm-01", title: "Album Typography",            price: 49,  sheets: 21, sheetExt: "png", sheetPath: "products/album-psd/design-material/albumb-typography",        downloadPath: "products/album-psd/design-material/albumb-typography/albumb-typography.zip" },
      { id: "dm-02", title: "Birds PNG",                   price: 5,  sheets: 2, sheetExt: "png", sheetPath: "products/album-psd/design-material/birds",                    downloadPath: "products/album-psd/design-material/birds/birds.zip" },
      { id: "dm-03", title: "Birthday Wishes PNG",         price: 39, sheets: 17, sheetExt: "png", sheetPath: "products/album-psd/design-material/birthday-wishes",          downloadPath: "products/album-psd/design-material/birthday-wishes/birthday-wishes.zip" },
      { id: "dm-04", title: "Falling Leaves PNG",          price: 5, sheets: 2, sheetExt: "png", sheetPath: "products/album-psd/design-material/falling-leaves",           downloadPath: "products/album-psd/design-material/falling-leaves/falling-leaves.zip" },
      { id: "dm-05", title: "Fire PNG",                    price: 5, sheets: 2, sheetExt: "png", sheetPath: "products/album-psd/design-material/fire",                     downloadPath: "products/album-psd/design-material/fire/fire.zip" },
      { id: "dm-06", title: "Gift PNG",                    price: 59, sheets: 41, sheetExt: "png", sheetPath: "products/album-psd/design-material/gift",                     downloadPath: "products/album-psd/design-material/gift/gift.zip" },
      { id: "dm-07", title: "Islamic Wedding PNG",         price: 49, sheets: 28, sheetExt: "png", sheetPath: "products/album-psd/design-material/islamic-wedding",          downloadPath: "products/album-psd/design-material/islamic-wedding/islamic-wedding.zip" },
      { id: "dm-08", title: "Light Effects PNG",           price: 9, sheets: 7, sheetExt: "png", sheetPath: "products/album-psd/design-material/light-effects",            downloadPath: "products/album-psd/design-material/light-effects/light-effects.zip" },
      { id: "dm-09", title: "Love Designs PNG",            price: 39, sheets: 20, sheetExt: "png", sheetPath: "products/album-psd/design-material/love-designs",             downloadPath: "products/album-psd/design-material/love-designs/love-designs.zip" },
      { id: "dm-10", title: "Newborn Baby Wishes PNG",     price: 19, sheets: 14, sheetExt: "png", sheetPath: "products/album-psd/design-material/newbord-babywishes",       downloadPath: "products/album-psd/design-material/newbord-babywishes/newbord-babywishes.zip" },
      { id: "dm-11", title: "Photo Mask PNG",              price: 9, sheets: 9, sheetExt: "png", sheetPath: "products/album-psd/design-material/photo-mask",               downloadPath: "products/album-psd/design-material/photo-mask/photo-mask.zip" },
      { id: "dm-12", title: "Photo Overlay PNG",           price: 19, sheets: 19, sheetExt: "png", sheetPath: "products/album-psd/design-material/photo-overlay",            downloadPath: "products/album-psd/design-material/photo-overlay/photo-overlay.zip" },
      { id: "dm-13", title: "Sky Background PNG",          price: 9, sheets: 11, sheetExt: "png", sheetPath: "products/album-psd/design-material/sky-background",           downloadPath: "products/album-psd/design-material/sky-background/sky-background.zip" },
      { id: "dm-14", title: "Studio Background 4×6 PNG",  price: 19, sheets: 18, sheetExt: "jpg", sheetPath: "products/album-psd/design-material/studio-background/4X6",   downloadPath: "products/album-psd/design-material/studio-background/4X6/studio-background-4x6.zip" },
      { id: "dm-21", title: "Studio Background 6×4 PNG",  price: 11, sheets: 14, sheetExt: "jpg", sheetPath: "products/album-psd/design-material/studio-background/6X4",   downloadPath: "products/album-psd/design-material/studio-background/6X4/studio-background-6x4.zip" },
      { id: "dm-15", title: "Water Drop PNG",              price: 1, sheets: 1, sheetExt: "png", sheetPath: "products/album-psd/design-material/water-drop",               downloadPath: "products/album-psd/design-material/water-drop/water-drop.zip" },
      { id: "dm-16", title: "Wedding Album Background PNG",price: 11, sheets: 11, sheetExt: "png", sheetPath: "products/album-psd/design-material/wedding-albumb-background", downloadPath: "products/album-psd/design-material/wedding-albumb-background/wedding-albumb-background.zip" },
      { id: "dm-17", title: "Wedding Album Frame PNG",     price: 19, sheets: 19, sheetExt: "png", sheetPath: "products/album-psd/design-material/wedding-albumb-frame",     downloadPath: "products/album-psd/design-material/wedding-albumb-frame/wedding-albumb-frame.zip" },
      { id: "dm-18", title: "Wedding Album PNG",           price: 7, sheets: 7, sheetExt: "png", sheetPath: "products/album-psd/design-material/wedding-albumb",           downloadPath: "products/album-psd/design-material/wedding-albumb/wedding-albumb.zip" },
      { id: "dm-19", title: "Wedding Quotes PNG",          price: 2, sheets: 2, sheetExt: "png", sheetPath: "products/album-psd/design-material/wedding-quotes",           downloadPath: "products/album-psd/design-material/wedding-quotes/wedding-quotes.zip" },
      { id: "dm-20", title: "Wedding Text PNG",            price: 4, sheets: 4, sheetExt: "png", sheetPath: "products/album-psd/design-material/wedding-text",             downloadPath: "products/album-psd/design-material/wedding-text/wedding-text.zip" },
    ],
  },
];

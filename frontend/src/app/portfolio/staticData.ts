export interface StaticPortfolioItem {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  image?: string;       // S3 key — reused from product pages, no extra storage
  youtubeId?: string;   // YouTube video ID for invitation videos
  href: string;         // links to the product page
}

export const staticPortfolioItems: StaticPortfolioItem[] = [
  // Album PSD — same S3 keys as product pages, zero extra storage cost
  {
    id: "static-alb-01",
    title: "Traditional Wedding Album 12×36",
    category: "album-design",
    categoryLabel: "Album Design",
    image: "products/album-psd/12X36/traditional-wedding/cover.jpg",
    href: "/products/digital/album-psd",
  },
  {
    id: "static-alb-02",
    title: "Cinematic Wedding Album 12×36",
    category: "album-design",
    categoryLabel: "Album Design",
    image: "products/album-psd/12X36/cinematic-wedding/cover.jpg",
    href: "/products/digital/album-psd",
  },
  {
    id: "static-alb-03",
    title: "Birthday Album 18×24",
    category: "album-design",
    categoryLabel: "Album Design",
    image: "products/album-psd/18X24/birthday/cover.jpg",
    href: "/products/digital/album-psd",
  },

  // Invitation Videos — YouTube thumbnails, no S3 needed
  {
    id: "static-iv-01",
    title: "Haldi & Shaadi Invitation Video Template",
    category: "invitation-video",
    categoryLabel: "Invitation Video",
    youtubeId: "nyN79ukDc_E",
    href: "/products/digital/invitation-video",
  },
  {
    id: "static-iv-02",
    title: "Animated Wedding Invitation | Cartoon Wedding Invite",
    category: "invitation-video",
    categoryLabel: "Invitation Video",
    youtubeId: "dcrrWARp8v8",
    href: "/products/digital/invitation-video",
  },
  {
    id: "static-iv-03",
    title: "Royal Wedding Invitation Video Template",
    category: "invitation-video",
    categoryLabel: "Invitation Video",
    youtubeId: "Y8d6iLsHCa4",
    href: "/products/digital/invitation-video",
  },
  {
    id: "static-iv-04",
    title: "Cute Animated Wedding Invitation | Cartoon Couple",
    category: "invitation-video",
    categoryLabel: "Invitation Video",
    youtubeId: "YTEc_oAZjmc",
    href: "/products/digital/invitation-video",
  },
  {
    id: "static-iv-05",
    title: "Animated Save The Date Wedding Invitation",
    category: "invitation-video",
    categoryLabel: "Invitation Video",
    youtubeId: "ZFx2mScbkiE",
    href: "/products/digital/invitation-video",
  },
  {
    id: "static-iv-06",
    title: "Bride Groom Cartoon Wedding Invitation",
    category: "invitation-video",
    categoryLabel: "Invitation Video",
    youtubeId: "IUlfoB7uAyY",
    href: "/products/digital/invitation-video",
  },
  {
    id: "static-iv-07",
    title: "Marathi Animated Save The Date Invitation",
    category: "invitation-video",
    categoryLabel: "Invitation Video",
    youtubeId: "0bVQO27JU-k",
    href: "/products/digital/invitation-video",
  },
  {
    id: "static-iv-08",
    title: "Rang Lageya Save The Date Wedding Invitation",
    category: "invitation-video",
    categoryLabel: "Invitation Video",
    youtubeId: "OeiVix-atQI",
    href: "/products/digital/invitation-video",
  },
  {
    id: "static-iv-09",
    title: "Singaar Ko Rehne Do Wedding Invitation",
    category: "invitation-video",
    categoryLabel: "Invitation Video",
    youtubeId: "V-ljdkT5gcQ",
    href: "/products/digital/invitation-video",
  },
  {
    id: "static-iv-10",
    title: "Laal Ishq Save The Date Wedding Invitation",
    category: "invitation-video",
    categoryLabel: "Invitation Video",
    youtubeId: "VXIzWz5fz_c",
    href: "/products/digital/invitation-video",
  },
  {
    id: "static-iv-11",
    title: "Mora Saajan Save The Date Wedding Invitation",
    category: "invitation-video",
    categoryLabel: "Invitation Video",
    youtubeId: "x_HtL0pZfdg",
    href: "/products/digital/invitation-video",
  },
];

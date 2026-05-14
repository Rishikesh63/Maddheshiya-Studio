import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/cart", "/profile", "/login", "/register", "/forgot-password"],
      },
    ],
    sitemap: "https://madhesiyastudio.com/sitemap.xml",
  };
}

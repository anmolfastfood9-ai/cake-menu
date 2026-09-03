import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://sweetdelights.com").replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/menu",
          "/menu/cakes",
          "/menu/cake/",
          "/menu/category/",
          "/menu/occasion/",
          "/menu/order",
        ],
        disallow: [
          "/admin/",
          "/admin",
          "/api/",
          "/_next/",
        ],
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
  };
}

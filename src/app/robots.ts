import { MetadataRoute } from "next";
import { getAppUrl } from "@/lib/appUrl";

export default function robots(): MetadataRoute.Robots {
  const appUrl = getAppUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/menu",
          "/menu/cakes",
          "/menu/cake/",
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

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tiokarishop.github.io/tiokarishop";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/checkout", "/account"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

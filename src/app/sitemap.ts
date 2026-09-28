import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tiokarishop.github.io/tiokarishop";

  // Get all products
  const products = await db.product.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  // Get all categories
  const categories = await db.category.findMany({
    select: { slug: true },
  });

  // Static pages
  const staticPages = [
    { url: "", priority: 1.0 },
    { url: "/search", priority: 0.8 },
    { url: "/checkout", priority: 0.5 },
    { url: "/account", priority: 0.5 },
    { url: "/sign-in", priority: 0.3 },
    { url: "/sign-up", priority: 0.3 },
  ];

  // Product pages
  const productPages = products.map((product) => ({
    url: `/product/${product.slug}`,
    lastModified: product.updatedAt,
    priority: 0.9,
  }));

  // Category pages
  const categoryPages = categories.map((category) => ({
    url: `/category/${category.slug}`,
    priority: 0.8,
  }));

  return [
    ...staticPages.map((page) => ({
      url: `${baseUrl}${page.url}`,
      priority: page.priority,
    })),
    ...productPages.map((page) => ({
      url: `${baseUrl}${page.url}`,
      lastModified: page.lastModified,
      priority: page.priority,
    })),
    ...categoryPages.map((page) => ({
      url: `${baseUrl}${page.url}`,
      priority: page.priority,
    })),
  ];
}

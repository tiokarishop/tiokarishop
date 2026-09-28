"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Clock, ChevronRight } from "lucide-react";

interface RecentlyViewedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  viewedAt: Date;
}

export default function RecentlyViewed() {
  const [products, setProducts] = useState<RecentlyViewedProduct[]>([]);

  useEffect(() => {
    // Load recently viewed from localStorage
    const stored = localStorage.getItem("recentlyViewed");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProducts(parsed.slice(0, 5));
      } catch {
        // Invalid data, clear it
        localStorage.removeItem("recentlyViewed");
      }
    }
  }, []);

  const addToRecentlyViewed = (product: RecentlyViewedProduct) => {
    const stored = localStorage.getItem("recentlyViewed");
    let products: RecentlyViewedProduct[] = stored ? JSON.parse(stored) : [];

    // Remove if already exists
    products = products.filter((p) => p.id !== product.id);

    // Add to beginning
    products.unshift(product);

    // Keep only last 10
    products = products.slice(0, 10);

    localStorage.setItem("recentlyViewed", JSON.stringify(products));
    setProducts(products.slice(0, 5));
  };

  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recently Viewed
        </h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="flex-shrink-0 w-40 group"
          >
            <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden mb-2">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-sm font-medium text-gray-900 truncate group-hover:underline">
              {product.name}
            </h3>
            <p className="text-sm font-semibold">{formatPrice(product.price)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

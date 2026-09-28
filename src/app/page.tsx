import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { db } from "@/lib/db";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

async function getFeaturedProducts() {
  return db.product.findMany({
    where: { isActive: true },
    include: {
      category: true,
      variants: true,
      reviews: {
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      },
    },
    take: 8,
    orderBy: { createdAt: "desc" },
  });
}

async function getCategories() {
  return db.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
  });
}

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-xl">
            <p className="text-sm font-medium tracking-widest uppercase text-gray-300 mb-4">
              New Collection 2026
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Elevate Your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400">
                Personal Style
              </span>
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Discover curated collections of premium clothes, shoes, and
              perfumes that define who you are.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/category/clothes"
                className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/category/perfumes"
                className="inline-flex items-center gap-2 border border-white/30 px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                Explore Perfumes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden"
            >
              {cat.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-semibold text-lg">{cat.name}</h3>
                <p className="text-sm text-gray-200">
                  {cat._count.products} products
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link
            href="/search"
            className="text-sm font-medium text-gray-600 hover:text-black flex items-center gap-1"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Value Props */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Premium Quality</h3>
              <p className="text-sm text-gray-600">
                Curated products from top brands and designers
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Fast Shipping</h3>
              <p className="text-sm text-gray-600">
                Free delivery on orders over $75
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Easy Returns</h3>
              <p className="text-sm text-gray-600">
                30-day hassle-free return policy
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

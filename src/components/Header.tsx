"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";
import { ShoppingBag, Search, Menu, User } from "lucide-react";
import { useState } from "react";

const categories = [
  { name: "Clothes", slug: "clothes", href: "/category/clothes" },
  { name: "Shoes", slug: "shoes", href: "/category/shoes" },
  { name: "Perfumes", slug: "perfumes", href: "/category/perfumes" },
  { name: "Accessories", slug: "accessories", href: "/category/accessories" },
];

export default function Header() {
  const { totalItems, toggleCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = totalItems();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              TiokariShop
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={cat.href}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/search"
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>
            <Link
              href="/account"
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>
            <button
              onClick={toggleCart}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-4 space-y-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={cat.href}
                className="block text-sm font-medium text-gray-600 hover:text-gray-900"
                onClick={() => setMobileOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

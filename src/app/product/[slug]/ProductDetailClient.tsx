"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  RotateCcw,
  Shield,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function ProductDetailClient({
  product,
  avgRating,
}: {
  product: Product;
  avgRating: number;
}) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    product.variants.length > 0 ? product.variants[0]?.id ?? null : null
  );
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState<string | null>("description");

  const currentVariant = product.variants.find((v) => v.id === selectedVariant);
  const displayPrice = currentVariant?.price ?? product.price;
  const displayStock = currentVariant?.stock ?? product.stock;

  const handleAddToCart = () => {
    addItem(
      {
        productId: product.id,
        variantId: selectedVariant ?? undefined,
        name: product.name,
        sku: currentVariant?.sku ?? product.sku,
        price: displayPrice,
        image: currentVariant?.image ?? product.images[0],
        variantName: currentVariant?.name,
      },
      quantity
    );
  };

  const sections = [
    { id: "description", label: "Description" },
    { id: "details", label: "Details" },
    { id: "shipping", label: "Shipping & Returns" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    selectedImage === idx
                      ? "border-black"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide">
            {product.category.name}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= avgRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              ({product.reviews.length} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mt-4">
            <span className="text-2xl font-bold">
              {formatPrice(displayPrice)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          {/* Variants */}
          {product.variants.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">
                {product.variants[0]?.options
                  ? Object.keys(product.variants[0].options)[0]
                  : "Option"}
                :{" "}
                <span className="font-normal text-gray-600">
                  {currentVariant?.name}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant.id)}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                      selectedVariant === variant.id
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-black"
                    }`}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4 mt-8">
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-gray-50"
              >
                -
              </button>
              <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(displayStock, quantity + 1))}
                className="px-3 py-2 hover:bg-gray-50"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={displayStock === 0}
              className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="w-5 h-5" />
              {displayStock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
            <button className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>

          {displayStock > 0 && displayStock <= 5 && (
            <p className="text-sm text-red-600 mt-2">
              Only {displayStock} left in stock!
            </p>
          )}

          {/* Value props */}
          <div className="grid grid-cols-3 gap-4 mt-8 py-6 border-t border-b">
            <div className="text-center">
              <Truck className="w-5 h-5 mx-auto mb-1 text-gray-600" />
              <p className="text-xs text-gray-600">Free Shipping</p>
            </div>
            <div className="text-center">
              <RotateCcw className="w-5 h-5 mx-auto mb-1 text-gray-600" />
              <p className="text-xs text-gray-600">30-Day Returns</p>
            </div>
            <div className="text-center">
              <Shield className="w-5 h-5 mx-auto mb-1 text-gray-600" />
              <p className="text-xs text-gray-600">Secure Payment</p>
            </div>
          </div>

          {/* Accordion sections */}
          <div className="mt-6">
            {sections.map((section) => (
              <div key={section.id} className="border-b">
                <button
                  onClick={() =>
                    setOpenSection(
                      openSection === section.id ? null : section.id
                    )
                  }
                  className="flex items-center justify-between w-full py-4 text-left"
                >
                  <span className="font-medium">{section.label}</span>
                  {openSection === section.id ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {openSection === section.id && (
                  <div className="pb-4 text-sm text-gray-600">
                    {section.id === "description" && product.description}
                    {section.id === "details" && (
                      <ul className="list-disc list-inside space-y-1">
                        <li>SKU: {product.sku}</li>
                        {product.attributes != null &&
                          Object.entries(product.attributes as Record<string, string[]>).map(
                            ([key, values]) => (
                              <li key={key}>
                                {key}: {values.join(", ")}
                              </li>
                            )
                          )}
                      </ul>
                    )}
                    {section.id === "shipping" && (
                      <div className="space-y-2">
                        <p>Free standard shipping on orders over $75.</p>
                        <p>Express shipping available at checkout.</p>
                        <p>30-day hassle-free returns.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium text-sm">
                    {review.user.name ?? "Anonymous"}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {review.title && (
                  <h4 className="font-medium mb-1">{review.title}</h4>
                )}
                {review.comment && (
                  <p className="text-sm text-gray-600">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

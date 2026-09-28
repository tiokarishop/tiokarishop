import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import { Heart } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="group">
      <div className="relative aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden mb-3">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {product.comparePrice && product.comparePrice > product.price && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            Sale
          </span>
        )}
        <button
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          {product.category.name}
        </p>
        <h3 className="text-sm font-medium text-gray-900 mt-1 group-hover:underline">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

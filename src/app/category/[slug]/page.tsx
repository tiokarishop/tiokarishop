import { db } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await db.category.findUnique({
    where: { slug },
    include: {
      products: {
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
      },
    },
  });

  if (!category) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{category.name}</h1>
        {category.description && (
          <p className="text-gray-600 mt-2">{category.description}</p>
        )}
        <p className="text-sm text-gray-500 mt-2">
          {category.products.length} products
        </p>
      </div>

      {category.products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No products in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {category.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

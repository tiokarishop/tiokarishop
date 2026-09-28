import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Plus, Edit, Trash2, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  const products = await db.product.findMany({
    include: {
      category: true,
      variants: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Products</h1>
        <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b bg-gray-50">
              <th className="px-6 py-3 font-medium">Product</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Price</th>
              <th className="px-6 py-3 font-medium">Stock</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">{product.category.name}</td>
                <td className="px-6 py-4 text-sm font-medium">{formatPrice(product.price)}</td>
                <td className="px-6 py-4 text-sm">
                  {product.variants.length > 0
                    ? product.variants.reduce((sum, v) => sum + v.stock, 0)
                    : product.stock}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    product.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-gray-100 rounded">
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded">
                      <Edit className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-1.5 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

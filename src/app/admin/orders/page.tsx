import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Eye } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOrders() {
  const orders = await db.order.findMany({
    include: {
      user: { select: { email: true, name: true } },
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Orders</h1>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b bg-gray-50">
              <th className="px-6 py-3 font-medium">Order ID</th>
              <th className="px-6 py-3 font-medium">Customer</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Items</th>
              <th className="px-6 py-3 font-medium">Total</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-mono">#{order.id.slice(-8)}</td>
                <td className="px-6 py-4 text-sm">{order.user.name ?? order.user.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    order.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                    order.status === "SHIPPED" ? "bg-blue-100 text-blue-700" :
                    order.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                    order.status === "REFUNDED" ? "bg-purple-100 text-purple-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{order.items.length}</td>
                <td className="px-6 py-4 text-sm font-medium">{formatPrice(order.total)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <Eye className="w-4 h-4 text-gray-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

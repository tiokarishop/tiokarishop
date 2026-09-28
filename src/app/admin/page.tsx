import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [totalProducts, totalOrders, totalCustomers, recentOrders] =
    await Promise.all([
      db.product.count(),
      db.order.count(),
      db.user.count(),
      db.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { email: true, name: true } },
          items: true,
        },
      }),
    ]);

  const totalRevenue = recentOrders.reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: "Total Revenue", value: formatPrice(totalRevenue), icon: DollarSign, change: "+12.5%" },
    { label: "Total Orders", value: totalOrders.toString(), icon: ShoppingCart, change: "+8.2%" },
    { label: "Total Products", value: totalProducts.toString(), icon: Package, change: "+3" },
    { label: "Total Customers", value: totalCustomers.toString(), icon: Users, change: "+15.3%" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <stat.icon className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Items</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="px-6 py-4 text-sm font-mono">#{order.id.slice(-8)}</td>
                  <td className="px-6 py-4 text-sm">{order.user.name ?? order.user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                      order.status === "SHIPPED" ? "bg-blue-100 text-blue-700" :
                      order.status === "CANCELLED" ? "bg-red-100 text-red-700" :
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

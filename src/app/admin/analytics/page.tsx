"use client";

import { useState } from "react";
import { BarChart3, TrendingUp, Users, ShoppingCart, DollarSign, Package, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");

  const stats = [
    { label: "Total Revenue", value: "$12,450", change: "+12.5%", positive: true, icon: DollarSign },
    { label: "Total Orders", value: "156", change: "+8.2%", positive: true, icon: ShoppingCart },
    { label: "Conversion Rate", value: "3.2%", change: "+0.5%", positive: true, icon: TrendingUp },
    { label: "Avg Order Value", value: "$79.74", change: "-2.1%", positive: false, icon: BarChart3 },
    { label: "New Customers", value: "48", change: "+15.3%", positive: true, icon: Users },
    { label: "Products Sold", value: "234", change: "+24", positive: true, icon: Package },
  ];

  const topProducts = [
    { name: "Classic White Sneakers", sales: 45, revenue: "$4,049.55", trend: "up" },
    { name: "Slim Fit Oxford Shirt", sales: 38, revenue: "$2,279.62", trend: "up" },
    { name: "Eau de Parfum - Noir", sales: 32, revenue: "$4,159.68", trend: "up" },
    { name: "Leather Crossbody Bag", sales: 28, revenue: "$4,199.72", trend: "down" },
    { name: "Running Performance Shoes", sales: 25, revenue: "$2,999.75", trend: "up" },
  ];

  const recentOrders = [
    { id: "#12345", customer: "John Doe", total: "$89.99", status: "Delivered", time: "2 min ago" },
    { id: "#12344", customer: "Sarah Smith", total: "$129.99", status: "Shipped", time: "15 min ago" },
    { id: "#12343", customer: "Mike Johnson", total: "$59.99", status: "Processing", time: "1 hour ago" },
    { id: "#12342", customer: "Emma Wilson", total: "$199.99", status: "Pending", time: "2 hours ago" },
    { id: "#12341", customer: "Alex Brown", total: "$79.99", status: "Delivered", time: "3 hours ago" },
  ];

  const salesData = [
    { day: "Mon", revenue: 1200, orders: 12 },
    { day: "Tue", revenue: 1800, orders: 18 },
    { day: "Wed", revenue: 1500, orders: 15 },
    { day: "Thu", revenue: 2200, orders: 22 },
    { day: "Fri", revenue: 2800, orders: 28 },
    { day: "Sat", revenue: 3200, orders: 32 },
    { day: "Sun", revenue: 2400, orders: 24 },
  ];

  const maxRevenue = Math.max(...salesData.map((d) => d.revenue));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          Analytics
        </h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border rounded-lg px-4 py-2 text-sm"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <stat.icon className="w-5 h-5 text-gray-600" />
              </div>
              <span
                className={`text-xs font-medium flex items-center gap-1 ${
                  stat.positive ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.positive ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-xl border p-6 mb-8">
        <h2 className="text-lg font-semibold mb-6">Sales Overview</h2>
        <div className="flex items-end gap-4 h-48">
          {salesData.map((data) => (
            <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full relative">
                <div
                  className="w-full bg-black rounded-t-lg transition-all hover:bg-gray-800"
                  style={{ height: `${(data.revenue / maxRevenue) * 160}px` }}
                />
              </div>
              <span className="text-xs text-gray-500">{data.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <div className="bg-white rounded-xl border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Top Products</h2>
          </div>
          <div className="divide-y">
            {topProducts.map((product, idx) => (
              <div key={product.name} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{product.revenue}</p>
                  <p className={`text-xs ${product.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {product.trend === "up" ? "↑" : "↓"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
          </div>
          <div className="divide-y">
            {recentOrders.map((order) => (
              <div key={order.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{order.id}</p>
                  <p className="text-xs text-gray-500">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{order.total}</p>
                  <p className="text-xs text-gray-500">{order.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

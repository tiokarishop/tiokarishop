"use client";

import { useState } from "react";
import { ShoppingCart, TrendingUp, Mail, MessageCircle, RefreshCw, Send } from "lucide-react";

export default function AbandonedCartsPage() {
  const [isSending, setIsSending] = useState(false);
  const [lastSent, setLastSent] = useState<Date | null>(null);

  const handleSendReminders = async () => {
    setIsSending(true);
    try {
      const res = await fetch("/api/abandoned-cart/remind", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setLastSent(new Date());
      }
    } catch (error) {
      console.error("Failed to send reminders:", error);
    }
    setIsSending(false);
  };

  const stats = [
    { label: "Abandoned Carts", value: "23", icon: ShoppingCart, change: "+12%" },
    { label: "Recovery Rate", value: "18.5%", icon: TrendingUp, change: "+3.2%" },
    { label: "Emails Sent", value: "156", icon: Mail, change: "+24" },
    { label: "WhatsApp Sent", value: "89", icon: MessageCircle, change: "+18" },
  ];

  const abandonedCarts = [
    { id: "1", customer: "john@example.com", items: 3, total: 189.99, timeAgo: "2 hours ago", status: "pending" },
    { id: "2", customer: "sarah@example.com", items: 1, total: 79.99, timeAgo: "3 hours ago", status: "reminded" },
    { id: "3", customer: "mike@example.com", items: 2, total: 149.98, timeAgo: "5 hours ago", status: "recovered" },
    { id: "4", customer: "emma@example.com", items: 4, total: 299.96, timeAgo: "1 day ago", status: "reminded" },
    { id: "5", customer: "alex@example.com", items: 1, total: 59.99, timeAgo: "1 day ago", status: "pending" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingCart className="w-6 h-6" />
          Abandoned Cart Recovery
        </h1>
        <button
          onClick={handleSendReminders}
          disabled={isSending}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400"
        >
          <Send className="w-4 h-4" />
          {isSending ? "Sending..." : "Send Reminders Now"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <stat.icon className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-xs text-green-600 font-medium">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recovery Settings */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Recovery Settings</h2>
        <div className="space-y-4">
          {[
            { label: "First Reminder", desc: "Send 1 hour after abandonment", value: "1 hour" },
            { label: "Second Reminder", desc: "Send 24 hours after abandonment", value: "24 hours" },
            { label: "Final Reminder", desc: "Send 72 hours after abandonment with discount", value: "72 hours" },
            { label: "Discount Incentive", desc: "Offer 10% off in final reminder", value: "10% off" },
          ].map((setting) => (
            <div key={setting.label} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-sm">{setting.label}</p>
                <p className="text-xs text-gray-500">{setting.desc}</p>
              </div>
              <span className="text-sm font-medium text-gray-700">{setting.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Abandoned Carts List */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Abandoned Carts</h2>
          {lastSent && (
            <span className="text-xs text-gray-500">
              Last reminder sent: {lastSent.toLocaleTimeString()}
            </span>
          )}
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b bg-gray-50">
              <th className="px-6 py-3 font-medium">Customer</th>
              <th className="px-6 py-3 font-medium">Items</th>
              <th className="px-6 py-3 font-medium">Total</th>
              <th className="px-6 py-3 font-medium">Abandoned</th>
              <th className="px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {abandonedCarts.map((cart) => (
              <tr key={cart.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{cart.customer}</td>
                <td className="px-6 py-4 text-sm">{cart.items}</td>
                <td className="px-6 py-4 text-sm font-medium">${cart.total.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{cart.timeAgo}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      cart.status === "recovered"
                        ? "bg-green-100 text-green-700"
                        : cart.status === "reminded"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {cart.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

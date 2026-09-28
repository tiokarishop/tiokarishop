"use client";

import { useState } from "react";
import { User, Package, Heart, MapPin, Settings, LogOut } from "lucide-react";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("orders");

  const tabs = [
    { id: "orders", label: "Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="font-medium">John Doe</p>
              <p className="text-sm text-gray-500">john@example.com</p>
            </div>
          </div>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
            <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          {activeTab === "orders" && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Order History</h2>
              <div className="text-center py-16 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">No orders yet</p>
                <p className="text-sm mt-2">Your order history will appear here</p>
              </div>
            </div>
          )}

          {activeTab === "wishlist" && (
            <div>
              <h2 className="text-xl font-semibold mb-6">My Wishlist</h2>
              <div className="text-center py-16 text-gray-500">
                <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Your wishlist is empty</p>
                <p className="text-sm mt-2">Save items you love for later</p>
              </div>
            </div>
          )}

          {activeTab === "addresses" && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Saved Addresses</h2>
              <div className="text-center py-16 text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">No saved addresses</p>
                <p className="text-sm mt-2">Add addresses for faster checkout</p>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
              <div className="space-y-6 max-w-md">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input type="text" className="w-full border rounded-lg px-4 py-2" defaultValue="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" className="w-full border rounded-lg px-4 py-2" defaultValue="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <input type="password" className="w-full border rounded-lg px-4 py-2" placeholder="Leave blank to keep current" />
                </div>
                <button className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

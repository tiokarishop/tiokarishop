"use client";

import { useState } from "react";
import { MessageCircle, Send, CheckCircle, XCircle, Settings, TestTube } from "lucide-react";

export default function WhatsAppSettingsPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [settings, setSettings] = useState({
    phoneNumberId: "",
    accessToken: "",
    verifyToken: "",
    autoReplyEnabled: true,
    orderNotifications: true,
    shippingNotifications: true,
    deliveryNotifications: true,
    abandonedCartReminders: true,
  });

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/whatsapp/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "order_confirmation",
          phone: "+1234567890",
          customerName: "Test User",
          orderId: "TEST-001",
          items: [{ name: "Test Product", quantity: 1, price: 29.99 }],
          total: 29.99,
        }),
      });

      const data = await res.json();
      setTestResult({
        success: data.success,
        message: data.success
          ? "Test message sent successfully!"
          : `Failed: ${data.error || "Unknown error"}`,
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: "Failed to connect to WhatsApp API",
      });
    }

    setIsTesting(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <MessageCircle className="w-6 h-6" />
        WhatsApp Business API
      </h1>

      {/* Connection Status */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Connection Status</h2>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
              isConnected
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {isConnected ? (
              <>
                <CheckCircle className="w-4 h-4" /> Connected
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" /> Not Connected
              </>
            )}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Connect your WhatsApp Business API to send automated order notifications,
          shipping updates, and respond to customer messages.
        </p>
        <button
          onClick={handleTestConnection}
          disabled={isTesting}
          className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400"
        >
          <TestTube className="w-4 h-4" />
          {isTesting ? "Testing..." : "Send Test Message"}
        </button>
        {testResult && (
          <div
            className={`mt-4 p-3 rounded-lg text-sm ${
              testResult.success
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {testResult.message}
          </div>
        )}
      </div>

      {/* API Configuration */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          API Configuration
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number ID</label>
            <input
              type="text"
              value={settings.phoneNumberId}
              onChange={(e) =>
                setSettings({ ...settings, phoneNumberId: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Your WhatsApp Business Phone Number ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Access Token</label>
            <input
              type="password"
              value={settings.accessToken}
              onChange={(e) =>
                setSettings({ ...settings, accessToken: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Your Meta Access Token"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Verify Token</label>
            <input
              type="text"
              value={settings.verifyToken}
              onChange={(e) =>
                setSettings({ ...settings, verifyToken: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Your Webhook Verify Token"
            />
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
        <div className="space-y-4">
          {[
            { key: "autoReplyEnabled", label: "Auto-Reply Messages", desc: "Automatically respond to customer messages" },
            { key: "orderNotifications", label: "Order Confirmations", desc: "Send WhatsApp message when order is placed" },
            { key: "shippingNotifications", label: "Shipping Updates", desc: "Notify when order ships" },
            { key: "deliveryNotifications", label: "Delivery Confirmations", desc: "Notify when order is delivered" },
            { key: "abandonedCartReminders", label: "Abandoned Cart Reminders", desc: "Remind customers about items left in cart" },
          ].map((item) => (
            <label key={item.key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={settings[item.key as keyof typeof settings] as boolean}
                onChange={(e) =>
                  setSettings({ ...settings, [item.key]: e.target.checked })
                }
                className="w-5 h-5 rounded"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
        <Send className="w-4 h-4" />
        Save Settings
      </button>
    </div>
  );
}

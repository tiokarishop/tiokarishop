import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { Package, Truck, CheckCircle, Clock, MapPin, CreditCard } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: { select: { id: true, name: true, images: true } },
        },
      },
      user: { select: { id: true, email: true, name: true } },
    },
  });

  if (!order) notFound();

  const steps = [
    { id: "PENDING", label: "Order Placed", icon: Clock, completed: true },
    { id: "PROCESSING", label: "Processing", icon: Package, completed: ["PROCESSING", "SHIPPED", "DELIVERED"].includes(order.status) },
    { id: "SHIPPED", label: "Shipped", icon: Truck, completed: ["SHIPPED", "DELIVERED"].includes(order.status) },
    { id: "DELIVERED", label: "Delivered", icon: CheckCircle, completed: order.status === "DELIVERED" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">Order Tracking</h1>
      <p className="text-gray-600 mb-8">Order #{order.id.slice(-8)}</p>

      {/* Progress Tracker */}
      <div className="bg-white rounded-xl border p-6 mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    step.completed
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  <step.icon className="w-6 h-6" />
                </div>
                <p
                  className={`text-sm mt-2 font-medium ${
                    step.completed ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </p>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`w-16 sm:w-24 h-1 mx-2 ${
                    step.completed ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                    {item.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-sm font-semibold mt-1">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="border-t mt-6 pt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Shipping Address
            </h2>
            <p className="text-sm text-gray-600">
              {(order.shippingAddress as Record<string, string>).name}
              <br />
              {(order.shippingAddress as Record<string, string>).line1}
              <br />
              {(order.shippingAddress as Record<string, string>).city}, {(order.shippingAddress as Record<string, string>).state}{" "}
              {(order.shippingAddress as Record<string, string>).postalCode}
              <br />
              {(order.shippingAddress as Record<string, string>).country}
            </p>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment
            </h2>
            <p className="text-sm text-gray-600">
              Paid via Stripe
              <br />
              <span className="text-xs text-gray-400">
                {order.stripePaymentId
                  ? `Transaction: ${order.stripePaymentId.slice(-8)}`
                  : "Payment pending"}
              </span>
            </p>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold mb-4">Order Status</h2>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                order.status === "DELIVERED"
                  ? "bg-green-100 text-green-700"
                  : order.status === "SHIPPED"
                  ? "bg-blue-100 text-blue-700"
                  : order.status === "CANCELLED"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {order.status}
            </span>
            <p className="text-sm text-gray-500 mt-2">
              Ordered on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

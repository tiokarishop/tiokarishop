"use client";

import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock, CreditCard, Truck, CheckCircle, Tag, X } from "lucide-react";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [step, setStep] = useState<"cart" | "shipping" | "payment">("cart");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    amount: number;
  } | null>(null);
  const [discountError, setDiscountError] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const subtotalAmount = subtotal();
  const discountAmount = appliedDiscount?.amount || 0;
  const shipping = subtotalAmount - discountAmount > 75 ? 0 : 9.99;
  const tax = (subtotalAmount - discountAmount) * 0.08;
  const total = subtotalAmount - discountAmount + shipping + tax;

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;

    setIsApplying(true);
    setDiscountError("");

    try {
      const res = await fetch("/api/discount/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: discountCode,
          subtotal: subtotalAmount,
        }),
      });

      const data = await res.json();

      if (data.valid) {
        setAppliedDiscount({
          code: discountCode.toUpperCase(),
          amount: data.discountAmount,
        });
        setDiscountError("");
      } else {
        setDiscountError(data.message);
        setAppliedDiscount(null);
      }
    } catch (error) {
      setDiscountError("Failed to apply discount");
    }

    setIsApplying(false);
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode("");
    setDiscountError("");
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    clearCart();
    setOrderComplete(true);
    setIsProcessing(false);
  };

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your order. You will receive a confirmation email shortly.
        </p>
        <Link
          href="/"
          className="inline-block bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8">
          Add some products to your cart before checking out.
        </p>
        <Link
          href="/"
          className="inline-block bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Progress */}
      <div className="flex items-center gap-4 mb-10">
        {["cart", "shipping", "payment"].map((s, idx) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s
                  ? "bg-black text-white"
                  : idx < ["cart", "shipping", "payment"].indexOf(step)
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {idx + 1}
            </div>
            <span className="text-sm font-medium capitalize hidden sm:inline">
              {s}
            </span>
            {idx < 2 && <div className="w-8 h-px bg-gray-300 mx-2" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form */}
        <div className="lg:col-span-2">
          {step === "cart" && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Review Your Cart</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b pb-4">
                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      {item.variantName && (
                        <p className="text-sm text-gray-500">{item.variantName}</p>
                      )}
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setStep("shipping")}
                className="mt-6 w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Continue to Shipping
              </button>
            </div>
          )}

          {step === "shipping" && (
            <div>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Shipping Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input type="text" className="w-full border rounded-lg px-4 py-2" placeholder="John Doe" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input type="text" className="w-full border rounded-lg px-4 py-2" placeholder="123 Main St" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input type="text" className="w-full border rounded-lg px-4 py-2" placeholder="New York" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State</label>
                  <input type="text" className="w-full border rounded-lg px-4 py-2" placeholder="NY" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Postal Code</label>
                  <input type="text" className="w-full border rounded-lg px-4 py-2" placeholder="10001" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input type="tel" className="w-full border rounded-lg px-4 py-2" placeholder="+1 234 567 8900" />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setStep("cart")}
                  className="flex-1 border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("payment")}
                  className="flex-1 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {step === "payment" && (
            <div>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Card Number</label>
                  <input type="text" className="w-full border rounded-lg px-4 py-2" placeholder="4242 4242 4242 4242" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Expiry</label>
                    <input type="text" className="w-full border rounded-lg px-4 py-2" placeholder="MM/YY" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CVC</label>
                    <input type="text" className="w-full border rounded-lg px-4 py-2" placeholder="123" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                <Lock className="w-4 h-4" />
                Your payment is secured with SSL encryption
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setStep("shipping")}
                  className="flex-1 border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="flex-1 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                >
                  {isProcessing ? "Processing..." : `Pay ${formatPrice(total)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            {/* Discount Code Input */}
            <div className="mb-4">
              {appliedDiscount ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      {appliedDiscount.code}
                    </span>
                    <span className="text-sm text-green-600">
                      -{formatPrice(appliedDiscount.amount)}
                    </span>
                  </div>
                  <button
                    onClick={removeDiscount}
                    className="p-1 hover:bg-green-100 rounded"
                  >
                    <X className="w-4 h-4 text-green-600" />
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                      placeholder="Discount code"
                      className="flex-1 border rounded-lg px-3 py-2 text-sm uppercase"
                    />
                    <button
                      onClick={handleApplyDiscount}
                      disabled={isApplying || !discountCode.trim()}
                      className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300"
                    >
                      {isApplying ? "..." : "Apply"}
                    </button>
                  </div>
                  {discountError && (
                    <p className="text-xs text-red-500 mt-1">{discountError}</p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(subtotalAmount)}</span>
              </div>
              {appliedDiscount && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedDiscount.code})</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

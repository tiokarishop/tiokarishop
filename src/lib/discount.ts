/**
 * Discount & Coupon System for TiokariShop
 * Handles promo codes, discounts, and special offers
 */

import { db } from "@/lib/db";

export interface DiscountCode {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  startsAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}

export interface DiscountResult {
  valid: boolean;
  discountAmount: number;
  finalTotal: number;
  message: string;
}

/**
 * Validate and apply a discount code
 */
export async function applyDiscountCode(
  code: string,
  subtotal: number
): Promise<DiscountResult> {
  const discount = await db.discountCode.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!discount) {
    return {
      valid: false,
      discountAmount: 0,
      finalTotal: subtotal,
      message: "Invalid discount code",
    };
  }

  if (!discount.isActive) {
    return {
      valid: false,
      discountAmount: 0,
      finalTotal: subtotal,
      message: "This discount code is no longer active",
    };
  }

  const now = new Date();

  if (discount.startsAt > now) {
    return {
      valid: false,
      discountAmount: 0,
      finalTotal: subtotal,
      message: "This discount code is not yet valid",
    };
  }

  if (discount.expiresAt && discount.expiresAt < now) {
    return {
      valid: false,
      discountAmount: 0,
      finalTotal: subtotal,
      message: "This discount code has expired",
    };
  }

  if (discount.minOrderAmount && subtotal < discount.minOrderAmount) {
    return {
      valid: false,
      discountAmount: 0,
      finalTotal: subtotal,
      message: `Minimum order amount of $${discount.minOrderAmount} required`,
    };
  }

  if (discount.usageLimit && discount.usageCount >= discount.usageLimit) {
    return {
      valid: false,
      discountAmount: 0,
      finalTotal: subtotal,
      message: "This discount code has reached its usage limit",
    };
  }

  // Calculate discount
  let discountAmount = 0;
  if (discount.type === "PERCENTAGE") {
    discountAmount = (subtotal * discount.value) / 100;
  } else {
    discountAmount = discount.value;
  }

  // Apply max discount cap
  if (discount.maxDiscount && discountAmount > discount.maxDiscount) {
    discountAmount = discount.maxDiscount;
  }

  // Ensure discount doesn't exceed subtotal
  if (discountAmount > subtotal) {
    discountAmount = subtotal;
  }

  const finalTotal = subtotal - discountAmount;

  return {
    valid: true,
    discountAmount,
    finalTotal,
    message: `Discount applied: -$${discountAmount.toFixed(2)}`,
  };
}

/**
 * Increment usage count for a discount code
 */
export async function incrementDiscountUsage(code: string) {
  await db.discountCode.update({
    where: { code: code.toUpperCase() },
    data: { usageCount: { increment: 1 } },
  });
}

/**
 * Get all active discount codes
 */
export async function getActiveDiscounts() {
  return db.discountCode.findMany({
    where: {
      isActive: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    },
  });
}

/**
 * Create a new discount code
 */
export async function createDiscountCode(data: {
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  startsAt?: Date;
  expiresAt?: Date;
}) {
  return db.discountCode.create({
    data: {
      code: data.code.toUpperCase(),
      type: data.type,
      value: data.value,
      minOrderAmount: data.minOrderAmount,
      maxDiscount: data.maxDiscount,
      usageLimit: data.usageLimit,
      startsAt: data.startsAt || new Date(),
      expiresAt: data.expiresAt,
      isActive: true,
      usageCount: 0,
    },
  });
}

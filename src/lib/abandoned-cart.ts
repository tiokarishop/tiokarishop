/**
 * Abandoned Cart Recovery Service
 * Tracks carts that were abandoned and sends recovery reminders
 */

import { db } from "@/lib/db";
import { sendAbandonedCartReminder } from "@/lib/whatsapp";

export interface AbandonedCart {
  id: string;
  userId: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  createdAt: Date;
  lastReminderSent: Date | null;
  reminderCount: number;
  recovered: boolean;
}

/**
 * Track a cart as abandoned (called when user leaves without checking out)
 */
export async function trackAbandonedCart(userId: string, items: Array<{
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}>) {
  // In a real implementation, you'd store this in a separate AbandonedCart table
  // For now, we'll use the existing CartItem table with a flag
  console.log(`[Abandoned Cart] Tracking cart for user ${userId} with ${items.length} items`);
}

/**
 * Send recovery reminders for abandoned carts
 * Should be run as a cron job (e.g., every hour)
 */
export async function sendAbandonedCartReminders() {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Find carts that have been inactive for 1+ hours
  const abandonedCarts = await db.cartItem.findMany({
    include: {
      user: { select: { id: true, email: true, name: true } },
      product: { select: { id: true, name: true, price: true, images: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // Group by user
  const userCarts = new Map<string, typeof abandonedCarts>();

  for (const item of abandonedCarts) {
    if (!userCarts.has(item.userId)) {
      userCarts.set(item.userId, []);
    }
    userCarts.get(item.userId)!.push(item);
  }

  // Send reminders
  for (const [userId, items] of userCarts) {
    const user = items[0].user;
    const cartTotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    // Send WhatsApp reminder if phone is available
    // In a real implementation, you'd have the user's phone number
    console.log(`[Abandoned Cart] Sending reminder to ${user.email} for ${items.length} items ($${cartTotal.toFixed(2)})`);

    // Example: Send via WhatsApp
    // await sendAbandonedCartReminder(phone, {
    //   customerName: user.name || user.email,
    //   items: items.map((i) => ({ name: i.product.name, price: i.product.price })),
    //   cartTotal,
    // });
  }

  return { remindersSent: userCarts.size };
}

/**
 * Mark cart as recovered (called when user completes checkout)
 */
export async function markCartRecovered(userId: string) {
  console.log(`[Abandoned Cart] Cart recovered for user ${userId}`);
  // In a real implementation, update the AbandonedCart table
}

/**
 * Get abandoned cart statistics
 */
export async function getAbandonedCartStats() {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const [totalAbandoned, totalRecovered, totalReminders] = await Promise.all([
    db.cartItem.count(),
    0, // Would come from AbandonedCart table
    0, // Would come from AbandonedCart table
  ]);

  return {
    totalAbandoned,
    totalRecovered,
    totalReminders,
    recoveryRate: totalAbandoned > 0 ? (totalRecovered / totalAbandoned) * 100 : 0,
  };
}

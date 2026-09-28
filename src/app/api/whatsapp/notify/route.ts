import { NextRequest, NextResponse } from "next/server";
import {
  sendOrderConfirmation,
  sendShippingNotification,
  sendDeliveryConfirmation,
  sendAbandonedCartReminder,
} from "@/lib/whatsapp";
import { db } from "@/lib/db";

/**
 * POST /api/whatsapp/notify
 * Send WhatsApp notifications for various e-commerce events
 *
 * Body: {
 *   type: "order_confirmation" | "shipping" | "delivery" | "abandoned_cart",
 *   phone: string,
 *   orderId?: string,
 *   customerName: string,
 *   ...
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, phone, ...data } = body;

    if (!phone || !type) {
      return NextResponse.json(
        { error: "Phone number and notification type are required" },
        { status: 400 }
      );
    }

    // Validate phone number format (E.164)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: "Invalid phone number format. Use E.164 format (e.g., +1234567890)" },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case "order_confirmation": {
        const order = await db.order.findUnique({
          where: { id: data.orderId },
          include: { items: true },
        });

        if (!order) {
          return NextResponse.json(
            { error: "Order not found" },
            { status: 404 }
          );
        }

        result = await sendOrderConfirmation(phone, {
          orderId: order.id.slice(-8),
          customerName: data.customerName,
          items: order.items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          total: order.total,
          estimatedDelivery: data.estimatedDelivery,
        });
        break;
      }

      case "shipping": {
        result = await sendShippingNotification(phone, {
          orderId: data.orderId,
          customerName: data.customerName,
          trackingNumber: data.trackingNumber,
          carrier: data.carrier,
        });
        break;
      }

      case "delivery": {
        result = await sendDeliveryConfirmation(phone, {
          orderId: data.orderId,
          customerName: data.customerName,
        });
        break;
      }

      case "abandoned_cart": {
        result = await sendAbandonedCartReminder(phone, {
          customerName: data.customerName,
          items: data.items,
          cartTotal: data.cartTotal,
        });
        break;
      }

      default:
        return NextResponse.json(
          { error: "Invalid notification type" },
          { status: 400 }
        );
    }

    // Log notification
    console.log(`[WhatsApp] ${type} notification sent to ${phone}:`, result);

    return NextResponse.json({
      success: result.success,
      type,
      phone,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("WhatsApp notification error:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}

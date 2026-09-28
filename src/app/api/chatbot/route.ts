import { NextRequest, NextResponse } from "next/server";
import { processMessage } from "@/lib/ai-chatbot";
import { db } from "@/lib/db";

/**
 * POST /api/chatbot
 * AI Chatbot endpoint - processes customer messages and returns intelligent responses
 *
 * Body: {
 *   message: string,
 *   context?: {
 *     userId?: string,
 *     cartItems?: Array<{ productId: string, name: string, price: number }>
 *   }
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, context } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Enrich context with user data if userId provided
    let enrichedContext = context || {};

    if (context?.userId) {
      const [cartItems, recentOrders] = await Promise.all([
        db.cartItem.findMany({
          where: { userId: context.userId },
          include: { product: { select: { id: true, name: true, price: true } } },
        }),
        db.order.findMany({
          where: { userId: context.userId },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      ]);

      enrichedContext = {
        ...enrichedContext,
        cartItems: cartItems.map((item) => ({
          productId: item.productId,
          name: item.product.name,
          price: item.product.price,
        })),
        recentOrders: recentOrders.map((order) => ({
          id: order.id,
          status: order.status,
          total: order.total,
        })),
      };
    }

    const response = await processMessage(message, enrichedContext);

    return NextResponse.json({
      ...response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}

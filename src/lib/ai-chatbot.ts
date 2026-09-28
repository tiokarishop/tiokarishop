/**
 * AI Chatbot Service for TiokariShop
 * Provides intelligent responses to customer queries using rule-based logic
 * Can be extended to use OpenAI/Claude API for more advanced responses
 */

import { db } from "@/lib/db";

export interface ChatbotResponse {
  message: string;
  suggestions?: string[];
  products?: Array<{
    id: string;
    name: string;
    price: number;
    image?: string;
    slug: string;
  }>;
  action?: "show_products" | "track_order" | "contact_support" | "none";
}

/**
 * Process customer message and generate AI response
 */
export async function processMessage(
  message: string,
  context?: {
    userId?: string;
    cartItems?: Array<{ productId: string; name: string; price: number }>;
    recentOrders?: Array<{ id: string; status: string; total: number }>;
  }
): Promise<ChatbotResponse> {
  const lower = message.toLowerCase().trim();

  // Greeting
  if (isGreeting(lower)) {
    return {
      message: `👋 Hello! Welcome to TiokariShop. I'm your AI shopping assistant. I can help you with:

• 🔍 Finding products
• 📦 Tracking orders
• 🚚 Shipping information
• ↩️ Returns & refunds
• 💡 Product recommendations

What would you like help with today?`,
      suggestions: ["Show new arrivals", "Track my order", "Shipping info", "Talk to support"],
      action: "none",
    };
  }

  // Product search
  if (isProductSearch(lower)) {
    const products = await searchProducts(lower);
    if (products.length > 0) {
      return {
        message: `I found ${products.length} product${products.length > 1 ? "s" : ""} that might interest you:`,
        products: products.slice(0, 4),
        suggestions: ["Show more details", "Add to cart", "Show similar items"],
        action: "show_products",
      };
    }
    return {
      message: `I couldn't find any products matching "${message}". Would you like to:

• Browse our categories
• Try a different search term
• Speak with a team member`,
      suggestions: ["Browse categories", "New arrivals", "Talk to support"],
      action: "none",
    };
  }

  // Order tracking
  if (isOrderTracking(lower)) {
    if (context?.recentOrders && context.recentOrders.length > 0) {
      const orders = context.recentOrders
        .map((o) => `• Order #${o.id.slice(-8)} — ${o.status} ($${o.total.toFixed(2)})`)
        .join("\n");
      return {
        message: `📦 Here are your recent orders:\n\n${orders}\n\nYou can track any order in real-time from your account page.`,
        suggestions: ["View all orders", "Contact support"],
        action: "track_order",
      };
    }
    return {
      message: `📦 To track your order, please visit your account page where you'll find real-time updates on all your orders.

If you have your order number, I can look it up for you.`,
      suggestions: ["View account", "Contact support"],
      action: "track_order",
    };
  }

  // Shipping info
  if (isShippingQuery(lower)) {
    return {
      message: `🚚 **Shipping Information**

• **Standard Shipping** (3-5 business days): $9.99
• **Express Shipping** (1-2 business days): $19.99
• **Free Standard Shipping** on orders over $75

All orders include tracking. You'll receive a confirmation email with tracking details once your order ships.`,
      suggestions: ["Track my order", "Shipping policy", "Contact support"],
      action: "none",
    };
  }

  // Returns
  if (isReturnQuery(lower)) {
    return {
      message: `↩️ **Returns & Refunds**

• **30-day** hassle-free returns
• Free return shipping on defective items
• Refunds processed within **5-7 business days**
• Items must be in original condition

To start a return, visit your account page or contact our support team.`,
      suggestions: ["Start a return", "Return policy", "Contact support"],
      action: "none",
    };
  }

  // Recommendations
  if (isRecommendationRequest(lower)) {
    const recommendations = await getRecommendations(context?.cartItems);
    if (recommendations.length > 0) {
      return {
        message: `💡 Based on your interests, here are some recommendations:`,
        products: recommendations.slice(0, 4),
        suggestions: ["Show more", "New arrivals", "Browse all"],
        action: "show_products",
      };
    }
    return {
      message: `💡 I'd love to help you find something special! Here are our most popular items:`,
      products: await getPopularProducts(),
      suggestions: ["New arrivals", "Best sellers", "Sale items"],
      action: "show_products",
    };
  }

  // Support
  if (isSupportRequest(lower)) {
    return {
      message: `👋 **Customer Support**

Our team is here to help! You can reach us:

• 📧 Email: support@tiokarishop.com
• 💬 Live Chat: Available on our website
• 🕐 Hours: Mon-Fri, 9AM-6PM EST

We typically respond within 2 hours during business hours.`,
      suggestions: ["Email support", "FAQ", "Shipping info"],
      action: "contact_support",
    };
  }

  // Price inquiry
  if (isPriceQuery(lower)) {
    return {
      message: `💰 **Pricing Information**

I can help you find products within your budget. What price range are you looking for?

• Under $50
• $50 - $100
• $100 - $200
• Over $200`,
      suggestions: ["Under $50", "$50-$100", "$100-$200", "Over $200"],
      action: "none",
    };
  }

  // Default response
  return {
    message: `I'm here to help! 💜

I can assist you with:
• 🔍 Finding products
• 📦 Order tracking
• 🚚 Shipping information
• ↩️ Returns & refunds
• 💡 Recommendations

What would you like to know?`,
    suggestions: ["Browse products", "Track order", "Shipping info", "Support"],
    action: "none",
  };
}

// Intent detection helpers
function isGreeting(text: string): boolean {
  return ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"].some((g) => text.includes(g));
}

function isProductSearch(text: string): boolean {
  return ["show", "find", "looking for", "search", "buy", "shop", "need", "want"].some((k) => text.includes(k));
}

function isOrderTracking(text: string): boolean {
  return ["track", "order", "status", "where is", "delivery status"].some((k) => text.includes(k));
}

function isShippingQuery(text: string): boolean {
  return ["shipping", "delivery", "how long", "arrive", "ship"].some((k) => text.includes(k));
}

function isReturnQuery(text: string): boolean {
  return ["return", "refund", "exchange", "send back"].some((k) => text.includes(k));
}

function isRecommendationRequest(text: string): boolean {
  return ["recommend", "suggest", "popular", "best", "trending", "new", "arrival"].some((k) => text.includes(k));
}

function isSupportRequest(text: string): boolean {
  return ["support", "help", "human", "agent", "person", "contact"].some((k) => text.includes(k));
}

function isPriceQuery(text: string): boolean {
  return ["price", "cost", "how much", "budget", "cheap", "expensive"].some((k) => text.includes(k));
}

// Product search
async function searchProducts(query: string) {
  const searchTerms = query
    .replace(/show|find|looking for|search|buy|shop|need|want/gi, "")
    .trim();

  return db.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: searchTerms, mode: "insensitive" } },
        { description: { contains: searchTerms, mode: "insensitive" } },
        { category: { name: { contains: searchTerms, mode: "insensitive" } } },
      ],
    },
    include: { category: true },
    take: 4,
  });
}

// Get recommendations based on cart items
async function getRecommendations(cartItems?: Array<{ productId: string; name: string; price: number }>) {
  if (!cartItems || cartItems.length === 0) {
    return getPopularProducts();
  }

  // Get categories from cart items
  const cartProducts = await db.product.findMany({
    where: { id: { in: cartItems.map((i) => i.productId) } },
    select: { categoryId: true },
  });

  const categoryIds = [...new Set(cartProducts.map((p) => p.categoryId))];

  return db.product.findMany({
    where: {
      isActive: true,
      categoryId: { in: categoryIds },
      id: { notIn: cartItems.map((i) => i.productId) },
    },
    include: { category: true },
    take: 4,
  });
}

// Get popular products
async function getPopularProducts() {
  return db.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });
}

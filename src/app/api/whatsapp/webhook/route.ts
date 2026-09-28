import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/whatsapp/webhook
 * Webhook verification for Meta WhatsApp Business API
 * Meta sends a GET request to verify the webhook URL
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode === "subscribe" && token === verifyToken) {
    console.log("WhatsApp webhook verified");
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

/**
 * POST /api/whatsapp/webhook
 * Receive incoming messages from WhatsApp customers
 * Handles auto-replies and message processing
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Handle different webhook event types
    if (body.object === "whatsapp_business_account") {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.field === "messages") {
            const messages = change.value.messages;
            const metadata = change.value.metadata;

            if (messages) {
              for (const message of messages) {
                await handleIncomingMessage(message, metadata);
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("WhatsApp webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

/**
 * Handle incoming WhatsApp messages with auto-reply logic
 */
async function handleIncomingMessage(
  message: {
    from: string;
    id: string;
    timestamp: string;
    type: string;
    text?: { body: string };
    button?: { payload: string; text: string };
  },
  metadata: {
    display_phone_number: string;
    phone_number_id: string;
  }
) {
  const { sendWhatsAppMessage } = await import("@/lib/whatsapp");

  const from = message.from;
  const messageType = message.type;

  // Handle different message types
  if (messageType === "text") {
    const text = message.text?.body?.toLowerCase() || "";

    // Auto-reply based on keywords
    if (text.includes("order") || text.includes("track")) {
      await sendWhatsAppMessage(
        from,
        `📦 *Track Your Order*

To track your order, please visit:
${process.env.NEXT_PUBLIC_APP_URL}/account

You'll find real-time updates on all your orders there.

Need help? Type "support" to speak with our team.`
      );
    } else if (text.includes("shipping") || text.includes("delivery")) {
      await sendWhatsAppMessage(
        from,
        `🚚 *Shipping Information*

• Free standard shipping on orders over $75
• Express shipping available at checkout
• Delivery time: 3-5 business days (standard)
• Tracking available for all orders

Questions? Type "support" to speak with our team.`
      );
    } else if (text.includes("return") || text.includes("refund")) {
      await sendWhatsAppMessage(
        from,
        `↩️ *Returns & Refunds*

• 30-day hassle-free returns
• Free return shipping on defective items
• Refunds processed within 5-7 business days

Start a return: ${process.env.NEXT_PUBLIC_APP_URL}/account

Need help? Type "support" to speak with our team.`
      );
    } else if (text.includes("support") || text.includes("help") || text.includes("human")) {
      await sendWhatsAppMessage(
        from,
        `👋 *Customer Support*

Our team is here to help! You can reach us:

📧 Email: support@tiokarishop.com
💬 Live Chat: Available on our website
🕐 Hours: Mon-Fri, 9AM-6PM EST

We typically respond within 2 hours during business hours.`
      );
    } else if (text.includes("hi") || text.includes("hello") || text.includes("hey")) {
      await sendWhatsAppMessage(
        from,
        `👋 *Welcome to TiokariShop!*

Hi there! I'm your TiokariShop assistant. Here's what I can help you with:

• 📦 *Track* — Track your order
• 🚚 *Shipping* — Shipping info
• ↩️ *Returns* — Returns & refunds
• 👋 *Support* — Speak to our team

Just type a keyword or ask me anything!`
      );
    } else {
      // Default response
      await sendWhatsAppMessage(
        from,
        `Thanks for reaching out! 💜

I can help you with:
• Order tracking
• Shipping info
• Returns & refunds
• Customer support

Type a keyword or visit our website:
${process.env.NEXT_PUBLIC_APP_URL}`
      );
    }
  } else if (messageType === "button") {
    // Handle button clicks (e.g., from list messages)
    const payload = message.button?.payload || "";
    await sendWhatsAppMessage(
      from,
      `You selected: ${message.button?.text}\n\nHow can I help you further?`
    );
  } else {
    // Handle non-text messages (images, audio, etc.)
    await sendWhatsAppMessage(
      from,
      `Thanks for your message! 💜

For the best experience, please type your question. I can help with:
• Order tracking
• Shipping info
• Returns & refunds
• Customer support`
    );
  }
}

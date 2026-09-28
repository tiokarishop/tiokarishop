/**
 * WhatsApp Business API (Meta Cloud API) notification service
 * Handles sending order notifications to customers via WhatsApp
 */

const WHATSAPP_API_URL = "https://graph.facebook.com/v21.0";
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

export interface WhatsAppMessage {
  to: string;
  type: "text" | "template";
  content: string | WhatsAppTemplate;
}

export interface WhatsAppTemplate {
  name: string;
  language: string;
  components?: Array<{
    type: string;
    parameters: Array<{
      type: string;
      text?: string;
      image?: { link: string };
    }>;
  }>;
}

/**
 * Send a text message via WhatsApp Business API
 */
export async function sendWhatsAppMessage(to: string, message: string) {
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    console.warn("WhatsApp API not configured. Set WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN.");
    return { success: false, error: "WhatsApp API not configured" };
  }

  try {
    const response = await fetch(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: to.replace("+", ""),
          type: "text",
          text: { body: message },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("WhatsApp API error:", data);
      return { success: false, error: data };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send WhatsApp message:", error);
    return { success: false, error };
  }
}

/**
 * Send a template message via WhatsApp Business API
 */
export async function sendWhatsAppTemplate(
  to: string,
  templateName: string,
  language: string = "en",
  components?: WhatsAppTemplate["components"]
) {
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    console.warn("WhatsApp API not configured.");
    return { success: false, error: "WhatsApp API not configured" };
  }

  try {
    const response = await fetch(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: to.replace("+", ""),
          type: "template",
          template: {
            name: templateName,
            language: { code: language },
            components,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("WhatsApp API error:", data);
      return { success: false, error: data };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send WhatsApp template:", error);
    return { success: false, error };
  }
}

/**
 * Send order confirmation notification
 */
export async function sendOrderConfirmation(
  phone: string,
  orderDetails: {
    orderId: string;
    customerName: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
    estimatedDelivery?: string;
  }
) {
  const itemsList = orderDetails.items
    .map(
      (item) =>
        `• ${item.name} x${item.quantity} — $${item.price.toFixed(2)}`
    )
    .join("\n");

  const message = `🛍️ *Order Confirmed!*

Hi ${orderDetails.customerName},

Thank you for shopping with TiokariShop!

📦 *Order #${orderDetails.orderId}*
${itemsList}

💰 *Total: $${orderDetails.total.toFixed(2)}*

${orderDetails.estimatedDelivery ? `📅 Estimated delivery: ${orderDetails.estimatedDelivery}` : ""}

We'll notify you when your order ships. Track your order anytime at:
${process.env.NEXT_PUBLIC_APP_URL}/account

Thank you for choosing TiokariShop! 💜`;

  return sendWhatsAppMessage(phone, message);
}

/**
 * Send shipping notification
 */
export async function sendShippingNotification(
  phone: string,
  orderDetails: {
    orderId: string;
    customerName: string;
    trackingNumber?: string;
    carrier?: string;
  }
) {
  const message = `🚚 *Your Order Has Shipped!*

Hi ${orderDetails.customerName},

Great news! Your order #${orderDetails.orderId} is on its way.

${orderDetails.trackingNumber ? `📋 Tracking: ${orderDetails.trackingNumber}` : ""}
${orderDetails.carrier ? `🏢 Carrier: ${orderDetails.carrier}` : ""}

Track your order: ${process.env.NEXT_PUBLIC_APP_URL}/account

Thank you for shopping with TiokariShop! 💜`;

  return sendWhatsAppMessage(phone, message);
}

/**
 * Send delivery confirmation
 */
export async function sendDeliveryConfirmation(
  phone: string,
  orderDetails: {
    orderId: string;
    customerName: string;
  }
) {
  const message = `✅ *Order Delivered!*

Hi ${orderDetails.customerName},

Your order #${orderDetails.orderId} has been delivered. We hope you love your purchase!

If you have any questions or need help, just reply to this message.

Thank you for choosing TiokariShop! 💜`;

  return sendWhatsAppMessage(phone, message);
}

/**
 * Send abandoned cart reminder
 */
export async function sendAbandonedCartReminder(
  phone: string,
  cartDetails: {
    customerName: string;
    items: Array<{ name: string; price: number }>;
    cartTotal: number;
  }
) {
  const itemsList = cartDetails.items
    .map((item) => `• ${item.name} — $${item.price.toFixed(2)}`)
    .join("\n");

  const message = `🛒 *You left something behind!*

Hi ${cartDetails.customerName},

You have items waiting in your cart:

${itemsList}

💰 Total: $${cartDetails.cartTotal.toFixed(2)}

Complete your purchase before they sell out:
${process.env.NEXT_PUBLIC_APP_URL}/checkout

Need help? Just reply to this message! 💜`;

  return sendWhatsAppMessage(phone, message);
}

/**
 * Send promotional broadcast (to be used carefully)
 */
export async function sendPromotionalMessage(
  phone: string,
  promoDetails: {
    customerName: string;
    title: string;
    description: string;
    discountCode?: string;
    expiryDate?: string;
  }
) {
  const message = `🎉 *${promoDetails.title}*

Hi ${promoDetails.customerName},

${promoDetails.description}

${promoDetails.discountCode ? `🏷️ Use code: *${promoDetails.discountCode}*` : ""}
${promoDetails.expiryDate ? `⏰ Valid until: ${promoDetails.expiryDate}` : ""}

Shop now: ${process.env.NEXT_PUBLIC_APP_URL}

_TiokariShop_`;

  return sendWhatsAppMessage(phone, message);
}

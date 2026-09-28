/**
 * Email notification service for TiokariShop
 * Uses Nodemailer with SMTP or can be extended to use SendGrid/Resend
 */

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@tiokarishop.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(
  to: string,
  orderDetails: {
    orderId: string;
    customerName: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    shippingAddress: {
      name: string;
      line1: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  }
) {
  const itemsHtml = orderDetails.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
        </tr>
      `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - TiokariShop</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff;">
        <!-- Header -->
        <div style="background: #000; padding: 30px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">TiokariShop</h1>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #000; margin-top: 0;">Order Confirmed!</h2>
          <p style="color: #666; line-height: 1.6;">
            Hi ${orderDetails.customerName},
          </p>
          <p style="color: #666; line-height: 1.6;">
            Thank you for your order! We've received it and are preparing it for shipment.
          </p>

          <!-- Order Details -->
          <div style="background: #f9f9f9; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #000;">Order #${orderDetails.orderId}</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #eee;">
                  <th style="padding: 12px; text-align: left;">Item</th>
                  <th style="padding: 12px; text-align: center;">Qty</th>
                  <th style="padding: 12px; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #eee;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #666;">Subtotal</span>
                <span style="color: #000;">$${orderDetails.subtotal.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #666;">Tax</span>
                <span style="color: #000;">$${orderDetails.tax.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #666;">Shipping</span>
                <span style="color: #000;">$${orderDetails.shipping.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; margin-top: 12px; padding-top: 12px; border-top: 2px solid #eee;">
                <span style="color: #000;">Total</span>
                <span style="color: #000;">$${orderDetails.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <!-- Shipping Address -->
          <div style="margin: 20px 0;">
            <h3 style="color: #000;">Shipping Address</h3>
            <p style="color: #666; line-height: 1.6; margin: 0;">
              ${orderDetails.shippingAddress.name}<br>
              ${orderDetails.shippingAddress.line1}<br>
              ${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.state} ${orderDetails.shippingAddress.postalCode}<br>
              ${orderDetails.shippingAddress.country}
            </p>
          </div>

          <!-- CTA -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${APP_URL}/account" style="display: inline-block; background: #000; color: #fff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 600;">
              Track Your Order
            </a>
          </div>

          <p style="color: #999; font-size: 14px; text-align: center;">
            Questions? Reply to this email or contact us at support@tiokarishop.com
          </p>
        </div>

        <!-- Footer -->
        <div style="background: #f5f5f5; padding: 20px; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} TiokariShop. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"TiokariShop" <${FROM_EMAIL}>`,
      to,
      subject: `Order Confirmed - #${orderDetails.orderId}`,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
    return { success: false, error };
  }
}

/**
 * Send shipping notification email
 */
export async function sendShippingEmail(
  to: string,
  orderDetails: {
    orderId: string;
    customerName: string;
    trackingNumber?: string;
    carrier?: string;
  }
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your Order Has Shipped - TiokariShop</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: #000; padding: 30px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">TiokariShop</h1>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="color: #000; margin-top: 0;">Your Order Has Shipped!</h2>
          <p style="color: #666; line-height: 1.6;">
            Hi ${orderDetails.customerName},
          </p>
          <p style="color: #666; line-height: 1.6;">
            Great news! Your order #${orderDetails.orderId} is on its way.
          </p>
          ${orderDetails.trackingNumber ? `
          <div style="background: #f9f9f9; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0; color: #666;">
              <strong>Tracking Number:</strong> ${orderDetails.trackingNumber}<br>
              ${orderDetails.carrier ? `<strong>Carrier:</strong> ${orderDetails.carrier}` : ""}
            </p>
          </div>
          ` : ""}
          <div style="text-align: center; margin: 30px 0;">
            <a href="${APP_URL}/account" style="display: inline-block; background: #000; color: #fff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 600;">
              Track Your Order
            </a>
          </div>
        </div>
        <div style="background: #f5f5f5; padding: 20px; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} TiokariShop. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"TiokariShop" <${FROM_EMAIL}>`,
      to,
      subject: `Your Order Has Shipped - #${orderDetails.orderId}`,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send shipping email:", error);
    return { success: false, error };
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  to: string,
  resetToken: string
) {
  const resetUrl = `${APP_URL}/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reset Your Password - TiokariShop</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: #000; padding: 30px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">TiokariShop</h1>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="color: #000; margin-top: 0;">Reset Your Password</h2>
          <p style="color: #666; line-height: 1.6;">
            You requested a password reset for your TiokariShop account. Click the button below to reset your password.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="display: inline-block; background: #000; color: #fff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 600;">
              Reset Password
            </a>
          </div>
          <p style="color: #999; font-size: 14px;">
            This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
          </p>
        </div>
        <div style="background: #f5f5f5; padding: 20px; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} TiokariShop. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"TiokariShop" <${FROM_EMAIL}>`,
      to,
      subject: "Reset Your Password - TiokariShop",
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    return { success: false, error };
  }
}

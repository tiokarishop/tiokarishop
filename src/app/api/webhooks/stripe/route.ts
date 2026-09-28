import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      // Update order status
      await db.order.updateMany({
        where: { stripePaymentId: paymentIntent.id },
        data: { status: "PROCESSING" },
      });
      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      await db.order.updateMany({
        where: { stripePaymentId: paymentIntent.id },
        data: { status: "CANCELLED" },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}

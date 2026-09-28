import { NextRequest, NextResponse } from "next/server";
import { sendAbandonedCartReminders } from "@/lib/abandoned-cart";

/**
 * POST /api/abandoned-cart/remind
 * Trigger abandoned cart recovery reminders
 * Should be called by a cron job (e.g., Vercel Cron, GitHub Actions)
 */
export async function POST(req: NextRequest) {
  try {
    // Verify cron secret (if using Vercel Cron)
    const authHeader = req.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await sendAbandonedCartReminders();

    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Abandoned cart reminder error:", error);
    return NextResponse.json(
      { error: "Failed to send reminders" },
      { status: 500 }
    );
  }
}

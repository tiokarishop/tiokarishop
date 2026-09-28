import { NextRequest, NextResponse } from "next/server";
import { applyDiscountCode } from "@/lib/discount";

/**
 * POST /api/discount/apply
 * Validate and apply a discount code
 *
 * Body: { code: string, subtotal: number }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, subtotal } = body;

    if (!code || typeof subtotal !== "number") {
      return NextResponse.json(
        { error: "Code and subtotal are required" },
        { status: 400 }
      );
    }

    const result = await applyDiscountCode(code, subtotal);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Discount apply error:", error);
    return NextResponse.json(
      { error: "Failed to apply discount" },
      { status: 500 }
    );
  }
}

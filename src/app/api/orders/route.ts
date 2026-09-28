import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        include: {
          user: { select: { id: true, email: true, name: true } },
          items: {
            include: {
              product: { select: { id: true, name: true, images: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, items, shippingAddress, billingAddress, subtotal, tax, shipping, total } = body;

    const order = await db.order.create({
      data: {
        userId,
        items: {
          create: items.map((item: Record<string, unknown>) => ({
            productId: item.productId,
            variantId: item.variantId || null,
            name: item.name,
            sku: item.sku,
            price: item.price,
            quantity: item.quantity,
            image: item.image || null,
          })),
        },
        shippingAddress,
        billingAddress,
        subtotal,
        tax,
        shipping,
        total,
      },
      include: {
        items: true,
        user: { select: { id: true, email: true, name: true } },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/src/lib/stripe";
import { prisma } from "@/src/lib/prisma";

/**
 * Body:
 * {
 *   orgId: string,
 *   userId: string,
 *   items: Array<{
 *     productId: string,
 *     quantity: number,
 *     seatId?: string | null,
 *   }>,
 *   successPath?: string,
 *   cancelPath?: string,
 *   orgStripeAccountId?: string // for Connect payouts (optional)
 * }
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    orgId,
    userId,
    items,
    successPath = "/checkout/success",
    cancelPath = "/checkout",
    orgStripeAccountId,
  } = body;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "No items." }, { status: 400 });
  }

  // Load products and compute totals (minimal example)
  const productIds = items.map((i: any) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

  const lineItems: any[] = [];
  let total = 0;

  for (const it of items) {
    const p = products.find((x: typeof products[number]) => x.id === it.productId);
    if (!p) continue;
    const unitAmount = Math.round(Number(p.price) * 100); // cents
    total += unitAmount * (it.quantity ?? 1);

    lineItems.push({
      quantity: it.quantity ?? 1,
      price_data: {
        currency: (p.currency || "EUR").toLowerCase(),
        unit_amount: unitAmount,
        product_data: { name: p.name, description: p.description || undefined },
      },
    });
  }

  // Create pending order
  const order = await prisma.order.create({
    data: {
      userId,
      orgId,
      totalAmount: (total / 100) as unknown as any, // Prisma Decimal
      paymentStatus: "PENDING",
      items: {
        create: items.map((it: any) => ({
          productId: it.productId,
          seatId: it.seatId ?? null,
          eventId: it.eventId, // Store eventId directly on OrderItem
          quantity: it.quantity ?? 1,
          price: Number(products.find((p: typeof products[number]) => p.id === it.productId)?.price ?? 0),
        })),
      },
    },
    include: { items: true },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Optional: platform fee calc (flat 5% example)
  const applicationFeeAmount = Math.round(total * 0.05);

  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      line_items: lineItems,
      success_url: `${appUrl}${successPath}?orderId=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}${cancelPath}?orderId=${order.id}`,
      metadata: {
        orderId: order.id,
        orgId,
        userId,
      },
    },
    orgStripeAccountId
      ? {
          stripeAccount: orgStripeAccountId, // If collecting on behalf of organizer
        }
      : undefined
  );

  // If using Connect but charging on platform and transferring:
  // You can create a PaymentIntent with transfer_data/destination instead.

  return NextResponse.json({ id: session.id, url: session.url });
}

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { issueTicket } from "@/features/tickets/tickets.service";
import type Stripe from "stripe";

export const runtime = "nodejs"; // ensure Node runtime (not edge)

export async function POST(req: NextRequest) {
  const sig = (await headers()).get("stripe-signature");
  if (!sig) return new NextResponse("Missing signature", { status: 400 });

  const secret = process.env.STRIPE_WEBHOOK_SECRET!;
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const orderId = session.metadata?.orderId ?? undefined;
    const orgId   = session.metadata?.orgId   ?? undefined;
    const userId  = session.metadata?.userId  ?? undefined;

    if (!orderId) return NextResponse.json({ ok: true });

    // Idempotency guard
    const existing = await prisma.order.findUnique({ where: { id: orderId } });
    if (!existing || existing.paymentStatus === "PAID") {
      return NextResponse.json({ ok: true });
    }

    // Mark order paid
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: "PAID" },
    });

    // Issue tickets for ticket items (and mark seats sold)
    const items = await prisma.orderItem.findMany({ where: { orderId } });

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (product?.type === "TICKET") {
        if (item.seatId) {
          await prisma.seat.update({
            where: { id: item.seatId },
            data: { status: "sold", reservedUntil: null },
          });
        }
        const relatedEventId = (item as any).eventId as string | undefined;
        for (let i = 0; i < item.quantity; i++) {
          await issueTicket({
            orderId,
            eventId: relatedEventId ?? product.id,
            seatId: item.seatId ?? null,
          });
        }
      }
      // TODO: handle LOTTO and MEMBERSHIP products
    }
  }

  return NextResponse.json({ received: true });
}

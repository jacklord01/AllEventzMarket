import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { issueTicket } from "@/features/tickets/tickets.service";
import type Stripe from "stripe";

export const runtime = "nodejs"; // ensure Node runtime (not edge)

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new NextResponse("Missing signature", { status: 400 });

  const secret = process.env.STRIPE_WEBHOOK_SECRET!;
  const raw = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    if (err instanceof Error) {
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }
    return new NextResponse(`Webhook Error: Unknown error`, { status: 400 });
  }

  // Handle success
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const orderId = session.metadata?.orderId as string | undefined;
    if (!orderId) return NextResponse.json({ ok: true });

    // Idempotency: if already processed, exit
    const existing = await prisma.order.findUnique({ where: { id: orderId } });
    if (!existing || existing.paymentStatus === "PAID") {
      return NextResponse.json({ ok: true });
    }

    // Mark order paid
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: "PAID" },
    });

    // For each OrderItem, issue Ticket(s) (handle quantity)
    const items = await prisma.orderItem.findMany({ where: { orderId } });
    const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId } });

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });

      if (product?.type === "TICKET") {
        // If seat-bound, mark seat sold
        if (item.seatId) {
          await prisma.seat.update({
            where: { id: item.seatId },
            data: { status: "sold", reservedUntil: null },
          });
        }

        // Quantity could be > 1
        for (let i = 0; i < item.quantity; i++) {
          await issueTicket({
            orderId: orderId,
            eventId: item.eventId, // Use eventId directly from OrderItem
            seatId: item.seatId ?? null,
          });
        }
      }

      if (product?.type === "MEMBERSHIP") {
        // Seed 52 weekly LottoEntry records etc. (omitted here for brevity)
      }

      if (product?.type === "LOTTO") {
        // Create LottoEntry for current draw (omitted for brevity)
      }
    }
  }

  return NextResponse.json({ received: true });
}

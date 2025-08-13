import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { issueTicket } from "@/features/tickets/tickets.service";
import type Stripe from "stripe";

export const runtime = "nodejs"; // ensure Node runtime

export async function POST(req: NextRequest) {
  const sig = (await headers()).get("stripe-signature");
  if (!sig) return new NextResponse("Missing signature", { status: 400 });

  const secret = process.env.STRIPE_WEBHOOK_SECRET ?? "";
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const orderId = session.metadata?.orderId;
    const orgId = session.metadata?.orgId;
    const userId = session.metadata?.userId;
    const fallbackEventId = session.metadata?.eventId; // optional, if you pass it at checkout

    if (!orderId) return NextResponse.json({ ok: true });

    // Idempotency guard
    const existing = await prisma.order.findUnique({ where: { id: orderId } });
    if (!existing || existing.paymentStatus === "PAID") {
      return NextResponse.json({ ok: true });
    }

    // Mark order as paid
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: "PAID" },
    });

    // Load ordered items
    const items = await prisma.orderItem.findMany({
      where: { orderId },
      select: {
        id: true,
        quantity: true,
        seatId: true,
        product: { select: { type: true, id: true } },
      },
    });

    for (const item of items) {
      const productType = item.product.type;

      if (productType === "TICKET") {
        // Resolve eventId without using `any`
        let eventIdForTicket: string | undefined = fallbackEventId;

        if (!eventIdForTicket && item.seatId) {
          const seat = await prisma.seat.findUnique({
            where: { id: item.seatId },
            select: { eventId: true },
          });
          eventIdForTicket = seat?.eventId;
        }

        // If still missing, you can map product→event in your data model, or enforce sending eventId in metadata.
        if (!eventIdForTicket) {
          // If you want to fail loudly in dev:
          // throw new Error("Missing eventId for ticket issuance.");
          // Otherwise skip issuing tickets silently:
          continue;
        }

        if (item.seatId) {
          await prisma.seat.update({
            where: { id: item.seatId },
            data: { status: "sold", reservedUntil: null },
          });
        }

        for (let i = 0; i < item.quantity; i++) {
          await issueTicket({
            orderId,
            eventId: eventIdForTicket,
            seatId: item.seatId ?? null,
          });
        }
      }

      if (productType === "MEMBERSHIP") {
        // TODO: seed 52 weekly LottoEntry rows, etc.
      }

      if (productType === "LOTTO") {
        // TODO: create LottoEntry for scheduled draw
      }
    }
  }

  return NextResponse.json({ received: true });
}

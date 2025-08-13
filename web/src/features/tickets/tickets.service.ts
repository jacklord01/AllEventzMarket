import { prisma } from "@/src/lib/prisma";
import { qrDataUrl } from "@/src/lib/qr";

type CreateTicketInput = {
  orderId: string;
  eventId: string;
  seatId?: string | null;
};

export async function issueTicket(input: CreateTicketInput) {
  // Generate QR payload (keep minimal; sensitive details are in DB)
  const payload = {
    t: "ticket",
    orderId: input.orderId,
    eventId: input.eventId,
    seatId: input.seatId ?? null,
    ts: Date.now(),
  };

  const qr = await qrDataUrl(payload);

  return prisma.ticket.create({
    data: {
      orderId: input.orderId,
      eventId: input.eventId,
      seatId: input.seatId ?? null,
      qrCodeUrl: qr, // consider storing in S3 for production
    },
  });
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const StripeSchema = z.object({
  eventId: z.string(),
  amount: z.number(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = StripeSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  // TODO: implement
  return NextResponse.json({ message: "Stripe payment processed" });
}

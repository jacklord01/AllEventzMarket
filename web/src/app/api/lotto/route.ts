import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const LottoSchema = z.object({
  eventId: z.string(),
  ticketCount: z.number(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = LottoSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  // TODO: implement
  return NextResponse.json({ message: "Lotto entry created" });
}

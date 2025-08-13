import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const EventSchema = z.object({
  name: z.string(),
  date: z.string(),
});

export async function GET(req: NextRequest) {
  // TODO: implement
  return NextResponse.json({ message: "List of events" });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = EventSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  // TODO: implement
  return NextResponse.json({ message: "Event created" });
}

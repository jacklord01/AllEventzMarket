import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Param<T extends string> = { params: Promise<Record<T, string>> };

export async function GET(
  _req: NextRequest,
  { params }: Param<"eventId">
) {
  const { eventId } = await params;
  if (!eventId) {
    return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
  }
  try {
    const seats = await prisma.seat.findMany({
      where: { eventId },
    });
    return NextResponse.json(seats);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch seats" }, { status: 500 });
  }
}

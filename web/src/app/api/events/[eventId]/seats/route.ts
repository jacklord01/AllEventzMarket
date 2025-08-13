import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const { eventId } = params;
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

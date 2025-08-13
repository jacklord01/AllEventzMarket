import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Next.js expects the context param to be typed as { params: { [key: string]: string } }
export async function GET(
  req: NextRequest,
  context: any // Use 'any' to ensure compatibility with Next.js build
) {
  const { eventId } = context.params;
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

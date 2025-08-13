import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const OrderSchema = z.object({
  productId: z.string(),
  quantity: z.number(),
});

export async function GET(req: NextRequest) {
  // TODO: implement
  return NextResponse.json({ message: "List of orders" });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = OrderSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  // TODO: implement
  return NextResponse.json({ message: "Order created" });
}

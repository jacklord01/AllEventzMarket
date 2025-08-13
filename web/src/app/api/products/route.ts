import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ProductSchema = z.object({
  name: z.string(),
  price: z.number(),
});

export async function GET(req: NextRequest) {
  // TODO: implement
  return NextResponse.json({ message: "List of products" });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = ProductSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  // TODO: implement
  return NextResponse.json({ message: "Product created" });
}

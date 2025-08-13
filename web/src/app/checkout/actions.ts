"use server";

export async function createCheckoutSession(payload: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to create checkout session");
  return res.json(); // { id, url }
}

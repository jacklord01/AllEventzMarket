"use client";
import { useState } from "react";

interface BuyButtonProps {
  orgId: string;
  userId: string;
  productId: string;
  seatId?: string;
}

export default function BuyButton({ orgId, userId, productId, seatId }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);

  async function onBuy() {
    setLoading(true);
    const payload = {
      orgId,
      userId,
      items: [{ productId, quantity: 1, seatId }],
      successPath: "/checkout/success",
      cancelPath: "/checkout",
    };
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const { url } = await res.json();
    window.location.href = url;
  }

  return (
    <button disabled={loading} onClick={onBuy}>
      {loading ? "Redirecting…" : "Pay with Stripe"}
    </button>
  );
}

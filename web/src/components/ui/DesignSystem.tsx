import React from "react";
import { Button } from "@/components/ui/Button";

export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4 border border-border">
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      <div>{children}</div>
    </div>
  );
}

export function Badge({ children, color = "primary" }: { children: React.ReactNode; color?: string }) {
  const colorClass =
    color === "success"
      ? "bg-success text-white"
      : color === "accent"
      ? "bg-accent text-white"
      : color === "secondary"
      ? "bg-secondary text-white"
      : "bg-primary text-white";
  return <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${colorClass}`}>{children}</span>;
}

export function Alert({ children, type = "info" }: { children: React.ReactNode; type?: "info" | "success" | "error" }) {
  const colorClass =
    type === "success"
      ? "bg-success text-white"
      : type === "error"
      ? "bg-red-500 text-white"
      : "bg-secondary text-white";
  return <div className={`p-2 rounded mb-2 ${colorClass}`}>{children}</div>;
}

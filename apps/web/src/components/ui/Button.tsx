import React from "react";
import { colors } from "@/styles/tokens";

export function Button({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="px-4 py-2 rounded font-semibold bg-primary text-white hover:bg-accent transition"
      style={{ background: colors.primary }}
      {...props}
    >
      {children}
    </button>
  );
}

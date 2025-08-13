import React from "react";
import { colors } from "@/styles/tokens";

export type Seat = {
  id: string;
  label: string;
  status: "available" | "selected" | "reserved" | "sold";
  section: "stalls" | "balcony" | "vip";
  price: number;
};

export function SeatMap({
  seats,
  selected,
  onSelect,
}: {
  seats: Seat[];
  selected: string[];
  onSelect: (id: string) => void;
}) {
  function getColor(seat: Seat) {
    if (seat.status === "sold") return "bg-unavailable text-gray-600";
    if (seat.status === "reserved") return "bg-orange-200 text-orange-800";
    if (selected.includes(seat.id)) return "bg-primary text-white scale-105";
    if (seat.section === "vip") return "bg-success text-white";
    if (seat.section === "balcony") return "bg-secondary text-white";
    return "bg-background text-text";
  }

  return (
    <div className="grid grid-cols-10 gap-2 p-4 bg-muted rounded-lg">
      {seats.map(seat => (
        <button
          key={seat.id}
          className={`w-12 h-12 rounded flex items-center justify-center font-bold border transition ${getColor(seat)}`}
          disabled={seat.status === "sold"}
          aria-label={`Seat ${seat.label} ${seat.status}`}
          onClick={() => onSelect(seat.id)}
        >
          {seat.label}
        </button>
      ))}
    </div>
  );
}

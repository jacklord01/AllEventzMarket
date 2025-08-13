import React from "react";
import { useSeats } from "@/hooks/useSeats";

export function SeatPicker({ eventId }: { eventId: string }) {
  const { data: seats, error, isLoading } = useSeats(eventId);

  if (isLoading) return <div>Loading seats...</div>;
  if (error) return <div>Error loading seats.</div>;
  if (!seats || seats.length === 0) return <div>No seats found.</div>;

  return (
    <div className="grid grid-cols-4 gap-2">
      {seats.map((seat: any) => (
        <button
          key={seat.id}
          className={`border rounded p-2 ${seat.isBooked ? "bg-gray-300" : "bg-green-200"}`}
          disabled={seat.isBooked}
        >
          {seat.label || seat.id}
        </button>
      ))}
    </div>
  );
}

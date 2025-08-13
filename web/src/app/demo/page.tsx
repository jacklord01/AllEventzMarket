import React from "react";
import { Card, Badge, Alert } from "@/components/ui/DesignSystem";
import { LottoPicker } from "@/components/LottoPicker";
import { SeatMap } from "@/components/SeatMap";
import { Button } from "@/components/ui/Button";

export default function DemoShowcase() {
  // Example state for LottoPicker
  const [selected, setSelected] = React.useState<number[]>([]);
  const [alwaysInclude, setAlwaysInclude] = React.useState<number[]>([]);

  // Example state for SeatMap
  const [selectedSeats, setSelectedSeats] = React.useState<string[]>([]);
  const seats = Array.from({ length: 30 }, (_, i) => ({
    id: `S${i + 1}`,
    label: `${i + 1}`,
    status: i % 7 === 0 ? "sold" : i % 5 === 0 ? "reserved" : selectedSeats.includes(`S${i + 1}`) ? "selected" : "available",
    section: i < 10 ? "stalls" : i < 20 ? "balcony" : "vip",
    price: 20 + (i % 3) * 5,
  }));

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card title="Lotto Picker Demo">
        <LottoPicker
          selected={selected}
          alwaysInclude={alwaysInclude}
          onChange={setSelected}
          onAlwaysIncludeChange={setAlwaysInclude}
        />
        <div className="mt-2">
          <Badge color="accent">Selected: {selected.join(", ") || "None"}</Badge>
          <Badge color="success">Always Include: {alwaysInclude.join(", ") || "None"}</Badge>
        </div>
      </Card>
      <Card title="Seat Map Demo">
        <SeatMap
          seats={seats}
          selected={selectedSeats}
          onSelect={id => setSelectedSeats(sel => sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id])}
        />
        <div className="mt-2">
          <Alert type="info">Click seats to select. Orange = reserved, Gray = sold, Green = VIP, Blue = Balcony.</Alert>
          <Badge>Selected Seats: {selectedSeats.join(", ") || "None"}</Badge>
        </div>
      </Card>
      <Card title="Button Demo">
        <Button>Primary Action</Button>
      </Card>
    </div>
  );
}
